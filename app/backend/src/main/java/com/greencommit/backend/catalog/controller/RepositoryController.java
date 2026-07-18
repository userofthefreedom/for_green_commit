package com.greencommit.backend.catalog.controller;

import com.greencommit.backend.catalog.dto.IssueCardResponse;
import com.greencommit.backend.catalog.service.CatalogService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/** F007/BR04: 표37 API — GET /repositories/{id}/issues. */
@RestController
@RequiredArgsConstructor
public class RepositoryController {

    private final CatalogService catalogService;

    @GetMapping("/repositories/{id}/issues")
    public ResponseEntity<List<IssueCardResponse>> getIssues(@PathVariable("id") UUID repositoryId) {
        return ResponseEntity.ok(catalogService.getIssuesForRepository(repositoryId));
    }
}
