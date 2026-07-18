package com.greencommit.backend.automation.dto;

import com.greencommit.backend.profile.entity.PrimaryIde;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

/** POST /automations/clone/prepare 요청. */
public record ClonePrepareRequest(@NotNull UUID userId, UUID sessionId, @NotNull UUID repositoryId, PrimaryIde ide) {
}
