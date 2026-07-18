package com.greencommit.backend.journey.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

/** POST /journeys 요청 — Repository·Issue 선택 완료 후 Mission Journey 생성(F008). */
public record JourneyCreateRequest(
        @NotNull UUID userId,
        @NotNull UUID repositoryId,
        @NotNull UUID issueId) {
}
