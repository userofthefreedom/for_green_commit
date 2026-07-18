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

/**
 * F011/BR08: 질문 Coach가 던지는 질문(전체 정답 코드 선노출 금지, 사용자 판단 유도).
 * Phase 1은 엔티티/Repository만 두고 실제 질문 생성 로직·API는 연결하지 않는다
 * (질문 Coach 화면은 향후 POST /ai/orchestrations 확장과 함께 연결 예정).
 */
@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private JourneySession session;

    @Column(name = "question_text", columnDefinition = "text", nullable = false)
    private String questionText;

    /** 질문 깊이(1부터 시작, 사용자 숙련도에 따라 상향). */
    @Column(name = "depth", nullable = false)
    private Integer depth;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
