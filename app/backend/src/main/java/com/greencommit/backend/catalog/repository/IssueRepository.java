package com.greencommit.backend.catalog.repository;

import com.greencommit.backend.catalog.entity.Issue;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IssueRepository extends JpaRepository<Issue, UUID> {

    /** BR04: Repository 선택 후에만 그 Repository의 Issue 후보를 노출한다. */
    List<Issue> findByRepositoryId(UUID repositoryId);
}
