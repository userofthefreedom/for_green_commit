import { createBrowserRouter, Outlet } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { AuthGuard } from './AuthGuard'
import { LandingPage } from '../features/landing/LandingPage'
import { AuthCallbackPage } from '../features/auth-callback/AuthCallbackPage'
import { GithubAnalysisPage } from '../features/onboarding/GithubAnalysisPage'
import { ProfilePage } from '../features/onboarding/ProfilePage'
import { TutorialPage } from '../features/onboarding/TutorialPage'
import { RepositoryRecommendationPage } from '../features/recommendation/RepositoryRecommendationPage'
import { IssueSelectionPage } from '../features/recommendation/IssueSelectionPage'
import { JourneyOverviewPage } from '../features/journey/JourneyOverviewPage'
import { ForkPage } from '../features/journey/ForkPage'
import { ClonePage } from '../features/journey/ClonePage'
import { BriefPage } from '../features/journey/BriefPage'
import { CoachPage } from '../features/journey/CoachPage'
import { ShipPage } from '../features/journey/ShipPage'
import { MonitoringPage } from '../features/journey/MonitoringPage'
import { ResultPage } from '../features/journey/ResultPage'
import { NotificationsPage } from '../features/notifications/NotificationsPage'
import { MyContributionsPage } from '../features/contributions/MyContributionsPage'
import { SettingsPage } from '../features/settings/SettingsPage'

/**
 * SCR001~018 ↔ 라우트 1:1 매핑 (기획서 표19 "8. 핵심 화면 목록" 기준).
 * Landing(SCR001)과 /auth/callback(SCR002)은 AuthGuard 밖에 둔다 — 로그인 전에도
 * 봐야 하는 화면이기 때문. 나머지 16개 화면은 AuthGuard로 감싼다 (Phase 1은
 * pass-through 스텁, Phase 2에서 실제 세션 검사로 교체).
 */
export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <LandingPage /> }, // SCR001 Landing
      { path: '/auth/callback', element: <AuthCallbackPage /> }, // SCR002 GitHub 회원가입
      {
        element: (
          <AuthGuard>
            <Outlet />
          </AuthGuard>
        ),
        children: [
          { path: '/onboarding/analysis', element: <GithubAnalysisPage /> }, // SCR003 GitHub 분석
          { path: '/onboarding/profile', element: <ProfilePage /> }, // SCR004 추가 프로필
          { path: '/onboarding/tutorial', element: <TutorialPage /> }, // SCR005 초보자 튜토리얼
          { path: '/recommend/repositories', element: <RepositoryRecommendationPage /> }, // SCR006
          { path: '/recommend/issues', element: <IssueSelectionPage /> }, // SCR007 Issue 선택
          { path: '/journey/overview', element: <JourneyOverviewPage /> }, // SCR008 Journey 개요 (신규)
          { path: '/journey/fork', element: <ForkPage /> }, // SCR009 Fork
          { path: '/journey/clone', element: <ClonePage /> }, // SCR010 Clone·IDE Handoff
          { path: '/journey/brief', element: <BriefPage /> }, // SCR011 Repo·Issue Brief
          { path: '/journey/coach', element: <CoachPage /> }, // SCR012 질문 Coach
          { path: '/journey/ship', element: <ShipPage /> }, // SCR013 Commit·PR
          { path: '/journey/monitoring', element: <MonitoringPage /> }, // SCR014 PR Monitoring (신규)
          { path: '/journey/result', element: <ResultPage /> }, // SCR015 결과
          { path: '/notifications', element: <NotificationsPage /> }, // SCR016 알림
          { path: '/contributions', element: <MyContributionsPage /> }, // SCR017 나의 기여
          { path: '/settings', element: <SettingsPage /> }, // SCR018 설정
        ],
      },
    ],
  },
])
