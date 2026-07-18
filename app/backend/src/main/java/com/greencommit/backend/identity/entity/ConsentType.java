package com.greencommit.backend.identity.entity;

/**
 * BR01/BR06: 회원가입 시 공개 프로필·Repository 읽기 권한, 이후 Fork/PR 자동화 별도 동의 구분.
 */
public enum ConsentType {
    PROFILE_READ,
    PUBLIC_REPO_READ,
    FORK_AUTOMATION,
    PR_AUTOMATION
}
