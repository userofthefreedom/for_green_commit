package com.greencommit.backend.recommendation.repository;

import com.greencommit.backend.recommendation.entity.Recommendation;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommendationRepository extends JpaRepository<Recommendation, UUID> {
}
