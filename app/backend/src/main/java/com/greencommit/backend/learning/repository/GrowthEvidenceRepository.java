package com.greencommit.backend.learning.repository;

import com.greencommit.backend.learning.entity.GrowthEvidence;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrowthEvidenceRepository extends JpaRepository<GrowthEvidence, UUID> {
}
