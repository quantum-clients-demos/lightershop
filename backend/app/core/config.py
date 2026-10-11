import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Ember & Co. - Lighter Shop API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Database
    # Default to local postgres or fallback to sqlite async
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql+asyncpg://postgres:postgres@localhost:5432/lightershop"
    )
    SQLITE_FALLBACK_URL: str = "sqlite+aiosqlite:///./lightershop.db"
    
    # Security / JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "ember-and-co-ultra-secure-demo-secret-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Razorpay Payment Gateway
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "rzp_test_EMBER_DEMO_KEY")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "ember_demo_secret_key_12345")
    RAZORPAY_WEBHOOK_SECRET: str = os.getenv("RAZORPAY_WEBHOOK_SECRET", "ember_webhook_secret_key")
    
    # Business Logic Config
    RETAIL_FREE_SHIPPING_THRESHOLD: float = 1999.0  # ₹1,999 from banner
    STANDARD_SHIPPING_FEE: float = 149.0
    GST_RATE: float = 0.18  # 18% standard GST for accessories in India
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]
    
    model_config = SettingsConfigDict(
        env_file=[".env", "../.env"],
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
