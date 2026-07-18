package com.greencommit.backend.catalog.repository;

import com.greencommit.backend.catalog.entity.RepositorySnapshot;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RepositorySnapshotRepository extends JpaRepository<RepositorySnapshot, UUID> {
}
