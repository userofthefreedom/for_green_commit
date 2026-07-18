package com.greencommit.backend.recommendation.dto;

import java.util.List;
import java.util.UUID;

/** GET /recommendations/repositories 응답 — 표16 Repository 카드 + 추천 점수/근거. */
public record RepositoryRecommendationResponse(
        UUID repositoryId,
        String fullName,
        String description,
        String primaryLanguage,
        String topics,
        String repoUrl,
        String publicBenefitSummary,
        String recentActivitySummary,
        String contributionDocsQuality,
        String externalPrResponsiveness,
        Double fitScore,
        String cautionNote,
        Integer stars,
        Double score,
        Integer rank,
        List<EvidenceItem> evidence) {
}
