"""프로토타입 단계의 canned 응답 클라이언트. 실제 Local GPU Model Server 연동 전까지 사용."""
from app.model_gateway.base import ModelClient


class MockModelClient(ModelClient):
    def analyze_repository(self, repository_id: str, issue_id: str | None) -> dict:
        return {
            "related_files": [],
            "summary": f"[mock] repository={repository_id} issue={issue_id} 분석 결과 (Phase 1+에서 채움)",
        }
