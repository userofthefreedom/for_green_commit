"""POST /v1/repository-analysis — Local GPU Model 호출 (기획서 SECTION IV-2)."""
from fastapi import APIRouter

from app.model_gateway.mock_client import MockModelClient
from app.schemas.repository_analysis import RepositoryAnalysisRequest, RepositoryAnalysisResult

router = APIRouter(prefix="/v1/repository-analysis", tags=["repository-analysis"])
_client = MockModelClient()


@router.post("", response_model=RepositoryAnalysisResult)
def analyze_repository(request: RepositoryAnalysisRequest) -> RepositoryAnalysisResult:
    result = _client.analyze_repository(request.repository_id, request.issue_id)
    return RepositoryAnalysisResult(**result)
