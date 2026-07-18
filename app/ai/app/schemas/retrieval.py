"""RAG / Vector 검색 스키마 (기획서 SECTION IV-2 RAG/Vector)."""
from pydantic import BaseModel

from app.schemas.common import Evidence


class RetrievalQuery(BaseModel):
    query: str
    repository_id: str | None = None
    top_k: int = 5


class RetrievalResult(BaseModel):
    matches: list[Evidence]
