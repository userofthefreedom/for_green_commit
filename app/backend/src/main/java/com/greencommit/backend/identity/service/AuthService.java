package com.greencommit.backend.identity.service;

import com.greencommit.backend.identity.dto.GitHubAccountResponse;
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
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * F001/BR01: GitHub 계정 필수 회원가입.
 * `handleGithubCallback`은 Phase 1에서 만든 수동 테스트용 스텁 경로(실제 토큰 없이 upsert)이고,
 * `handleGithubLogin`은 Phase 2의 실제 Spring Security OAuth2 로그인 흐름(GithubOAuth2UserService)이
 * 호출하는 진짜 경로로, 실제 access token/scope를 저장한다. 두 경로 모두 같은 upsert 로직을 공유한다.
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
        User savedUser = upsertIdentity(request.githubId(), request.githubLogin(), request.email(),
                request.displayName(), request.avatarUrl(), request.publicReposCount(), request.followers());
        upsertCredential(savedUser, "stub-access-token", "public_repo read:user");
        return toResponse(savedUser);
    }

    /** Phase 2: 실제 GitHub OAuth2 로그인 성공 시 {@link com.greencommit.backend.common.security.GithubOAuth2UserService}가 호출. */
    @Transactional
    public UserResponse handleGithubLogin(Long githubId, String githubLogin, String email, String displayName,
            String avatarUrl, Integer publicReposCount, Integer followers, String accessToken, String scope) {
        User savedUser = upsertIdentity(githubId, githubLogin, email, displayName, avatarUrl, publicReposCount,
                followers);
        upsertCredential(savedUser, accessToken, scope);
        return toResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public Optional<UserResponse> findByGithubId(Long githubId) {
        return userRepository.findByGithubId(githubId).map(this::toResponse);
    }

    /** F004: SCR003(GitHub 분석)이 보여줄, 로그인 시 저장된 실제 공개 프로필 Snapshot(BR02). */
    @Transactional(readOnly = true)
    public Optional<GitHubAccountResponse> getGithubAccountSummary(Long githubId) {
        return userRepository.findByGithubId(githubId)
                .flatMap(user -> gitHubAccountRepository.findByUserId(user.getId()))
                .map(account -> new GitHubAccountResponse(
                        account.getLogin(),
                        account.getProfileUrl(),
                        account.getPublicReposCount(),
                        account.getFollowers(),
                        account.getConnectedAt()));
    }

    private User upsertIdentity(Long githubId, String githubLogin, String email, String displayName,
            String avatarUrl, Integer publicReposCount, Integer followers) {
        Instant now = Instant.now();
        User user = userRepository.findByGithubId(githubId)
                .map(existing -> {
                    existing.setGithubLogin(githubLogin);
                    existing.setEmail(email);
                    existing.setDisplayName(displayName);
                    existing.setAvatarUrl(avatarUrl);
                    existing.setUpdatedAt(now);
                    return existing;
                })
                .orElseGet(() -> User.builder()
                        .githubId(githubId)
                        .githubLogin(githubLogin)
                        .email(email)
                        .displayName(displayName)
                        .avatarUrl(avatarUrl)
                        .createdAt(now)
                        .updatedAt(now)
                        .build());
        final User savedUser = userRepository.save(user);

        GitHubAccount account = gitHubAccountRepository.findByUserId(savedUser.getId())
                .orElseGet(() -> GitHubAccount.builder().user(savedUser).build());
        account.setGithubUserId(githubId);
        account.setLogin(githubLogin);
        account.setProfileUrl("https://github.com/" + githubLogin);
        account.setPublicReposCount(publicReposCount);
        account.setFollowers(followers);
        account.setConnectedAt(now);
        gitHubAccountRepository.save(account);

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

        return savedUser;
    }

    private void upsertCredential(User user, String accessToken, String scope) {
        OAuthCredential credential = oAuthCredentialRepository.findByUserId(user.getId())
                .orElseGet(() -> OAuthCredential.builder().user(user).provider("github").build());
        credential.setAccessToken(accessToken);
        credential.setScope(scope);
        oAuthCredentialRepository.save(credential);
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
