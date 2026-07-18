import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useJourney } from '../../app/JourneyContext'

const CLOSE_REASONS = ['Technical', 'Duplicate', 'Scope', 'No response', 'Unknown']

/**
 * SCR015 결과 — "Merge 또는 Closed 결과와 학습 요약" (기획서 표19, BR11/BR14).
 * Phase 6: PR을 실제로 등록했다면(JourneyContext.pullRequest) 방금 1회 조회한 진짜 상태로
 * 화면을 결정한다 — MERGED/CLOSED_UNMERGED/OPEN/UNKNOWN 4가지 실제 케이스를 전부 다룬다.
 * 실제 GitHub API는 "왜 닫혔는지" 구조화된 사유를 안 주므로, Closed일 때 사유는 BR11대로
 * 항상 Unknown으로 표시한다(추정하지 않음). PR을 등록하지 않고 이 화면에 바로 왔다면(데모/
 * 리뷰 목적) 기존 데모 탭으로 두 결과를 모두 볼 수 있게 유지한다.
 */
export function ResultPage() {
  const { pullRequest } = useJourney()
  const [demoOutcome, setDemoOutcome] = useState<'merged' | 'closed'>('merged')

  if (pullRequest) {
    const { state } = pullRequest.status
    if (state === 'MERGED') return <MergedView />
    if (state === 'CLOSED_UNMERGED') return <ClosedView reason="Unknown" />
    if (state === 'OPEN') return <OpenView prUrl={pullRequest.link.prUrl} />
    return <UnknownView prUrl={pullRequest.link.prUrl} />
  }

  return (
    <>
      <div className="row" style={{ marginBottom: 12 }}>
        <button type="button" className={demoOutcome === 'merged' ? 'tab on' : 'tab'} onClick={() => setDemoOutcome('merged')}>
          데모: 머지됨
        </button>
        <button type="button" className={demoOutcome === 'closed' ? 'tab on' : 'tab'} onClick={() => setDemoOutcome('closed')}>
          데모: 머지 안 됨
        </button>
      </div>
      {demoOutcome === 'merged' ? <MergedView /> : <ClosedView reason="Scope" demo />}
    </>
  )
}

function MergedView() {
  return (
    <>
      <div className="hero" style={{ padding: 32 }}>
        <h1>축하해요, 머지됐어요! 🎉</h1>
        <p>첫 오픈소스 기여가 반영됐어요.</p>
      </div>
      <div className="grid g2" style={{ marginTop: 18 }}>
        <div className="card">
          <div className="eyebrow">이번에 자란 역량 (사고 흔적 기반)</div>
          <div className="axis">
            <div className="t">
              <span>문제 이해</span>
              <span className="muted">향상</span>
            </div>
            <div className="meter">
              <i style={{ width: '60%' }} />
            </div>
          </div>
          <div className="axis">
            <div className="t">
              <span>코드 탐색</span>
              <span className="muted">향상</span>
            </div>
            <div className="meter">
              <i style={{ width: '45%' }} />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="eyebrow">다음 도전</div>
          <p className="muted" style={{ marginTop: 10 }}>이번 기여는 나의 기여 History에 저장됐어요.</p>
          <Link to="/recommend/repositories" className="btn p full lg" style={{ marginTop: 10 }}>
            더 깊은 미션 도전 →
          </Link>
          <Link to="/contributions" className="btn full" style={{ marginTop: 8 }}>
            나의 기여 기록 보기
          </Link>
        </div>
      </div>
    </>
  )
}

function ClosedView({ reason, demo }: { reason: string; demo?: boolean }) {
  return (
    <>
      <h1>이번엔 머지되지 않았어요</h1>
      <p className="lede">괜찮아요. 왜 그런지 함께 보고 다음엔 반영될 확률을 높여요.</p>
      <div className="card">
        <div className="eyebrow">Closed 사유</div>
        <div className="row" style={{ marginBottom: 12 }}>
          {CLOSE_REASONS.map((r) => (
            <span key={r} className={r === reason ? 'pill' : 'pill g'}>
              {r}
            </span>
          ))}
        </div>
        <p className="muted" style={{ fontSize: 12, margin: '0 0 12px' }}>
          {demo
            ? '공개 데이터만으로 사유가 불명확하면 Unknown으로 저장해요 (BR11) — 머지 확률을 단정해서 보여주진 않아요 (BR14).'
            : 'GitHub 공개 API는 Closed 사유를 구조화해서 주지 않아서 Unknown으로 저장했어요 (BR11) — 정확한 사유 분류는 Review 코멘트 분석과 함께 추후 확장 범위예요.'}
        </p>
        <Link to="/journey/coach" className="btn p">
          보완해서 다시 요청하기 →
        </Link>{' '}
        <Link to="/recommend/repositories" className="btn">
          비슷한 다른 이슈 찾기
        </Link>
      </div>
    </>
  )
}

function OpenView({ prUrl }: { prUrl: string }) {
  return (
    <>
      <h1>PR이 아직 열려 있어요</h1>
      <p className="lede">
        메인테이너 리뷰를 기다리는 중이에요. 이번 프로토타입은 등록 직후 1회만 상태를
        확인해요(F017 MVP 범위) — 나중에 다시 확인하려면 GitHub에서 직접 봐주세요.
      </p>
      <div className="card">
        <div className="callout b">⏳ 아직 Open 상태예요. 머지 확률은 표시하지 않아요 (BR14).</div>
        <a href={prUrl} target="_blank" rel="noreferrer" className="btn p" style={{ marginTop: 12 }}>
          GitHub에서 PR 확인하기 ↗
        </a>{' '}
        <Link to="/contributions" className="btn">
          나의 기여 기록 보기
        </Link>
      </div>
    </>
  )
}

function UnknownView({ prUrl }: { prUrl: string }) {
  return (
    <>
      <h1>상태를 확인하지 못했어요</h1>
      <p className="lede">GitHub 응답을 받지 못했어요 (Rate Limit이거나 존재하지 않는 PR일 수 있어요).</p>
      <div className="card">
        <a href={prUrl} target="_blank" rel="noreferrer" className="btn p">
          GitHub에서 직접 확인하기 ↗
        </a>
      </div>
    </>
  )
}
