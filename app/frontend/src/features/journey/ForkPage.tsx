import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * SCR009 Fork — "수동/자동/스킵" (기획서 표19).
 * v3 prototype #fork 화면을 이관했다. 자동화 실패 시 수동 명령/링크 Fallback을 같은
 * 화면에 즉시 제공해야 한다는 SPEC.md 예외 상황(BR07)을 반영해, 자동화 실패 데모
 * 버튼과 Fallback 카드를 추가했다 — 실제 GitHub API 자동화(POST /automations/fork)는
 * Phase 2+에서 연결한다.
 */
export function ForkPage() {
  const navigate = useNavigate()
  const [autoState, setAutoState] = useState<'idle' | 'success' | 'failed'>('idle')

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
          <button type="button" className="btn sm">
            이 단계 건너뛰기 (다음부터 숨김)
          </button>
          <button type="button" className="btn auto" onClick={() => setAutoState('success')}>
            ⚡ 이 단계 자동화하기
          </button>
          <button type="button" className="btn p" style={{ marginLeft: 'auto' }} onClick={() => navigate('/journey/clone')}>
            GitHub에서 Fork하고 다음 ↗
          </button>
        </div>

        {autoState === 'success' && (
          <div className="autoresult" style={{ marginTop: 12 }}>
            <div className="callout b">
              ⚡ API로 자동 실행했어요 — 가입 때 받은 GitHub 토큰으로 내 계정에 Fork 완료. (별도
              로그인 불필요)
            </div>
            <button type="button" className="btn p full" style={{ marginTop: 10 }} onClick={() => navigate('/journey/clone')}>
              다음 단계로 →
            </button>
          </div>
        )}

        <div className="note" style={{ marginTop: 14 }}>
          데모용: <button type="button" className="btn sm" onClick={() => setAutoState('failed')}>자동화 실패 시나리오 보기</button>
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
