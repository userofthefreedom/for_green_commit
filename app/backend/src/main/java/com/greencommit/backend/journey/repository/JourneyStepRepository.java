package com.greencommit.backend.journey.repository;

import com.greencommit.backend.journey.entity.JourneyStep;
import com.greencommit.backend.journey.entity.JourneyStepType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JourneyStepRepository extends JpaRepository<JourneyStep, UUID> {

    List<JourneyStep> findBySessionIdOrderBySequenceAsc(UUID sessionId);

    Optional<JourneyStep> findBySessionIdAndStepType(UUID sessionId, JourneyStepType stepType);
}
