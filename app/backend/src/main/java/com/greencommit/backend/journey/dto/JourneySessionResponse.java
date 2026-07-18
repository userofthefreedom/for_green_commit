package com.greencommit.backend.journey.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record JourneySessionResponse(
        UUID sessionId,
        UUID missionId,
        String status,
        Instant startedAt,
        Instant completedAt,
        List<JourneyStepResponse> steps) {
}
