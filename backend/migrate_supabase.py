import asyncio
import logging
import sys
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

# Set up logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("migration")

from app.core.config import settings
from app.core.database import _format_db_url, Base
import app.models  # Register all models on Base.metadata
from app.core.seed import seed_initial_data

async def run_supabase_migration():
    logger.info("Starting Supabase PostgreSQL migration & schema creation...")
    
    formatted_url = _format_db_url(settings.DATABASE_URL)
    # Mask password for display
    display_url = formatted_url
    if "@" in display_url:
        prefix, rest = display_url.split("://", 1)
        creds, host = rest.rsplit("@", 1)
        display_url = f"{prefix}://postgres:****@{host}"
    logger.info(f"Connecting to database: {display_url}")

    engine = create_async_engine(formatted_url, echo=False, pool_pre_ping=True)
    
    # 1. Test connection
    try:
        async with engine.begin() as conn:
            val = await conn.execute(text("SELECT version();"))
            version_str = val.scalar()
            logger.info(f"Successfully connected to PostgreSQL engine: {version_str}")
    except Exception as e:
        logger.error(f"Failed to connect to PostgreSQL: {e}")
        sys.exit(1)

    # 2. Create all schemas/tables
    logger.info("Executing Base.metadata.create_all on Supabase public schema...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("All database tables created successfully!")

    # 3. Seed initial data
    SessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False, autoflush=False)
    async with SessionLocal() as session:
        logger.info("Running seed_initial_data...")
        await seed_initial_data(session)

    # 4. Verify created tables and records
    logger.info("Verifying tables in Supabase public schema:")
    async with engine.begin() as conn:
        tables_res = await conn.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        """))
        tables = [r[0] for r in tables_res.fetchall()]
        logger.info(f"Tables present ({len(tables)}): {', '.join(tables)}")

        for tbl in tables:
            cnt_res = await conn.execute(text(f"SELECT COUNT(*) FROM \"{tbl}\";"))
            cnt = cnt_res.scalar()
            logger.info(f" - {tbl}: {cnt} rows")

    await engine.dispose()
    logger.info("Supabase migration completed successfully!")

if __name__ == "__main__":
    asyncio.run(run_supabase_migration())
