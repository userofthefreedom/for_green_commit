"""Quality Gate 서비스 — BR14(정확한 머지 확률 표시 금지) 등 금지 표현을 검사한다."""
import re

from app.schemas.quality_gate import QualityCheckRequest, QualityCheckResult

# BR14: "머지 확률 87%" 같은 정확한 수치 표현을 금지한다.
_MERGE_PROBABILITY_PATTERN = re.compile(r"(머지|merge)\s*확률\s*\d+%", re.IGNORECASE)


def check(request: QualityCheckRequest) -> QualityCheckResult:
    violations: list[str] = []
    if _MERGE_PROBABILITY_PATTERN.search(request.text):
        violations.append("BR14 위반: 정확한 머지 확률 수치를 표시할 수 없습니다.")
    return QualityCheckResult(passed=not violations, violations=violations)
