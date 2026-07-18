package com.greencommit.backend.experience.repository;

import com.greencommit.backend.experience.entity.NextMissionRecommendation;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/** F019 확장(Phase 99 보류) — 어떤 서비스도 아직 이 Repository를 주입받지 않는다. */
public interface NextMissionRecommendationRepository extends JpaRepository<NextMissionRecommendation, UUID> {
}
