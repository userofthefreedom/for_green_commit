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
 * F021(Phase 99 보류): 모델/Prompt/Embedding/Graph Schema/Repository Snapshot 버전 실행 로그.
 * 테이블만 존재, 로직 없음.
 */
@Entity
@Table(name = "ai_execution_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIExecutionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orchestration_run_id")
    private OrchestrationRun orchestrationRun;

    @Column(name = "model_name")
    private String modelName;

    @Column(name = "prompt_summary", columnDefinition = "text")
    private String promptSummary;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
