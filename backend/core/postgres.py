from contextlib import contextmanager

import psycopg2

from core.config import get_database_url, load_env


def get_postgres_url() -> str:
    load_env()
    return get_database_url()


@contextmanager
def postgres_connection():
    connection = psycopg2.connect(get_postgres_url(), connect_timeout=3)
    try:
        yield connection
    finally:
        connection.close()


def check_postgres_health() -> dict:
    try:
        with postgres_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute('SELECT 1')
                cursor.fetchone()
        return {'status': 'healthy'}
    except Exception as exc:
        return {'status': 'unhealthy', 'error': str(exc)}