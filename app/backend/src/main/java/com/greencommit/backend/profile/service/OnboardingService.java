package com.greencommit.backend.profile.service;

import com.greencommit.backend.common.exception.NotFoundException;
import com.greencommit.backend.identity.entity.User;
import com.greencommit.backend.identity.repository.UserRepository;
import com.greencommit.backend.profile.dto.OnboardingRequest;
import com.greencommit.backend.profile.dto.OnboardingResponse;
import com.greencommit.backend.profile.entity.IDEPreference;
import com.greencommit.backend.profile.entity.Preference;
import com.greencommit.backend.profile.entity.SkillProfile;
import com.greencommit.backend.profile.repository.IDEPreferenceRepository;
import com.greencommit.backend.profile.repository.PreferenceRepository;
import com.greencommit.backend.profile.repository.SkillProfileRepository;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** F003/F004/BR03: 추가 프로필·IDE 선택 저장(표13). */
@Service
@RequiredArgsConstructor
public class OnboardingService {

    private final UserRepository userRepository;
    private final SkillProfileRepository skillProfileRepository;
    private final PreferenceRepository preferenceRepository;
    private final IDEPreferenceRepository idePreferenceRepository;

    @Transactional
    public OnboardingResponse saveOnboarding(OnboardingRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new NotFoundException("User not found: " + request.userId()));
        Instant now = Instant.now();

        Preference preference = preferenceRepository.findByUserId(user.getId())
                .orElseGet(() -> Preference.builder().user(user).build());
        preference.setFirstTimeContributor(request.firstTimeContributor());
        preference.setInterestAreas(request.interestAreas());
        preference.setContributionTypes(request.contributionTypes());
        preference.setWeeklyHours(request.weeklyHours());
        preference.setUpdatedAt(now);
        preferenceRepository.save(preference);

        IDEPreference idePreference = idePreferenceRepository.findByUserId(user.getId())
                .orElseGet(() -> IDEPreference.builder().user(user).build());
        idePreference.setPrimaryIde(request.primaryIde());
        idePreferenceRepository.save(idePreference);

        SkillProfile skillProfile = skillProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> SkillProfile.builder().user(user).build());
        skillProfile.setExperienceLevel(request.experienceLevel());
        skillProfile.setGitPrConfidence(request.gitPrConfidence());
        if (request.userAdjustedSkills() != null) {
            skillProfile.setUserAdjustedSkills(request.userAdjustedSkills());
        }
        skillProfile.setUpdatedAt(now);
        skillProfileRepository.save(skillProfile);

        return new OnboardingResponse(
                user.getId(),
                idePreference.getPrimaryIde(),
                skillProfile.getExperienceLevel(),
                preference.isFirstTimeContributor(),
                preference.getInterestAreas(),
                preference.getContributionTypes(),
                preference.getWeeklyHours());
    }
}
