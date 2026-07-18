import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'

interface AuthContextValue {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
})

/**
 * Phase 1 스텁 — 항상 미인증 상태(`isAuthenticated: false`)와 no-op login/logout을 제공한다.
 * Phase 2에서 GitHub OAuth 세션 하이드레이션(BR01 — GitHub 계정 없이는 회원가입/기여 Journey
 * 사용 불가)으로 교체된다. 지금은 AuthGuard가 이 값을 사용하지 않고 항상 통과시킨다.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: false,
      login: () => {
        // TODO(Phase 2): GitHub OAuth authorize URL로 리다이렉트한다.
      },
      logout: () => {
        // TODO(Phase 2): 세션/토큰을 정리하고 Landing으로 돌려보낸다.
      },
    }),
    [],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
