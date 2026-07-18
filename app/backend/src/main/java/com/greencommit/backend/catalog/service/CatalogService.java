package com.greencommit.backend.catalog.service;

import com.greencommit.backend.catalog.dto.IssueCardResponse;
import com.greencommit.backend.catalog.entity.Issue;
import com.greencommit.backend.catalog.entity.IssueProfile;
import com.greencommit.backend.catalog.repository.IssueProfileRepository;
import com.greencommit.backend.catalog.repository.IssueRepository;
import com.greencommit.backend.catalog.repository.RepositoryJpaRepository;
import com.greencommit.backend.common.exception.NotFoundException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** F007/BR04: 선택한 Repository의 Issue 후보만 노출. */
@Service
@RequiredArgsConstructor
public class CatalogService {

    private final RepositoryJpaRepository repositoryRepository;
    private final IssueRepository issueRepository;
    private final IssueProfileRepository issueProfileRepository;

    @Transactional(readOnly = true)
    public List<IssueCardResponse> getIssuesForRepository(UUID repositoryId) {
        if (!repositoryRepository.existsById(repositoryId)) {
            throw new NotFoundException("Repository not found: " + repositoryId);
        }
        List<Issue> issues = issueRepository.findByRepositoryId(repositoryId);
        return issues.stream().map(this::toResponse).toList();
    }

    private IssueCardResponse toResponse(Issue issue) {
        IssueProfile profile = issueProfileRepository.findByIssueId(issue.getId()).orElse(null);
        return new IssueCardResponse(
                issue.getId(),
                issue.getRepository().getId(),
                issue.getNumber(),
                issue.getTitle(),
                issue.getUrl(),
                issue.getSummary(),
                profile == null ? null : profile.getCurrentProblem(),
                profile == null ? null : profile.getExpectedOutcome(),
                profile == null ? null : profile.getCompletionCriteria(),
                issue.getContributionType(),
                issue.getEstimatedScope(),
                issue.getDifficulty() == null ? null : issue.getDifficulty().name(),
                issue.getAssignee(),
                issue.getLinkedPrUrl(),
                issue.getLastUpdatedAt(),
                issue.getState());
    }
}
