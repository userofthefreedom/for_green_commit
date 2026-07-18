package com.greencommit.backend.journey.repository;

import com.greencommit.backend.journey.entity.ContributionMission;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContributionMissionRepository extends JpaRepository<ContributionMission, UUID> {
}
