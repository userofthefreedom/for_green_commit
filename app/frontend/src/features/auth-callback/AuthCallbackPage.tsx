import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../app/AuthContext'

/**
 * 실제 GitHub OAuth 로그인 완료 후 백엔드(GithubOAuth2SuccessHandler)가 브라우저를
 * 이 경로로 돌려보낸다(Phase 2). 이 시점엔 세션 쿠키가 이미 발급돼 있으므로,
 * GET /auth/session을 다시 확인해 온보딩 화면으로 넘어간다. AuthGuard 밖 라우트
 * (세션 확인이 끝나기 전에 AuthGuard가 먼저 Landing으로 튕겨내는 걸 막기 위함).
 */
export function AuthCallbackPage() {
  const { status, refresh } = useAuth()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    void refresh().then(() => setChecked(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!checked || status === 'loading') {
    return (
      <section style={{ textAlign: 'center', padding: '60px 0' }}>
        <p className="lede">GitHub 로그인 확인 중…</p>
      </section>
    )
  }
  if (status === 'authenticated') {
    return <Navigate to="/onboarding/analysis" replace />
  }
  // 로그인 실패/취소 — 다시 Landing으로.
  return <Navigate to="/?login_error=1" replace />
}
