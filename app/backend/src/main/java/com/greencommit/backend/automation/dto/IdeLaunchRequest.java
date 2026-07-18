package com.greencommit.backend.automation.dto;

import com.greencommit.backend.profile.entity.PrimaryIde;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

/** POST /ide-launch 요청 — 선택 IDE Handoff 기록·URL 생성. */
public record IdeLaunchRequest(@NotNull UUID userId, @NotNull PrimaryIde ide, UUID repositoryId) {
}
