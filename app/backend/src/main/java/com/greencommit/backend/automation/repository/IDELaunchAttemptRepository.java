package com.greencommit.backend.automation.repository;

import com.greencommit.backend.automation.entity.IDELaunchAttempt;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IDELaunchAttemptRepository extends JpaRepository<IDELaunchAttempt, UUID> {
}
