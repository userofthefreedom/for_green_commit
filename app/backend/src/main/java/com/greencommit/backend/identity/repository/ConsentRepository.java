package com.greencommit.backend.identity.repository;

import com.greencommit.backend.identity.entity.Consent;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsentRepository extends JpaRepository<Consent, UUID> {

    List<Consent> findByUserId(UUID userId);
}
