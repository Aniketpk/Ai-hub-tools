# AI Hub

AI Hub is split into a Next.js frontend and a FastAPI backend. AI provider keys stay on the backend.

## Local development

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add provider keys to backend/.env (never commit this file).
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API health check is available at `http://localhost:8000/health`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in `frontend/.env.local` for local development.

## Environment variables

Backend (`backend/.env`): `GOOGLE_API_KEY`, `OPENROUTER_API_KEY`, `DATABASE_URL`, `FRONTEND_URL`.
Frontend (`frontend/.env.local`): `NEXT_PUBLIC_API_URL`.

Never put provider secrets in `NEXT_PUBLIC_*` variables.

## Deployment

### Vercel frontend

- Root Directory: `frontend`
- Framework preset: Next.js
- Build command: `npm run build`
- Install command: `npm install`
- Output directory: default
- Add `NEXT_PUBLIC_API_URL` with the deployed Railway backend base URL (no trailing slash).

### Railway backend

- Root directory: `backend`
- Build/install command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Set `GOOGLE_API_KEY`, `OPENROUTER_API_KEY` as needed and `FRONTEND_URL` to the deployed Vercel origin.
- Health check path: `/health`.

## AI behavior

The backend exposes chat, text summarization, translation, code generation, idea generation, document Q&A/summary, image analysis, orchestration, and `/health` endpoints. Gemini and OpenRouter are tried server-side, followed by local Ollama where available. PDF and DOCX extraction happens in the backend.
