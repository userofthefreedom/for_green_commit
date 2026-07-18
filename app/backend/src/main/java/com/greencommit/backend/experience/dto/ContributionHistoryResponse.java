package com.greencommit.backend.experience.dto;

import java.time.Instant;
import java.util.UUID;

/** GET /history 응답 — F019 초안(PR연결 + Journey 요약만). */
public record ContributionHistoryResponse(
        UUID id,
        String repoOwner,
        String repoName,
        Integer prNumber,
        String prUrl,
        String journeySummary,
        Instant createdAt) {
}
