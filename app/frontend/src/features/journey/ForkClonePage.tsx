import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/AuthContext'
import { useJourney } from '../../app/JourneyContext'
import { postAutomationClonePrepare, postAutomationFork, postIdeLaunch } from '../../lib/api/endpoints'

/**
 * SCR009 Fork + SCR010 Clone·IDE Handoff 통합 화면 (기획서 표19, F009/F010/F013, BR06/BR07).
 * 2026-07-19 사용자 결정: 기획서상 두 화면이지만, 사용자 입장에서 Fork·Clone은 "복사→내려받기"로
 * 이어지는 한 동작이라 한 페이지로 합쳤다. 백엔드 JourneyStep은 여전히 FORK/CLONE 두 단계로
 * 남아있고(JourneyOverviewPage의 9단계 Matrix 참고), 이 화면의 "다음" 버튼이 두 PATCH를
 * 순서대로 호출한다.
 */
export function ForkClonePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { journey, meta, updateStep } = useJourney()

  // Fork
  const [autoState, setAutoState] = useState<'idle' | 'success' | 'failed'>('idle')
  const [forkedUrl, setForkedUrl] = useState<string | null>(null)
  const [forkBusy, setForkBusy] = useState(false)

  // Clone
  const [cloneCommand, setCloneCommand] = useState<string | null>(null)
  const [ideDeepLink, setIdeDeepLink] = useState<string | null>(null)
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [ideOpened, setIdeOpened] = useState(false)
  const [ideInstructions, setIdeInstructions] = useState<string | null>(null)

  const [busy, setBusy] = useState(false)

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

  async function handleAutomateFork() {
    if (!user || !meta) return
    setForkBusy(true)
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
      setForkBusy(false)
    }
  }

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
        // BR07: 브라우저는 로컬 앱을 직접 실행할 수 없다 — OS에 등록된 커스텀 URL 스킴으로
        // 이동시켜 설치된 IDE로 핸드오프를 "시도"할 뿐이다. 성공 여부는 JS가 알 수 없으므로
        // 항상 아래 수동 Fallback(명령 복사)을 함께 보여준다.
        window.location.href = res.deepLinkUrl
      }
    } finally {
      setIdeOpened(true)
    }
  }

  async function goNext(action: 'COMPLETE' | 'SKIP') {
    if (!journey) {
      navigate('/journey/brief')
      return
    }
    setBusy(true)
    try {
      await updateStep('FORK', { action })
      await updateStep('CLONE', { action })
      navigate('/journey/brief')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <h1>Fork &amp; Clone · 내 작업 공간 준비하기</h1>
      <p className="lede">코드를 고치기 전에, 원본을 건드리지 않고 안전하게 연습할 내 작업 공간을 만들어요.</p>

      <div className="card">
        <div className="eyebrow">이 단계에서 하는 일</div>
        <table className="kv">
          <tbody>
            <tr>
              <td>Fork</td>
              <td>원본 저장소를 <b>내 GitHub 계정</b>에 통째로 복사해요. 원본은 전혀 바뀌지 않아요.</td>
            </tr>
            <tr>
              <td>Clone</td>
              <td>그 복사본을 <b>내 컴퓨터(IDE)</b>로 내려받아, 실제로 코드를 열어보고 고칠 수 있게 해요.</td>
            </tr>
          </tbody>
        </table>
        <p className="muted" style={{ fontSize: 12, margin: '10px 0 0' }}>
          정리하면: <b>Fork로 내 계정에 복사</b> → <b>Clone으로 내 컴퓨터에 내려받기</b>. 두 단계 다
          끝나야 IDE에서 실제 코드를 열어볼 수 있어요.
        </p>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="eyebrow">1. Fork — GitHub에서 내 계정으로 복사</div>
        <p>
          GitHub 저장소 우측 상단 <b>Fork</b> 버튼을 누르면 내 계정으로 복사본이 생겨요.
        </p>
        <div className="row" style={{ marginTop: 10 }}>
          <button type="button" className="btn auto" onClick={handleAutomateFork} disabled={forkBusy || !meta}>
            ⚡ 이 단계 자동화하기
          </button>
        </div>

        {autoState === 'success' && (
          <div className="autoresult" style={{ marginTop: 12 }}>
            <div className="callout b">
              ⚡ API로 자동 실행했어요 — {forkedUrl}. (프로토타입: 실제 GitHub API 대신 성공을
              시뮬레이션합니다)
            </div>
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
            . (BR07 — 무단 로컬/원격 실행 대신 항상 수동 Fallback을 함께 보여줘요.)
          </div>
        )}
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="eyebrow">2. Clone — 내 컴퓨터로 내려받기</div>
        <p className="muted" style={{ fontSize: 13 }}>
          이 단계는 자동화하지 않아요. 아래 명령을 복사해 직접 내려받고, IDE로 열어요.
        </p>
        <div className="eyebrow" style={{ marginTop: 12 }}>
          이 명령을 복사해 터미널에 붙여넣기
        </div>
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
        <p className="muted" style={{ fontSize: 13, marginTop: 10 }}>
          IDE에서 폴더가 잘 열렸는지 확인한 뒤, 다시 이 창으로 돌아와 다음으로 넘어가세요.
        </p>
      </div>

      <div className="stepfoot" style={{ marginTop: 18 }}>
        <button type="button" className="btn sm" onClick={() => void goNext('SKIP')} disabled={busy}>
          이 단계 건너뛰기 (다음부터 숨김)
        </button>
        <button
          type="button"
          className="btn p"
          style={{ marginLeft: 'auto' }}
          onClick={() => void goNext('COMPLETE')}
          disabled={busy}
        >
          Fork·Clone 확인했어요 · 다음 →
        </button>
      </div>
    </>
  )
}
