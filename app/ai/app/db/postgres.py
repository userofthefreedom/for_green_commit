"""PostgreSQL(+pgvector) 연결 헬퍼. 실제 커넥션 풀은 Phase 4+에서 구성한다."""
from app.core.config import settings


def get_dsn() -> str:
    return settings.postgres_dsn
