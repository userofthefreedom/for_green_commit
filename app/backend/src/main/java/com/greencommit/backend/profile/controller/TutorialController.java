package com.greencommit.backend.profile.controller;

import com.greencommit.backend.profile.dto.TutorialProgressRequest;
import com.greencommit.backend.profile.dto.TutorialProgressResponse;
import com.greencommit.backend.profile.service.TutorialService;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** F003: 표37 API — GET+POST /tutorial/progress. */
@RestController
@RequiredArgsConstructor
public class TutorialController {

    private final TutorialService tutorialService;

    @GetMapping("/tutorial/progress")
    public ResponseEntity<TutorialProgressResponse> getProgress(@RequestParam UUID userId) {
        return ResponseEntity.ok(tutorialService.getProgress(userId));
    }

    @PostMapping("/tutorial/progress")
    public ResponseEntity<TutorialProgressResponse> saveProgress(@Valid @RequestBody TutorialProgressRequest request) {
        return ResponseEntity.ok(tutorialService.saveProgress(request));
    }
}
