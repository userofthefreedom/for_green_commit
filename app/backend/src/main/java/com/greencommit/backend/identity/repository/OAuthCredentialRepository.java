package com.greencommit.backend.identity.repository;

import com.greencommit.backend.identity.entity.OAuthCredential;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OAuthCredentialRepository extends JpaRepository<OAuthCredential, UUID> {

    Optional<OAuthCredential> findByUserId(UUID userId);
}
