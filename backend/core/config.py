import os
from pathlib import Path

from dotenv import load_dotenv


def load_env() -> None:
    env_path = Path(__file__).resolve().parents[1] / '.env'
    load_dotenv(dotenv_path=env_path, override=False)


def get_env(name: str, fallback: str | None = None) -> str | None:
    load_env()
    value = os.getenv(name)
    if value:
        return value
    return fallback


def get_database_url() -> str:
    database_url = (
        get_env('POSTGRESS_DATABASE_URL')
        or get_env('POSTGRES_DATABASE_URL')
        or get_env('DATABASE_URL')
    )
    if not database_url:
        raise ValueError('Database URL is not set')
    return database_url


def get_redis_url() -> str:
    redis_url = get_env('REDIS_URL')
    if not redis_url:
        raise ValueError('REDIS_URL is not set')
    return redis_url


def get_google_client_id() -> str:
    google_client_id = get_env('GOOGLE_CLIENT_ID')
    if not google_client_id:
        raise ValueError('GOOGLE_CLIENT_ID is not set')
    return google_client_id


def get_session_cookie_name() -> str:
    return get_env('SESSION_COOKIE_NAME', 'phy_chat_session') or 'phy_chat_session'


def get_session_ttl_minutes() -> int:
    raw_ttl = get_env('SESSION_TTL_MINUTES', '10080')
    return int(raw_ttl or '10080')


def is_cookie_secure() -> bool:
    return (get_env('COOKIE_SECURE', 'false') or 'false').lower() in {'1', 'true', 'yes', 'on'}


def get_allowed_email_domain() -> str:
    return (get_env('ALLOWED_EMAIL_DOMAIN', 'sjb.mrt.ac.lk') or 'sjb.mrt.ac.lk').lower()


def get_google_api_key() -> str:
    google_api_key = get_env('GOOGLE_API_KEY')
    if not google_api_key:
        raise ValueError('GOOGLE_API_KEY is not set')
    return google_api_key


def get_gemini_model() -> str:
    return get_env('GEMINI_MODEL', 'gemini-2.5-flash') or 'gemini-2.5-flash'


def get_embedding_model() -> str:
    return get_env('EMBEDDING_MODEL', 'models/gemini-embedding-001') or 'models/gemini-embedding-001'


def get_cors_origins() -> list[str]:
    raw_origins = get_env('CORS_ORIGINS', 'http://localhost:5173') or 'http://localhost:5173'
    return [origin.strip() for origin in raw_origins.split(',') if origin.strip()]