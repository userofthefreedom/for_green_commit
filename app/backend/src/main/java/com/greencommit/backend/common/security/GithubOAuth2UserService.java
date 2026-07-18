package com.greencommit.backend.common.security;

import com.greencommit.backend.identity.service.AuthService;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

/**
 * BR01: 실제 GitHub OAuth2 로그인 성공 시 GitHub의 /user 응답을 받아 identity 도메인에 upsert한다.
 * `SecurityConfig`의 `oauth2Login().userInfoEndpoint().userService(...)`에서 사용된다.
 */
@Service
@RequiredArgsConstructor
public class GithubOAuth2UserService extends DefaultOAuth2UserService {

    private final AuthService authService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        Long githubId = ((Number) attributes.get("id")).longValue();
        String login = (String) attributes.get("login");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String avatarUrl = (String) attributes.get("avatar_url");
        Integer publicRepos = attributes.get("public_repos") == null
                ? null : ((Number) attributes.get("public_repos")).intValue();
        Integer followers = attributes.get("followers") == null
                ? null : ((Number) attributes.get("followers")).intValue();

        String accessToken = userRequest.getAccessToken().getTokenValue();
        String scope = String.join(",", userRequest.getAccessToken().getScopes());

        authService.handleGithubLogin(githubId, login, email, name, avatarUrl, publicRepos, followers,
                accessToken, scope);

        return oAuth2User;
    }
}
