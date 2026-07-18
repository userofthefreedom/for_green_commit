package com.greencommit.backend.journey.service;

import com.greencommit.backend.catalog.entity.Issue;
import com.greencommit.backend.catalog.entity.Repository;
import com.greencommit.backend.catalog.repository.IssueRepository;
import com.greencommit.backend.catalog.repository.RepositoryJpaRepository;
import com.greencommit.backend.common.exception.NotFoundException;
import com.greencommit.backend.identity.entity.User;
import com.greencommit.backend.identity.repository.UserRepository;
import com.greencommit.backend.journey.dto.JourneyCreateRequest;
import com.greencommit.backend.journey.dto.JourneySessionResponse;
import com.greencommit.backend.journey.dto.JourneyStepResponse;
import com.greencommit.backend.journey.dto.JourneyStepUpdateRequest;
import com.greencommit.backend.journey.entity.ContributionMission;
import com.greencommit.backend.journey.entity.JourneyCheckpoint;
import com.greencommit.backend.journey.entity.JourneySession;
import com.greencommit.backend.journey.entity.JourneySessionStatus;
import com.greencommit.backend.journey.entity.JourneyStep;
import com.greencommit.backend.journey.entity.JourneyStepMode;
import com.greencommit.backend.journey.entity.JourneyStepState;
import com.greencommit.backend.journey.entity.JourneyStepType;
import com.greencommit.backend.journey.repository.ContributionMissionRepository;
import com.greencommit.backend.journey.repository.JourneyCheckpointRepository;
import com.greencommit.backend.journey.repository.JourneySessionRepository;
import com.greencommit.backend.journey.repository.JourneyStepRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** F008/부록B: Journey 생성 및 9단계 상태(완료/스킵/재시도) 관리. */
@Service
@RequiredArgsConstructor
public class JourneyService {

    /** 부록B에 정의된 9단계 순서. */
    private static final JourneyStepType[] STEP_ORDER = {
            JourneyStepType.TUTORIAL,
            JourneyStepType.FORK,
            JourneyStepType.CLONE,
            JourneyStepType.REPO_ISSUE_BRIEF,
            JourneyStepType.QUESTION_COACH,
            JourneyStepType.IDE_LAUNCH,
            JourneyStepType.COMMIT_PUSH,
            JourneyStepType.PR,
            JourneyStepType.MONITORING
    };

    private final UserRepository userRepository;
    private final RepositoryJpaRepository repositoryRepository;
    private final IssueRepository issueRepository;
    private final ContributionMissionRepository missionRepository;
    private final JourneySessionRepository sessionRepository;
    private final JourneyStepRepository stepRepository;
    private final JourneyCheckpointRepository checkpointRepository;

    @Transactional
    public JourneySessionResponse createJourney(JourneyCreateRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new NotFoundException("User not found: " + request.userId()));
        Repository repository = repositoryRepository.findById(request.repositoryId())
                .orElseThrow(() -> new NotFoundException("Repository not found: " + request.repositoryId()));
        Issue issue = issueRepository.findById(request.issueId())
                .orElseThrow(() -> new NotFoundException("Issue not found: " + request.issueId()));

        Instant now = Instant.now();
        ContributionMission mission = missionRepository.save(ContributionMission.builder()
                .user(user)
                .repository(repository)
                .issue(issue)
                .title(repository.getName() + " - " + issue.getTitle())
                .status("ACTIVE")
                .createdAt(now)
                .build());

        JourneySession session = sessionRepository.save(JourneySession.builder()
                .mission(mission)
                .status(JourneySessionStatus.IN_PROGRESS)
                .startedAt(now)
                .build());

        int sequence = 1;
        for (JourneyStepType stepType : STEP_ORDER) {
            stepRepository.save(JourneyStep.builder()
                    .session(session)
                    .stepType(stepType)
                    .sequence(sequence++)
                    .state(JourneyStepState.PENDING)
                    .updatedAt(now)
                    .build());
        }

        return toResponse(session);
    }

    /** Journey 개요(SCR008) 화면이 새로고침 후에도 현재 단계 상태를 다시 불러올 수 있도록. */
    @Transactional(readOnly = true)
    public JourneySessionResponse getJourney(UUID sessionId) {
        JourneySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NotFoundException("Journey session not found: " + sessionId));
        return toResponse(session);
    }

    @Transactional
    public JourneySessionResponse updateStep(UUID sessionId, String stepTypeRaw, JourneyStepUpdateRequest request) {
        JourneySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NotFoundException("Journey session not found: " + sessionId));
        JourneyStepType stepType = parseStepType(stepTypeRaw);
        JourneyStep step = stepRepository.findBySessionIdAndStepType(sessionId, stepType)
                .orElseThrow(() -> new NotFoundException("Journey step not found: " + stepTypeRaw));

        Instant now = Instant.now();
        switch (request.action()) {
            case COMPLETE -> step.setState(JourneyStepState.COMPLETED);
            case SKIP -> step.setState(JourneyStepState.SKIPPED);
            case RETRY -> step.setState(JourneyStepState.IN_PROGRESS);
        }
        if (request.mode() != null && !request.mode().isBlank()) {
            step.setMode(JourneyStepMode.valueOf(request.mode().toUpperCase()));
        }
        step.setUpdatedAt(now);
        stepRepository.save(step);

        checkpointRepository.save(JourneyCheckpoint.builder()
                .session(session)
                .stepType(stepType)
                .checkpointData("action=" + request.action() + ";mode=" + step.getMode())
                .createdAt(now)
                .build());

        List<JourneyStep> allSteps = stepRepository.findBySessionIdOrderBySequenceAsc(sessionId);
        boolean allDone = allSteps.stream()
                .allMatch(s -> s.getState() == JourneyStepState.COMPLETED || s.getState() == JourneyStepState.SKIPPED);
        if (allDone && session.getStatus() != JourneySessionStatus.COMPLETED) {
            session.setStatus(JourneySessionStatus.COMPLETED);
            session.setCompletedAt(now);
            sessionRepository.save(session);
        }

        return toResponse(session);
    }

    private JourneyStepType parseStepType(String raw) {
        try {
            return JourneyStepType.valueOf(raw.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new NotFoundException("Unknown journey step: " + raw);
        }
    }

    private JourneySessionResponse toResponse(JourneySession session) {
        List<JourneyStepResponse> steps = stepRepository.findBySessionIdOrderBySequenceAsc(session.getId()).stream()
                .map(step -> new JourneyStepResponse(
                        step.getId(),
                        step.getStepType().name(),
                        step.getSequence(),
                        step.getState().name(),
                        step.getMode() == null ? null : step.getMode().name(),
                        step.getUpdatedAt()))
                .toList();
        return new JourneySessionResponse(
                session.getId(),
                session.getMission().getId(),
                session.getStatus().name(),
                session.getStartedAt(),
                session.getCompletedAt(),
                steps);
    }
}
