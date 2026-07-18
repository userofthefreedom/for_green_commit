package com.greencommit.backend.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * BR01: GitHub 계정 필수 회원가입 게이트가 최종 목표지만, 실제 GitHub OAuth2 Client 등록은
 * Phase 2에서 진행한다. Phase 1은 spring-boot-starter-security가 classpath에 있어 기본
 * 자동 설정(모든 요청 로그인 필요)이 걸리는 것을 막기 위해 전체 permitAll 체인만 둔다.
 * TODO(Phase 2, 팀 확인 후 구현): OAuth2 Login으로 교체하고 인증되지 않은 요청은 Landing으로 리다이렉트.
 */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        return http.build();
    }
}
