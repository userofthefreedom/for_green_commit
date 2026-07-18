package com.greencommit.backend.experience.service;

import com.greencommit.backend.experience.dto.ContributionHistoryResponse;
import com.greencommit.backend.experience.entity.ContributionHistory;
import com.greencommit.backend.experience.repository.ContributionHistoryRepository;
import com.greencommit.backend.prtracking.entity.PullRequestLink;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** F019 초안: 기여 History 조회(PR 연결 + Journey 요약만, Review/Merge 이력 보강은 보류). */
@Service
@RequiredArgsConstructor
public class HistoryService {

    private final ContributionHistoryRepository contributionHistoryRepository;

    @Transactional(readOnly = true)
    public List<ContributionHistoryResponse> getHistory(UUID userId) {
        List<ContributionHistory> histories = userId == null
                ? contributionHistoryRepository.findAll()
                : contributionHistoryRepository.findByUserId(userId);
        return histories.stream().map(this::toResponse).toList();
    }

    private ContributionHistoryResponse toResponse(ContributionHistory history) {
        PullRequestLink link = history.getPrLink();
        return new ContributionHistoryResponse(
                history.getId(),
                link == null ? null : link.getRepoOwner(),
                link == null ? null : link.getRepoName(),
                link == null ? null : link.getPrNumber(),
                link == null ? null : link.getPrUrl(),
                history.getJourneySummary(),
                history.getCreatedAt());
    }
}
