package com.greencommit.backend.prtracking.dto;

import java.time.Instant;
import java.util.UUID;

public record PullRequestLinkResponse(
        UUID id, String repoOwner, String repoName, Integer prNumber, String prUrl, Instant createdAt) {
}
