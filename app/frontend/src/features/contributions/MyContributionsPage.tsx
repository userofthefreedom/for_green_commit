import { useState } from 'react'
import { Link } from 'react-router-dom'

const COMMENT_TABS = ['전체', '변경요청', '질문', '칭찬']

/**
 * SCR017 나의 기여 — "History·칭찬·성장 흔적·다음 Mission" (기획서 표19).
 * v3 prototype #my 화면(머지 배지, 코멘트 모아보기, 사고 역량 지도)을 이관했다.
 * 실제 데이터는 GET /history(표37) + ContributionHistory/GrowthEvidence 엔티티로
 * 채워지지만, F023(최소 게임화)은 표21 "선택" 우선순위라 지금은 placeholder다.
 */
export function MyContributionsPage() {
  const [filter, setFilter] = useState('전체')

  return (
    <section>
      <h1>나의 기여</h1>
      <p className="lede">받은 코멘트, 머지 배지, 스스로 생각한 흔적을 한곳에서 봐요.</p>

      <div className="card">
        <div className="eyebrow">
          머지 배지 <span className="muted" style={{ textTransform: 'none', fontWeight: 400 }}>· 참여한 레포에서 머지된 횟수로 자라요</span>
        </div>
        <div className="row" style={{ margin: '4px 0 12px' }}>
          {['🌱', '🌿', '🌳', '🏆'].map((icon, i) => (
            <span key={icon} className="badge">
              <span className={i < 1 ? 'bmed' : 'bmed off'}>{icon}</span>
              <span className="muted" style={{ fontSize: 11 }}>Lv.{i + 1}</span>
            </span>
          ))}
        </div>
        <div className="callout g">머지 1건 달성 — 다음 배지까지 머지 2건 더 필요해요.</div>
      </div>

      <div className="grid g2" style={{ marginTop: 18 }}>
        <div className="card">
          <div className="eyebrow">
            코멘트 모아보기 <span className="muted" style={{ textTransform: 'none', fontWeight: 400 }}>· 내가 참여한 이슈만</span>
          </div>
          <div className="tabs">
            {COMMENT_TABS.map((tab) => (
              <button key={tab} type="button" className={filter === tab ? 'tab on' : 'tab'} onClick={() => setFilter(tab)}>
                {tab}
              </button>
            ))}
          </div>
          <div className="cmt">
            <div className="who">
              <span className="mav">M</span>maintainer · #12603 · <span className="tp praise">칭찬</span>
            </div>
            <div>"깔끔한 첫 기여네요, 고마워요!"</div>
          </div>
          <p className="note">필터: {filter}</p>
        </div>
        <div>
          <div className="card praisecard">
            <div className="eyebrow">받은 칭찬 모아보기 💚</div>
            <p className="muted" style={{ fontSize: 12, margin: '0 0 10px' }}>힘 빠질 때 다시 꺼내 봐요.</p>
            <div className="cmt">"깔끔한 첫 기여네요, 고마워요!"</div>
          </div>
          <div className="card" style={{ marginTop: 18 }}>
            <div className="eyebrow">
              사고 역량 지도 <span className="muted" style={{ textTransform: 'none', fontWeight: 400 }}>· 스스로 답한 근거로만 자라요</span>
            </div>
            <div className="axis">
              <div className="t">
                <span>문제 이해</span>
                <span className="muted">보통</span>
              </div>
              <div className="meter">
                <i style={{ width: '60%' }} />
              </div>
            </div>
            <div className="axis">
              <div className="t">
                <span>코드 탐색</span>
                <span className="muted">보통</span>
              </div>
              <div className="meter">
                <i style={{ width: '45%' }} />
              </div>
            </div>
            <div className="axis">
              <div className="t">
                <span>메타인지</span>
                <span className="muted">보통</span>
              </div>
              <div className="meter">
                <i style={{ width: '50%' }} />
              </div>
            </div>
            <Link to="/recommend/repositories" className="btn p full lg" style={{ marginTop: 14 }}>
              다음 미션 찾기 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
