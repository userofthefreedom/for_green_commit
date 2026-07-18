package com.greencommit.backend.ai.entity;

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
 * F021(Phase 99 보류): RAG 검색 근거. 테이블만 존재, 어떤 서비스도 채우지 않는다.
 * TODO(Phase 99, 팀 확인 후 구현): app/ai retrieval 라우터 결과를 이 테이블에 적재.
 */
@Entity
@Table(name = "retrieval_evidences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RetrievalEvidence {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orchestration_run_id")
    private OrchestrationRun orchestrationRun;

    @Column(name = "source_url")
    private String sourceUrl;

    @Column(name = "snippet", columnDefinition = "text")
    private String snippet;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
