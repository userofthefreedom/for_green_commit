package com.greencommit.backend.recommendation.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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

/** F006/BR09: 추천 이유 — GitHub 원문·기준 시각·규칙 이름. Graph 경로는 GraphPath(F020, 미사용). */
@Entity
@Table(name = "recommendation_evidences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecommendationEvidence {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recommendation_id", nullable = false)
    private Recommendation recommendation;

    /** GITHUB_SOURCE / RULE / GRAPH. */
    @Column(name = "evidence_type", nullable = false)
    private String evidenceType;

    @Column(name = "source_url")
    private String sourceUrl;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "rule_name")
    private String ruleName;

    @Column(name = "captured_at", nullable = false)
    private Instant capturedAt;
}
