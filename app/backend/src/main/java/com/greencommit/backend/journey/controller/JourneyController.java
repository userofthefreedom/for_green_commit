package com.greencommit.backend.journey.controller;

import com.greencommit.backend.journey.dto.JourneyCreateRequest;
import com.greencommit.backend.journey.dto.JourneySessionResponse;
import com.greencommit.backend.journey.dto.JourneyStepUpdateRequest;
import com.greencommit.backend.journey.service.JourneyService;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/** F008: 표37 API — POST /journeys, PATCH /journeys/{id}/steps/{step}. */
@RestController
@RequiredArgsConstructor
public class JourneyController {

    private final JourneyService journeyService;

    @PostMapping("/journeys")
    public ResponseEntity<JourneySessionResponse> createJourney(@Valid @RequestBody JourneyCreateRequest request) {
        return ResponseEntity.ok(journeyService.createJourney(request));
    }

    @PatchMapping("/journeys/{id}/steps/{step}")
    public ResponseEntity<JourneySessionResponse> updateStep(
            @PathVariable("id") UUID sessionId,
            @PathVariable("step") String step,
            @Valid @RequestBody JourneyStepUpdateRequest request) {
        return ResponseEntity.ok(journeyService.updateStep(sessionId, step, request));
    }
}
