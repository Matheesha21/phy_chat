# USJ Physics Department AI Assistant — Backend

Node.js + Express API for the frontend. Handles the Google Gemini chat calls and
serves lecture / lecturer / hall data from MongoDB.

> This folder is a standalone Node service. It is **not** executed inside the
> Magic Patterns preview (which runs the React frontend only) — run it locally or
> deploy it separately, then point the frontend's `services/api.ts` base URL at it.

## Endpoints

These match exactly what the frontend `services/` layer calls:

| Method | Path             | Purpose                       |
| ------ | ---------------- | ----------------------------- |
| POST   | `/api/chat`      | Send a user message to Gemini |
| GET    | `/api/lectures`  | List lectures                 |
| GET    | `/api/lecturers` | List lecturers                |
| GET    | `/api/halls`     | List lecture halls            |
| GET    | `/api/health`    | Health check                  |

## Setup

```bash
cd backend
npm install
cp .env.example .env      # then fill in MONGO_URI and GEMINI_API_KEY
npm run seed              # optional: load sample data
npm run dev               # starts on http://localhost:5000
```

## Connecting the frontend

In the frontend `services/api.ts`, swap the mock `apiClient` for real `fetch`
calls against `http://localhost:5000` (or your deployed URL). Each service file
already documents the endpoint it maps to.

## Structure

```
backend/
├── server.js              # Express app entry
├── seed.js                # Sample data loader
├── config/db.js           # MongoDB connection
├── models/                # Mongoose schemas (match frontend interfaces)
├── controllers/           # Request handlers
├── routes/                # Express routers
└── services/geminiService.js  # Gemini call + department-data grounding
```
