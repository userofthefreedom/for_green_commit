"""POST /v1/retrieval/search — RAG/pgvector 검색 (기획서 SECTION IV-2)."""
from fastapi import APIRouter

from app.schemas.retrieval import RetrievalQuery, RetrievalResult
from app.services.rag_service import search

router = APIRouter(prefix="/v1/retrieval", tags=["retrieval"])


@router.post("/search", response_model=RetrievalResult)
def search_retrieval(query: RetrievalQuery) -> RetrievalResult:
    return search(query)
