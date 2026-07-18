package com.greencommit.backend.ai.dto;

import java.util.UUID;

/** POST /ai/orchestrations 요청(STUB ONLY, F021 Phase 99 보류). */
public record OrchestrationRequest(UUID userId, UUID sessionId, String intent) {
}
