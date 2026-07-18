package com.greencommit.backend.profile.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

/** POST /tutorial/progress 요청 — 완료 또는 스킵 상태 저장. */
public record TutorialProgressRequest(
        @NotNull UUID userId,
        boolean completed,
        boolean skipped,
        String currentStep) {
}
