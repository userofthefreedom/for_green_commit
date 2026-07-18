"""애플리케이션 설정. 환경변수(.env)로 오버라이드 가능."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "green-commit-ai"
    postgres_dsn: str = "postgresql://greencommit:greencommit@localhost:5432/greencommit"
    redis_url: str = "redis://localhost:6379/0"
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "greencommit"


settings = Settings()
