package com.greencommit.backend.journey.entity;

/** F008: Journey 각 단계는 완료·스킵·자동화·실패·재시도 상태를 가진다. */
public enum JourneyStepState {
    PENDING,
    IN_PROGRESS,
    COMPLETED,
    SKIPPED,
    FAILED,
    RETRY
}
