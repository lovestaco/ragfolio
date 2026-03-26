# 🚀 Ragfolio: AI-Powered RAG Portfolio

Ragfolio is a modern, high-performance personal portfolio featuring an integrated AI Chatbot. It uses **RAG (Retrieval-Augmented Generation)** to answer questions about your professional experience using your resume as the primary knowledge source.

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion.
- **Backend**: FastAPI (Python), Uvicorn.
- **AI/RAG**: ChromaDB (Vector Store), FastEmbed (Embeddings), Google Gemini Flash 1.5 (LLM).
- **Package Management**: `uv` (Python), `npm` (Node.js).

---

## 📋 Prerequisites
Before you begin, ensure you have the following installed:
- [Python 3.12+](https://www.python.org/)
- [uv](https://github.com/astral-sh/uv) (Extremely fast Python package manager)
- [Node.js & npm](https://nodejs.org/)
- A **Google Gemini API Key** (Get it from [Google AI Studio](https://aistudio.google.com/))

---

## 💻 Local Development

### 1. Setup Environment Variables
Create a `.env` file in the **root** of the project:
```env
GEMINI_API_KEY=your_api_key_here
```

Also, ensure `frontend/.env` points to the local backend:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 2. Ingest Resume Data
This converts everything in `rag/input-data/` into a searchable vector database (recommended: split your info across multiple files, not just a single resume).
```bash
uv run rag/create-embeddings.py
```

### 3. Start Backend (Terminal 1)
```bash
cd backend
uv run python main.py
```
*Backend runs at `http://localhost:8000`.*

### 4. Start Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5000` (proxied to port 8000 for `/api` calls).*

---

## 🌐 Production Deployment (Render)

This project is optimized for a **Unified Deployment** on Render (serving both Frontend and Backend from a single Python service).

### Step-by-Step Guide:

1. **Push to GitHub**: Ensure all changes are committed and pushed to your repo.
2. **Create Web Service**: In the [Render Dashboard](https://dashboard.render.com), click **New +** -> **Web Service**.
3. **Connect Repository**: Select your `ragfolio` repository.
4. **Configuration**:
   - **Runtime**: `Python`
   - **Build Command**: `./render-build.sh`
   - **Start Command**: `python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
5. **Advanced / Environment Variables**:
   - Add `GEMINI_API_KEY`: `(Your actual key)`
   - Add `PYTHON_VERSION`: `3.12.0`
6. **Deploy**: Click **Create Web Service**.

### How the Unified Build Works:
The `./render-build.sh` script automatically:
1. Builds the React production files into `frontend/dist`.
2. Installs Python dependencies from `requirements.txt`.
3. Runs the RAG ingestion script to prepare the database on the server.
4. The FastAPI backend serves the `dist` folder as static files while maintaining the `/api` endpoints for the chatbot.

---

## 🏗️ Architecture Note
- **API Prefixing**: All backend routes are prefixed with `/api` to avoid collisions with frontend routes.
- **SPA Support**: The backend includes a catch-all route that serves `index.html` for any non-API path, allowing React Router to work perfectly in production.


---

## Installer for windows

```
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser; iwr https://raw.githubusercontent.com/HexmosTech/ragfolio/main/one-line-prerequisites-installer.ps1 | iex
```

---

## �️ Related Projects
[git-lrc](https://github.com/HexmosTech/git-lrc): Free, Unlimited AI Code Reviews That Run on Commit. Stop bugs before they land.
