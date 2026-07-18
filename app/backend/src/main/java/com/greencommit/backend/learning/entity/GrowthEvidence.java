package com.greencommit.backend.learning.entity;

import com.greencommit.backend.identity.entity.User;
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

/** F012: 학습 성장 흔적(사고 역량 지도의 원천 데이터, F023 실데이터 연동은 보류). */
@Entity
@Table(name = "growth_evidences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrowthEvidence {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private JourneySession session;

    @Column(name = "evidence_text", columnDefinition = "text", nullable = false)
    private String evidenceText;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
