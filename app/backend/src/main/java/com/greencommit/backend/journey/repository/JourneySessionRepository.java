package com.greencommit.backend.journey.repository;

import com.greencommit.backend.journey.entity.JourneySession;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JourneySessionRepository extends JpaRepository<JourneySession, UUID> {
}
