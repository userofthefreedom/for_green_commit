package com.greencommit.backend.recommendation.entity;

import com.greencommit.backend.catalog.entity.Repository;
import com.greencommit.backend.identity.entity.User;
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

/** F006: 개인화 Repository 추천(단순 규칙 기반 스코어링, Knowledge Graph는 F020 Phase 99). */
@Entity
@Table(name = "recommendations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    /** 익명/미가입 조회는 null 허용 — 그런 경우 일반 랭킹만 노출한다. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id", nullable = false)
    private Repository repository;

    @Column(name = "score", nullable = false)
    private Double score;

    @Column(name = "rank", nullable = false)
    private Integer rank;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
