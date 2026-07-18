package com.greencommit.backend.experience.repository;

import com.greencommit.backend.experience.entity.Notification;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

/** F018(Phase 99 보류) — 컨트롤러는 이 Repository를 조회하지 않고 항상 빈 목록을 반환한다. */
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
}
