package com.greencommit.backend.automation.repository;

import com.greencommit.backend.automation.entity.GitOperationCheckpoint;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GitOperationCheckpointRepository extends JpaRepository<GitOperationCheckpoint, UUID> {
}
