package com.greencommit.backend.identity.repository;

import com.greencommit.backend.identity.entity.GitHubAccount;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GitHubAccountRepository extends JpaRepository<GitHubAccount, UUID> {

    Optional<GitHubAccount> findByUserId(UUID userId);
}
