package com.greencommit.backend.common.config;

import com.greencommit.backend.common.security.GithubOAuth2SuccessHandler;
import com.greencommit.backend.common.security.GithubOAuth2UserService;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * BR01: GitHub 계정 필수 회원가입 게이트. Phase 2에서 Spring Security OAuth2 Login(GitHub)으로
 * 실제 로그인을 연결했다 — `/`, `/oauth2/**`, `/login/**`, `/auth/session`(비로그인 상태 확인용)을
 * 제외한 모든 요청은 인증이 필요하고, 비로그인 상태에서 보호된 API를 호출하면 로그인 페이지로
 * 리다이렉트하지 않고 401을 반환한다(프론트가 fetch로 호출하는 JSON API이기 때문).
 */
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final GithubOAuth2UserService githubOAuth2UserService;
    private final GithubOAuth2SuccessHandler githubOAuth2SuccessHandler;

    private static final String FRONTEND_ORIGIN = "http://localhost:5173";

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 세션 쿠키 + 로컬 개발(동일 사이트: localhost) 전제의 프로토타입 범위 결정.
                // 운영 배포 전환 시 CSRF 보호를 다시 켜는 것을 검토해야 한다.
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/actuator/**", "/oauth2/**", "/login/**", "/auth/session")
                        .permitAll()
                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo.userService(githubOAuth2UserService))
                        .successHandler(githubOAuth2SuccessHandler)
                        .failureHandler((request, response, exception) ->
                                response.sendRedirect(FRONTEND_ORIGIN + "/?login_error=1")))
                .logout(logout -> logout
                        .logoutUrl("/auth/logout")
                        .logoutSuccessHandler((request, response, authentication) ->
                                response.setStatus(HttpServletResponse.SC_NO_CONTENT))
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID"))
                .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) ->
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED)));
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(FRONTEND_ORIGIN));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
