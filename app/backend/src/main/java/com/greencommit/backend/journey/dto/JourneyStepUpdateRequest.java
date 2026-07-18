package com.greencommit.backend.journey.dto;

import jakarta.validation.constraints.NotNull;

/**
 * PATCH /journeys/{id}/steps/{step} 요청 — 완료·스킵·재시도(BR05: 자동화 동의·외부 실행 확인·PR
 * 등록 검증은 스킵으로 생략할 수 없으나, Phase 1 프로토타입은 그 검증을 단순화해 mode로만 남긴다).
 */
public record JourneyStepUpdateRequest(@NotNull StepAction action, String mode) {

    public enum StepAction {
        COMPLETE,
        SKIP,
        RETRY
    }
}
