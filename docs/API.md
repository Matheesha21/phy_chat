# API Documentation

Backend API reference for the USJ Physics Department AI Assistant. See the [root README](../README.md) for project setup.

## Base URL

```
http://localhost:8000
```

## Authentication

Except for `POST /auth/google`, `GET /`, and `GET /health`, all endpoints require authentication.

Authentication is **cookie-based**, not header-based:

1. `POST /auth/google` verifies a Google ID token and, on success, sets an `HttpOnly` session cookie on the response.
2. The browser automatically sends that cookie on subsequent requests. No `Authorization` header is used.
3. Requests made from JavaScript (e.g. Axios/`fetch`) must be sent with credentials enabled (`withCredentials: true` / `credentials: 'include'`) so the cookie is included.

| Property | Value |
|---|---|
| Cookie name | value of `SESSION_COOKIE_NAME` (default `phy_chat_session`) |
| HttpOnly | yes |
| SameSite | `Lax` |
| Secure | value of `COOKIE_SECURE` env var |
| Lifetime | `SESSION_TTL_MINUTES` (default 10080 = 7 days) |

Requests without a valid session cookie receive `401 Unauthorized`.

## Common error format

Errors follow FastAPI's default shape:

```json
{
  "detail": "Human-readable error message"
}
```

Validation errors (`422`) return FastAPI's standard field-level error array instead.

| Status | Meaning |
|---|---|
| 400 | Malformed request (e.g. missing required data) |
| 401 | Not authenticated / session expired or invalid |
| 403 | Authenticated but not allowed to access the resource |
| 404 | Resource not found |
| 409 | Conflict with current resource state |
| 422 | Request body failed validation |
| 502 | Upstream Gemini call failed |
| 503 | Health check failed (Postgres/Redis unreachable) |

---

## System

### `GET /`

Liveness check.

**Auth required:** No

**Response** `200 OK`
```json
{ "message": "Physics chatbot backend running" }
```

### `GET /health`

Health check for the backend, PostgreSQL, and Redis.

**Auth required:** No

**Response** `200 OK` (healthy) or `503 Service Unavailable` (unhealthy)
```json
{
  "status": "healthy",
  "backend": { "status": "healthy" },
  "postgres": { "status": "healthy" },
  "redis": { "status": "healthy" }
}
```

---

## Auth

### `POST /auth/google`

Verifies a Google ID token, creates the user on first sign-in, and starts a session. Rejects tokens for emails outside `ALLOWED_EMAIL_DOMAIN`.

**Auth required:** No

**Headers**
| Header | Value |
|---|---|
| Content-Type | `application/json` |

**Request body**
```json
{
  "id_token": "google_id_token_from_frontend_sso"
}
```

