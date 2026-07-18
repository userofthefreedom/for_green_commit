import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

interface IssueCard {
  id: string
  number: string
  title: string
  fitScore: number
  labels: string[]
  difficulty: string
  scope: string
  doneCriteria: string
  best?: boolean
}

// Phase 1 placeholder — 실제로는 GET /repositories/{id}/issues(표37)로 채워진다.
// "카드 세부속성" 갭 해소: 난이도·범위·완료 기준을 카드에 노출한다 (SCR007 핵심 목적).
const MOCK_ISSUES: IssueCard[] = [
  {
    id: 'typo',
    number: '#12603',
    title: 'Typo in instructor help page',
    fitScore: 94,
    labels: ['good first issue', 'docs'],
    difficulty: '쉬움',
    scope: '파일 1개 · 국소 변경',
    doneCriteria: '오타 수정 · 프론트 빌드 통과',
    best: true,
  },
  {
    id: 'tooltip',
    number: '#12811',
    title: 'Add tooltip to feedback session card',
    fitScore: 76,
    labels: ['good first issue', 'frontend'],
    difficulty: '보통',
    scope: '파일 2~3개 · 여러 대안 존재',
    doneCriteria: '툴팁 노출 · 접근성 속성 포함 · 스냅샷 테스트 통과',
  },
]

/**
 * SCR007 Issue 선택 — "Issue 설명·완료 기준·난이도·범위" (기획서 표19).
 * v3 prototype #recommend 화면의 2단계(이슈 선택 + 하단 select-bar)를 분리 이관했다.
 * 선택을 확정하면 SCR008 Journey 개요로 이동한다.
 */
export function IssueSelectionPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const repositoryName = searchParams.get('repositoryName') ?? '레포 미선택'
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null)

  const selectedIssue = MOCK_ISSUES.find((issue) => issue.id === selectedIssueId)

  return (
    <section>
      <h1>미션 찾기 — 이슈 선택</h1>
      <p className="lede">
        2. <b>{repositoryName}</b>의 Issue 후보예요. 완료 기준·난이도를 보고 하나를 골라보세요.
      </p>

      <div>
        {MOCK_ISSUES.map((issue) => (
          <div key={issue.id} className={issue.id === selectedIssueId ? 'issue best' : 'issue'}>
            <div style={{ flex: 1 }}>
              <div className="row" style={{ alignItems: 'center' }}>
                <b>{issue.title}</b>
                <span className="muted" style={{ fontSize: 12 }}>
                  {issue.number}
                </span>
                <span className="pill">적합도 {issue.fitScore}</span>
              </div>
              <div style={{ margin: '6px 0' }}>
                {issue.labels.map((label) => (
                  <span key={label} className="tag">
                    {label}
                  </span>
                ))}
                <span className="pill g">난이도 {issue.difficulty}</span>
                <span className="pill b">{issue.scope}</span>
              </div>
              <p className="muted" style={{ fontSize: 12, margin: 0 }}>
                완료 기준: {issue.doneCriteria}
              </p>
            </div>
            <button type="button" className="btn p" onClick={() => setSelectedIssueId(issue.id)}>
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
        <button
          type="button"
          className="btn p lg"
          disabled={!selectedIssue}
          onClick={() => navigate('/journey/overview')}
        >
          다음 단계로 (기여 시작) →
        </button>
      </div>
    </section>
  )
}
