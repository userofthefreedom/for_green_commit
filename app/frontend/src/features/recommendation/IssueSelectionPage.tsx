import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useJourney } from '../../app/JourneyContext'
import { getRepositoryIssues } from '../../lib/api/endpoints'
import type { IssueSummary } from '../../lib/api/endpoints'

/**
 * SCR007 Issue 선택 — "Issue 설명·완료 기준·난이도·범위" (기획서 표19).
 * Phase 4: GET /repositories/{id}/issues(F007, BR04)로 실제 Issue 후보를 불러오고, 선택을
 * 확정하면 POST /journeys(F008)로 실제 Journey(9단계)를 생성한 뒤 SCR008로 이동한다.
 */
export function IssueSelectionPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { startJourney } = useJourney()
  const repositoryId = searchParams.get('repositoryId') ?? ''
  const repositoryName = searchParams.get('repositoryName') ?? '레포 미선택'

  const [issues, setIssues] = useState<IssueSummary[] | null>(null)
  const [error, setError] = useState(false)
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    if (!repositoryId) return
    getRepositoryIssues(repositoryId)
      .then(setIssues)
      .catch(() => setError(true))
  }, [repositoryId])

  const selectedIssue = issues?.find((issue) => issue.issueId === selectedIssueId)

  async function handleStart() {
    if (!selectedIssue) return
    setStarting(true)
    try {
      await startJourney({
        repositoryId,
        repositoryName,
        issueId: selectedIssue.issueId,
        issueTitle: selectedIssue.title,
      })
      navigate('/journey/overview')
    } catch {
      setError(true)
    } finally {
      setStarting(false)
    }
  }

  return (
    <section>
      <h1>미션 찾기 — 이슈 선택</h1>
      <p className="lede">
        2. <b>{repositoryName}</b>의 Issue 후보예요. 완료 기준·난이도를 보고 하나를 골라보세요.
      </p>

      {!repositoryId && <p className="muted">먼저 레포를 선택해주세요.</p>}
      {error && <p className="muted">불러오지 못했어요. 새로고침해보세요.</p>}
      {repositoryId && !error && !issues && <p className="muted">불러오는 중…</p>}

      <div>
        {issues?.map((issue) => (
          <div key={issue.issueId} className={issue.issueId === selectedIssueId ? 'issue best' : 'issue'}>
            <div style={{ flex: 1 }}>
              <div className="row" style={{ alignItems: 'center' }}>
                <b>{issue.title}</b>
                <span className="muted" style={{ fontSize: 12 }}>
                  #{issue.number}
                </span>
              </div>
              <div style={{ margin: '6px 0' }}>
                {issue.contributionType && <span className="tag">{issue.contributionType}</span>}
                {issue.difficulty && <span className="pill g">난이도 {issue.difficulty}</span>}
                {issue.estimatedScope && <span className="pill b">{issue.estimatedScope}</span>}
              </div>
              {issue.currentProblem && (
                <p className="muted" style={{ fontSize: 12, margin: 0 }}>
                  지금 문제: {issue.currentProblem}
                </p>
              )}
              {issue.completionCriteria && (
                <p className="muted" style={{ fontSize: 12, margin: 0 }}>
                  완료 기준: {issue.completionCriteria}
                </p>
              )}
            </div>
            <button type="button" className="btn p" onClick={() => setSelectedIssueId(issue.issueId)}>
              이 이슈 선택
            </button>
          </div>
        ))}
      </div>

      <div
        className="card"
        style={{ display: 'flex', position: 'sticky', bottom: 14, alignItems: 'center', gap: 14, marginTop: 20 }}
      >
        <div style={{ flex: 1, fontSize: 13 }}>
          선택 — 레포: <b>{repositoryName}</b> · 이슈: <b>{selectedIssue?.title ?? '—'}</b>
        </div>
        <button type="button" className="btn p lg" disabled={!selectedIssue || starting} onClick={handleStart}>
          {starting ? '시작하는 중…' : '다음 단계로 (기여 시작) →'}
        </button>
      </div>
    </section>
  )
}
