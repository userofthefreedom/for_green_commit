package com.greencommit.backend.profile.dto;

import com.greencommit.backend.profile.entity.ExperienceLevel;
import com.greencommit.backend.profile.entity.PrimaryIde;
import java.util.UUID;

public record OnboardingResponse(
        UUID userId,
        PrimaryIde primaryIde,
        ExperienceLevel experienceLevel,
        boolean firstTimeContributor,
        String interestAreas,
        String contributionTypes,
        Integer weeklyHours) {
}
