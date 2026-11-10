from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="LINKPULSE_", env_file=".env", extra="ignore")

    app_name: str = "LinkPulse"
    secret_key: str = "dev-secret-change-me-in-production-0123456789"
    access_token_minutes: int = 60 * 24
    webhook_secret: str = "whsec_dev"
    database_url: str = "sqlite:///./linkpulse.db"
    billing_provider: str = "fake"  # only "fake" ships; plug in Stripe etc. in app/billing.py
    base_url: str = "http://localhost:8000"
    admin_emails: str = ""  # comma-separated; these accounts get admin on signup

    def is_admin_email(self, email: str) -> bool:
        return email.lower() in {e.strip().lower() for e in self.admin_emails.split(",") if e.strip()}


@lru_cache
def get_settings() -> Settings:
    return Settings()
