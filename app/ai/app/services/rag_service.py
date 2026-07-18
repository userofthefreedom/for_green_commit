"""RAG/Vector 검색 서비스. pgvector 연동은 Phase 4+에서 채운다."""
from app.schemas.retrieval import RetrievalQuery, RetrievalResult


def search(query: RetrievalQuery) -> RetrievalResult:
    # TODO(Phase 4+): pgvector 코사인 유사도 검색으로 교체.
    return RetrievalResult(matches=[])
