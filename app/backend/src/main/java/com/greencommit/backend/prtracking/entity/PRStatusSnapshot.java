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
 * F017(Phase 99 보류): 주기적 PR 상태 Snapshot. 테이블만 존재하고 어떤 서비스도 아직 채우지 않는다
 * (GET /pull-requests/{id}/status의 1회 조회는 이 테이블에 쓰지 않고 즉시 조회 결과만 반환한다).
 * TODO(Phase 99, 팀 확인 후 구현): PollingJob과 함께 주기적 상태 추적 도입.
 */
@Entity
@Table(name = "pr_status_snapshots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PRStatusSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pr_link_id", nullable = false)
    private PullRequestLink prLink;

    /** OPEN / MERGED / CLOSED_UNMERGED / UNKNOWN (BR11). */
    @Column(name = "state", nullable = false)
    private String state;

    @Column(name = "merged")
    private Boolean merged;

    @Column(name = "checked_at", nullable = false)
    private Instant checkedAt;
}
