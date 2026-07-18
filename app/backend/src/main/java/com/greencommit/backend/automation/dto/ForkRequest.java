package com.greencommit.backend.automation.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

/** POST /automations/fork 요청(BR06: 사용자 버튼 클릭 후 호출된다는 전제). */
public record ForkRequest(@NotNull UUID userId, UUID sessionId, @NotNull UUID repositoryId) {
}
