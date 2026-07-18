import { apiClient } from './client'

/**
 * 기획서 표37 "API 15종"의 타입 정의 + 호출 함수. Phase 1은 경로·페이로드 형태만
 * 확정하고, 화면 컴포넌트에서의 실제 호출(TanStack Query)은 Phase 2 이후 붙인다.
 * (표37은 `GET+POST /tutorial/progress`를 한 항목으로 묶어 15종으로 세지만, 여기서는
 * 메서드별로 함수를 분리해 총 16개 함수로 표현했다.)
 */

// 1. POST /auth/github/callback — BR01 GitHub 필수 회원가입 게이트
export interface GithubCallbackRequest {
  code: string
}
export interface GithubCallbackResponse {
  userId: string
  isNewUser: boolean
  accessToken: string
}
export function postAuthGithubCallback(payload: GithubCallbackRequest) {
  return apiClient<GithubCallbackResponse>('/auth/github/callback', { method: 'POST', body: payload })
}

// 2. PUT /users/me/onboarding — 추가 프로필(IDE·경험·관심·시간·첫 기여 여부)
export interface OnboardingUpdateRequest {
  frameworkExperience?: 'NONE' | 'INTERMEDIATE' | 'PROFICIENT'
  gitCollaborationExperience?: 'NONE' | 'INTERMEDIATE' | 'PROFICIENT'
  externalPrCount?: '0' | '1_2' | '3_PLUS'
  interests?: string[]
  weeklyHours?: string
  idePreference?: 'VSCODE' | 'INTELLIJ' | 'OTHER'
  isFirstTimeContributor?: boolean
}
export function putUserOnboarding(payload: OnboardingUpdateRequest) {
  return apiClient<void>('/users/me/onboarding', { method: 'PUT', body: payload })
}

// 3. GET /tutorial/progress — 초보자 튜토리얼 완료/스킵 상태 조회
export interface TutorialProgress {
  stepId: string
  completed: boolean
  skipped: boolean
}
export function getTutorialProgress() {
  return apiClient<TutorialProgress[]>('/tutorial/progress')
}

// 4. POST /tutorial/progress — 튜토리얼 완료/스킵 상태 저장
export function postTutorialProgress(payload: TutorialProgress) {
  return apiClient<TutorialProgress>('/tutorial/progress', { method: 'POST', body: payload })
}

// 5. GET /recommendations/repositories — 개인화 Repository 추천 (적합도·Evidence)
export interface RepositoryRecommendation {
  repositoryId: string
  name: string
  description: string
  fitScore: number
  languages: string[]
  goodFirstIssueCount: number
}
export function getRepositoryRecommendations() {
  return apiClient<RepositoryRecommendation[]>('/recommendations/repositories')
}

// 6. GET /repositories/{id}/issues — 선택 Repository의 Issue 후보 (BR04)
export interface IssueSummary {
  issueId: string
  number: string
  title: string
  fitScore: number
  labels: string[]
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
}
export function getRepositoryIssues(repositoryId: string) {
  return apiClient<IssueSummary[]>(`/repositories/${repositoryId}/issues`)
}

// 7. POST /journeys — Repository·Issue 확정 후 Journey(Mission) 생성
export interface CreateJourneyRequest {
  repositoryId: string
  issueId: string
}
export interface Journey {
  journeyId: string
  currentStep: string
}
export function postJourney(payload: CreateJourneyRequest) {
  return apiClient<Journey>('/journeys', { method: 'POST', body: payload })
}

// 8. PATCH /journeys/{id}/steps/{step} — 단계 완료/스킵/재시도 상태 갱신
export interface UpdateJourneyStepRequest {
  status: 'DONE' | 'SKIPPED' | 'IN_PROGRESS' | 'FAILED'
}
export function patchJourneyStep(journeyId: string, step: string, payload: UpdateJourneyStepRequest) {
  return apiClient<Journey>(`/journeys/${journeyId}/steps/${step}`, { method: 'PATCH', body: payload })
}

// 9. POST /automations/fork — Fork 자동화 (GitHub API, BR06 사용자 확인 후 실행)
export interface AutomateForkRequest {
  repositoryId: string
}
export interface AutomateForkResponse {
  forkedRepositoryUrl: string
}
export function postAutomationFork(payload: AutomateForkRequest) {
  return apiClient<AutomateForkResponse>('/automations/fork', { method: 'POST', body: payload })
}

// 10. POST /automations/clone/prepare — Clone 명령/IDE Deep Link 준비 (BR07, 무단 로컬 실행 금지)
export interface PrepareCloneRequest {
  repositoryId: string
}
export interface PrepareCloneResponse {
  cloneCommand: string
  ideDeepLink?: string
}
export function postAutomationClonePrepare(payload: PrepareCloneRequest) {
  return apiClient<PrepareCloneResponse>('/automations/clone/prepare', { method: 'POST', body: payload })
}

// 11. POST /ide-launch — 사용자 클릭 기반 IDE 실행 Handoff
export interface IdeLaunchRequest {
  journeyId: string
  targetPath: string
}
export interface IdeLaunchResponse {
  launched: boolean
  fallbackInstruction?: string
}
export function postIdeLaunch(payload: IdeLaunchRequest) {
  return apiClient<IdeLaunchResponse>('/ide-launch', { method: 'POST', body: payload })
}

// 12. POST /ai/orchestrations — 질문 Coach 오케스트레이션 (BR08/BR09 — 정답 선노출 금지, Evidence 구분)
export interface AiOrchestrationRequest {
  journeyId: string
  stepId: string
  input: string
}
export interface AiOrchestrationResponse {
  reply: string
  evidence: string[]
}
export function postAiOrchestration(payload: AiOrchestrationRequest) {
  return apiClient<AiOrchestrationResponse>('/ai/orchestrations', { method: 'POST', body: payload })
}

// 13. POST /pull-requests — PR 연결·등록 (등록 직후 1회 상태 조회까지가 MVP 범위)
export interface CreatePullRequestRequest {
  journeyId: string
  pullRequestUrl: string
}
export interface PullRequestLink {
  pullRequestId: string
  pullRequestUrl: string
  status: 'OPEN' | 'MERGED' | 'CLOSED_UNMERGED' | 'UNKNOWN'
}
export function postPullRequest(payload: CreatePullRequestRequest) {
  return apiClient<PullRequestLink>('/pull-requests', { method: 'POST', body: payload })
}

// 14. GET /pull-requests/{id}/status — PR 상태 조회 (F017 확장에서 주기 폴링으로 발전)
export function getPullRequestStatus(pullRequestId: string) {
  return apiClient<PullRequestLink>(`/pull-requests/${pullRequestId}/status`)
}

// 15. GET /notifications — 알림 보관함 (F018 필수 확장, MVP는 단순 조회만)
export interface NotificationItem {
  notificationId: string
  message: string
  read: boolean
  createdAt: string
}
export function getNotifications() {
  return apiClient<NotificationItem[]>('/notifications')
}

// 16. GET /history — Contribution History 초안 (PR 연결 + Journey 요약 저장분)
export interface HistoryItem {
  historyId: string
  journeyId: string
  summary: string
}
export function getHistory() {
  return apiClient<HistoryItem[]>('/history')
}
