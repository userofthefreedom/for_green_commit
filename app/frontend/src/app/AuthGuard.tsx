import type { ReactNode } from 'react'

interface AuthGuardProps {
  children: ReactNode
}

// TODO(Phase 2): 실제 세션 확인 — 지금은 항상 통과시킴 (BR01 게이트 미구현)
/**
 * SCR003~018을 감싸는 라우트 가드. Phase 1은 pass-through 스텁이라 미인증 상태에서도
 * 모든 화면에 접근할 수 있다. Phase 2에서 AuthContext의 실제 세션 값을 읽어
 * 미인증 시 Landing(`/`)으로 리다이렉트하도록 채운다.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  return <>{children}</>
}
