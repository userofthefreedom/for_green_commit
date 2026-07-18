package com.greencommit.backend.journey.dto;

import java.time.Instant;
import java.util.UUID;

public record JourneyStepResponse(
        UUID stepId,
        String stepType,
        Integer sequence,
        String state,
        String mode,
        Instant updatedAt) {
}
