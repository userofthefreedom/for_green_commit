package com.greencommit.backend.experience.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * F018(Phase 99 보류): 표37 API — GET /notifications.
 * TODO(Phase 99, 팀 확인 후 구현): 실제 알림 생성·조회 로직 연결. 지금은 항상 빈 목록.
 */
@RestController
public class NotificationController {

    @GetMapping("/notifications")
    public ResponseEntity<List<Object>> getNotifications() {
        return ResponseEntity.ok(List.of());
    }
}
