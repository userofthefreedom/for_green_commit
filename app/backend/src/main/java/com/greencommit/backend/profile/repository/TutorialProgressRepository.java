package com.greencommit.backend.profile.repository;

import com.greencommit.backend.profile.entity.TutorialProgress;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TutorialProgressRepository extends JpaRepository<TutorialProgress, UUID> {

    Optional<TutorialProgress> findByUserId(UUID userId);
}
