package com.greencommit.backend.profile.repository;

import com.greencommit.backend.profile.entity.Preference;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PreferenceRepository extends JpaRepository<Preference, UUID> {

    Optional<Preference> findByUserId(UUID userId);
}
