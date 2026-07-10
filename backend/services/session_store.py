from __future__ import annotations

import hashlib
import json
import secrets
from datetime import UTC, datetime, timedelta

from core.config import get_session_ttl_minutes
from core.redis import get_redis_client

_SESSION_KEY_PREFIX = 'session:'


def _utcnow() -> datetime:
    return datetime.now(UTC)


def _hash_token(session_token: str) -> str:
    return hashlib.sha256(session_token.encode('utf-8')).hexdigest()


def _session_key(session_token: str) -> str:
    return f'{_SESSION_KEY_PREFIX}{_hash_token(session_token)}'


def _ttl_seconds() -> int:
    return get_session_ttl_minutes() * 60


def create_session(user_id: int) -> tuple[str, datetime]:
    session_token = secrets.token_urlsafe(48)
    ttl_seconds = _ttl_seconds()
    payload = {'user_id': user_id, 'created_at': _utcnow().isoformat()}

    client = get_redis_client()
    client.setex(_session_key(session_token), ttl_seconds, json.dumps(payload))

    expires_at = _utcnow() + timedelta(seconds=ttl_seconds)
    return session_token, expires_at


def get_session_user_id(session_token: str) -> int | None:
    client = get_redis_client()
    key = _session_key(session_token)
    raw = client.get(key)
    if not raw:
        return None

    payload = json.loads(raw)
    client.expire(key, _ttl_seconds())
    return payload.get('user_id')


def delete_session(session_token: str) -> None:
    client = get_redis_client()
    client.delete(_session_key(session_token))
