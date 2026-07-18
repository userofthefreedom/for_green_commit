import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/AuthContext'
import { useJourney } from '../../app/JourneyContext'
import { postAutomationClonePrepare, postIdeLaunch } from '../../lib/api/endpoints'

/**
 * SCR010 Clone·IDE Handoff — "명령 복사·IDE Clone/열기·Fallback" (기획서 표19, F010/F013, BR07).
 * Phase 5: 실제 POST /automations/clone/prepare로 명령/Deep Link를 받고, "IDE에서 열기"는
 * 실제 POST /ide-launch를 호출한다. IDE 선택 값을 조회하는 API가 아직 없어(온보딩 GET
 * 미구현) VS Code를 기본값으로 쓴다 — Phase 99 이후 프로필 조회가 생기면 대체.
 */
export function ClonePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { journey, meta, updateStep } = useJourney()

  const [cloneCommand, setCloneCommand] = useState<string | null>(null)
  const [ideDeepLink, setIdeDeepLink] = useState<string | null>(null)
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [ideOpened, setIdeOpened] = useState(false)
  const [ideInstructions, setIdeInstructions] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !meta) return
    postAutomationClonePrepare({
      userId: user.id,
      sessionId: journey?.sessionId,
      repositoryId: meta.repositoryId,
      ide: 'VSCODE',
    })
      .then((res) => {
        setCloneCommand(res.cloneCommand)
        setIdeDeepLink(res.ideDeepLink)
        setFallbackUrl(res.fallbackUrl)
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta, user])

  async function handleCopy() {
    if (!cloneCommand) return
    try {
      await navigator.clipboard.writeText(cloneCommand)
    } catch {
      // 클립보드 권한이 없어도 명령 텍스트는 화면에 그대로 보인다.
    }
    setCopied(true)
  }

  async function handleOpenIde() {
    if (!user) return
    try {
      const res = await postIdeLaunch({ userId: user.id, ide: 'VSCODE', repositoryId: meta?.repositoryId })
      setIdeInstructions(res.instructions)
      if (res.deepLinkUrl) {
        // BR07: 브라우저는 로컬 앱을 직접 실행할 수 없다 — 할 수 있는 건 OS에 등록된 커스텀
        // URL 스킴(vscode://...)으로 이동시켜 OS가 설치된 IDE로 핸드오프하도록 "시도"하는
        // 것뿐이다. 성공/실패 여부는 JS가 알 수 없으므로(OS가 브라우저에 알려주지 않음),
        // 항상 아래 수동 Fallback(명령 복사)을 함께 보여준다.
        window.location.href = res.deepLinkUrl
      }
    } finally {
      setIdeOpened(true)
    }
  }

  async function goNext(action: 'COMPLETE' | 'SKIP') {
    if (journey) await updateStep('CLONE', { action })
    navigate('/journey/brief')
  }

  return (
    <>
      <h1>클론 · 내 컴퓨터로 가져오기</h1>
      <p className="lede">이 단계는 자동화하지 않아요. 아래 명령을 복사해 직접 내려받고, IDE로 열어요.</p>
      <div className="card">
        <div className="eyebrow">1. 이 명령을 복사해 터미널에 붙여넣기</div>
        <div className="code">{cloneCommand ?? '불러오는 중…'}</div>
        <div className="row" style={{ marginTop: 10 }}>
          <button type="button" className="btn auto" onClick={handleCopy} disabled={!cloneCommand}>
            📋 git 명령 복사{copied ? '됨' : ''}
          </button>
          <button type="button" className="btn" onClick={handleOpenIde}>
            💻 IDE에서 열기 ↗
          </button>
        </div>
        {ideOpened && (
          <div className="autoresult" style={{ marginTop: 12 }}>
            <div className="callout g">
              💻 {ideDeepLink
                ? 'VS Code를 여는 요청을 보냈어요 — 설치돼 있다면 잠시 후 열립니다. 안 열리면 아래 안내대로 명령을 직접 실행하세요.'
                : (ideInstructions ?? '이 IDE는 자동 실행 Deep Link를 지원하지 않아요 — 아래 명령을 직접 실행해주세요.')}
            </div>
          </div>
        )}
        <p className="note">
          IDE가 없거나 Deep Link({ideDeepLink ?? '미지원 IDE'})가 열리지 않으면 위 명령을 터미널에
          직접 붙여넣거나{' '}
          {fallbackUrl && (
            <a href={fallbackUrl} target="_blank" rel="noreferrer">
              저장소 페이지 ↗
            </a>
          )}
          에서 직접 진행하세요 (BR07 수동 Fallback).
        </p>

        <div className="eyebrow" style={{ marginTop: 16 }}>
          2. IDE에서 폴더가 열리면
        </div>
        <p className="muted" style={{ fontSize: 13 }}>
          프로젝트가 잘 열렸는지 확인한 뒤, 다시 이 창으로 돌아와 학습을 시작하세요.
        </p>
        <div className="stepfoot">
          <button type="button" className="btn sm" onClick={() => void goNext('SKIP')}>
            이 단계 건너뛰기 (다음부터 숨김)
          </button>
          <button type="button" className="btn p" style={{ marginLeft: 'auto' }} onClick={() => void goNext('COMPLETE')}>
            IDE 확인했어요 · 다음 →
          </button>
        </div>
      </div>
    </>
  )
}
