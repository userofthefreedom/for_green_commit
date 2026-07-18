package com.greencommit.backend.identity.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * F001: OAuth2 Access/Refresh Token 보관 자리(BR01 Secret 원칙). 실제 GitHub OAuth2 핸드셰이크는
 * Phase 2에서 Spring Security OAuth2 Client로 채워지며, Phase 1에서는 콜백 스텁이 placeholder 값을 넣는다.
 */
@Entity
@Table(name = "oauth_credentials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OAuthCredential {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "provider", nullable = false)
    @Builder.Default
    private String provider = "github";

    @Column(name = "access_token")
    private String accessToken;

    @Column(name = "refresh_token")
    private String refreshToken;

    @Column(name = "scope")
    private String scope;

    @Column(name = "expires_at")
    private Instant expiresAt;
}
