import { useState } from 'react'
import { Link } from 'react-router-dom'

const CLOSE_REASONS = ['Technical', 'Duplicate', 'Scope', 'No response', 'Unknown']

/**
 * SCR015 결과 — "Merge 또는 Closed 결과와 학습 요약" (기획서 표19).
 * v3 prototype의 #success/#fail 두 화면을 하나로 합쳤다 (BR11: MERGED와
 * CLOSED_UNMERGED를 구분하며 사유가 불명확하면 UNKNOWN으로 저장). 데모용 탭으로
 * 두 결과를 모두 볼 수 있게 했고, "Closed 사유 5분류" 갭을 반영해 Technical /
 * Duplicate / Scope / No response / Unknown 분류를 노출한다.
 */
export function ResultPage() {
  const [outcome, setOutcome] = useState<'merged' | 'closed'>('merged')

  return (
    <>
      <div className="row" style={{ marginBottom: 12 }}>
        <button type="button" className={outcome === 'merged' ? 'tab on' : 'tab'} onClick={() => setOutcome('merged')}>
          데모: 머지됨
        </button>
        <button type="button" className={outcome === 'closed' ? 'tab on' : 'tab'} onClick={() => setOutcome('closed')}>
          데모: 머지 안 됨
        </button>
      </div>

      {outcome === 'merged' ? (
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
              <div className="rec" style={{ background: '#fff' }}>
                <span className="pill b">코치 4단계</span>
                <b style={{ display: 'block', marginTop: 6 }}>tooltip 추가 (frontend)</b>
                <div className="muted" style={{ fontSize: 12, margin: '4px 0' }}>
                  여러 파일·여러 대안이 있는 이슈
                </div>
              </div>
              <p className="muted" style={{ marginTop: 10 }}>이번엔 건너뛴 단계는 자동으로 빠지고, 코치는 더 깊게 켜져요.</p>
              <Link to="/recommend/repositories" className="btn p full lg" style={{ marginTop: 10 }}>
                더 깊은 미션 도전 →
              </Link>
              <Link to="/contributions" className="btn full" style={{ marginTop: 8 }}>
                나의 기여 기록 보기
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1>이번엔 머지되지 않았어요</h1>
          <p className="lede">괜찮아요. 왜 그런지 함께 보고 다음엔 반영될 확률을 높여요.</p>
          <div className="card">
            <div className="eyebrow">Closed 사유</div>
            <div className="row" style={{ marginBottom: 12 }}>
              {CLOSE_REASONS.map((reason) => (
                <span key={reason} className={reason === 'Scope' ? 'pill' : 'pill g'}>
                  {reason}
                </span>
              ))}
            </div>
            <p className="muted" style={{ fontSize: 12, margin: '0 0 12px' }}>
              공개 데이터만으로 사유가 불명확하면 Unknown으로 저장해요 (BR11) — 머지 확률을 단정해서
              보여주진 않아요 (BR14).
            </p>
            <div className="card" style={{ boxShadow: 'none', marginBottom: 10 }}>
              <span className="pill a">변경 요청 (Scope)</span>
              <p style={{ margin: '8px 0 4px' }}>"수정은 맞지만 같은 문제가 다른 파일에도 있어요. 함께 고쳐주세요."</p>
              <b style={{ color: 'var(--green-d)' }}>→ 동일 부분을 전수 검색해 함께 수정 후 재요청</b>
            </div>
            <Link to="/journey/coach" className="btn p">
              보완해서 다시 요청하기 →
            </Link>{' '}
            <Link to="/recommend/repositories" className="btn">
              비슷한 다른 이슈 찾기
            </Link>
          </div>
        </>
      )}
    </>
  )
}
