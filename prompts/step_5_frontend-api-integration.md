You are an expert React and TypeScript Developer specializing in building modern, interactive frontend components.

Your goal is to enhance the existing `Chatbot.tsx` component to properly integrate with the FastAPI backend, ensuring smooth state management, error handling, and a premium user experience.

---

### TASK

Modify `frontend/src/components/chatbot/Chatbot.tsx` to fully integrate with the RAG backend.

The output should include:
1.  **Environment Variable Configuration**: Use Vite environment variables (`VITE_API_BASE_URL`) to manage the backend API URL. Create a `.env` file if it doesn't exist.
2.  **API Integration**: Update the `handleSend` function to call the `POST /ask` endpoint using the configured base URL.
3.  **State Management**: Ensure messages are updated correctly for both user and AI responses.
4.  **Loading States**: Display a loading indicator while waiting for the AI response.
5.  **Error Handling**: Gracefully handle network errors and API errors by displaying helpful messages in the chat interface.
6.  **Health Check + Navbar Status**: Call a `GET /health` endpoint to determine whether the backend is reachable, and display **Backend: Online/Offline** in the UI navbar.
7.  **Auto-Scroll**: (Optional but recommended) Ensure the chat window scrolls to the latest message.

---

### TECHNICAL REQUIREMENTS

1.  **Ask API Call**:
    *   Endpoint: `${BACKEND_URL}/ask`
    *   Method: `POST`
    *   Body: `{ "question": string }`
2.  **Health API Call**:
    *   Endpoint: `${BACKEND_URL}/health`
    *   Method: `GET`
    *   Expected: `200 OK` indicates online (don’t hard-depend on a specific JSON shape).
    *   Timing: Run once on mount and poll every 10 seconds.
    *   Robustness: Use a request timeout (e.g. `AbortController` with 2–5s) so the UI doesn’t hang on network stalls.
3.  **Logic for `handleSend`**:
    *   Add the user's question to the `messages` array immediately.
    *   Set `loading` to `true`.
    *   Fetch the data using a try-catch block.
    *   On success, add the AI's answer to the `messages` array.
    *   On failure, add an "Error" message to the `messages` array.
    *   Always set `loading` to `false` at the end.
4.  **Navbar Status UI**:
    *   Show a compact status indicator in the navbar area (e.g. “Backend: Online” in green / “Backend: Offline” in red).
    *   Preserve existing styling and layout; implement the indicator in `Chatbot.tsx` only if it already owns the navbar UI.
    *   If the navbar lives elsewhere, also update the appropriate navbar component to render the status (keep changes minimal and consistent with existing patterns).

---

### OUTPUT STYLE

*   Write clean, readable TypeScript code using Functional Components and Hooks.
*   Preserve existing styling and component structure.
*   Ensure the code is a "drop-in" replacement for `Chatbot.tsx`.

---

Now, generate the updated code for `frontend/src/components/chatbot/Chatbot.tsx` based on these instructions.
