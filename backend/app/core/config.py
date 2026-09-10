from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "sqlite:///./budgetbrain.db"
    # Development-only defaults. Set real values through the deployment environment.
    secret_key: str = "change-this-before-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080
    groq_api_key: str = ""
    smtp_email: str = ""
    smtp_password: str = ""
    frontend_url: str = "http://localhost:5173"
    cors_origins: str = "http://localhost:5173"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip().rstrip("/") for origin in self.cors_origins.split(",") if origin.strip()]

settings = Settings()
