package com.greencommit.backend.catalog.dto;

import java.time.Instant;
import java.util.UUID;

/** GET /repositories/{id}/issues 응답 — 표16 Issue 카드. */
public record IssueCardResponse(
        UUID issueId,
        UUID repositoryId,
        Integer number,
        String title,
        String url,
        String summary,
        String currentProblem,
        String expectedOutcome,
        String completionCriteria,
        String contributionType,
        String estimatedScope,
        String difficulty,
        String assignee,
        String linkedPrUrl,
        Instant lastUpdatedAt,
        String state) {
}
