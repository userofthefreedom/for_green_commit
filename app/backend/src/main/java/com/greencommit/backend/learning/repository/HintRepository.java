package com.greencommit.backend.learning.repository;

import com.greencommit.backend.learning.entity.Hint;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HintRepository extends JpaRepository<Hint, UUID> {
}
