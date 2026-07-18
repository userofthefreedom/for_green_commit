package com.greencommit.backend.ai.repository;

import com.greencommit.backend.ai.entity.RetrievalEvidence;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/** F021(Phase 99 보류) — 어떤 서비스도 아직 이 Repository를 주입받지 않는다. */
public interface RetrievalEvidenceRepository extends JpaRepository<RetrievalEvidence, UUID> {
}
