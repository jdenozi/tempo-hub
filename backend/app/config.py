from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    APP_NAME: str = "TempoHub"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql://tempohub:tempohub@db:5432/tempohub"

    # JWT
    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24 * 7  # 1 week

    # Admin
    ADMIN_EMAIL: str = "admin@tempo-hub.fr"
    ADMIN_PASSWORD: str = "changeme"

    # OIDC / Authentik
    OIDC_CLIENT_ID: str = "tempohub"
    OIDC_CLIENT_SECRET: str = "tempohub-secret-tempo-2024"
    OIDC_ISSUER: str = "https://auth.tempo-hub.fr/application/o/tempohub/"
    OIDC_REDIRECT_URI: str = "https://tempo-hub.fr/auth/callback"

    # Authentik API (for admin operations)
    AUTHENTIK_API_URL: str = "https://auth.tempo-hub.fr"
    AUTHENTIK_API_TOKEN: str = ""

    # Frontend URL
    FRONTEND_URL: str = "https://tempo-hub.fr"

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
