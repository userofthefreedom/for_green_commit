package com.greencommit.backend.catalog.repository;

import com.greencommit.backend.catalog.entity.ContributionRule;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContributionRuleRepository extends JpaRepository<ContributionRule, UUID> {
}
