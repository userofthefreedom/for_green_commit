package com.greencommit.backend.profile.entity;

import com.greencommit.backend.identity.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
 * F002/BR02: GitHub 공개 활동 자동 분석 결과와 사용자 보정값을 분리 보관.
 */
@Entity
@Table(name = "skill_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    /** GitHub 공개 활동 분석으로 채워지는 언어/기술 목록(콤마 구분, BR02 — 실력 단정 아님). */
    @Column(name = "analyzed_languages")
    private String analyzedLanguages;

    /** 사용자가 자기 진단으로 보정한 기술·Framework 목록(콤마 구분). */
    @Column(name = "user_adjusted_skills")
    private String userAdjustedSkills;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level", length = 32)
    private ExperienceLevel experienceLevel;

    /** 선택 입력: Git·PR 자신감 (1~5). */
    @Column(name = "git_pr_confidence")
    private Integer gitPrConfidence;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
