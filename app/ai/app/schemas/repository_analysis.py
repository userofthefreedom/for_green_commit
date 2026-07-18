"""Local GPU Model 인터페이스 스키마 (기획서 SECTION IV-2 Local GPU Model)."""
from pydantic import BaseModel

from app.schemas.common import Evidence


class RepositoryAnalysisRequest(BaseModel):
    repository_id: str
    issue_id: str | None = None


class RepositoryAnalysisResult(BaseModel):
    related_files: list[str]
    summary: str
    evidence: list[Evidence] = []
