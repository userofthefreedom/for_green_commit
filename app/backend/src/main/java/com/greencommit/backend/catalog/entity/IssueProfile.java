package com.greencommit.backend.catalog.entity;

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

/** 표16 Issue 카드 상세: 현재 문제·기대 결과·완료 기준(Repo·Issue Brief 화면에서 사용). */
@Entity
@Table(name = "issue_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false, unique = true)
    private Issue issue;

    /** 현재 문제. */
    @Column(name = "current_problem", columnDefinition = "text")
    private String currentProblem;

    /** 기대 결과. */
    @Column(name = "expected_outcome", columnDefinition = "text")
    private String expectedOutcome;

    /** 완료 기준. */
    @Column(name = "completion_criteria", columnDefinition = "text")
    private String completionCriteria;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
