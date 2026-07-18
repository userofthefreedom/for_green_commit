import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJourney } from '../../app/JourneyContext'
import { getRepositoryIssues, getRepositoryRecommendations } from '../../lib/api/endpoints'
import type { IssueSummary, RepositoryRecommendation } from '../../lib/api/endpoints'

/**
 * SCR011 Repo·Issue Brief — "프로젝트 목적·문제·기대·완료 기준" (기획서 표19, F011).
 * Phase 5: JourneyContext의 실제 선택(레포·이슈)을 이용해 실제 카탈로그 데이터로 채운다.
 * 전용 단건 조회 API는 없으므로 기존 목록 API(GET /recommendations/repositories,
 * GET /repositories/{id}/issues)에서 골라 쓴다 — 이 화면만을 위한 새 엔드포인트는 만들지 않았다.
 * 실제 Local GPU+RAG 분석(F011의 "관련 파일 후보" 등)은 여전히 Phase 99 보류 범위.
 */
export function BriefPage() {
  const navigate = useNavigate()
  const { journey, meta, updateStep } = useJourney()
  const [repo, setRepo] = useState<RepositoryRecommendation | null>(null)
  const [issue, setIssue] = useState<IssueSummary | null>(null)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    if (!meta) return
    getRepositoryRecommendations()
      .then((repos) => setRepo(repos.find((r) => r.repositoryId === meta.repositoryId) ?? null))
      .catch(() => {})
    getRepositoryIssues(meta.repositoryId)
      .then((issues) => setIssue(issues.find((i) => i.issueId === meta.issueId) ?? null))
      .catch(() => {})
  }, [meta])

  async function handleContinue() {
    setStarting(true)
    try {
      if (journey) await updateStep('REPO_ISSUE_BRIEF', { action: 'COMPLETE' })
    } finally {
      navigate('/journey/coach')
    }
  }

  if (!meta) {
    return (
      <>
        <h1>레포 &amp; 이슈, 쉽게 정리해줄게요</h1>
        <p className="lede">아직 선택한 미션이 없어요. 먼저 레포와 이슈를 골라주세요.</p>
      </>
    )
  }

  return (
    <>
      <h1>레포 &amp; 이슈, 쉽게 정리해줄게요</h1>
      <p className="lede">코드를 만지기 전에 "여기가 어떤 곳이고, 내가 뭘 고치는지"를 한눈에.</p>
      <div className="grid g2">
        <div className="card">
          <div className="eyebrow">이 레포는 어떤 곳? · {meta.repositoryName}</div>
          <p>{repo?.description ?? '불러오는 중…'}</p>
          {repo?.primaryLanguage && (
            <>
              <div className="eyebrow" style={{ marginTop: 12 }}>
                기술 스택
              </div>
              <div>
                <span className="tag">{repo.primaryLanguage}</span>
              </div>
            </>
          )}
          <div className="callout g" style={{ marginTop: 12 }}>
            겁먹지 마세요 — 이번에 건드릴 건 이 중 아주 작은 부분이에요.
          </div>
        </div>
        <div className="card">
          <div className="eyebrow">네가 고른 이슈</div>
          <b style={{ display: 'block', fontSize: 15 }}>{meta.issueTitle}</b>
          <p style={{ margin: '6px 0 12px' }}>{issue?.summary ?? '불러오는 중…'}</p>
          <table className="kv">
            <tbody>
              <tr>
                <td>지금 문제</td>
                <td>{issue?.currentProblem ?? '—'}</td>
              </tr>
              <tr>
                <td>기대 결과</td>
                <td>{issue?.expectedOutcome ?? '—'}</td>
              </tr>
              <tr>
                <td>완료 기준</td>
                <td>{issue?.completionCriteria ?? '—'}</td>
              </tr>
            </tbody>
          </table>
          <div className="callout b" style={{ marginTop: 10 }}>
            난이도: {issue?.difficulty ?? '—'} · 범위: {issue?.estimatedScope ?? '—'}
          </div>
          <button
            type="button"
            className="btn p full lg"
            style={{ marginTop: 14 }}
            onClick={handleContinue}
            disabled={starting}
          >
            학습하며 수정하기 →
          </button>
        </div>
      </div>
    </>
  )
}
