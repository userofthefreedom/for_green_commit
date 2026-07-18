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

/**
 * F020(Phase 99 보류): Neo4j Knowledge Graph 추천 근거 경로. 테이블은 존재하나
 * 어떤 서비스도 이 엔티티를 조회/저장하지 않는다.
 * TODO(Phase 99, 팀 확인 후 구현): Neo4j 실제 그래프 질의로 GraphPath 채우기.
 */
@Entity
@Table(name = "graph_paths")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GraphPath {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recommendation_id")
    private Recommendation recommendation;

    @Column(name = "path_json", columnDefinition = "text")
    private String pathJson;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
