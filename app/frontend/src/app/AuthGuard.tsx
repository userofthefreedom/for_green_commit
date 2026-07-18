import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

interface AuthGuardProps {
  children: ReactNode
}

/**
 * SCR003~018을 감싸는 라우트 가드(BR01). GitHub 로그인이 안 되어 있으면 Landing(`/`)으로
 * 돌려보낸다. 세션 확인(GET /auth/session) 중에는 잠깐 로딩 표시만 한다.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { status } = useAuth()

  if (status === 'loading') {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted, #5c6b62)' }}>
        로그인 확인 중…
      </div>
    )
  }
  if (status === 'anonymous') {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}
