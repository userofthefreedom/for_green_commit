import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * SCR013 Commit·PR — "IDE 실행·Commit·Push·PR 템플릿·체크포인트" (기획서 표19).
 * v3 prototype #ship 화면을 이관했다. v3에서는 이 화면에서 바로 성공/실패 데모로
 * 건너뛰었지만, 실제 흐름은 "PR URL/번호 등록 → Monitoring 상태로 전환"이므로
 * (SPEC.md 6절) 여기서는 SCR014 PR Monitoring으로 이동한다.
 */
export function ShipPage() {
  const navigate = useNavigate()
  const [ideOpened, setIdeOpened] = useState(false)

  return (
    <>
      <h1>이제 커밋하고 PR로 반영 요청해요</h1>
      <p className="lede">학습한 대로 IDE에서 직접 고치고, 아래 안내대로 커밋 → PR 하면 첫 기여 완료예요.</p>
      <div className="grid g2">
        <div className="card">
          <div className="eyebrow">1. 커밋 (변경 기록)</div>
          <div className="code">{'git checkout -b fix/short-description\ngit commit -am "Fix ..."\ngit push origin HEAD'}</div>
          <div className="callout g" style={{ marginTop: 10 }}>
            좋은 메시지: <b>Fix typo in instructor help page</b> · 피할 것: update, fix, asdf
          </div>
        </div>
        <div className="card">
          <div className="eyebrow">2. Pull Request (반영 요청)</div>
          <div className="card" style={{ boxShadow: 'none', background: '#fafbfa', whiteSpace: 'pre-line', fontSize: 13, color: 'var(--muted)' }}>
            {'What: (무엇을 바꿨는지)\nWhy: (왜 필요한지)\nHow tested: (어떻게 확인했는지)\nFixes #(이슈 번호)'}
          </div>
          <p className="note">'Fixes #번호'를 넣으면 머지 시 이슈가 자동으로 닫혀요.</p>
        </div>
      </div>

      <div className="card center" style={{ marginTop: 18 }}>
        <b>지금 바로 IDE에서 실습해볼까요?</b>
        <p className="muted" style={{ fontSize: 13, margin: '6px 0 12px' }}>
          방금 학습한 접근대로 코드를 고치고, 위 명령으로 커밋·PR 해보세요.
        </p>
        <button type="button" className="btn p lg" onClick={() => setIdeOpened(true)}>
          💻 바로 실습하기 (IDE 열기) ↗
        </button>
        {ideOpened && (
          <div className="autoresult" style={{ marginTop: 12, textAlign: 'left' }}>
            <div className="callout g">💻 IDE를 열었어요 — 학습한 대로 수정하고 커밋·PR 하세요. 다 되면 아래에서 알려주세요.</div>
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="eyebrow">✅ 다 했나요? (체크포인트)</div>
        <div className="check">
          <span className="cb on">✓</span>학습한 대로 코드를 수정했다
        </div>
        <div className="check">
          <span className="cb on">✓</span>커밋하고 push 했다
        </div>
        <div className="check">
          <span className="cb on">✓</span>GitHub에서 PR을 열었다
        </div>
        <button type="button" className="btn p" style={{ marginTop: 12 }} onClick={() => navigate('/journey/monitoring')}>
          PR 등록 완료 · 상태 확인하러 가기 →
        </button>
      </div>
    </>
  )
}
