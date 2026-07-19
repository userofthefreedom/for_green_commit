import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJourney } from '../../app/JourneyContext'
import { BLOCK_HINTS, QPRAISE, resolveCoachIssue } from './coach/coachData'
import type { CoachApproach, CoachStep } from './coach/coachData'

/**
 * SCR012 질문 Coach — "탐색 → 대안 비교 → 블록 선택 + 질문 코치" (기획서 표19, F021 데모).
 * docs/green-commit-prototype-v3.html #coach 화면의 3단계 상태 기계를 실제 React state로
 * 옮겼다. Q&A 콘텐츠(coach/coachData.ts)는 v3 문구를 그대로 이관한 정적 데이터다 — 실제
 * Local GPU+RAG 생성(F021 Orchestrator)은 여전히 Phase 99 보류 범위이고, 이 화면은 v3가
 * 검증한 "질문으로 스스로 찾게 하기" 흐름 자체가 MVP 구현이다.
 *
 * BR08: 각 단계의 보기는 클릭 전까지 정답/오답 스타일이 전혀 드러나지 않는다 — 방금 클릭한
 * 보기 하나에만 ok/no 클래스가 붙고(v3와 동일하게 매 클릭마다 이전 표시를 지운다), 전체 정답
 * 코드는 절대 먼저 보여주지 않는다.
 */

type Phase = 'explore' | 'plan' | 'qa'
type ThinkKey = 'independent' | 'metacog' | 'evidence' | 'followup'
type FlowItem = { t: 'block' } | { t: 'q'; s: CoachStep } | { t: 'follow' }

const THINK_META: Record<ThinkKey, { dot: string; title: string; desc: string }> = {
  independent: { dot: '🧭', title: '독립 사고', desc: '힌트·보기 없이 스스로 통과' },
  metacog: { dot: '🔍', title: '추측·사실 구분', desc: '확신도·근거를 표시' },
  evidence: { dot: '🔗', title: '근거 인용 (Evidence)', desc: '근거 링크를 눌러 확인 — 추정은 추정이라고 표시 (BR09)' },
  followup: { dot: '💬', title: '질문하는 습관', desc: '스스로 궁금증을 질문으로 만듦' },
}
const THINK_ORDER: ThinkKey[] = ['independent', 'metacog', 'evidence', 'followup']

function stripTag(s: string) {
  return s.replace(/<[^>]*>/g, '')
}

function buildFlow(approach: CoachApproach): FlowItem[] {
  const flow: FlowItem[] = []
  const f0 = approach.files[0]
  if (f0 && f0.blocks && f0.blocks.length) flow.push({ t: 'block' })
  approach.steps.forEach((s) => flow.push({ t: 'q', s }))
  flow.push({ t: 'follow' })
  return flow
}

