package com.greencommit.backend.experience.entity;

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
 * F019 확장(Phase 99 보류): 다음 학습 미션 추천. 테이블만 존재, 어떤 서비스도 생성 로직을 갖지 않는다.
 * TODO(Phase 99, 팀 확인 후 구현): History/성장 흔적을 근거로 다음 Mission 추천.
 */
@Entity
@Table(name = "next_mission_recommendations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NextMissionRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "suggestion_text", columnDefinition = "text")
    private String suggestionText;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
