package com.greencommit.backend.journey.repository;

import com.greencommit.backend.journey.entity.StepPreference;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StepPreferenceRepository extends JpaRepository<StepPreference, UUID> {

    List<StepPreference> findByUserId(UUID userId);
}
