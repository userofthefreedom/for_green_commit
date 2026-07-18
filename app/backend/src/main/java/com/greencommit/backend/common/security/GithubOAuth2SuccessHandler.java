package com.greencommit.backend.common.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

/**
 * BR01: 로그인 성공 후 프론트엔드의 SCR002(/auth/callback)로 돌려보낸다. 세션 쿠키는 이미
 * 응답에 실려 있으므로, 프론트는 이 경로에서 GET /auth/session을 호출해 로그인 상태를 확인한다.
 */
@Component
public class GithubOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {
        response.sendRedirect(frontendUrl + "/auth/callback");
    }
}
