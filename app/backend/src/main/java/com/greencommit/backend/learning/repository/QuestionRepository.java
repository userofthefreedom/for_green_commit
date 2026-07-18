package com.greencommit.backend.learning.repository;

import com.greencommit.backend.learning.entity.Question;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, UUID> {
}
