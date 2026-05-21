"""RDB 연결 레이어. POSTGRES_URL 또는 DATABASE_URL 설정 후 psycopg 연동."""

from __future__ import annotations

import os
from contextlib import contextmanager
from typing import Generator


def database_url() -> str | None:
    return os.environ.get("POSTGRES_URL") or os.environ.get("DATABASE_URL")


def is_configured() -> bool:
    return bool(database_url())


@contextmanager
def connection() -> Generator[object, None, None]:
    """RDB 붙일 때 psycopg.connect(database_url()) 로 교체."""
    url = database_url()
    if not url:
        raise RuntimeError(
            "DATABASE_URL / POSTGRES_URL is not set. "
            "Add it to .env locally or Vercel project settings."
        )
    # import psycopg
    # with psycopg.connect(url) as conn:
    #     yield conn
    raise NotImplementedError("RDB driver not wired yet — uncomment psycopg in requirements.txt")
