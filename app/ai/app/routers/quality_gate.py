"""POST /v1/quality-gate/check — Quality Gate 검사 (기획서 SECTION IV-7)."""
from fastapi import APIRouter

from app.schemas.quality_gate import QualityCheckRequest, QualityCheckResult
from app.services.quality_gate_service import check

router = APIRouter(prefix="/v1/quality-gate", tags=["quality-gate"])


@router.post("/check", response_model=QualityCheckResult)
def check_quality(request: QualityCheckRequest) -> QualityCheckResult:
    return check(request)
