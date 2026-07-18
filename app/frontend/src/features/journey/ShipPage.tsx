import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJourney } from '../../app/JourneyContext'

/**
 * SCR013 Commit·PR — "IDE 실행·Commit·Push·PR 템플릿·체크포인트" (기획서 표19, F014/F015/F016).
 * Phase 6: "PR 등록 완료" 입력란이 실제 PR URL을 받아 POST /pull-requests로 등록하고,
 * 곧바로 F017 MVP 슬라이스(등록 직후 1회 상태 조회)까지 수행한 뒤 Monitoring으로 이동한다.
 * 실제 GitHub의 공개 PR을 넣으면(예: 이 저장소 자신의 PR) 진짜 상태가 조회된다.
 */
export function ShipPage() {
  const navigate = useNavigate()
  const { journey, updateStep, registerPullRequest } = useJourney()
  const [ideOpened, setIdeOpened] = useState(false)
  const [prUrl, setPrUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleRegister() {
    setError(null)
    setSubmitting(true)
    try {
      await registerPullRequest(prUrl)
      if (journey) {
        await updateStep('COMMIT_PUSH', { action: 'COMPLETE' })
        await updateStep('PR', { action: 'COMPLETE' })
      }
      navigate('/journey/monitoring')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'PR 등록에 실패했어요. 주소를 확인해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

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
        <div className="eyebrow">✅ PR을 열었다면, 주소를 알려주세요</div>
        <p className="muted" style={{ fontSize: 12, margin: '0 0 10px' }}>
          형식: https://github.com/{'{owner}'}/{'{repo}'}/pull/{'{번호}'} — 등록하면 바로 실제 상태를
          1회 조회해요 (F017 MVP 범위).
        </p>
        <input
          className="line"
          placeholder="https://github.com/octocat/Hello-World/pull/1"
          value={prUrl}
          onChange={(e) => setPrUrl(e.target.value)}
        />
        {error && (
          <p className="muted" style={{ color: 'var(--amber, #b7791f)', marginTop: 8 }}>
            {error}
          </p>
        )}
        <button
          type="button"
          className="btn p"
          style={{ marginTop: 12 }}
          onClick={handleRegister}
          disabled={submitting || !prUrl.trim()}
        >
          {submitting ? '등록 중…' : 'PR 등록 완료 · 상태 확인하러 가기 →'}
        </button>
      </div>
    </>
  )
}
