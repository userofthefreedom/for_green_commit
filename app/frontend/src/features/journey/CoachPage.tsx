import { useNavigate } from 'react-router-dom'

/**
 * SCR012 질문 Coach — "파일 구조·대안·질문·Hint·Evidence" (기획서 표19).
 *
 * v3 prototype #coach 화면은 3단계 상태 기계(탐색→대안 비교→블록별 질문)로 구현돼
 * 있었다. Phase 1은 그 3단계 구조와 카피를 정적 카드로만 이관한다 — 실제 인터랙션
 * (모의 검색, 대안 선택에 따른 코드 분기, 질문 채점, Hint 단계적 공개, 사고 흔적
 * 누적)은 F021 Orchestrator·AI 서비스가 붙는 이후 Phase에서 구현한다. BR08(전체
 * 정답 코드 선노출 금지)·BR09(Evidence와 추정 구분)를 UI 문구로 미리 반영해뒀다.
 */
export function CoachPage() {
  const navigate = useNavigate()

  return (
    <>
      <h1>학습하며 수정하기</h1>
      <p className="lede">
        정답을 알려주지 않아요. 대신 <b>실제 개발자가 파일을 찾는 방법</b>을 따라가며 직접 찾아봐요.
      </p>

      <div className="grid g2">
        <div>
          <div className="card">
            <div className="eyebrow">1단계 · 파일 찾기 (모의 검색)</div>
            <p className="muted" style={{ fontSize: 12, margin: '0 0 10px' }}>
              레포 파일 트리만 보고 알아맞히는 게 아니에요. 실무 개발자처럼 <b>검색</b>으로 진입점을
              찾아요.
            </p>
            <div className="anchor">📎 이슈 본문에 틀린 문자열("Sessios")이 그대로 적혀 있어요.</div>
            <div className="qbox">이 오타가 어느 파일에 있는지 찾으려면, 레포 전체에서 무엇을 검색해야 할까요?</div>
            <p className="note">
              (예시) "Sessios"처럼 드물게 등장하는 문자열로 검색하면 결과가 몇 개로 좁혀져요. "help"
              처럼 흔한 단어는 결과가 수백 개라 오히려 쓸모없어져요.
            </p>
          </div>

          <div className="card" style={{ marginTop: 18 }}>
            <div className="eyebrow">2단계 · 대안 비교</div>
            <p className="muted" style={{ fontSize: 12, margin: '0 0 10px' }}>
              정답이 하나가 아니에요. 각 대안의 <b>수정 파일 수·장단점</b>을 보고 골라요. 큰 대안이
              항상 좋은 건 아니에요.
            </p>
            <div className="rec best">
              <b>기본 접근 · 한 파일 수정</b>
              <p className="muted" style={{ fontSize: 12, margin: '6px 0' }}>
                이 파일 한 곳만 고치면 되는 단순한 작업이에요.
              </p>
              <span className="pill">난이도: 쉬움</span> <span className="pill g">가장 단순하고 정석 (권장)</span>
            </div>
          </div>

          <div className="card" style={{ marginTop: 18 }}>
            <div className="eyebrow">3단계 · 블록 선택 + 질문 Coach</div>
            <div className="anchor">📎 이 변경이 다른 파일·기능에 번지는지 생각해보세요.</div>
            <div className="qbox">이 수정의 영향 범위는 어디까지일까요?</div>
            <button type="button" className="opt" disabled>
              거의 없음 — 파일 안에서 끝나는 국소적 변경
            </button>
            <button type="button" className="opt" disabled>
              전체 빌드가 깨질 수 있음
            </button>
            <button type="button" className="opt" disabled>
              서버에 저장된 데이터가 바뀜
            </button>
            <p className="note">
              객관식 선택 후 "왜 그렇게 골랐나요?"를 한 번 더 물어요(생성 효과) — 정답 여부보다{' '}
              <b>근거를 스스로 대는 과정</b> 자체가 사고 흔적으로 남아요. 막히면 Hint가 단계적으로
              열려요.
            </p>
          </div>
        </div>

        <div>
          <div className="think">
            <div className="eyebrow" style={{ marginBottom: 4 }}>
              🧠 사고의 흔적
            </div>
            <p className="muted" style={{ fontSize: 12, margin: '0 0 8px' }}>
              정답 여부가 아니라 <b>스스로 생각한 흔적</b>이 쌓여요. 점수·쿠폰이 아니라 실력의
              증거예요.
            </p>
            <div className="tlamp">
              <span className="dot">🧭</span>
              <div>
                <div className="tt">독립 사고</div>
                <div className="ds">힌트·보기 없이 스스로 통과</div>
              </div>
            </div>
            <div className="tlamp">
              <span className="dot">🔍</span>
              <div>
                <div className="tt">추측·사실 구분</div>
                <div className="ds">확신도·근거를 표시</div>
              </div>
            </div>
            <div className="tlamp">
              <span className="dot">🔗</span>
              <div>
                <div className="tt">근거 인용 (Evidence)</div>
                <div className="ds">근거 링크를 눌러 확인 — 추정은 추정이라고 표시 (BR09)</div>
              </div>
            </div>
            <div className="tlamp">
              <span className="dot">💬</span>
              <div>
                <div className="tt">질문하는 습관</div>
                <div className="ds">스스로 궁금증을 질문으로 만듦</div>
              </div>
            </div>
          </div>
          <div className="card" style={{ marginTop: 18 }}>
            <div className="eyebrow">원칙</div>
            <p className="muted" style={{ fontSize: 12, margin: 0 }}>
              전체 정답 코드는 최초 판단 전에 노출하지 않아요 (BR08). AI 설명은 확인된 근거(Evidence)와
              추정을 구분해서 보여줘요 (BR09).
            </p>
          </div>
        </div>
      </div>

      <div className="center" style={{ marginTop: 22 }}>
        <button type="button" className="btn p lg" onClick={() => navigate('/journey/ship')}>
          학습 완료 · Commit·PR로 이동 →
        </button>
      </div>
    </>
  )
}
