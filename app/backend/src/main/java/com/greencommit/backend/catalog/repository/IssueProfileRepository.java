package com.greencommit.backend.catalog.repository;

import com.greencommit.backend.catalog.entity.IssueProfile;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueProfileRepository extends JpaRepository<IssueProfile, UUID> {

    Optional<IssueProfile> findByIssueId(UUID issueId);
}
