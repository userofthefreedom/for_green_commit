package com.greencommit.backend.prtracking.entity;

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
 * F017(Phase 99 보류): 주기적 Polling 설정. 테이블만 존재하며 prtracking/scheduler 패키지는
 * Phase 0 스캐폴드 그대로 비워둔다.
 * TODO(Phase 99, 팀 확인 후 구현): PR Poller 스케줄러가 이 엔티티를 읽어 주기 실행.
 */
@Entity
@Table(name = "polling_jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PollingJob {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pr_link_id", nullable = false)
    private PullRequestLink prLink;

    @Column(name = "cron_expression")
    private String cronExpression;

    @Column(name = "last_run_at")
    private Instant lastRunAt;

    @Column(name = "active", nullable = false)
    private boolean active;
}
