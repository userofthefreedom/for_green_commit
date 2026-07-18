package com.greencommit.backend.experience.controller;

import com.greencommit.backend.experience.dto.ContributionHistoryResponse;
import com.greencommit.backend.experience.service.HistoryService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** F019 초안: 표37 API — GET /history. */
@RestController
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    @GetMapping("/history")
    public ResponseEntity<List<ContributionHistoryResponse>> getHistory(@RequestParam(required = false) UUID userId) {
        return ResponseEntity.ok(historyService.getHistory(userId));
    }
}
