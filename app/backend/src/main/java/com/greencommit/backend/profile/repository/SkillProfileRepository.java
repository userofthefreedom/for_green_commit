package com.greencommit.backend.profile.repository;

import com.greencommit.backend.profile.entity.SkillProfile;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SkillProfileRepository extends JpaRepository<SkillProfile, UUID> {

    Optional<SkillProfile> findByUserId(UUID userId);
}
