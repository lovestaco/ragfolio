import os
from typing import Iterable, List, Tuple

import chromadb
from fastembed import TextEmbedding

# The pre-trained model used to convert text into numerical vectors.
EMBEDDING_MODEL_NAME = "BAAI/bge-small-en-v1.5"
# The local directory where the vector database is stored.
CHROMA_DB_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")
# The name of the collection within ChromaDB to store resume data.
COLLECTION_NAME = "resume_chunks"
# Directory containing source documents to embed.
INPUT_DATA_DIR = os.path.join(os.path.dirname(__file__), "input-data")
# The number of text chunks processed at once during embedding.
ENCODE_BATCH_SIZE = 32
# The number of vectors saved to the database in a single transaction.
DB_ADD_BATCH_SIZE = 100


def chunk_text(text: str, max_chars: int = 500) -> List[str]:
    """Split the input text into semantically coherent chunks."""
    text = text.strip()
    if not text:
        return []

    paragraphs = text.split("\n\n")
    chunks: List[str] = []
    current = ""

    def flush_current():
        nonlocal current
        if current.strip():
            chunks.append(current.strip())
        current = ""

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue

        if len(current) + len(para) + 2 > max_chars:
            if len(para) > max_chars:
                lines = para.split("\n")
                for line in lines:
                    line = line.strip()
                    if not line:
                        continue
                    if len(current) + len(line) + 1 > max_chars:
                        flush_current()
                    current = (current + " " + line).strip()
                flush_current()
            else:
                flush_current()
                current = para
        else:
            if current:
                current = current + "\n\n" + para
            else:
                current = para

    flush_current()
    return chunks


def _iter_input_files(input_dir: str) -> Iterable[str]:
    if not os.path.isdir(input_dir):
        raise FileNotFoundError(f"Could not find input directory at {input_dir}")

    for root, _dirs, files in os.walk(input_dir):
        for name in sorted(files):
            path = os.path.join(root, name)
            if os.path.isfile(path):
                yield path


def load_input_chunks(input_dir: str) -> Tuple[List[str], List[dict]]:
    """Read all files in input_dir and return (chunks, metadatas)."""
    all_chunks: List[str] = []
    all_metadatas: List[dict] = []

    input_dir_abs = os.path.abspath(input_dir)
    files = list(_iter_input_files(input_dir_abs))
    if not files:
        raise ValueError(f"No files found under {input_dir_abs}")

    total_chars = 0
    for file_path in files:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()
        except UnicodeDecodeError:
            # Skip binary/unknown encodings to avoid poisoning the store
            continue

        total_chars += len(text)
        file_chunks = chunk_text(text, max_chars=500)
        if not file_chunks:
            continue

        rel_source = os.path.relpath(file_path, input_dir_abs)
        for i, chunk in enumerate(file_chunks):
            all_chunks.append(chunk)
            all_metadatas.append(
                {
                    "source": rel_source,
                    "chunk_index": i,
                }
            )

    if not all_chunks:
        raise ValueError(f"No text chunks were created from files under {input_dir_abs}")

    print(
        f"Loaded input-data: {len(files)} files, {total_chars} characters, {len(all_chunks)} chunks."
    )
    return all_chunks, all_metadatas


def compute_embeddings(chunks: List[str]) -> List[List[float]]:
    """Convert text chunks into numerical embedding vectors."""
    model = TextEmbedding(model_name=EMBEDDING_MODEL_NAME)
    all_embeddings: List[List[float]] = []

    print("Computing embeddings in batches...")
    for start in range(0, len(chunks), ENCODE_BATCH_SIZE):
        batch = chunks[start : start + ENCODE_BATCH_SIZE]
        for emb in model.embed(batch):
            all_embeddings.append(emb.tolist())
        print(f"  Encoded {min(start + ENCODE_BATCH_SIZE, len(chunks))}/{len(chunks)} chunks")

    return all_embeddings


def save_to_vector_store(
    chunks: List[str], embeddings: List[List[float]], metadatas: List[dict]
) -> None:
    """Clear existing data and save new embeddings to ChromaDB."""
    if len(chunks) != len(embeddings) or len(chunks) != len(metadatas):
        raise ValueError("chunks/embeddings/metadatas must be the same length")

    os.makedirs(CHROMA_DB_DIR, exist_ok=True)
    from chromadb.config import Settings
    client = chromadb.PersistentClient(
        path=CHROMA_DB_DIR, 
        settings=Settings(anonymized_telemetry=False)
    )

    # Safely clear the collection by deleting and recreating it
    try:
        client.delete_collection(name=COLLECTION_NAME)
    except Exception:
        pass  # Collection likely doesn't exist yet

    collection = client.get_or_create_collection(name=COLLECTION_NAME)

    print("Storing embeddings in ChromaDB...")
    for start in range(0, len(chunks), DB_ADD_BATCH_SIZE):
        end = min(start + DB_ADD_BATCH_SIZE, len(chunks))
        collection.add(
            ids=[
                f"{metadatas[i].get('source','unknown')}::chunk-{metadatas[i].get('chunk_index', i)}"
                for i in range(start, end)
            ],
            documents=chunks[start:end],
            embeddings=embeddings[start:end],
            metadatas=metadatas[start:end],
        )
        print(f"  Stored {end}/{len(chunks)} chunks")

    print(f"Successfully stored {len(chunks)} chunks at {CHROMA_DB_DIR}.")


def build_vector_store(input_dir: str = None) -> None:
    """Orchestrate the full ingestion pipeline from files to database."""
    if input_dir is None:
        input_dir = INPUT_DATA_DIR

    # 1. Load and chunk all input files
    chunks, metadatas = load_input_chunks(input_dir)

    # 2. Generate embeddings for each chunk
    embeddings = compute_embeddings(chunks)

    # 3. Save everything to the database
    save_to_vector_store(chunks, embeddings, metadatas)


def main() -> None:
    """Entry point for the embedding creation script."""
    build_vector_store()


if __name__ == "__main__":
    main()
