package com.greencommit.backend.prtracking.repository;

import com.greencommit.backend.prtracking.entity.PullRequestLink;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PullRequestLinkRepository extends JpaRepository<PullRequestLink, UUID> {

    List<PullRequestLink> findByUserId(UUID userId);
}
