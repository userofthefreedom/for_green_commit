package com.greencommit.backend.journey.repository;

import com.greencommit.backend.journey.entity.JourneyCheckpoint;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JourneyCheckpointRepository extends JpaRepository<JourneyCheckpoint, UUID> {
}
