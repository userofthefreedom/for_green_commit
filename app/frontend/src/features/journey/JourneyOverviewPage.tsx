import { Link } from 'react-router-dom'

interface SkipMatrixRow {
  step: string
  skip: string
  automation: string
  constraint: string
}

// 기획서 부록 B "Journey 자동화·스킵 Matrix"를 그대로 옮긴 9단계 표 —
// PRD.md가 지목한 "9단계 스킵매트릭스" 갭을 이 화면에서 해소한다.
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

/**
 * SCR008 Journey 개요 (신규 화면) — "단계·진행도·스킵·자동화 설정" (기획서 표19).
 *
 * 이전 프로토타입(v3)에는 없던 화면이다. Issue를 확정한 직후, 첫 Fork 버튼을 누르기
 * 전에 전체 기여 여정(Fork→Clone→Brief→Coach→Commit·PR→Monitoring→결과)을 한눈에
 * 보여주고, 어떤 단계가 스킵 가능한지 / 어디까지 자동화되는지를 미리 안내하는 역할이다
 * (JourneySession/JourneyStep 엔티티가 이 상태를 갖는다). Phase 1은 라우팅과 정적
 * 설명만 제공하고, 실제 진행률·스킵 저장은 이후 Phase에서 JourneyRail/Settings와
 * 함께 연결한다.
 */
export function JourneyOverviewPage() {
  return (
    <section>
      <h1>기여 여정 개요</h1>
      <p className="lede">
        이제부터 GitHub에서 실제로 일어나는 8단계예요. 익숙한 단계는 건너뛰거나 자동화할 수 있고,
        Green Commit이 매 단계 옆에서 코치해요.
      </p>

      <div className="card">
        <div className="eyebrow">이번 Journey에서 지나갈 단계</div>
        <div className="flowline" style={{ margin: '6px 0 4px' }}>
          {['Fork', 'Clone', 'Brief', 'Coach', 'Commit·PR', 'Monitoring', '결과'].map((step, i, arr) => (
            <span key={step} style={{ display: 'contents' }}>
              <span className="fchip">
                {i + 1} {step}
              </span>
              {i < arr.length - 1 && <span>→</span>}
            </span>
          ))}
        </div>
        <div className="callout g" style={{ marginTop: 10 }}>
          왼쪽 사이드 레일(Journey Rail)이 지금 어디에 있는지 계속 보여줄 거예요.
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
