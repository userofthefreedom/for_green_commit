package com.greencommit.backend.prtracking.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.greencommit.backend.common.exception.NotFoundException;
import com.greencommit.backend.experience.entity.ContributionHistory;
import com.greencommit.backend.experience.repository.ContributionHistoryRepository;
import com.greencommit.backend.identity.entity.User;
import com.greencommit.backend.identity.repository.UserRepository;
import com.greencommit.backend.journey.entity.JourneySession;
import com.greencommit.backend.journey.repository.JourneySessionRepository;
import com.greencommit.backend.prtracking.dto.PullRequestLinkRequest;
import com.greencommit.backend.prtracking.dto.PullRequestLinkResponse;
import com.greencommit.backend.prtracking.dto.PullRequestStatusResponse;
import com.greencommit.backend.prtracking.entity.PullRequestLink;
import com.greencommit.backend.prtracking.repository.PullRequestLinkRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

/**
 * F016/F017 MVP 슬라이스, BR10/BR11: 사용자가 등록한 PR만 추적하며, 등록 직후 1회 상태 조회만
 * 수행한다(주기적 Polling은 F017 Phase 99 보류). GitHub 공개 REST API를 인증 없이 호출하므로
 * Private Repo는 지원하지 않고 Rate Limit에 걸릴 수 있다 — 실패 시 500 대신 UNKNOWN을 반환한다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PullRequestService {

    private final UserRepository userRepository;
    private final JourneySessionRepository journeySessionRepository;
    private final PullRequestLinkRepository pullRequestLinkRepository;
    private final ContributionHistoryRepository contributionHistoryRepository;
    private final RestClient restClient = RestClient.create();

    @Transactional
    public PullRequestLinkResponse createLink(PullRequestLinkRequest request) {
        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new NotFoundException("User not found: " + request.userId()));
        JourneySession session = request.sessionId() == null
                ? null
                : journeySessionRepository.findById(request.sessionId()).orElse(null);

        PullRequestLink link = pullRequestLinkRepository.save(PullRequestLink.builder()
                .user(user)
                .session(session)
                .repoOwner(request.repoOwner())
                .repoName(request.repoName())
                .prNumber(request.prNumber())
                .prUrl(request.prUrl())
                .createdAt(Instant.now())
                .build());

        // F019 초안: PR 등록 시점에 최소 History(PR 연결 + Journey 요약 문자열)를 함께 남긴다.
        String journeySummary = session == null
                ? "PR 등록: " + request.repoOwner() + "/" + request.repoName() + "#" + request.prNumber()
                : session.getMission().getTitle() + " Journey를 통해 PR을 제출했어요.";
        contributionHistoryRepository.save(ContributionHistory.builder()
                .user(user)
                .prLink(link)
                .journeySummary(journeySummary)
                .createdAt(Instant.now())
                .build());

        return new PullRequestLinkResponse(
                link.getId(), link.getRepoOwner(), link.getRepoName(), link.getPrNumber(), link.getPrUrl(), link.getCreatedAt());
    }

    @Transactional(readOnly = true)
    public PullRequestStatusResponse getStatus(UUID prLinkId) {
        PullRequestLink link = pullRequestLinkRepository.findById(prLinkId)
                .orElseThrow(() -> new NotFoundException("Pull request link not found: " + prLinkId));

        String url = "https://api.github.com/repos/%s/%s/pulls/%d"
                .formatted(link.getRepoOwner(), link.getRepoName(), link.getPrNumber());
        try {
            GitHubPullResponse pull = restClient.get()
                    .uri(url)
                    .header("Accept", "application/vnd.github+json")
                    .retrieve()
                    .body(GitHubPullResponse.class);
            if (pull == null) {
                return unknown(link);
            }
            // BR11: MERGED와 CLOSED_UNMERGED를 구분하고, 사유가 불명확하면 UNKNOWN.
            String state;
            if (Boolean.TRUE.equals(pull.merged())) {
                state = "MERGED";
            } else if ("closed".equalsIgnoreCase(pull.state())) {
                state = "CLOSED_UNMERGED";
            } else if ("open".equalsIgnoreCase(pull.state())) {
                state = "OPEN";
            } else {
                state = "UNKNOWN";
            }
            return new PullRequestStatusResponse(link.getId(), state, pull.merged(), pull.title(), Instant.now(), "github");
        } catch (Exception e) {
            log.warn("GitHub PR status lookup failed for {}: {}", url, e.getMessage());
            return unknown(link);
        }
    }

    private PullRequestStatusResponse unknown(PullRequestLink link) {
        return new PullRequestStatusResponse(link.getId(), "UNKNOWN", null, null, Instant.now(), "unavailable");
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record GitHubPullResponse(String state, Boolean merged, String title) {
    }
}
