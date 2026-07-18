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
 * F017(Phase 99 보류): Review 이벤트(승인/변경요청/코멘트). 테이블만 존재, 로직 없음.
 * TODO(Phase 99, 팀 확인 후 구현): PR Poller가 GitHub Review API 결과를 이 테이블에 적재.
 */
@Entity
@Table(name = "review_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pr_link_id", nullable = false)
    private PullRequestLink prLink;

    @Column(name = "reviewer")
    private String reviewer;

    @Column(name = "event_type")
    private String eventType;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
