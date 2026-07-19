import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJourney } from '../../app/JourneyContext'
import { getRepositoryRecommendations } from '../../lib/api/endpoints'

const CHECKLIST_ITEMS = ['학습한 대로 코드를 수정했다', '커밋하고 push 했다', 'GitHub에서 PR을 열었다']

/**
 * SCR013 Commit·PR — "IDE 실행·Commit·Push·PR 템플릿·체크포인트" (기획서 표19, F014/F015/F016).
 * Phase 6: "PR 등록 완료" 입력란이 실제 PR URL을 받아 POST /pull-requests로 등록하고,
 * 곧바로 F017 MVP 슬라이스(등록 직후 1회 상태 조회)까지 수행한 뒤 Monitoring으로 이동한다.
 * 실제 GitHub의 공개 PR을 넣으면(예: 이 저장소 자신의 PR) 진짜 상태가 조회된다.
 *
 * 2026-07-19 사용자 피드백 반영: "이 단계가 뭘 하는 건지, 어떻게 하는지 설명이 없다"는 지적이
 * 있어 개념 설명(커밋/Push/PR이 각각 뭔지)과 명령어별 설명을 추가하고, v3 프로토타입에 있었지만
 * 이관 과정에서 빠졌던 "다 했나요?" 체크리스트를 되살렸다(docs/green-commit-prototype-v3.html
 * SHIP 섹션 참고). 체크리스트는 진행 상황을 스스로 확인하는 용도라 제출을 막지는 않는다.
 */
export function ShipPage() {
  const navigate = useNavigate()
  const { journey, meta, updateStep, registerPullRequest } = useJourney()
  const [ideOpened, setIdeOpened] = useState(false)
  const [checked, setChecked] = useState<boolean[]>([false, false, false])
  const [prUrl, setPrUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [avgFeedbackHours, setAvgFeedbackHours] = useState<number | null>(null)

  useEffect(() => {
    if (!meta) return
    getRepositoryRecommendations()
      .then((repos) => {
        const repo = repos.find((r) => r.repositoryId === meta.repositoryId)
        setAvgFeedbackHours(repo?.avgFeedbackHours ?? null)
      })
      .catch(() => {})
  }, [meta])

  function toggleCheck(i: number) {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
  }

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

      <div className="card">
        <div className="eyebrow">이 단계에서 하는 일</div>
        <table className="kv">
          <tbody>
            <tr>
              <td>커밋(Commit)</td>
              <td>내가 고친 코드를 하나의 "저장 지점"으로 기록해요. 나중에 무엇을 왜 바꿨는지 되짚을 수 있게 해줘요.</td>
            </tr>
            <tr>
              <td>푸시(Push)</td>
              <td>그 기록을 내 GitHub 복사본(Fork)에 업로드해요. 아직 원본 저장소엔 아무 영향이 없어요.</td>
            </tr>
            <tr>
              <td>PR(Pull Request)</td>
              <td>"이 변경을 원본 저장소에 반영해주세요"라고 메인테이너에게 요청하는 것이에요. 검토·머지는 저장소 관리자가 해요.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid g2" style={{ marginTop: 18 }}>
        <div className="card">
          <div className="eyebrow">1. 커밋 (변경 기록)</div>
          <div className="code">{'git checkout -b fix/short-description\ngit commit -am "Fix ..."\ngit push origin HEAD'}</div>
          <ul className="muted" style={{ fontSize: 12, margin: '8px 0 0', paddingLeft: 18 }}>
            <li><code>checkout -b</code>: 원본 브랜치를 건드리지 않도록 새 작업용 브랜치를 만들어요.</li>
            <li><code>commit -am</code>: 바뀐 파일을 모아 메시지와 함께 저장 지점으로 남겨요.</li>
            <li><code>push origin HEAD</code>: 지금 브랜치의 기록을 내 GitHub 복사본에 올려요.</li>
          </ul>
          <div className="callout g" style={{ marginTop: 10 }}>
            좋은 메시지: <b>Fix typo in instructor help page</b> · 피할 것: update, fix, asdf
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              커밋 메시지는 나중에 나 자신과 다른 사람이 "왜 이 변경을 했는지" 알 수 있는 유일한 단서예요.
            </div>
          </div>
        </div>
        <div className="card">
          <div className="eyebrow">2. Pull Request (반영 요청)</div>
          <div className="card" style={{ boxShadow: 'none', background: '#fafbfa', whiteSpace: 'pre-line', fontSize: 13, color: 'var(--muted)' }}>
            {'What: (무엇을 바꿨는지)\nWhy: (왜 필요한지)\nHow tested: (어떻게 확인했는지)\nFixes #(이슈 번호)'}
          </div>
          <ul className="muted" style={{ fontSize: 12, margin: '8px 0 0', paddingLeft: 18 }}>
            <li><b>What</b>: 리뷰어가 코드를 열어보기 전에 무엇이 바뀌는지 한눈에 알게 해요.</li>
            <li><b>Why</b>: 이 변경이 필요한 이유 — 보통 이슈 내용을 요약하면 돼요.</li>
            <li><b>How tested</b>: 직접 눈으로 확인했는지, 빌드가 통과했는지 등 검증 방법이에요.</li>
          </ul>
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
        <div className="eyebrow">✅ 다 했나요?</div>
        {CHECKLIST_ITEMS.map((label, i) => (
          <div key={label} className="check" style={{ cursor: 'pointer' }} onClick={() => toggleCheck(i)}>
            <span className={'cb' + (checked[i] ? ' on' : '')}>{checked[i] ? '✓' : ''}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="eyebrow">PR을 열었다면, 주소를 알려주세요</div>
        <p className="muted" style={{ fontSize: 12, margin: '0 0 10px' }}>
          형식: https://github.com/{'{owner}'}/{'{repo}'}/pull/{'{번호}'} — 등록하면 바로 실제 상태를
          1회 조회해요 (F017 MVP 범위).
        </p>
        {avgFeedbackHours != null && (
          <div className="callout b" style={{ marginBottom: 10 }}>
            💡 {meta?.repositoryName ?? '이 오픈소스'}는 평균적으로 <b>{avgFeedbackHours}시간</b> 안에
            첫 피드백을 줘요. PR을 올린 뒤 그 시간을 기준으로 기다려보면 돼요 — 반응이 없다고 너무
            일찍 조바심 내지 않아도 괜찮아요.
          </div>
        )}
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
