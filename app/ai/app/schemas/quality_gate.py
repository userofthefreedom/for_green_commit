"""Quality Gate 스키마 — BR09(근거/추정 구분), BR14(머지확률 금지) 검사 (기획서 SECTION IV-7)."""
from pydantic import BaseModel


class QualityCheckRequest(BaseModel):
    text: str


class QualityCheckResult(BaseModel):
    passed: bool
    violations: list[str] = []
