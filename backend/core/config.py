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