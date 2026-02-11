from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres123@localhost:5432/transactions_db"
    REDIS_URL: str = "redis://localhost:6379"
    OPENAI_API_KEY: str = "sk-placeholder"
    SECRET_KEY: str = "supersecretkey"
    
    class Config:
        env_file = ".env"

settings = Settings()
