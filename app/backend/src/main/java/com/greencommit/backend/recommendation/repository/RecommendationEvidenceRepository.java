package com.greencommit.backend.recommendation.repository;

import com.greencommit.backend.recommendation.entity.RecommendationEvidence;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommendationEvidenceRepository extends JpaRepository<RecommendationEvidence, UUID> {

    List<RecommendationEvidence> findByRecommendationId(UUID recommendationId);
}
