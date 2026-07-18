package com.greencommit.backend.recommendation.service;

import com.greencommit.backend.catalog.entity.Repository;
import com.greencommit.backend.catalog.repository.RepositoryJpaRepository;
import com.greencommit.backend.identity.entity.User;
import com.greencommit.backend.identity.repository.UserRepository;
import com.greencommit.backend.profile.entity.Preference;
import com.greencommit.backend.profile.repository.PreferenceRepository;
import com.greencommit.backend.recommendation.dto.EvidenceItem;
import com.greencommit.backend.recommendation.dto.RepositoryRecommendationResponse;
import com.greencommit.backend.recommendation.entity.Recommendation;
import com.greencommit.backend.recommendation.entity.RecommendationEvidence;
import com.greencommit.backend.recommendation.repository.RecommendationEvidenceRepository;
import com.greencommit.backend.recommendation.repository.RecommendationRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * F006: 개인화 Repository 추천. Phase 1 스코어링은 seed Repository의 fitScore를 기본값으로 쓰고,
 * userId가 있으면 Preference.interestAreas와 topics가 겹칠 때 소폭 가산하는 단순 규칙 기반이다.
 * TODO(Phase 99, 팀 확인 후 구현): Neo4j Knowledge Graph 기반 추천 근거(F020)로 교체.
 */
@Service
@RequiredArgsConstructor
public class RecommendationService {

    private static final double INTEREST_MATCH_BONUS = 5.0;

    private final RepositoryJpaRepository repositoryRepository;
    private final UserRepository userRepository;
    private final PreferenceRepository preferenceRepository;
    private final RecommendationRepository recommendationRepository;
    private final RecommendationEvidenceRepository recommendationEvidenceRepository;

    @Transactional
    public List<RepositoryRecommendationResponse> recommendRepositories(UUID userId) {
        List<Repository> repositories = repositoryRepository.findAll();
        List<String> interestAreas = resolveInterestAreas(userId);
        Optional<User> user = userId == null ? Optional.empty() : userRepository.findById(userId);

        record Scored(Repository repository, double score, boolean interestMatch) {
        }

        List<Scored> scored = new ArrayList<>();
        for (Repository repository : repositories) {
            double base = repository.getFitScore() == null ? 0.0 : repository.getFitScore();
            boolean matched = matchesInterest(repository, interestAreas);
            double score = matched ? base + INTEREST_MATCH_BONUS : base;
            scored.add(new Scored(repository, score, matched));
        }
        scored.sort(Comparator.comparingDouble(Scored::score).reversed());

        Instant now = Instant.now();
        List<RepositoryRecommendationResponse> result = new ArrayList<>();
        int rank = 1;
        for (Scored item : scored) {
            Recommendation recommendation = Recommendation.builder()
                    .user(user.orElse(null))
                    .repository(item.repository())
                    .score(item.score())
                    .rank(rank)
                    .createdAt(now)
                    .build();
            recommendation = recommendationRepository.save(recommendation);

            List<EvidenceItem> evidenceItems = new ArrayList<>();
            RecommendationEvidence fitEvidence = RecommendationEvidence.builder()
                    .recommendation(recommendation)
                    .evidenceType("RULE")
                    .sourceUrl(item.repository().getRepoUrl())
                    .description("Seed 적합도 점수 " + item.repository().getFitScore())
                    .ruleName("fit_score_baseline")
                    .capturedAt(now)
                    .build();
            recommendationEvidenceRepository.save(fitEvidence);
            evidenceItems.add(new EvidenceItem(
                    fitEvidence.getEvidenceType(), fitEvidence.getSourceUrl(), fitEvidence.getDescription(), fitEvidence.getRuleName()));

            if (item.interestMatch()) {
                RecommendationEvidence interestEvidence = RecommendationEvidence.builder()
                        .recommendation(recommendation)
                        .evidenceType("RULE")
                        .sourceUrl(item.repository().getRepoUrl())
                        .description("사용자 관심 분야와 topics 일치")
                        .ruleName("interest_area_match")
                        .capturedAt(now)
                        .build();
                recommendationEvidenceRepository.save(interestEvidence);
                evidenceItems.add(new EvidenceItem(
                        interestEvidence.getEvidenceType(), interestEvidence.getSourceUrl(),
                        interestEvidence.getDescription(), interestEvidence.getRuleName()));
            }

            Repository repository = item.repository();
            result.add(new RepositoryRecommendationResponse(
                    repository.getId(),
                    repository.getFullName(),
                    repository.getDescription(),
                    repository.getPrimaryLanguage(),
                    repository.getTopics(),
                    repository.getRepoUrl(),
                    repository.getPublicBenefitSummary(),
                    repository.getRecentActivitySummary(),
                    repository.getContributionDocsQuality(),
                    repository.getExternalPrResponsiveness(),
                    repository.getFitScore(),
                    repository.getCautionNote(),
                    repository.getStars(),
                    item.score(),
                    rank,
                    evidenceItems));
            rank++;
        }
        return result;
    }

    private List<String> resolveInterestAreas(UUID userId) {
        if (userId == null) {
            return List.of();
        }
        return preferenceRepository.findByUserId(userId)
                .map(Preference::getInterestAreas)
                .filter(areas -> areas != null && !areas.isBlank())
                .map(areas -> List.of(areas.toLowerCase(Locale.ROOT).split("\\s*,\\s*")))
                .orElse(List.of());
    }

    private boolean matchesInterest(Repository repository, List<String> interestAreas) {
        if (interestAreas.isEmpty() || repository.getTopics() == null) {
            return false;
        }
        String topics = repository.getTopics().toLowerCase(Locale.ROOT);
        return interestAreas.stream().anyMatch(topics::contains);
    }
}
