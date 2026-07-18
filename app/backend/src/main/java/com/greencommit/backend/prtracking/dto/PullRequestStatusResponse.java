package com.greencommit.backend.prtracking.dto;

import java.time.Instant;
import java.util.UUID;

/**
 * GET /pull-requests/{id}/status 응답 — F017 MVP 슬라이스(등록 직후 1회 조회, BR11: 사유
 * 불명확 시 UNKNOWN). state는 OPEN / MERGED / CLOSED_UNMERGED / UNKNOWN 중 하나.
 */
public record PullRequestStatusResponse(
        UUID prLinkId, String state, Boolean merged, String title, Instant checkedAt, String source) {
}
