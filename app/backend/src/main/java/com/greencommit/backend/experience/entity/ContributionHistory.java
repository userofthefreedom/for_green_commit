package com.greencommit.backend.experience.entity;

import com.greencommit.backend.identity.entity.User;
import com.greencommit.backend.prtracking.entity.PullRequestLink;
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
 * F019 초안: PR 연결 + Journey 요약 문자열만 저장하는 최소 History. Review·Merge 이력 보강은
 * 이번 라운드 범위 밖(팀 확인 후 Phase 99).
 */
@Entity
@Table(name = "contribution_histories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContributionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pr_link_id")
    private PullRequestLink prLink;

    @Column(name = "journey_summary", columnDefinition = "text")
    private String journeySummary;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
