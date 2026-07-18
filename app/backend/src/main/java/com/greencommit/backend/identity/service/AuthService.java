package com.greencommit.backend.identity.service;

import com.greencommit.backend.identity.dto.GitHubCallbackRequest;
import com.greencommit.backend.identity.dto.UserResponse;
import com.greencommit.backend.identity.entity.ConsentType;
import com.greencommit.backend.identity.entity.Consent;
import com.greencommit.backend.identity.entity.GitHubAccount;
import com.greencommit.backend.identity.entity.OAuthCredential;
import com.greencommit.backend.identity.entity.User;
import com.greencommit.backend.identity.repository.ConsentRepository;
import com.greencommit.backend.identity.repository.GitHubAccountRepository;
import com.greencommit.backend.identity.repository.OAuthCredentialRepository;
import com.greencommit.backend.identity.repository.UserRepository;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * F001/BR01: GitHub 계정 필수 회원가입. Phase 1에서는 실제 OAuth2 Authorization Code 교환 없이
 * 콜백 payload를 신뢰해 User/GitHubAccount/OAuthCredential/Consent를 upsert하는 스텁 흐름이다.
 * TODO(Phase 2, 팀 확인 후 구현): Spring Security OAuth2 Client로 실제 GitHub 로그인 게이트 연결.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final GitHubAccountRepository gitHubAccountRepository;
    private final OAuthCredentialRepository oAuthCredentialRepository;
    private final ConsentRepository consentRepository;

    @Transactional
    public UserResponse handleGithubCallback(GitHubCallbackRequest request) {
        Instant now = Instant.now();
        User user = userRepository.findByGithubId(request.githubId())
                .map(existing -> {
                    existing.setGithubLogin(request.githubLogin());
                    existing.setEmail(request.email());
                    existing.setDisplayName(request.displayName());
                    existing.setAvatarUrl(request.avatarUrl());
                    existing.setUpdatedAt(now);
                    return existing;
                })
                .orElseGet(() -> User.builder()
                        .githubId(request.githubId())
                        .githubLogin(request.githubLogin())
                        .email(request.email())
                        .displayName(request.displayName())
                        .avatarUrl(request.avatarUrl())
                        .createdAt(now)
                        .updatedAt(now)
                        .build());
        final User savedUser = userRepository.save(user);

        GitHubAccount account = gitHubAccountRepository.findByUserId(savedUser.getId())
                .orElseGet(() -> GitHubAccount.builder().user(savedUser).build());
        account.setGithubUserId(request.githubId());
        account.setLogin(request.githubLogin());
        account.setProfileUrl("https://github.com/" + request.githubLogin());
        account.setPublicReposCount(request.publicReposCount());
        account.setFollowers(request.followers());
        account.setConnectedAt(now);
        gitHubAccountRepository.save(account);

        OAuthCredential credential = oAuthCredentialRepository.findByUserId(savedUser.getId())
                .orElseGet(() -> OAuthCredential.builder().user(savedUser).provider("github").build());
        // Phase 1 스텁: 실제 토큰이 없으므로 placeholder만 저장한다 (Phase 2에서 실제 토큰으로 대체).
        credential.setAccessToken("stub-access-token");
        credential.setScope("public_repo read:user");
        oAuthCredentialRepository.save(credential);

        if (consentRepository.findByUserId(savedUser.getId()).isEmpty()) {
            consentRepository.save(Consent.builder()
                    .user(savedUser)
                    .consentType(ConsentType.PROFILE_READ)
                    .granted(true)
                    .grantedAt(now)
                    .build());
            consentRepository.save(Consent.builder()
                    .user(savedUser)
                    .consentType(ConsentType.PUBLIC_REPO_READ)
                    .granted(true)
                    .grantedAt(now)
                    .build());
        }

        return toResponse(savedUser);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getGithubId(),
                user.getGithubLogin(),
                user.getEmail(),
                user.getDisplayName(),
                user.getAvatarUrl(),
                user.getCreatedAt());
    }
}
