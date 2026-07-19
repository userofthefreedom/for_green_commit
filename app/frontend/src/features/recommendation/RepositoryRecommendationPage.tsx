import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRepositoryRecommendations } from '../../lib/api/endpoints'
import type { RepositoryRecommendation } from '../../lib/api/endpoints'

/**
 * SCR006 Repository 추천 — "프로젝트 설명과 적합도·Evidence" (기획서 표19).
 * Phase 4: GET /recommendations/repositories(F006, 시드 데이터)로 실제 추천 목록을 불러오고,
 * 표16이 요구하는 카드 속성(공익목적·최근활동·문서품질·응답성·주의점)을 전부 노출한다.
 * 레포를 고르면 SCR007 Issue 선택으로 넘어간다 (BR04: Repository 선택 후에만 Issue 후보 노출).
 */
export function RepositoryRecommendationPage() {
  const navigate = useNavigate()
  const [repos, setRepos] = useState<RepositoryRecommendation[] | null>(null)
  const [error, setError] = useState(false)

  function load() {
    setRepos(null)
    setError(false)
    getRepositoryRecommendations()
      .then((data) => setRepos([...data].sort((a, b) => a.rank - b.rank)))
      .catch(() => setError(true))
  }

  useEffect(load, [])

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0 }}>미션 찾기 — 레포부터 골라요</h1>
          <p className="lede" style={{ margin: '4px 0 0' }}>
            기여할 레포를 고르면, 그 레포의 Issue가 다음 화면에 떠요. 마음에 안 들면 언제든 레포를
            다시 고르세요.
          </p>
        </div>
        <button className="btn" type="button" onClick={load}>
          🔄 새로고침
        </button>
      </div>

      <div className="eyebrow" style={{ marginTop: 16 }}>
        1. 레포 선택
      </div>

      {error && <p className="muted">불러오지 못했어요. 새로고침해보세요.</p>}
      {!error && !repos && <p className="muted">불러오는 중…</p>}

      <div className="grid g3" style={{ marginTop: 10 }}>
        {repos?.map((repo, i) => (
          <div key={repo.repositoryId} className={i === 0 ? 'rec best' : 'rec'}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <b>{repo.fullName}</b>
              <span className="pill">적합도 {repo.fitScore ?? repo.score}</span>
            </div>
            {repo.avgFeedbackHours != null && repo.avgFeedbackHours <= 48 && (
              <span className="pill g" style={{ marginTop: 6, display: 'inline-block' }}>
                ⚡ {repo.avgFeedbackHours <= 24 ? '빠른 응답' : '비교적 빠른 응답'} · 평균 {repo.avgFeedbackHours}시간
              </span>
            )}
            <p className="muted" style={{ fontSize: 13, margin: '8px 0' }}>
              {repo.description}
            </p>
            <div>
              {repo.primaryLanguage && <span className="tag">{repo.primaryLanguage}</span>}
              {repo.stars != null && <span className="tag">⭐ {repo.stars.toLocaleString()}</span>}
            </div>
            <table className="kv" style={{ marginTop: 8 }}>
              <tbody>
                {repo.publicBenefitSummary && (
                  <tr>
                    <td>공익 목적</td>
                    <td>{repo.publicBenefitSummary}</td>
                  </tr>
                )}
                {repo.recentActivitySummary && (
                  <tr>
                    <td>최근 활동</td>
                    <td>{repo.recentActivitySummary}</td>
                  </tr>
                )}
                {repo.contributionDocsQuality && (
                  <tr>
                    <td>기여 문서</td>
                    <td>{repo.contributionDocsQuality}</td>
                  </tr>
                )}
                {repo.externalPrResponsiveness && (
                  <tr>
                    <td>응답성</td>
                    <td>{repo.externalPrResponsiveness}</td>
                  </tr>
                )}
              </tbody>
            </table>
            {repo.cautionNote && (
              <div className="callout a" style={{ marginTop: 8, fontSize: 12 }}>
                ⚠ {repo.cautionNote}
              </div>
            )}
            {repo.evidence.length > 0 && (
              <div className="callout b" style={{ marginTop: 8, fontSize: 12 }}>
                📎 {repo.evidence[0].description}
              </div>
            )}
            <button
              type="button"
              className="btn p full"
              style={{ marginTop: 12 }}
              onClick={() =>
                navigate(
                  `/recommend/issues?repositoryId=${repo.repositoryId}&repositoryName=${encodeURIComponent(repo.fullName)}`,
                )
              }
            >
              이 레포 선택 →
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
