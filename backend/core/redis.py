import redis

from core.config import get_env, load_env


def get_redis_url() -> str:
    load_env()
    redis_url = get_env('REDIS_URL')
    if not redis_url:
        raise ValueError('REDIS_URL is not set')
    return redis_url


def get_redis_client() -> redis.Redis:
    return redis.Redis.from_url(
        get_redis_url(),
        socket_connect_timeout=3,
        socket_timeout=3,
        decode_responses=True,
    )


def check_redis_health() -> dict:
    try:
        client = get_redis_client()
        client.ping()
        return {'status': 'healthy'}
    except Exception as exc:
        return {'status': 'unhealthy', 'error': str(exc)}