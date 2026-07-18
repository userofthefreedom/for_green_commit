package com.greencommit.backend.automation.dto;

import java.util.UUID;

public record ForkResponse(UUID executionId, String status, String forkedRepoUrl, String resultDetail) {
}
