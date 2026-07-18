"""Redis 연결 헬퍼. 실제 캐시/큐 연동은 Phase 4+에서 구성한다."""
from app.core.config import settings


def get_url() -> str:
    return settings.redis_url
