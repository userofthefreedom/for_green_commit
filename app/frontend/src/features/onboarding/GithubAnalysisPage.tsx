import { Link } from 'react-router-dom'

/**
 * SCR003 GitHub 분석 — "공개 활동·언어·PR·분석 신뢰도" (기획서 표19).
 * v3 prototype의 #analyze 화면 카피를 이관했다. BR02: 공개 활동 분석과 자기 진단은
 * 분리 표시하며, GitHub 데이터만으로 실력을 단정하지 않는다 — 아래 "분석 신뢰도" +
 * 다음 화면(추가 프로필)의 자기 진단으로 그 원칙을 반영한다.
 */
export function GithubAnalysisPage() {
  return (
    <section>
      <h1>이렇게 분석했어요</h1>
      <p className="lede">공개 활동을 바탕으로 프로필을 만들었어요. 맞지 않으면 다음 단계에서 고칠 수 있어요.</p>
      <div className="grid g2">
        <div className="card">
          <div className="eyebrow">주로 쓰는 언어</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0' }}>
            <span style={{ width: 90 }}>JavaScript</span>
            <div className="meter" style={{ flex: 1 }}>
              <i style={{ width: '70%' }} />
            </div>
            <b>70%</b>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '8px 0' }}>
            <span style={{ width: 90 }}>Python</span>
            <div className="meter" style={{ flex: 1 }}>
              <i style={{ width: '20%' }} />
            </div>
            <b>20%</b>
          </div>
          <div className="eyebrow" style={{ marginTop: 16 }}>
            활동 요약
          </div>
          <div className="grid g3">
            <div className="card center" style={{ boxShadow: 'none' }}>
              <div className="big">12</div>
              <span className="muted">저장소</span>
            </div>
            <div className="card center" style={{ boxShadow: 'none' }}>
              <div className="big">3</div>
              <span className="muted">공개 PR</span>
            </div>
            <div className="card center" style={{ boxShadow: 'none' }}>
              <div className="big">240</div>
              <span className="muted">커밋</span>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="eyebrow">분석 신뢰도</div>
          <div className="meter" style={{ height: 12, margin: '8px 0' }}>
            <i style={{ width: '55%' }} />
          </div>
          <p className="muted">보통 — 다음 단계에서 몇 가지만 알려주세요.</p>
          <Link to="/onboarding/profile" className="btn p full lg" style={{ marginTop: 16 }}>
            내 정보 보정하기 →
          </Link>
        </div>
      </div>
    </section>
  )
}
