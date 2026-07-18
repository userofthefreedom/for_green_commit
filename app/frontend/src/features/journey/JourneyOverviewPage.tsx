import { Link } from 'react-router-dom'
import { useJourney } from '../../app/JourneyContext'

interface SkipMatrixRow {
  step: string
  skip: string
  automation: string
  constraint: string
}

// 기획서 부록 B "Journey 자동화·스킵 Matrix" 원문.
const SKIP_MATRIX: SkipMatrixRow[] = [
  { step: '튜토리얼', skip: '스킵', automation: '해당 없음', constraint: '첫 기여 사용자는 기본 노출' },
  { step: 'Fork', skip: '스킵', automation: 'GitHub API 자동화', constraint: '별도 쓰기 동의와 최종 확인' },
  { step: 'Clone', skip: '스킵', automation: 'IDE Clone Deep Link/보조 실행', constraint: '무단 로컬 실행 금지, 수동 명령 Fallback' },
  { step: 'Repo·Issue Brief', skip: '스킵', automation: 'Local GPU+RAG 자동 분석', constraint: '원문 링크 항상 제공' },
  { step: '질문 Coach', skip: '스킵', automation: '질문·Hint 자동 생성', constraint: '전체 정답 코드 선노출 금지' },
  { step: 'IDE 실행', skip: '스킵', automation: '사용자 클릭 기반 실행', constraint: '미설치·미지원 시 수동 안내' },
  { step: 'Commit·Push', skip: '스킵', automation: '명령 복사·체크리스트', constraint: '자동 Commit은 MVP 제외' },
  { step: 'PR', skip: '스킵', automation: '본문 Template·페이지 연결', constraint: '최종 제출 사용자 확인' },
  { step: 'Monitoring', skip: '해제', automation: 'Polling/Webhook', constraint: '사용자 연결 PR만 추적' },
]

const STEP_LABEL: Record<string, string> = {
  TUTORIAL: '튜토리얼',
  FORK: 'Fork',
  CLONE: 'Clone',
  REPO_ISSUE_BRIEF: 'Repo·Issue Brief',
  QUESTION_COACH: '질문 Coach',
  IDE_LAUNCH: 'IDE 실행',
  COMMIT_PUSH: 'Commit·Push',
  PR: 'PR',
  MONITORING: 'Monitoring',
}

const STATE_LABEL: Record<string, { label: string; className: string }> = {
  PENDING: { label: '대기', className: 'pill g' },
  IN_PROGRESS: { label: '진행 중', className: 'pill b' },
  COMPLETED: { label: '완료', className: 'pill' },
  SKIPPED: { label: '건너뜀', className: 'pill g' },
}

/**
 * SCR008 Journey 개요 (신규 화면, 기획서 표19) — "단계·진행도·스킵·자동화 설정".
 * Phase 4: Issue 선택 시 만들어진 실제 JourneySession(9단계, 부록B)을 JourneyContext에서
 * 읽어 진행 상태를 그대로 보여준다. F017(Monitoring 주기 추적)은 Phase 99 보류지만, 9번째
 * 단계 자체는 실제 JourneyStep 행으로 존재한다.
 */
export function JourneyOverviewPage() {
  const { journey, meta, loading } = useJourney()

  if (loading) {
    return (
      <section>
        <p className="lede">불러오는 중…</p>
      </section>
    )
  }

  if (!journey) {
    return (
      <section>
        <h1>기여 여정 개요</h1>
        <p className="lede">아직 시작한 Journey가 없어요. 먼저 레포와 Issue를 선택해주세요.</p>
        <Link to="/recommend/repositories" className="btn p lg">
          미션 찾기로 이동 →
        </Link>
      </section>
    )
  }

  return (
    <section>
      <h1>기여 여정 개요</h1>
      <p className="lede">
        {meta ? (
          <>
            <b>{meta.repositoryName}</b>의 <b>{meta.issueTitle}</b> — 이제부터 GitHub에서 실제로 일어나는
            9단계예요.
          </>
        ) : (
          '이제부터 GitHub에서 실제로 일어나는 9단계예요.'
        )}{' '}
        익숙한 단계는 건너뛰거나 자동화할 수 있고, Green Commit이 매 단계 옆에서 코치해요.
      </p>

      <div className="card">
        <div className="eyebrow">이번 Journey 진행 상태</div>
        <div className="check" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
          {journey.steps.map((step) => {
            const stateInfo = STATE_LABEL[step.state] ?? { label: step.state, className: 'pill g' }
            return (
              <div
                key={step.stepId}
                className="row"
                style={{ justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--line)' }}
              >
                <span>
                  {step.sequence}. {STEP_LABEL[step.stepType] ?? step.stepType}
                </span>
                <span className={stateInfo.className}>{stateInfo.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="eyebrow">단계별 스킵·자동화 Matrix</div>
        <p className="muted" style={{ fontSize: 12, margin: '0 0 12px' }}>
          모든 단계는 스킵할 수 있지만, 자동화 동의·외부 실행 확인·PR 등록 검증은 생략할 수 없어요
          (BR05). 자동화는 항상 사용자가 버튼을 눌러 확인한 뒤에만 실행돼요 (BR06).
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="matrix">
            <thead>
              <tr>
                <th>단계</th>
                <th>스킵</th>
                <th>자동/보조</th>
                <th>제약</th>
              </tr>
            </thead>
            <tbody>
              {SKIP_MATRIX.map((row) => (
                <tr key={row.step}>
                  <td>{row.step}</td>
                  <td>
                    <span className="pill g">{row.skip}</span>
                  </td>
                  <td>{row.automation}</td>
                  <td className="muted">{row.constraint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="center" style={{ marginTop: 22 }}>
        <Link to="/journey/fork" className="btn p lg">
          Fork부터 시작할게요 →
        </Link>
      </div>
    </section>
  )
}
