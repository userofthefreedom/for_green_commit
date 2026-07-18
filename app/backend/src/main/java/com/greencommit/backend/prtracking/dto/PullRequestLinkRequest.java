package com.greencommit.backend.prtracking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

/** POST /pull-requests 요청 — PR URL/번호 연결(F016). */
public record PullRequestLinkRequest(
        @NotNull UUID userId,
        UUID sessionId,
        @NotBlank String repoOwner,
        @NotBlank String repoName,
        @NotNull Integer prNumber,
        @NotBlank String prUrl) {
}