export function CoachPage() {
  const navigate = useNavigate()
  const { journey, meta, updateStep } = useJourney()

  // meta.issueTitle을 seed 데이터 제목과 대조해 7개 v3 Q&A 트리 중 하나를 고른다 (매치 없으면 typo).
  const issue = useMemo(() => resolveCoachIssue(meta?.issueTitle), [meta?.issueTitle])

  const [phase, setPhase] = useState<Phase>('explore')
  const [think, setThink] = useState<Record<ThinkKey, boolean>>({
    independent: false,
    metacog: false,
    evidence: false,
    followup: false,
  })
  function lamp(k: ThinkKey) {
    setThink((prev) => (prev[k] ? prev : { ...prev, [k]: true }))
  }

  // ---- Phase 1: 탐색 (검색어 고르기 → 결과에서 파일 찾기) ----
  const [es, setEs] = useState<0 | 1>(0)
  const [exploreClicked, setExploreClicked] = useState<number | null>(null)
  const [exploreOk, setExploreOk] = useState(false)
  const [exploreFeedback, setExploreFeedback] = useState<string | null>(null)
  const [exploreHintsShown, setExploreHintsShown] = useState<[number, number]>([0, 0])
  const [exploreHintUsed, setExploreHintUsed] = useState<[boolean, boolean]>([false, false])
  const [foundFile, setFoundFile] = useState('')

  function handleExploreOption(i: number) {
    const opt = issue.search.opts[i]
    setExploreClicked(i)
    setExploreOk(opt.ok)
    setExploreFeedback(opt.fb)
    if (opt.ok && !exploreHintUsed[0]) lamp('independent')
  }
  function handleExploreResult(i: number) {
    const r = issue.search.results[i]
    setExploreClicked(i)
    setExploreOk(r.ok)
    setExploreFeedback(r.fb)
    if (r.ok) {
      setFoundFile(stripTag(r.path))
      if (!exploreHintUsed[1]) lamp('independent')
    }
  }
  function handleExploreDontKnow() {
    const hints = es === 0 ? issue.search.hints : issue.search.pickHints
    const shown = exploreHintsShown[es]
    if (shown >= hints.length) return
    setExploreHintsShown((prev) => {
      const next: [number, number] = [...prev]
      next[es] = shown + 1
      return next
    })
    setExploreHintUsed((prev) => {
      const next: [boolean, boolean] = [...prev]
      next[es] = true
      return next
    })
  }
  function handleExploreNext() {
    if (es === 0) {
      setEs(1)
      setExploreClicked(null)
      setExploreOk(false)
      setExploreFeedback(null)
      return
    }
    setPhase('plan')
  }
  function handleBackToExplore() {
    setPhase('explore')
    setEs(0)
    setExploreClicked(null)
    setExploreOk(false)
    setExploreFeedback(null)
    setExploreHintsShown([0, 0])
    setExploreHintUsed([false, false])
  }

  // ---- Phase 2: 대안 비교 ----
  const [approach, setApproach] = useState<CoachApproach | null>(null)
  const [flow, setFlow] = useState<FlowItem[]>([])
  const [evidenceClicked, setEvidenceClicked] = useState<Set<number>>(new Set())

  // ---- Phase 3: 블록 선택 + 질문 코치 ----
  const [si, setSi] = useState(0)
  const [selectedFileIdx, setSelectedFileIdx] = useState(0)
  const [blockClicked, setBlockClicked] = useState<number | null>(null)
  const [optClicked, setOptClicked] = useState<number | null>(null)
  const [whyClicked, setWhyClicked] = useState<number | null>(null)
  const [showWhy, setShowWhy] = useState(false)
  const [followText, setFollowText] = useState('')
  const [stepFeedback, setStepFeedback] = useState<{ ok: boolean; html: string } | null>(null)
  const [stepHintsShown, setStepHintsShown] = useState(0)
  const [stepUsedHint, setStepUsedHint] = useState(false)
  const [questionText, setQuestionText] = useState('')
  const [questionWarning, setQuestionWarning] = useState<string | null>(null)
  const [qCount, setQCount] = useState(0)
  const [praiseMsg, setPraiseMsg] = useState<string | null>(null)
  const [finishing, setFinishing] = useState(false)

  const currentFlowItem = flow[si]

  function resetStepUI() {
    setSelectedFileIdx(0)
    setBlockClicked(null)
    setOptClicked(null)
    setWhyClicked(null)
    setShowWhy(false)
    setFollowText('')
    setStepFeedback(null)
    setStepHintsShown(0)
    setStepUsedHint(false)
  }

  function handleSelectApproach(a: CoachApproach) {
    setApproach(a)
    setFlow(buildFlow(a))
    setSi(0)
    setEvidenceClicked(new Set())
    resetStepUI()
    setPhase('qa')
  }
  function handleBackToPlan() {
    setPhase('plan')
  }

  function handleBlockClick(i: number) {
    if (!approach || !currentFlowItem || currentFlowItem.t !== 'block') return
    const blk = approach.files[0].blocks![i]
    setBlockClicked(i)
    setStepFeedback({ ok: blk.ok, html: (blk.ok ? '' : '🤔 여긴 아니에요 — ') + blk.why })
    if (blk.ok && !stepUsedHint) lamp('independent')
  }
  function handleOptClick(i: number) {
    if (!currentFlowItem || currentFlowItem.t !== 'q') return
    const s = currentFlowItem.s
    const ok = i === s.ans
    setOptClicked(i)
    setWhyClicked(null)
    setShowWhy(false)
    setStepFeedback({ ok, html: (ok ? '✅ ' : '🤔 다시 볼까요 — ') + s.fb })
    if (!ok) return
    if (!stepUsedHint) lamp('independent')
    if (s.whyOpts) setShowWhy(true)
  }
  function handleWhyClick(i: number) {
    if (!currentFlowItem || currentFlowItem.t !== 'q' || !currentFlowItem.s.whyOpts) return
    const s = currentFlowItem.s
    const ok = i === s.whyAns
    setWhyClicked(i)
    if (ok) {
      setStepFeedback({ ok: true, html: '✅ ' + s.whyFb })
      lamp('metacog')
    } else {
      setStepFeedback({
        ok: false,
        html:
          '🤔 답은 맞았지만 <b>이유</b>가 달라요 — 그게 더 중요해요. 답을 맞히는 건 운으로도 되지만, <b>왜 그런지 아는 것</b>은 다음 이슈에서도 쓸 수 있거든요.<br><br>→ ' +
          s.whyFb,
      })
    }
  }
  function handleStepDontKnow() {
    if (!currentFlowItem) return
    const hints = currentFlowItem.t === 'block' ? BLOCK_HINTS : currentFlowItem.t === 'q' ? currentFlowItem.s.hints : []
    if (!hints.length || stepHintsShown >= hints.length) return
    setStepUsedHint(true)
    setStepHintsShown((n) => n + 1)
  }
  function handleEvidenceClick(i: number) {
    setEvidenceClicked((prev) => {
      const next = new Set(prev)
      next.add(i)
      return next
    })
    lamp('evidence')
  }
  function handleAskQuestion() {
    const q = questionText.trim()
    if (q.length < 2) {
      setQuestionWarning('궁금한 걸 한 줄로 적어보세요 — 질문을 만드는 것 자체가 연습이에요')
      return
    }
    setQuestionWarning(null)
    const nextCount = qCount + 1
    setQCount(nextCount)
    lamp('followup')
    setPraiseMsg(QPRAISE[(nextCount - 1) % QPRAISE.length])
    setQuestionText('')
  }

  async function handleSubmit() {
    if (!currentFlowItem) return
    if (currentFlowItem.t === 'follow') {
      if (followText.trim().length >= 2) lamp('followup')
      setFinishing(true)
      try {
        if (journey) await updateStep('QUESTION_COACH', { action: 'COMPLETE' })
      } finally {
        navigate('/journey/ship')
      }
      return
    }
    setSi((prev) => prev + 1)
    resetStepUI()
  }

  const submitEnabled = (() => {
    if (!currentFlowItem) return false
    if (currentFlowItem.t === 'block') return blockClicked !== null && !!approach && !!approach.files[0].blocks?.[blockClicked]?.ok
    if (currentFlowItem.t === 'q') {
      if (optClicked === null || optClicked !== currentFlowItem.s.ans) return false
      if (currentFlowItem.s.whyOpts) return whyClicked !== null
      return true
    }
    return true // follow
  })()

  if (!meta) {
    return (
      <>
        <h1>학습하며 수정하기</h1>
        <p className="lede">아직 선택한 미션이 없어요. 먼저 레포와 이슈를 골라주세요.</p>
      </>
    )
  }

  return (
    <>
      <h1>학습하며 수정하기</h1>
      <p className="lede">
        {phase === 'explore' && (
          <>
            정답을 알려주지 않아요. 대신 <b>실제 개발자가 파일을 찾는 방법</b>을 따라가며 직접 찾아봐요.
          </>
        )}
        {phase === 'plan' &&
          (issue.approaches.length > 1
            ? '파일을 찾았어요. 이제 어떻게 고칠지 골라요 — 정답은 하나가 아니에요.'
            : '파일을 찾았어요. 이제 어디를 어떻게 고칠지 함께 봐요.')}
        {phase === 'qa' && '정답 여부보다 근거를 스스로 대는 과정 자체가 사고 흔적으로 남아요.'}
      </p>

      {phase === 'explore' && (
        <>
          <div className="card">
            <div className="eyebrow">🎯 {issue.title} · {issue.no}</div>
            <p className="muted" style={{ fontSize: 13, margin: '4px 0 0' }}>
              Brief에서 배경 지식과 코드 미리보기까지 봤죠? 이제 직접 찾아볼 차례예요.
            </p>
          </div>

          <div className="card" style={{ marginTop: 18 }}>
            <div className="stepper">
              {['① 검색어 고르기', '② 결과에서 파일 찾기'].map((label, i) => (
                <div key={label} className={'s' + (i < es ? ' done' : i === es ? ' cur' : '')}>
                  {label}
                </div>
              ))}
            </div>
            <p className="muted" style={{ fontSize: 12, marginBottom: 14 }}>
              트리만 보고 알아맞히는 게 아니에요. 실무 개발자도 <b>검색</b>으로 찾아요.
            </p>

            {es === 0 ? (
              <>
                <div className="anchor">
                  📎 <span dangerouslySetInnerHTML={{ __html: issue.search.anchor }} />
                </div>
                <div className="qbox" dangerouslySetInnerHTML={{ __html: issue.search.q }} />
                <div>
                  {issue.search.opts.map((o, i) => (
                    <button
                      key={i}
                      type="button"
                      className={'opt' + (exploreClicked === i ? (o.ok ? ' ok' : ' no') : '')}
                      onClick={() => handleExploreOption(i)}
                    >
                      {o.t}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="anchor">
                  📎 <span dangerouslySetInnerHTML={{ __html: issue.search.pickAnchor }} />
                </div>
                <div className="qbox" dangerouslySetInnerHTML={{ __html: issue.search.pickQ }} />
                <div className="sbar">
                  <span className="pr">$</span> grep -r &quot;{issue.search.query}&quot; .
                  <span style={{ opacity: 0.55, marginLeft: 'auto' }}>{issue.search.results.length}개 결과</span>
                </div>
                <div>
                  {issue.search.results.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      className={'sres' + (exploreClicked === i ? (r.ok ? ' ok' : ' no') : '')}
                      onClick={() => handleExploreResult(i)}
                    >
                      <div className="p" dangerouslySetInnerHTML={{ __html: r.path + (r.line ? ':' + r.line : '') }} />
                      <div className="pv" dangerouslySetInnerHTML={{ __html: r.pv }} />
                    </button>
                  ))}
                </div>
              </>
            )}

            {exploreFeedback && (
              <div className={'callout ' + (exploreOk ? 'g' : 'a')} style={{ marginTop: 10 }}>
                {es === 0 ? (exploreOk ? '✅ ' : '🤔 ') : exploreOk ? '' : '🤔 여긴 아니에요 — '}
                <span dangerouslySetInnerHTML={{ __html: exploreFeedback }} />
              </div>
            )}

            <div className="row" style={{ marginTop: 12 }}>
              <button type="button" className="btn sm" onClick={handleExploreDontKnow}>
                🤔 잘 모르겠어요
              </button>
              <button type="button" className="btn p" style={{ marginLeft: 'auto' }} disabled={!exploreOk} onClick={handleExploreNext}>
                {es === 0 ? '이 검색어로 검색 →' : '이 파일로 진행 →'}
              </button>
            </div>

            {exploreHintsShown[es] > 0 && (
              <div style={{ marginTop: 12 }}>
                {(es === 0 ? issue.search.hints : issue.search.pickHints).slice(0, exploreHintsShown[es]).map((h, i) => (
                  <div key={i} className="callout a" style={{ marginBottom: 6 }}>
                    💡 <span dangerouslySetInnerHTML={{ __html: h }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {phase === 'plan' && (
        <>
          <div className="callout g" style={{ marginBottom: 14 }}>
            ✅ 검색으로 진입점을 찾았어요: <b style={{ fontFamily: "'SFMono-Regular',Consolas,monospace" }}>{foundFile}</b>
          </div>
          <div className="card">
            <div className="eyebrow">이 파일, 어떻게 고칠까요</div>
            <p className="muted" style={{ fontSize: 12, margin: '0 0 10px' }}>
              정답이 하나가 아니에요. 각 대안의 <b>수정 파일 수·장단점</b>을 보고 골라보세요. 큰 대안이 항상 좋은 건 아니에요.
            </p>
            {issue.approaches.map((a) => {
              const rec = a.tradeoff.indexOf('권장') >= 0
              return (
                <div
                  key={a.id}
                  className="rec"
                  style={{ background: '#fff', marginBottom: 10, ...(rec ? { border: '2px solid var(--green)' } : {}) }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 8 }}>
                    <b>{a.name}</b>
                    <span className={'pill' + (rec ? '' : ' g')}>{a.effort}</span>
                  </div>
                  <p className="muted" style={{ fontSize: 13, margin: '4px 0 8px' }}>
                    {a.desc}
                  </p>
                  <div className="muted" style={{ fontSize: 12 }}>
                    ✎ 수정 파일 {a.files.length}개: {a.files.map((f) => f.path.split('/').pop()).join(', ')}
                  </div>
                  <div className={'callout ' + (rec ? 'g' : 'b')} style={{ margin: '8px 0 10px', fontSize: 12 }}>
                    {a.tradeoff}
                  </div>
                  <button type="button" className="btn p full sm" onClick={() => handleSelectApproach(a)}>
                    이 접근으로 학습 시작 →
                  </button>
                </div>
              )
            })}
            <button type="button" className="btn sm full" onClick={handleBackToExplore}>
              ← 파일 다시 찾기
            </button>
          </div>
        </>
      )}

      {phase === 'qa' && approach && currentFlowItem && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
            <div className="muted" style={{ fontSize: 13 }}>
              접근: <b>{approach.name}</b> · 수정 파일 {approach.files.length}개
            </div>
            <button type="button" className="btn sm" style={{ marginLeft: 'auto' }} onClick={handleBackToPlan}>
              ← 접근 다시 고르기
            </button>
          </div>
          <div className="stepper">
            {flow.map((f, i) => {
              const label = f.t === 'block' ? '어디를 고칠까' : f.t === 'follow' ? '후속 질문' : f.s.k
              return (
                <div key={i} className={'s' + (i < si ? ' done' : i === si ? ' cur' : '')}>
                  {label}
                </div>
              )
            })}
          </div>
          <p className="muted" style={{ fontSize: 12, marginBottom: 14 }}>
            <b>{flow.length - 1}단계</b> + 마무리 질문이에요. 질문은 모두 객관식이고, 답을 고르면 <b>“왜 그렇게 골랐나요?”</b>를 한 번 더 물어요.
          </p>

          <div className="grid g2">
            <div className="card">
              <div className="eyebrow">
                코드 보기 <span className="muted" style={{ textTransform: 'none', fontWeight: 400 }}>· 이 대안이 건드리는 파일들</span>
              </div>

              {currentFlowItem.t !== 'block' && (
                <div style={{ marginBottom: -1 }}>
                  {approach.files.map((f, i) => (
                    <button
                      key={i}
                      type="button"
                      className={'ftab' + (i === selectedFileIdx ? ' on' : '')}
                      onClick={() => setSelectedFileIdx(i)}
                    >
                      {f.path.split('/').pop()}
                    </button>
                  ))}
                </div>
              )}

              {currentFlowItem.t === 'block' ? (
                <div className="code">
                  {approach.files[0].blocks!.map((b, i) => (
                    <button
                      key={i}
                      type="button"
                      className={'cblk' + (blockClicked === i ? (b.ok ? ' ok' : ' no') : '')}
                      onClick={() => handleBlockClick(i)}
                    >
                      <span className="lb">{b.lb}</span>
                      {b.code}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="code">
                  {'// ' + approach.files[selectedFileIdx].path}
                  {'\n// ' + approach.files[selectedFileIdx].note}
                  {'\n\n' + approach.files[selectedFileIdx].code}
                </div>
              )}

              {currentFlowItem.t === 'block' && (
                <div className="anchor" style={{ marginTop: 12 }}>
                  📎 검색 결과가 알려준 줄 번호를 떠올려보세요 · <b>{approach.files[0].path}</b>
                </div>
              )}
              {currentFlowItem.t === 'q' && (
                <div className="anchor" style={{ marginTop: 12 }}>
                  📎 <span dangerouslySetInnerHTML={{ __html: currentFlowItem.s.anchor }} />
                </div>
              )}

              {currentFlowItem.t === 'block' && <div className="qbox">이 파일 안에서 <b>어느 부분</b>을 고쳐야 할까요?</div>}
              {currentFlowItem.t === 'q' && <div className="qbox" dangerouslySetInnerHTML={{ __html: currentFlowItem.s.q }} />}
              {currentFlowItem.t === 'follow' && (
                <div className="qbox">
                  마무리 — 코드를 받았다고 가정하고, 메인테이너에게 남길 <b>후속 질문</b>을 하나 적어보세요.{' '}
                  <span className="muted" style={{ fontWeight: 400, fontSize: 12 }}>
                    (여기만 직접 써요 — 질문 만들기는 보기로 대신할 수 없으니까요)
                  </span>
                </div>
              )}

              {currentFlowItem.t === 'q' && (
                <div>
                  {currentFlowItem.s.opts.map((o, i) => (
                    <button
                      key={i}
                      type="button"
                      className={'opt' + (optClicked === i ? (i === currentFlowItem.s.ans ? ' ok' : ' no') : '')}
                      onClick={() => handleOptClick(i)}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              )}

              {currentFlowItem.t === 'q' && showWhy && currentFlowItem.s.whyOpts && (
                <div style={{ marginTop: 6 }}>
                  <div className="qbox" style={{ background: 'var(--blue-soft)', color: '#1c4a80' }}>
                    🔍 {currentFlowItem.s.whyQ}
                  </div>
                  <div>
                    {currentFlowItem.s.whyOpts.map((o, i) => (
                      <button
                        key={i}
                        type="button"
                        className={'opt' + (whyClicked === i ? (i === currentFlowItem.s.whyAns ? ' ok' : ' no') : '')}
                        onClick={() => handleWhyClick(i)}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentFlowItem.t === 'follow' && (
                <div>
                  <div className="muted" style={{ fontSize: 12, fontWeight: 700, marginBottom: 5 }}>
                    내 질문 (한 줄이면 충분해요)
                  </div>
                  <input
                    className="line"
                    value={followText}
                    onChange={(e) => setFollowText(e.target.value)}
                    placeholder="예: 이 대안이면 다른 표에도 영향이 있을까요?"
                  />
                </div>
              )}

              {stepFeedback && (
                <div className={'callout ' + (stepFeedback.ok ? 'g' : 'a')} style={{ marginTop: 8 }} dangerouslySetInnerHTML={{ __html: stepFeedback.html }} />
              )}

              <div className="row" style={{ marginTop: 12 }}>
                {currentFlowItem.t !== 'follow' && (
                  <button type="button" className="btn sm" onClick={handleStepDontKnow}>
                    🤔 잘 모르겠어요
                  </button>
                )}
                <button
                  type="button"
                  className="btn p"
                  style={{ marginLeft: 'auto' }}
                  disabled={!submitEnabled || finishing}
                  onClick={handleSubmit}
                >
                  {currentFlowItem.t === 'follow' ? '코치 마치고 커밋·PR로 →' : '다음 →'}
                </button>
              </div>

              {stepHintsShown > 0 && (
                <div style={{ marginTop: 12 }}>
                  {(currentFlowItem.t === 'block' ? BLOCK_HINTS : currentFlowItem.t === 'q' ? currentFlowItem.s.hints : [])
                    .slice(0, stepHintsShown)
                    .map((h, i) => (
                      <div key={i} className="callout a" style={{ marginBottom: 6 }}>
                        💡 <span dangerouslySetInnerHTML={{ __html: h }} />
                      </div>
                    ))}
                </div>
              )}

              <div style={{ marginTop: 14, borderTop: '1px dashed var(--line)', paddingTop: 12 }}>
                <div className="muted" style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                  🙋 질문하기 <span style={{ fontWeight: 400 }}>· 막히거나 궁금하면 스스로 질문으로 만들어보세요</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    className="line"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAskQuestion()
                    }}
                    placeholder="예: 이 대안이면 다른 표에도 영향이 있을까요?"
                  />
                  <button type="button" className="btn" onClick={handleAskQuestion}>
                    질문
                  </button>
                </div>
                {questionWarning && (
                  <div className="callout a" style={{ marginTop: 10 }}>
                    {questionWarning}
                  </div>
                )}
                {praiseMsg && (
                  <div className="callout g" style={{ marginTop: 10 }}>
                    <span>
                      🎉 <span dangerouslySetInnerHTML={{ __html: praiseMsg }} />
                      <br />
                      <span className="muted" style={{ fontSize: 12 }}>
                        → 점수·쿠폰이 아니라 네 사고의 흔적으로 남아요.
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="think">
                <div className="eyebrow" style={{ marginBottom: 4 }}>
                  🧠 사고의 흔적
                </div>
                <p className="muted" style={{ fontSize: 12, margin: '0 0 8px' }}>
                  정답 여부가 아니라 <b>스스로 생각한 흔적</b>이 쌓여요. 점수·쿠폰이 아니라 실력의 증거예요.
                </p>
                {THINK_ORDER.map((k) => (
                  <div key={k} className={'tlamp' + (think[k] ? ' on' : '')}>
                    <span className="dot">{THINK_META[k].dot}</span>
                    <div>
                      <div className="tt">
                        {THINK_META[k].title} {k === 'followup' && qCount > 0 && <span className="muted" style={{ fontWeight: 400 }}>· {qCount}개</span>}
                      </div>
                      <div className="ds">{THINK_META[k].desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="eyebrow" style={{ marginTop: 16 }}>
                참고 근거 <span className="muted" style={{ textTransform: 'none', fontWeight: 400 }}>· 눌러서 확인</span>
              </div>
              <div className="row">
                {['이슈 ' + issue.no + ' ↗', '파일 트리 ↗', '비슷한 PR ↗'].map((t, i) => (
                  <button
                    key={i}
                    type="button"
                    className="tag"
                    style={{ cursor: 'pointer', ...(evidenceClicked.has(i) ? { borderColor: 'var(--green)', color: 'var(--green-d)' } : {}) }}
                    onClick={() => handleEvidenceClick(i)}
                  >
                    {evidenceClicked.has(i) ? '✓ ' : ''}
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
