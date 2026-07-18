package com.greencommit.backend.identity.controller;

import com.greencommit.backend.identity.dto.GitHubCallbackRequest;
import com.greencommit.backend.identity.dto.UserResponse;
import com.greencommit.backend.identity.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/** F001/BR01: 표37 API — POST /auth/github/callback. */
@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/auth/github/callback")
    public ResponseEntity<UserResponse> githubCallback(@Valid @RequestBody GitHubCallbackRequest request) {
        return ResponseEntity.ok(authService.handleGithubCallback(request));
    }
}