**Response** `200 OK` — also sets the session cookie
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
  "session_expires_at": "2026-07-21T10:00:00Z"
}
```

**Errors**
- `400` — Google token missing required claims
- `401` — invalid Google ID token, or email not verified
- `403` — email domain not in `ALLOWED_EMAIL_DOMAIN`

### `POST /auth/logout`

Revokes the current session and clears the session cookie.

**Auth required:** No (no-ops if no session cookie is present)

**Request body:** none

**Response** `200 OK`
```json
{ "message": "Logged out successfully" }
```

### `GET /auth/me`

Returns the currently authenticated user.

**Auth required:** Yes

**Response** `200 OK`
```json
{
  "id": 1,
  "google_sub": "1234567890",
  "email": "student@sjb.mrt.ac.lk",
  "full_name": "Jane Doe",
  "picture_url": "https://...",
  "is_active": true
}
```

**Errors:** `401` — not authenticated / session expired / user inactive

---

## Chat

### `POST /chat/`

Sends a message to the AI assistant and returns a reply. History is stateless — the full conversation must be sent by the client each time.

**Auth required:** Yes

**Headers**
| Header | Value |
|---|---|
| Content-Type | `application/json` |

**Request body**
```json
{
  "message": "What is the syllabus for PHY201?",
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello! How can I help?" }
  ]
}
```
| Field | Type | Required | Notes |
|---|---|---|---|
| `message` | string | yes | min length 1 |
| `history` | array of `{ role, content }` | no | `role` is `"user"` or `"assistant"`; defaults to `[]` |

**Response** `200 OK`
```json
{ "reply": "PHY201 covers classical mechanics..." }
```

**Errors**
- `401` — not authenticated
- `422` — invalid request body
- `502` — Gemini call failed

---

## Profile

Student profile drives quiz question generation (study year + interest modules).

### `POST /profile/`

Creates or updates (upsert) the current user's profile.

**Auth required:** Yes

**Headers**
| Header | Value |
|---|---|
| Content-Type | `application/json` |

**Request body**
```json
{
  "study_year": 2,
  "interest_modules": ["Electromagnetism", "Thermodynamics"],
  "description": "Interested in applied physics"
}
```
| Field | Type | Required | Notes |
|---|---|---|---|
| `study_year` | integer | yes | 1–4 |
| `interest_modules` | array of string | yes | at least 1 item |
| `description` | string \| null | no | |

**Response** `200 OK`
```json
{
  "id": 10,
  "user_id": 1,
  "study_year": 2,
  "interest_modules": ["Electromagnetism", "Thermodynamics"],
  "description": "Interested in applied physics",
  "created_at": "2026-07-14T10:00:00Z",
  "updated_at": "2026-07-14T10:00:00Z"
}
```

**Errors:** `401` — not authenticated · `422` — invalid request body

### `GET /profile/`

Returns the current user's profile.

**Auth required:** Yes

**Response** `200 OK` — same shape as above

**Errors**
- `401` — not authenticated
- `404` — profile not created yet

---

## Quiz

### `POST /quiz/generate`

Generates a new AI-authored MCQ tailored to the user's profile. Requires a profile to exist.

**Auth required:** Yes

**Request body:** none

**Response** `200 OK`
```json
{
  "id": 42,
  "topic": "Electromagnetism",
  "question": "What is the SI unit of magnetic flux?",
  "options": ["Tesla", "Weber", "Henry", "Farad"]
}
```
Note: `correct_option_index` is intentionally omitted from this response.

**Errors**
- `401` — not authenticated
- `404` — profile not set up (complete profile first)
- `502` — Gemini call failed

### `POST /quiz/{quiz_id}/answer`

Submits an answer for a previously generated question. Each question can only be answered once; the answer also updates the user's leaderboard stats.

**Auth required:** Yes

**Path parameters**
| Param | Type | Notes |
|---|---|---|
| `quiz_id` | integer | id returned by `POST /quiz/generate` |

**Headers**
| Header | Value |
|---|---|
| Content-Type | `application/json` |

**Request body**
```json
{
  "selected_option_index": 1,
  "time_taken_seconds": 12.5
}
```
| Field | Type | Required | Notes |
|---|---|---|---|
| `selected_option_index` | integer | yes | 0–3 |
| `time_taken_seconds` | number | yes | >= 0 |

**Response** `200 OK`
```json
{
  "quiz_id": 42,
  "is_correct": true,
  "correct_option_index": 1,
  "score_awarded": 85
}
```

**Errors**
- `401` — not authenticated
- `403` — quiz question belongs to another user
- `404` — quiz question not found
- `409` — question already answered
- `422` — invalid request body

---

## Leaderboard

### `GET /leaderboard/`

Returns all-time leaderboard standings, ranked by score.

**Auth required:** Yes

**Response** `200 OK`
```json
[
  {
    "rank": 1,
    "user_id": 1,
    "full_name": "Jane Doe",
    "email": "student@sjb.mrt.ac.lk",
    "correct_answers": 15,
    "wrong_answers": 3,
    "total_time_seconds": 210.4,
    "score": 920
  }
]
```

**Errors:** `401` — not authenticated
