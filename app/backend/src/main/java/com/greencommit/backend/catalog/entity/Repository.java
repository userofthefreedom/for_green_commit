package com.greencommit.backend.catalog.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * F005/F006, 표16 Repository 카드: 공익 목적·쉬운 설명·주요 기술·최근 활동·기여 문서·외부 PR
 * 응답성·사용자 적합도·주의점. Phase 1은 F005의 Batch 확장 없이 V11 seed 데이터(5~10개)만 사용한다.
 */
@Entity
@Table(name = "repositories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Repository {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "owner_login", nullable = false)
    private String ownerLogin;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "full_name", nullable = false, unique = true)
    private String fullName;

    @Column(name = "description")
    private String description;

    @Column(name = "primary_language")
    private String primaryLanguage;

    /** 콤마 구분 topic/기술 스택. */
    @Column(name = "topics")
    private String topics;

    @Column(name = "repo_url", nullable = false)
    private String repoUrl;

    /** 공익 목적. */
    @Column(name = "public_benefit_summary")
    private String publicBenefitSummary;

    /** 최근 활동. */
    @Column(name = "recent_activity_summary")
    private String recentActivitySummary;

    /** 기여 문서 품질. */
    @Column(name = "contribution_docs_quality")
    private String contributionDocsQuality;

    /** 외부 PR 응답성. */
    @Column(name = "external_pr_responsiveness")
    private String externalPrResponsiveness;

    /** 사용자 적합도 점수(0~100). 추천 랭킹(F006)에 사용. */
    @Column(name = "fit_score")
    private Double fitScore;

    /** 주의점. */
    @Column(name = "caution_note")
    private String cautionNote;

    @Column(name = "stars")
    private Integer stars;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
