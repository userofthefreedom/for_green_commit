package com.greencommit.backend.profile.dto;

import java.time.Instant;
import java.util.UUID;

public record TutorialProgressResponse(
        UUID userId,
        boolean completed,
        boolean skipped,
        String currentStep,
        Instant completedAt) {
}
