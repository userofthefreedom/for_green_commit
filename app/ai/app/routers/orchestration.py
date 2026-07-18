"""POST /v1/orchestrations — Orchestrator LLM 엔트리포인트 (기획서 SECTION IV-1)."""
from fastapi import APIRouter

from app.schemas.orchestration import OrchestrationRequest, OrchestrationResponse
from app.services.orchestrator_service import build_plan

router = APIRouter(prefix="/v1/orchestrations", tags=["orchestration"])


@router.post("", response_model=OrchestrationResponse)
def create_orchestration(request: OrchestrationRequest) -> OrchestrationResponse:
    return build_plan(request)
