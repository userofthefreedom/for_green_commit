package com.greencommit.backend.identity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * POST /auth/github/callback 요청 스텁 payload.
 * 실제 GitHub OAuth2 Authorization Code 교환은 Phase 2에서 Spring Security OAuth2 Client로 대체된다.
 * Phase 1은 이 payload를 그대로 받아 User/GitHubAccount/OAuthCredential을 upsert한다.
 */
public record GitHubCallbackRequest(
        @NotNull Long githubId,
        @NotBlank String githubLogin,
        String email,
        String displayName,
        String avatarUrl,
        Integer publicReposCount,
        Integer followers) {
}
