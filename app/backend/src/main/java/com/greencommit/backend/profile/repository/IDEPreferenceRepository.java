package com.greencommit.backend.profile.repository;

import com.greencommit.backend.profile.entity.IDEPreference;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IDEPreferenceRepository extends JpaRepository<IDEPreference, UUID> {

    Optional<IDEPreference> findByUserId(UUID userId);
}
