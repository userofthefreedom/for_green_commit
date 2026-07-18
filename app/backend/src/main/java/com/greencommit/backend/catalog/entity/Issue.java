package com.greencommit.backend.catalog.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * F006/F007, 표16 Issue 카드: 요약·기여 유형·예상 범위·난이도·담당자/연결 PR·최신성.
 * 문제/기대 결과/완료 기준은 {@link IssueProfile}에 별도 저장한다.
 */
@Entity
@Table(name = "issues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id", nullable = false)
    private Repository repository;

    @Column(name = "number", nullable = false)
    private Integer number;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "url", nullable = false)
    private String url;

    /** Issue 요약. */
    @Column(name = "summary", columnDefinition = "text")
    private String summary;

    /** 기여 유형(문서/버그/테스트/기능 등). */
    @Column(name = "contribution_type")
    private String contributionType;

    /** 예상 범위. */
    @Column(name = "estimated_scope")
    private String estimatedScope;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", length = 16)
    private IssueDifficulty difficulty;

    /** 담당자(있으면). */
    @Column(name = "assignee")
    private String assignee;

    /** 연결된 PR URL(있으면). */
    @Column(name = "linked_pr_url")
    private String linkedPrUrl;

    /** 최신성 — GitHub 원문 기준 마지막 갱신 시각. */
    @Column(name = "last_updated_at")
    private Instant lastUpdatedAt;

    /** OPEN / CLOSED. */
    @Column(name = "state", nullable = false)
    private String state;
}
