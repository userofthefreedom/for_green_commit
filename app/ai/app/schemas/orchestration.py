"""Orchestrator LLM 요청/응답 스키마 (기획서 SECTION IV-1, IV-4 Orchestration Flow)."""
from pydantic import BaseModel

from app.schemas.common import Evidence


class PlanStep(BaseModel):
    """Orchestrator가 제안하는 다음 행동 하나. 실제 부작용 실행은 Core Backend가 담당한다 (BR12)."""

    tool: str
    reason: str
    requires_user_confirmation: bool = True


class OrchestrationRequest(BaseModel):
    user_id: str
    journey_session_id: str
    current_step: str
    context: dict = {}


class OrchestrationResponse(BaseModel):
    plan: list[PlanStep]
    explanation: str
    evidence: list[Evidence] = []
