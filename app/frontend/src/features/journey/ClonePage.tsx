import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CLONE_COMMAND = 'git clone https://github.com/jiyeong/teammates.git'

/**
 * SCR010 Clone·IDE Handoff — "명령 복사·IDE Clone/열기·Fallback" (기획서 표19, BR07).
 * v3 prototype #clone 화면을 이관했다. 이 단계는 로컬 명령을 대신 실행하지 않고 —
 * 명령 복사 + 지원 IDE의 Clone/열기 Deep Link 호출만 한다는 BR07을 그대로 반영한다.
 */
export function ClonePage() {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [ideOpened, setIdeOpened] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(CLONE_COMMAND)
    } catch {
      // 클립보드 권한이 없어도 명령 텍스트는 화면에 그대로 보인다.
    }
    setCopied(true)
  }

  return (
    <>
      <h1>클론 · 내 컴퓨터로 가져오기</h1>
      <p className="lede">이 단계는 자동화하지 않아요. 아래 명령을 복사해 직접 내려받고, IDE로 열어요.</p>
      <div className="card">
        <div className="eyebrow">1. 이 명령을 복사해 터미널에 붙여넣기</div>
        <div className="code">{CLONE_COMMAND}</div>
        <div className="row" style={{ marginTop: 10 }}>
          <button type="button" className="btn auto" onClick={handleCopy}>
            📋 git 명령 복사{copied ? '됨' : ''}
          </button>
          <button type="button" className="btn" onClick={() => setIdeOpened(true)}>
            💻 IDE에서 열기 ↗
          </button>
        </div>
        {ideOpened && (
          <div className="autoresult" style={{ marginTop: 12 }}>
            <div className="callout g">💻 IDE(VS Code)를 열었어요 — 방금 클론한 폴더를 확인하세요.</div>
          </div>
        )}
        <p className="note">
          IDE가 없거나 Deep Link가 열리지 않으면 위 명령을 터미널에 직접 붙여넣고, 평소 쓰는
          에디터로 폴더를 열어주세요 (BR07 수동 Fallback).
        </p>

        <div className="eyebrow" style={{ marginTop: 16 }}>
          2. IDE에서 폴더가 열리면
        </div>
        <p className="muted" style={{ fontSize: 13 }}>
          프로젝트가 잘 열렸는지 확인한 뒤, 다시 이 창으로 돌아와 학습을 시작하세요.
        </p>
        <div className="stepfoot">
          <button type="button" className="btn sm">
            이 단계 건너뛰기 (다음부터 숨김)
          </button>
          <button type="button" className="btn p" style={{ marginLeft: 'auto' }} onClick={() => navigate('/journey/brief')}>
            IDE 확인했어요 · 다음 →
          </button>
        </div>
      </div>
    </>
  )
}
