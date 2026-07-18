package com.greencommit.backend.learning.repository;

import com.greencommit.backend.learning.entity.Answer;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answer, UUID> {
}
