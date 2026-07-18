"""Orchestrator LLM 역할의 서비스. 지금은 규칙 기반 스텁이며, 이후 실제 LLM 호출로 교체한다.

BR12: 이 서비스는 어떤 부작용(Fork/Clone/PR 등)도 직접 실행하지 않는다.
PlanStep 목록만 반환하고, 실제 실행은 Core Backend(app/backend)의 정책 검증을 거친다.
"""
from app.schemas.orchestration import OrchestrationRequest, OrchestrationResponse, PlanStep


def build_plan(request: OrchestrationRequest) -> OrchestrationResponse:
    # TODO(Phase 4+): 실제 LLM 호출로 대체. 지금은 현재 단계를 그대로 확인하는 스텁 플랜.
    return OrchestrationResponse(
        plan=[
            PlanStep(
                tool="noop",
                reason=f"'{request.current_step}' 단계 스텁 플랜 (실제 LLM 미연동)",
                requires_user_confirmation=True,
            )
        ],
        explanation="Orchestrator는 아직 mock 응답입니다 (Phase 0 스캐폴드).",
        evidence=[],
    )
