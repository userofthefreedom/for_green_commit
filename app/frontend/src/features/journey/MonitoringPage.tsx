import { Link } from 'react-router-dom'

/**
 * SCR014 PR Monitoring (신규 화면) — "상태·리뷰·CI·다음 행동" (기획서 표19).
 *
 * 이전 프로토타입(v3)에는 없던 화면이다. PR을 등록한 뒤 사용자가 연결한 PR의
 * Review/CI/Merge/Closed 상태를 추적하는 "지도" 화면이다 (PullRequestLink /
 * PRStatusSnapshot / ReviewEvent / PollingJob 엔티티, prtracking 도메인).
 *
 * F017 "PR 상태 Monitoring"은 기획서 표21에서 "필수 확장"(08.06 범위)으로 분류돼
 * 있다 — 이번 라운드(PRD.md 2026-07-18 범위 조정)는 MVP(F001~F016)까지만 실제
 * 로직을 구현하므로, 이 화면은 라우트/컴포넌트만 존재하는 뼈대다. 주기적 폴링,
 * Review 코멘트 요약, Closed 사유 5분류(Technical/Duplicate/Scope/No response/
 * Unknown, BR11) 같은 실제 동작은 팀 확인 후 MVP 이후 구현 예정이다. MVP 범위인
 * "PR 등록 직후 1회 상태 조회"는 SCR013(Commit·PR)에서 POST /pull-requests 호출
 * 시점에 이미 이뤄지고, 이 화면은 그 결과를 보여주는 자리다.
 */
export function MonitoringPage() {
  return (
    <>
      <h1>PR Monitoring</h1>
      <p className="lede">등록한 PR의 상태를 여기서 추적해요. (현재는 자리표시자 화면)</p>

      <div className="card">
        <div className="eyebrow">연결된 PR 없음</div>
        <p className="muted" style={{ fontSize: 13 }}>
          아직 이 Journey에 연결된 PR이 없어요. SCR013 Commit·PR 단계에서 PR을 등록하면 여기에
          상태가 나타나요. (SPEC.md 예외 상황: PR Poller 대상 PR 없음 → "연결된 PR 없음" 상태)
        </p>
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
        <div className="check">
          <span className="cb">·</span>사용자가 연결한 PR만 추적 (BR10)
        </div>
        <div className="callout a" style={{ marginTop: 10 }}>
          MVP는 PR 등록 직후 1회 상태 조회까지만 실제로 동작해요. 주기적 추적은 08.06 범위(F017)로
          팀 확인 후 구현할 예정이에요.
        </div>
      </div>

      <div className="center" style={{ marginTop: 22 }}>
        <Link to="/journey/result" className="btn p lg">
          데모: 결과 화면 보기 →
        </Link>
      </div>
    </>
  )
}
