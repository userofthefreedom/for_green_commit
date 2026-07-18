package com.greencommit.backend.identity.dto;

import java.time.Instant;

/** F004: GET /users/me/github-account 응답 — 로그인 시 저장된 실제 공개 프로필 Snapshot(BR02). */
public record GitHubAccountResponse(
        String login,
        String profileUrl,
        Integer publicReposCount,
        Integer followers,
        Instant connectedAt) {
}
