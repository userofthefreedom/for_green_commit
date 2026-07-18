package com.greencommit.backend.automation.repository;

import com.greencommit.backend.automation.entity.AutomationExecution;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AutomationExecutionRepository extends JpaRepository<AutomationExecution, UUID> {
}
