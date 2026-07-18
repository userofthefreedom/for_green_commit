package com.greencommit.backend.automation.dto;

import java.util.UUID;

public record IdeLaunchResponse(UUID attemptId, String deepLinkUrl, boolean succeeded, String instructions) {
}
