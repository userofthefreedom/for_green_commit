package com.greencommit.backend.learning.repository;

import com.greencommit.backend.learning.entity.ContributionPlan;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContributionPlanRepository extends JpaRepository<ContributionPlan, UUID> {
}
