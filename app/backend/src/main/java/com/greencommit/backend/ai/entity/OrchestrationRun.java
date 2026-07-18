package com.greencommit.backend.ai.entity;

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

/**
 * F021(Phase 99 보류): Orchestrator LLM의 Tool/Model Routing 실행 기록. 테이블만 존재하며
 * POST /ai/orchestrations 컨트롤러는 이 엔티티를 저장하지 않고 고정 placeholder만 반환한다.
 * TODO(Phase 99, 팀 확인 후 구현): app/ai FastAPI Orchestrator 실제 호출 및 실행 로그 적재.
 */
@Entity
@Table(name = "orchestration_runs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrchestrationRun {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "input_summary", columnDefinition = "text")
    private String inputSummary;

    @Column(name = "output_summary", columnDefinition = "text")
    private String outputSummary;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
