package com.greencommit.backend.recommendation.dto;

/** BR09: Evidence는 추정과 구분해 표현한다 — 규칙 이름/원문 링크를 함께 노출. */
public record EvidenceItem(String evidenceType, String sourceUrl, String description, String ruleName) {
}
