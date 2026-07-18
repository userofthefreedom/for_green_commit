package com.greencommit.backend.profile.service;

import com.greencommit.backend.common.exception.NotFoundException;
import com.greencommit.backend.identity.entity.User;
import com.greencommit.backend.identity.repository.UserRepository;
import com.greencommit.backend.profile.dto.TutorialProgressRequest;
import com.greencommit.backend.profile.dto.TutorialProgressResponse;
import com.greencommit.backend.profile.entity.TutorialProgress;
import com.greencommit.backend.profile.repository.TutorialProgressRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** F003/BR03: 초보자 튜토리얼 조회·완료·스킵. */
@Service
@RequiredArgsConstructor
public class TutorialService {

    private final UserRepository userRepository;
    private final TutorialProgressRepository tutorialProgressRepository;

    @Transactional(readOnly = true)
    public TutorialProgressResponse getProgress(UUID userId) {
        return tutorialProgressRepository.findByUserId(userId)
                .map(this::toResponse)
                .orElseGet(() -> new TutorialProgressResponse(userId, false, false, "WHAT", null));
    }

    @Transactional
    public TutorialProgressResponse saveProgress(TutorialProgressRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new NotFoundException("User not found: " + request.userId()));
        TutorialProgress progress = tutorialProgressRepository.findByUserId(user.getId())
                .orElseGet(() -> TutorialProgress.builder().user(user).build());
        progress.setCompleted(request.completed());
        progress.setSkipped(request.skipped());
        progress.setCurrentStep(request.currentStep());
        Instant now = Instant.now();
        if (request.completed() && progress.getCompletedAt() == null) {
            progress.setCompletedAt(now);
        }
        progress.setUpdatedAt(now);
        tutorialProgressRepository.save(progress);
        return toResponse(progress);
    }

    private TutorialProgressResponse toResponse(TutorialProgress progress) {
        return new TutorialProgressResponse(
                progress.getUser().getId(),
                progress.isCompleted(),
                progress.isSkipped(),
                progress.getCurrentStep(),
                progress.getCompletedAt());
    }
}
