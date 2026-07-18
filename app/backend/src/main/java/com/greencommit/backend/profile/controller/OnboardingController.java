package com.greencommit.backend.profile.controller;

import com.greencommit.backend.profile.dto.OnboardingRequest;
import com.greencommit.backend.profile.dto.OnboardingResponse;
import com.greencommit.backend.profile.service.OnboardingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/** F003/F004: 표37 API — PUT /users/me/onboarding. */
@RestController
@RequiredArgsConstructor
public class OnboardingController {

    private final OnboardingService onboardingService;

    @PutMapping("/users/me/onboarding")
    public ResponseEntity<OnboardingResponse> updateOnboarding(@Valid @RequestBody OnboardingRequest request) {
        return ResponseEntity.ok(onboardingService.saveOnboarding(request));
    }
}
