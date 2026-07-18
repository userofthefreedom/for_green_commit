package com.greencommit.backend.catalog.controller;

import com.greencommit.backend.recommendation.dto.RepositoryRecommendationResponse;
import com.greencommit.backend.recommendation.service.RecommendationService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * F006: 표37 API — GET /recommendations/repositories. recommendation 패키지는 controller
 * 하위 패키지가 없으므로(Phase 0 스캐폴드 기준) catalog 쪽 controller가 recommendation 서비스를 호출한다.
 */
@RestController
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/recommendations/repositories")
    public ResponseEntity<List<RepositoryRecommendationResponse>> getRecommendations(
            @RequestParam(required = false) UUID userId) {
        return ResponseEntity.ok(recommendationService.recommendRepositories(userId));
    }
}
