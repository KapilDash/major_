# Configuration
from pydantic_settings import BaseSettings
from pydantic import ConfigDict, field_validator
from typing import Optional, List

class Settings(BaseSettings):
    """Application settings"""
    
    # API
    API_TITLE: str = "Indian Judiciary AI"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "Advanced legal intelligence system"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: Optional[str] = None
    MONGODB_URL: Optional[str] = "mongodb://localhost:27017"
    
    # Google APIs
    GOOGLE_PROJECT_ID: Optional[str] = None
    GOOGLE_API_KEY: Optional[str] = None
    GOOGLE_CREDENTIALS_PATH: Optional[str] = None
    
    # Features
    ENABLE_GRAPH_ENGINE: bool = True
    ENABLE_RISK_DETECTOR: bool = True
    ENABLE_PROCEDURAL: bool = True
    ENABLE_CHATBOT: bool = True
    ENABLE_OUTCOME: bool = True
    ENABLE_DRAFTING: bool = True
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    # Note: We keep ALLOWED_ORIGINS as hardcoded list to avoid JSON parsing issues with pydantic_settings
    ALLOWED_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*",  # Allow all for development
    ]
    
    model_config = ConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",  # Ignore extra fields from .env
    )

settings = Settings()
