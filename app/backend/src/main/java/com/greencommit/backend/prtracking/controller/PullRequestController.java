package com.greencommit.backend.prtracking.controller;

import com.greencommit.backend.prtracking.dto.PullRequestLinkRequest;
import com.greencommit.backend.prtracking.dto.PullRequestLinkResponse;
import com.greencommit.backend.prtracking.dto.PullRequestStatusResponse;
import com.greencommit.backend.prtracking.service.PullRequestService;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/** F016/F017 MVP 슬라이스: 표37 API — POST /pull-requests, GET /pull-requests/{id}/status. */
@RestController
@RequiredArgsConstructor
public class PullRequestController {

    private final PullRequestService pullRequestService;

    @PostMapping("/pull-requests")
    public ResponseEntity<PullRequestLinkResponse> createLink(@Valid @RequestBody PullRequestLinkRequest request) {
        return ResponseEntity.ok(pullRequestService.createLink(request));
    }

    @GetMapping("/pull-requests/{id}/status")
    public ResponseEntity<PullRequestStatusResponse> getStatus(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(pullRequestService.getStatus(id));
    }
}
