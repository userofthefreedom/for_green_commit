"""공통 스키마. BR09(근거·추정 구분)를 스키마 레벨에서 강제하기 위한 타입들."""
from enum import Enum

from pydantic import BaseModel, Field


class ProvenanceTag(str, Enum):
    """이 값이 GitHub 원문인지, 규칙 계산인지, LLM 추정인지 구분 (BR09)."""

    GITHUB_ORIGINAL = "github_original"
    RULE_COMPUTED = "rule_computed"
    LLM_INFERENCE = "llm_inference"


class ConfidenceLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class Evidence(BaseModel):
    """추천/질문/평가의 근거 하나. 원문 링크 또는 규칙 경로를 담는다."""

    source: str = Field(description="근거 출처 설명 (예: GitHub Issue #123, Rule:activity_score)")
    provenance: ProvenanceTag
    confidence: ConfidenceLevel
    reference_url: str | None = None
