# Backend — USJ Physics Department AI Assistant

FastAPI backend serving the AI chat assistant, quiz competition, and leaderboard. See the [root README](../README.md) for the full project overview and architecture.

## Tech Stack

- Python 3.12+
- FastAPI + Uvicorn
- SQLAlchemy 2.0 + Alembic — ORM and database migrations
- PostgreSQL — primary database
- Redis — session/cache store
- Pydantic — request/response validation
- LangChain + Google Gemini API — LLM integration
- Google OAuth — SSO login

## Project Structure

```
backend/
├── app.py            FastAPI app instance and router registration
├── api/               Route handlers (auth, chat, quiz, leaderboard, profile)
├── core/              Config, database, Postgres and Redis connections
├── models/            SQLAlchemy models
├── schemas/           Pydantic schemas
├── services/          Business logic per feature
└── alembic/           Database migrations
```

## Prerequisites

- Python 3.12+
- A running PostgreSQL instance
- A running Redis instance
- Google OAuth client ID and Gemini API key

## Setup

Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file (copy `.env.example`) and set:

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

Run database migrations:

```bash
alembic upgrade head
```

## Run

Start the dev server:

```bash
uvicorn app:app --reload
```

The API is served at `http://localhost:8000`.

## Migrations

Create a new migration after changing models:

```bash
alembic revision --autogenerate -m "describe the change"
alembic upgrade head
```
