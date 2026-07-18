package com.greencommit.backend.automation.dto;

/**
 * BR07: Clone 자동화는 무단 로컬 명령 실행이 아니라 IDE Clone/열기 흐름 호출 또는 사용자가 직접
 * 실행하는 명령 문자열 제공에 그친다 — 서버는 어떤 로컬 명령도 실행하지 않는다.
 */
public record ClonePrepareResponse(String cloneCommand, String ideDeepLink, String fallbackUrl) {
}
