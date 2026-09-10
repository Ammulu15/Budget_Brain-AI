from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "sqlite:///./budgetbrain.db"
    secret_key: str = "supersecretbudgetbraindefaultkey2026"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080
    groq_api_key: str = ""
    smtp_email: str = ""
    smtp_password: str = ""

settings = Settings()