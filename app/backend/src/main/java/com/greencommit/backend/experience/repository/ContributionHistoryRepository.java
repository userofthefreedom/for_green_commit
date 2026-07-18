package com.greencommit.backend.experience.repository;

import com.greencommit.backend.experience.entity.ContributionHistory;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContributionHistoryRepository extends JpaRepository<ContributionHistory, UUID> {

    List<ContributionHistory> findByUserId(UUID userId);
}
