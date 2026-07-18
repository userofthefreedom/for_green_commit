package com.greencommit.backend.learning.entity;

import com.greencommit.backend.journey.entity.JourneySession;
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

/** F012: 질문 Coach 세션에서 누적된 기여 계획(사용자가 스스로 정리한 접근 방식). */
@Entity
@Table(name = "contribution_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContributionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private JourneySession session;

    @Column(name = "plan_text", columnDefinition = "text", nullable = false)
    private String planText;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
