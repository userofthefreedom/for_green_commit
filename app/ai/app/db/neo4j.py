"""Neo4j(Knowledge Graph) 연결 헬퍼. 실제 드라이버 연동은 Phase 4+에서 구성한다."""
from app.core.config import settings


def get_uri() -> str:
    return settings.neo4j_uri
