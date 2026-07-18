import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ApiError, apiClient } from '../lib/api/client'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8080'

export interface SessionUser {
  id: string
  githubId: number
  githubLogin: string
  email: string | null
  displayName: string | null
  avatarUrl: string | null
  createdAt: string
}

interface AuthContextValue {
  status: 'loading' | 'authenticated' | 'anonymous'
  user: SessionUser | null
  login: () => void
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  status: 'loading',
  user: null,
  login: () => {},
  logout: async () => {},
  refresh: async () => {},
})

/**
 * BR01 게이트: GitHub 로그인 여부를 실제 백엔드 세션(GET /auth/session)으로 확인한다(Phase 2).
 * `login()`은 Spring Security가 제공하는 `/oauth2/authorization/github`로 전체 페이지를
 * 이동시켜 실제 GitHub OAuth 동의 화면으로 넘어간다 — fetch가 아니라 브라우저 최상위 이동이어야
 * GitHub 로그인 페이지가 정상적으로 뜬다.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthContextValue['status']>('loading')
  const [user, setUser] = useState<SessionUser | null>(null)

  const refresh = useCallback(async () => {
    try {
      const me = await apiClient<SessionUser>('/auth/session')
      setUser(me)
      setStatus('authenticated')
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setUser(null)
        setStatus('anonymous')
      } else {
        // 네트워크 오류 등 — 로그인 안 된 것으로 취급(BR01: 확신 없으면 막는다)
        setUser(null)
        setStatus('anonymous')
      }
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const login = useCallback(() => {
    window.location.href = `${BASE_URL}/oauth2/authorization/github`
  }, [])

  const logout = useCallback(async () => {
    await fetch(`${BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' })
    setUser(null)
    setStatus('anonymous')
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, login, logout, refresh }),
    [status, user, login, logout, refresh],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
