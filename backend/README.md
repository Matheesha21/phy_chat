# Physics Chatbot Backend

FastAPI backend with Google-restricted authentication and a Gemini-powered chat API.

- **Postgres** — stores user profiles (via SQLAlchemy + Alembic migrations)
- **Redis** — stores session data (session id → user id, TTL-based)
- **LangChain + Gemini** — powers the chat endpoint

## Setup

1. Create a virtual environment
   ```
   python3 -m venv venv
   ```

2. Activate the virtual environment
   ```
   source venv/bin/activate
   ```

3. Install required libraries
   ```
   pip install -r requirements.txt
   ```

4. Copy `.env.example` to `.env` and fill in the values (see [Environment variables](#environment-variables) below)
   ```
   cp .env.example .env
   ```

5. Make sure Postgres and Redis are running and reachable at the URLs configured in `.env`

6. Run database migrations
   ```
   alembic upgrade head
   ```

7. Run the development server
   ```
   uvicorn app:app --reload
   ```

The API will be available at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`.

## Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `POSTGRES_DATABASE_URL` (or `POSTGRESS_DATABASE_URL` / `DATABASE_URL`) | Postgres connection string | — (required) |
| `REDIS_URL` | Redis connection string | — (required) |
| `GOOGLE_CLIENT_ID` | OAuth client ID used to verify Google ID tokens | — (required) |
| `SESSION_COOKIE_NAME` | Name of the session cookie | `phy_chat_session` |
| `SESSION_TTL_MINUTES` | Session lifetime in minutes (sliding — refreshed on each authenticated request) | `10080` (7 days) |
| `COOKIE_SECURE` | Whether the session cookie requires HTTPS (`true`/`false`) | `false` |
| `ALLOWED_EMAIL_DOMAIN` | Only Google accounts with this email domain may sign in | `sjb.mrt.ac.lk` |
| `GOOGLE_API_KEY` | API key for the Gemini model used by the chat endpoint | — (required) |
| `GEMINI_MODEL` | Gemini model name used by the chat endpoint | `gemini-2.5-flash` |

## Architecture notes

- **Users** are persisted in Postgres (`users` table, managed via Alembic). A user row is created automatically the first time someone signs in with an allowed Google account.
- **Sessions** live entirely in Redis, keyed by a SHA-256 hash of the opaque session token issued to the client (the raw token is only ever sent to the client via an httpOnly cookie). Each session maps to a `user_id` and expires via Redis TTL; the TTL is refreshed on every authenticated request (sliding expiration). There is no session table in Postgres.
- **Chat** is stateless on the server — no conversation data is persisted. The client sends the current message plus any prior turns it wants included as context (`history`), and the backend forwards that to Gemini via LangChain and returns the reply.

## API reference

### Auth — `/auth`

All endpoints are on the `/auth` prefix. Authentication is via an httpOnly session cookie (`SESSION_COOKIE_NAME`), set automatically on sign-in.

#### `POST /auth/google`

Sign in (or auto-register on first sign-in) with a Google ID token. Rejects tokens whose email is not verified or does not belong to `ALLOWED_EMAIL_DOMAIN`.

Request:
```json
{
  "id_token": "<google id token from the client-side Google Sign-In flow>"
}
```

Response `200`:
```json
{
  "user": {
    "id": 1,
    "google_sub": "1234567890",
    "email": "student@sjb.mrt.ac.lk",
    "full_name": "Jane Doe",
    "picture_url": "https://...",
    "is_active": true
  },
  "session_expires_at": "2026-07-16T00:00:00Z"
}
```

Sets the session cookie. Errors: `400` (missing token claims), `401` (invalid/unverified token), `403` (email domain not allowed).

#### `POST /auth/logout`

Revokes the current session (deletes it from Redis) and clears the session cookie.

Response `200`:
```json
{ "message": "Logged out successfully" }
```

#### `GET /auth/me`

Returns the currently authenticated user. Requires a valid session cookie.

Response `200`: same `user` object shape as above. Errors: `401` if not authenticated, session expired/invalid, or the user is inactive.

### Chat — `/chat`

Requires a valid session cookie (same auth as `/auth/me`).

#### `POST /chat/`

Sends a message to the Gemini-backed chat agent and returns its reply. No server-side history is stored — pass prior turns in `history` if you want the model to see them.

Request:
```json
{
  "message": "What is Newton's second law?",
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello! How can I help?" }
  ]
}
```

Response `200`:
```json
{ "reply": "Newton's second law states that F = ma..." }
```

Errors: `401` if not authenticated, `422` on an empty message, `502` if the Gemini call fails.

### Misc

- `GET /` — basic liveness message
- `GET /health` — reports Postgres and Redis connectivity (`200` if both healthy, `503` otherwise)

## Database migrations

Migrations are managed with Alembic (`alembic/`).

- Apply all migrations: `alembic upgrade head`
- Create a new migration after changing a model in `models/`: `alembic revision -m "description"` (or `--autogenerate` if the target DB is reachable)
