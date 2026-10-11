import logging
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker, AsyncEngine
from sqlalchemy.orm import declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()

import urllib.parse

def _format_db_url(url: str) -> str:
    """Format and URL-encode database URL, handling special characters like @ or # in credentials."""
    if not url:
        return url
    prefix = ""
    for p in ["postgresql+asyncpg://", "postgresql://", "postgres://"]:
        if url.startswith(p):
            prefix = p
            break
    if not prefix:
        return url
    
    rest = url[len(prefix):]
    if "@" in rest:
        # Split on the LAST @ to correctly isolate the host:port/db from credentials
        creds, host_part = rest.rsplit("@", 1)
        if ":" in creds:
            username, password = creds.split(":", 1)
            unquoted_pw = urllib.parse.unquote(password)
            encoded_pw = urllib.parse.quote_plus(unquoted_pw)
            unquoted_user = urllib.parse.unquote(username)
            encoded_user = urllib.parse.quote_plus(unquoted_user)
            return f"postgresql+asyncpg://{encoded_user}:{encoded_pw}@{host_part}"
    return "postgresql+asyncpg://" + rest

_primary_url = _format_db_url(settings.DATABASE_URL)
engine: AsyncEngine = create_async_engine(_primary_url, echo=False, pool_pre_ping=True)
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False, autoflush=False)


async def ensure_working_engine():
    """Verify if primary PostgreSQL connection works; if not, safely switch to SQLite async fallback."""
    global engine, AsyncSessionLocal
    try:
        async with engine.begin() as conn:
            # Simple connection verification ping
            pass
    except Exception as exc:
        logger.warning(
            f"Could not connect to primary database ({exc}). "
            f"Using local async SQLite database ({settings.SQLITE_FALLBACK_URL}) for smooth execution. "
            f"Provide a valid PostgreSQL connection in .env to use PostgreSQL."
        )
        engine = create_async_engine(settings.SQLITE_FALLBACK_URL, echo=False)
        AsyncSessionLocal = async_sessionmaker(
            bind=engine,
            class_=AsyncSession,
            expire_on_commit=False,
            autoflush=False
        )


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
