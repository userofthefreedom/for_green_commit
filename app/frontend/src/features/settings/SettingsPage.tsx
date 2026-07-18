import { useState } from 'react'

const IDE_OPTIONS = [
  { id: 'VSCODE', label: 'VS Code' },
  { id: 'INTELLIJ', label: 'IntelliJ / JetBrains' },
  { id: 'OTHER', label: '기타' },
]

/**
 * SCR018 설정 — "IDE·자동화·스킵·연동·삭제" (기획서 표19).
 * v3 prototype #settings 화면(GitHub 연동·건너뛴 단계)을 이관하고, 이전 감사에서
 * 지적된 "주 IDE" 설정 카드를 추가해 기획서 SCR018 정의를 완전히 커버했다.
 * Phase 1은 스킵 초기화 버튼 정도만 로컬 상태로 인터랙티브하고, 나머지는
 * placeholder다 (PRD.md "설정 실동작" 갭은 이후 Phase에서 실제 저장 연동으로 닫는다).
 */
export function SettingsPage() {
  const [ide, setIde] = useState('VSCODE')
  const [skippedSteps, setSkippedSteps] = useState<string[]>([])

  return (
    <section>
      <h1>설정</h1>
      <p className="lede">연동·자동화·건너뛴 단계를 관리하세요.</p>
      <div className="grid g2">
        <div className="card">
          <div className="eyebrow">GitHub 연동 · 자동화</div>
          <div className="check">
            <span style={{ flex: 1 }}>GitHub 연동 (Fork·PR 자동화 권한)</span>
            <span className="pill">연결됨</span>
          </div>
          <div className="check">
            <span style={{ flex: 1 }}>연동 해제 · 데이터 삭제</span>
            <button type="button" className="btn sm">
              요청
            </button>
          </div>
          <p className="note">자동화는 항상 사용자가 버튼을 눌러 확인한 뒤에만 실행돼요 (BR06).</p>
        </div>

        <div className="card">
          <div className="eyebrow">주 IDE</div>
          <p className="muted" style={{ fontSize: 12, margin: '0 0 10px' }}>
            Clone·IDE Handoff와 IDE 실행 단계에서 이 값으로 Deep Link를 만들어요.
          </p>
          <div className="row">
            {IDE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={ide === opt.id ? 'pill' : 'tag'}
                onClick={() => setIde(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="eyebrow">건너뛴 여정 단계</div>
          <div className="muted" style={{ fontSize: 13 }}>
            {skippedSteps.length ? skippedSteps.join(', ') : '아직 건너뛴 단계가 없어요.'}
          </div>
          <button type="button" className="btn sm" style={{ marginTop: 12 }} onClick={() => setSkippedSteps([])}>
            건너뛴 단계 초기화
          </button>
          <p className="note">건너뛴 단계는 다음 기여 여정부터 자동으로 숨겨져요.</p>
        </div>
      </div>
    </section>
  )
}
