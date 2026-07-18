package com.greencommit.backend.profile.entity;

import com.greencommit.backend.identity.entity.User;
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
 * 표13/BR03: "오픈소스가 처음이에요" 여부 + 관심 분야·투자 시간 등 추가 프로필 입력(F003).
 */
@Entity
@Table(name = "preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Preference {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    /** BR03: "오픈소스가 처음이에요" — 튜토리얼 기본 노출·Journey 기본값 결정. */
    @Column(name = "first_time_contributor", nullable = false)
    private boolean firstTimeContributor;

    /** 기여 관심 분야(공익 분야, 문서, 테스트, 버그, 기능 등), 콤마 구분. */
    @Column(name = "interest_areas")
    private String interestAreas;

    /** 기여 관심 유형, 콤마 구분. */
    @Column(name = "contribution_types")
    private String contributionTypes;

    @Column(name = "weekly_hours")
    private Integer weeklyHours;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
