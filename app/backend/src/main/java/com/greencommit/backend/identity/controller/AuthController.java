package com.greencommit.backend.identity.controller;

import com.greencommit.backend.identity.dto.GitHubAccountResponse;
import com.greencommit.backend.identity.dto.GitHubCallbackRequest;
import com.greencommit.backend.identity.dto.UserResponse;
import com.greencommit.backend.identity.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/** F001/BR01: 표37 API — POST /auth/github/callback, 및 Phase 2가 추가한 GET /auth/session. */
@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Phase 1 수동 테스트용 스텁 경로. 실제 로그인은 Phase 2부터 `/oauth2/authorization/github`
     * (Spring Security가 자동 제공) → GitHub 동의 화면 → `/login/oauth2/code/github` 흐름을 탄다.
     */
    @PostMapping("/auth/github/callback")
    public ResponseEntity<UserResponse> githubCallback(@Valid @RequestBody GitHubCallbackRequest request) {
        return ResponseEntity.ok(authService.handleGithubCallback(request));
    }

    /**
     * BR01 게이트 확인용. 프론트 AuthGuard/AuthContext가 앱 진입 시 호출해 로그인 여부를 판단한다.
     * SecurityConfig에서 permitAll이지만, 세션이 있으면 Authentication은 여전히 채워진다.
     */
    @GetMapping("/auth/session")
    public ResponseEntity<UserResponse> session(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        Long githubId = ((Number) principal.getAttributes().get("id")).longValue();
        return authService.findByGithubId(githubId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(401).build());
    }

    /** F004/BR02: SCR003 GitHub 분석 화면이 보여줄 실제 공개 프로필 Snapshot(로그인 시 저장됨). */
    @GetMapping("/users/me/github-account")
    public ResponseEntity<GitHubAccountResponse> githubAccount(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }
        Long githubId = ((Number) principal.getAttributes().get("id")).longValue();
        return authService.getGithubAccountSummary(githubId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).build());
    }
}
