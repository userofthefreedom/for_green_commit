import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getGithubAccount } from '../../lib/api/endpoints'
import type { GithubAccountSummary } from '../../lib/api/endpoints'

/**
 * SCR003 GitHub 분석 — "공개 활동·언어·PR·분석 신뢰도" (기획서 표19).
 * Phase 3: 로그인 시 저장된 실제 GitHub 공개 프로필(GET /users/me/github-account)을 보여준다.
 * BR02: 공개 활동 분석과 자기 진단은 분리 표시하며, GitHub 데이터만으로 실력을 단정하지 않는다 —
 * 언어 구성비처럼 별도 API 호출 없이는 얻을 수 없는 값은 v3처럼 꾸며내지 않고, 지금 실제로
 * 갖고 있는 값(공개 저장소 수·팔로워)만 보여준다.
 */
export function GithubAnalysisPage() {
  const [account, setAccount] = useState<GithubAccountSummary | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    getGithubAccount()
      .then(setAccount)
      .catch(() => setError(true))
  }, [])

  return (
    <section>
      <h1>이렇게 분석했어요</h1>
      <p className="lede">공개 활동을 바탕으로 프로필을 만들었어요. 맞지 않으면 다음 단계에서 고칠 수 있어요.</p>
      <div className="grid g2">
        <div className="card">
          <div className="eyebrow">GitHub 공개 프로필</div>
          {error && <p className="muted">불러오지 못했어요. 새로고침해보세요.</p>}
          {!error && !account && <p className="muted">불러오는 중…</p>}
          {account && (
            <>
              <div className="grid g3">
                <div className="card center" style={{ boxShadow: 'none' }}>
                  <div className="big">{account.publicReposCount ?? '—'}</div>
                  <span className="muted">공개 저장소</span>
                </div>
                <div className="card center" style={{ boxShadow: 'none' }}>
                  <div className="big">{account.followers ?? '—'}</div>
                  <span className="muted">팔로워</span>
                </div>
                <div className="card center" style={{ boxShadow: 'none' }}>
                  <span className="muted" style={{ fontSize: 12 }}>
                    @{account.login}
                  </span>
                </div>
              </div>
              <p className="note" style={{ marginTop: 12 }}>
                <a href={account.profileUrl} target="_blank" rel="noreferrer">
                  GitHub 프로필 열기 ↗
                </a>
              </p>
            </>
          )}
        </div>
        <div className="card">
          <div className="eyebrow">분석 신뢰도</div>
          <p className="muted">
            공개 활동만으로는 실력을 단정하지 않아요(BR02). 다음 단계에서 자기 진단으로 보정해요.
          </p>
          <Link to="/onboarding/profile" className="btn p full lg" style={{ marginTop: 16 }}>
            내 정보 보정하기 →
          </Link>
        </div>
      </div>
    </section>
  )
}
