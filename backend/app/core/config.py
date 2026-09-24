import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "EvidenceGraph AI Backend"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/evidencegraph"
    SECRET_KEY: str = "development_secret_key_change_in_production"
    CLERK_SECRET_KEY: str = ""
    AI_SERVICE_URL: str = "http://localhost:8001/ai"
    STORAGE_DIR: str = "./uploads"

    # Cloudinary Integration Settings
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""
    MAX_UPLOAD_SIZE_MB: int = 50

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

os.makedirs(settings.STORAGE_DIR, exist_ok=True)
