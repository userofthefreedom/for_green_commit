import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/AuthContext'
import { useJourney } from '../../app/JourneyContext'
import { postAutomationFork } from '../../lib/api/endpoints'

/**
 * SCR009 Fork — "수동/자동/스킵" (기획서 표19, F009, BR06/BR07).
 * Phase 5: "이 단계 자동화하기"가 실제로 POST /automations/fork를 호출한다(프로토타입 범위라
 * 서버는 실제 GitHub API 대신 성공을 시뮬레이션 — AutomationService 주석 참고). 자동화 실패는
 * 백엔드가 실제로 만들어내지 않으므로, BR07이 요구하는 "실패 시 수동 Fallback 즉시 제공"을
 * 보여주기 위한 데모 버튼을 별도로 둔다(클라이언트에서만 실패를 흉내낸다).
 */
export function ForkPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { journey, meta, updateStep } = useJourney()
  const [autoState, setAutoState] = useState<'idle' | 'success' | 'failed'>('idle')
  const [forkedUrl, setForkedUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleAutomate() {
    if (!user || !meta) return
    setBusy(true)
    try {
      const result = await postAutomationFork({
        userId: user.id,
        sessionId: journey?.sessionId,
        repositoryId: meta.repositoryId,
      })
      setForkedUrl(result.forkedRepoUrl)
      setAutoState('success')
    } catch {
      setAutoState('failed')
    } finally {
      setBusy(false)
    }
  }

  async function goNext(action: 'COMPLETE' | 'SKIP') {
    if (journey) await updateStep('FORK', { action })
    navigate('/journey/clone')
  }

  return (
    <>
      <h1>Fork · 내 계정으로 복사</h1>
      <p className="lede">원본을 직접 바꾸지 않고, 내 복사본에서 안전하게 작업해요.</p>
      <div className="card">
        <div className="eyebrow">GitHub로 가서 Fork</div>
        <p>
          GitHub 저장소 우측 상단 <b>Fork</b> 버튼을 누르면 내 계정으로 복사본이 생겨요.
        </p>
        <div className="stepfoot">
          <button type="button" className="btn sm" onClick={() => void goNext('SKIP')}>
            이 단계 건너뛰기 (다음부터 숨김)
          </button>
          <button type="button" className="btn auto" onClick={handleAutomate} disabled={busy || !meta}>
            ⚡ 이 단계 자동화하기
          </button>
          <button type="button" className="btn p" style={{ marginLeft: 'auto' }} onClick={() => void goNext('COMPLETE')}>
            GitHub에서 Fork하고 다음 ↗
          </button>
        </div>

        {autoState === 'success' && (
          <div className="autoresult" style={{ marginTop: 12 }}>
            <div className="callout b">
              ⚡ API로 자동 실행했어요 — {forkedUrl}. (프로토타입: 실제 GitHub API 대신 성공을
              시뮬레이션합니다)
            </div>
            <button type="button" className="btn p full" style={{ marginTop: 10 }} onClick={() => void goNext('COMPLETE')}>
              다음 단계로 →
            </button>
          </div>
        )}

        <div className="note" style={{ marginTop: 14 }}>
          데모용:{' '}
          <button type="button" className="btn sm" onClick={() => setAutoState('failed')}>
            자동화 실패 시나리오 보기
          </button>
        </div>
        {autoState === 'failed' && (
          <div className="callout a" style={{ marginTop: 10 }}>
            ⚠️ 자동 Fork에 실패했어요 (권한 만료 등). 대신 GitHub에서 직접 Fork해 주세요 — 우측
            상단 <b>Fork</b> 버튼, 또는{' '}
            <a href="https://github.com" target="_blank" rel="noreferrer">
              저장소 링크 바로 열기 ↗
            </a>
            . (BR07 — Clone과 마찬가지로 무단 로컬/원격 실행 대신 항상 수동 Fallback을 함께
            보여줘요.)
          </div>
        )}
      </div>
    </>
  )
}
