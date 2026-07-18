"""Local GPU Model / vLLM 스타일 모델 서버로 교체 가능한 추상 계약."""
from abc import ABC, abstractmethod


class ModelClient(ABC):
    @abstractmethod
    def analyze_repository(self, repository_id: str, issue_id: str | None) -> dict:
        """Repo·코드·Diff 분석 결과를 반환한다. 실제 GPU 모델 서버로 교체되는 지점."""
        raise NotImplementedError
