import { useNavigate } from 'react-router-dom'
import { useJourney } from '../../app/JourneyContext'

const STATE_COPY: Record<string, { label: string; tone: 'g' | 'a' | 'b' }> = {
  MERGED: { label: '✅ Merged — 반영됐어요!', tone: 'g' },
  CLOSED_UNMERGED: { label: '⚠️ Closed (머지되지 않음)', tone: 'a' },
  OPEN: { label: '⏳ 아직 열려 있어요 (Open)', tone: 'b' },
  UNKNOWN: { label: '❔ 상태를 확인하지 못했어요', tone: 'a' },
}

/**
 * SCR014 PR Monitoring (신규 화면) — "상태·리뷰·CI·다음 행동" (기획서 표19).
 *
 * F017 "PR 상태 Monitoring"은 표21에서 "필수 확장"(08.06 범위)이라, 주기적 폴링·Review 코멘트
 * 요약·PollingJob 스케줄러 등은 이번 라운드에서 만들지 않는다(PRD.md 2026-07-18 범위 조정).
 * 다만 MVP 슬라이스인 "PR 등록 직후 1회 상태 조회"는 SCR013에서 이미 실행됐으므로, 이 화면은
 * JourneyContext에 저장된 그 결과를 보여준다 — 실제 GitHub 공개 API로 조회한 진짜 상태다.
 */
export function MonitoringPage() {
  const navigate = useNavigate()
  const { journey, pullRequest, updateStep } = useJourney()

  async function goToResult() {
    if (journey) await updateStep('MONITORING', { action: 'COMPLETE' })
    navigate('/journey/result')
  }

  if (!pullRequest) {
    return (
      <>
        <h1>PR Monitoring</h1>
        <p className="lede">등록한 PR의 상태를 여기서 확인해요.</p>
        <div className="card">
          <div className="eyebrow">연결된 PR 없음</div>
          <p className="muted" style={{ fontSize: 13 }}>
            아직 이 Journey에 연결된 PR이 없어요. SCR013 Commit·PR 단계에서 PR을 등록하면 여기에
            상태가 나타나요.
          </p>
        </div>
      </>
    )
  }

  const copy = STATE_COPY[pullRequest.status.state] ?? STATE_COPY.UNKNOWN

  return (
    <>
      <h1>PR Monitoring</h1>
      <p className="lede">
        <b>
          {pullRequest.link.repoOwner}/{pullRequest.link.repoName}#{pullRequest.link.prNumber}
        </b>
        의 실제 상태를 방금 1회 조회했어요.
      </p>

      <div className="card">
        <div className={`callout ${copy.tone}`}>{copy.label}</div>
        {pullRequest.status.title && (
          <p style={{ margin: '10px 0 0' }}>
            <b>{pullRequest.status.title}</b>
          </p>
        )}
        <p className="muted" style={{ fontSize: 12, margin: '8px 0 0' }}>
          조회 시각: {new Date(pullRequest.status.checkedAt).toLocaleString('ko-KR')} · 출처:{' '}
          {pullRequest.status.source}
        </p>
        <a href={pullRequest.link.prUrl} target="_blank" rel="noreferrer" className="note">
          GitHub에서 PR 원문 보기 ↗
        </a>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="eyebrow">이 화면이 나중에 보여줄 것 (F017, 필수 확장)</div>
        <div className="check">
          <span className="cb">·</span>Review / CI / Merge / Closed 상태를 Polling·Webhook으로 주기 추적
        </div>
        <div className="check">
          <span className="cb">·</span>새 Review 코멘트를 AI가 요약 (원문과 대응 행동 분리)
        </div>
        <div className="check">
          <span className="cb">·</span>Closed 시 사유를 Technical / Duplicate / Scope / No response / Unknown 5분류로 저장 (BR11)
        </div>
        <div className="callout a" style={{ marginTop: 10 }}>
          지금은 등록 직후 1회 조회까지만 실제로 동작해요. 주기적 추적은 08.06 범위(F017)로 팀
          확인 후 구현할 예정이에요.
        </div>
      </div>

      <div className="center" style={{ marginTop: 22 }}>
        <button type="button" className="btn p lg" onClick={() => void goToResult()}>
          결과 화면 보기 →
        </button>
      </div>
    </>
  )
}
