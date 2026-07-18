package com.greencommit.backend.automation.service;

import com.greencommit.backend.automation.dto.ClonePrepareRequest;
import com.greencommit.backend.automation.dto.ClonePrepareResponse;
import com.greencommit.backend.automation.dto.ForkRequest;
import com.greencommit.backend.automation.dto.ForkResponse;
import com.greencommit.backend.automation.dto.IdeLaunchRequest;
import com.greencommit.backend.automation.dto.IdeLaunchResponse;
import com.greencommit.backend.automation.entity.AutomationExecution;
import com.greencommit.backend.automation.entity.AutomationStatus;
import com.greencommit.backend.automation.entity.AutomationType;
import com.greencommit.backend.automation.entity.IDELaunchAttempt;
import com.greencommit.backend.automation.repository.AutomationExecutionRepository;
import com.greencommit.backend.automation.repository.IDELaunchAttemptRepository;
import com.greencommit.backend.catalog.entity.Repository;
import com.greencommit.backend.catalog.repository.RepositoryJpaRepository;
import com.greencommit.backend.common.exception.NotFoundException;
import com.greencommit.backend.identity.entity.User;
import com.greencommit.backend.identity.repository.UserRepository;
import com.greencommit.backend.journey.entity.JourneySession;
import com.greencommit.backend.journey.repository.JourneySessionRepository;
import com.greencommit.backend.profile.entity.PrimaryIde;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * F009/F010/F013, BR06/BR07: Fork·Clone·IDE 실행은 사용자 버튼 클릭 후 호출되고, 서버는 임의의
 * 로컬 명령을 실행하지 않는다. Fork는 실제 GitHub API 없이 성공을 시뮬레이션하고(F009 프로토타입
 * 범위), Clone/IDE 실행은 명령 문자열·Deep Link만 반환한다.
 */
@Service
@RequiredArgsConstructor
public class AutomationService {

    private final UserRepository userRepository;
    private final RepositoryJpaRepository repositoryRepository;
    private final JourneySessionRepository journeySessionRepository;
    private final AutomationExecutionRepository automationExecutionRepository;
    private final IDELaunchAttemptRepository ideLaunchAttemptRepository;

    @Transactional
    public ForkResponse fork(ForkRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new NotFoundException("User not found: " + request.userId()));
        Repository repository = repositoryRepository.findById(request.repositoryId())
                .orElseThrow(() -> new NotFoundException("Repository not found: " + request.repositoryId()));
        JourneySession session = resolveSession(request.sessionId());

        Instant now = Instant.now();
        String forkedRepoUrl = "https://github.com/" + user.getGithubLogin() + "/" + repository.getName();
        AutomationExecution execution = automationExecutionRepository.save(AutomationExecution.builder()
                .user(user)
                .session(session)
                .automationType(AutomationType.FORK)
                .status(AutomationStatus.SUCCESS)
                .requestedAt(now)
                .completedAt(now)
                .resultDetail("Fork 시뮬레이션 성공: " + forkedRepoUrl)
                .build());

        return new ForkResponse(execution.getId(), execution.getStatus().name(), forkedRepoUrl, execution.getResultDetail());
    }

    @Transactional
    public ClonePrepareResponse clonePrepare(ClonePrepareRequest request) {
        userRepository.findById(request.userId())
                .orElseThrow(() -> new NotFoundException("User not found: " + request.userId()));
        Repository repository = repositoryRepository.findById(request.repositoryId())
                .orElseThrow(() -> new NotFoundException("Repository not found: " + request.repositoryId()));
        JourneySession session = resolveSession(request.sessionId());

        String cloneUrl = repository.getRepoUrl() + ".git";
        String cloneCommand = "git clone " + cloneUrl;
        String ideDeepLink = buildCloneDeepLink(request.ide(), cloneUrl);

        automationExecutionRepository.save(AutomationExecution.builder()
                .user(userRepository.getReferenceById(request.userId()))
                .session(session)
                .automationType(AutomationType.CLONE)
                .status(AutomationStatus.SUCCESS)
                .requestedAt(Instant.now())
                .completedAt(Instant.now())
                .resultDetail("Clone 명령/Deep Link 준비 완료 (BR07: 서버가 직접 실행하지 않음)")
                .build());

        return new ClonePrepareResponse(cloneCommand, ideDeepLink, repository.getRepoUrl());
    }

    @Transactional
    public IdeLaunchResponse ideLaunch(IdeLaunchRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new NotFoundException("User not found: " + request.userId()));
        Repository repository = request.repositoryId() == null
                ? null
                : repositoryRepository.findById(request.repositoryId()).orElse(null);

        String cloneUrl = repository == null ? null : repository.getRepoUrl() + ".git";
        String deepLink = buildCloneDeepLink(request.ide(), cloneUrl);

        IDELaunchAttempt attempt = ideLaunchAttemptRepository.save(IDELaunchAttempt.builder()
                .user(user)
                .ide(request.ide())
                .deepLinkUrl(deepLink)
                .launchedAt(Instant.now())
                .succeeded(true)
                .build());

        return new IdeLaunchResponse(
                attempt.getId(), deepLink, true,
                "클릭 시 " + request.ide() + " Deep Link가 열립니다. 미설치/미지원 시 위 명령을 직접 실행하세요.");
    }

    private JourneySession resolveSession(java.util.UUID sessionId) {
        if (sessionId == null) {
            return null;
        }
        return journeySessionRepository.findById(sessionId).orElse(null);
    }

    private String buildCloneDeepLink(PrimaryIde ide, String cloneUrl) {
        if (ide == null || cloneUrl == null) {
            return null;
        }
        return switch (ide) {
            case VSCODE -> "vscode://vscode.git/clone?url=" + cloneUrl;
            case INTELLIJ_IDEA -> "jetbrains://idea/checkout/git?checkout.repo=" + cloneUrl;
            case PYCHARM -> "jetbrains://pycharm/checkout/git?checkout.repo=" + cloneUrl;
            case WEBSTORM -> "jetbrains://web-storm/checkout/git?checkout.repo=" + cloneUrl;
            case ECLIPSE, OTHER -> null;
        };
    }
}
