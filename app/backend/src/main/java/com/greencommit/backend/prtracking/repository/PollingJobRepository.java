package com.greencommit.backend.prtracking.repository;

import com.greencommit.backend.prtracking.entity.PollingJob;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/** F017(Phase 99 보류) — 어떤 서비스도 아직 이 Repository를 주입받지 않는다. */
public interface PollingJobRepository extends JpaRepository<PollingJob, UUID> {
}
