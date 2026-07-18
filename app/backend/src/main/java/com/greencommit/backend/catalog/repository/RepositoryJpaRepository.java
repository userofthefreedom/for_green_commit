package com.greencommit.backend.catalog.repository;

import com.greencommit.backend.catalog.entity.Repository;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 이름이 {@code Repository}(엔티티)와 겹치므로 Spring Data JPA 인터페이스는
 * {@code RepositoryJpaRepository}로 명명한다.
 */
public interface RepositoryJpaRepository extends JpaRepository<Repository, UUID> {
}
