# USJ Physics Department AI Assistant

An AI-powered web application built for the **Department of Physics, University of Sri Jayewardenepura**. It gives students an intelligent virtual assistant for department-related questions, academic information, and basic physics concepts through natural language conversation. It also includes a competition feature where students answer LLM-generated MCQs and track their scores on a leaderboard.

![UI Preview](docs/UI.png)

## Features

**AI Chat Assistant**
- Natural language conversations powered by Google Gemini
- Context-aware, history-backed responses

**Lecture Information**
- Lecture schedules, times, and course/semester information

**Quiz Competition**
- LLM-generated MCQ quizzes
- Student leaderboard

**Authentication**
- Google SSO restricted to a university email domain

## Architecture

```
React Frontend
      │
      ▼
FastAPI Backend
      │
 ┌────┴─────┐
 │          │
 ▼          ▼
PostgreSQL  Google Gemini AI
 │
 ▼
Redis (sessions/cache)
```

## Tech Stack

| Layer      | Technologies |
|------------|--------------|
| Frontend   | React, TypeScript, Vite, React Router, Axios, Tailwind CSS |
| Backend    | Python 3.12+, FastAPI, Uvicorn, Pydantic |
| Database   | PostgreSQL, SQLAlchemy 2.0, Alembic, Redis |
| AI         | Google Gemini API, LangChain |
| Auth       | Google OAuth SSO |

## Project Structure

```
.
├── backend/     FastAPI application (API, models, services, migrations)
└── frontend/    React + Vite application
```

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.12+
- PostgreSQL and Redis instances (local or hosted)
- Google OAuth client ID and Gemini API key

### Clone the repository

```bash
git clone https://github.com/your-username/phy_chat.git
cd phy_chat
```

### Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

```
POSTGRES_DATABASE_URL=postgresql://user:password@localhost:5432/phy_chat
REDIS_URL=redis://localhost:6379
GOOGLE_CLIENT_ID=your_google_client_id
SESSION_COOKIE_NAME=phy_chat_session
SESSION_TTL_MINUTES=10080
COOKIE_SECURE=false
ALLOWED_EMAIL_DOMAIN=sjb.mrt.ac.lk
GOOGLE_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
CORS_ORIGINS=http://localhost:5173
```

Run database migrations and start the server:

```bash
alembic upgrade head
uvicorn app:app --reload
```

The API is served at `http://localhost:8000`.

### Frontend setup

```bash
cd frontend
npm install
```

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

```
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Run the dev server:

```bash
npm run dev
```

The app is served at `http://localhost:5173`.

## Documentation

- [API Documentation](docs/API.md) — every backend endpoint, request/response shapes, and auth details

## License

This project was developed for an exhibition at the **Department of Physics, University of Sri Jayewardenepura**.
