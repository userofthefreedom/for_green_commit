package com.greencommit.backend.identity.dto;

import java.time.Instant;
import java.util.UUID;

/** POST /auth/github/callback 및 사용자 조회 공용 응답. */
public record UserResponse(
        UUID id,
        Long githubId,
        String githubLogin,
        String email,
        String displayName,
        String avatarUrl,
        Instant createdAt) {
}
