import { useState } from 'react'
import { Link } from 'react-router-dom'

const IDE_OPTIONS = [
  { id: 'VSCODE', label: 'VS Code' },
  { id: 'INTELLIJ', label: 'IntelliJ / JetBrains' },
  { id: 'OTHER', label: '기타' },
]

/**
 * SCR004 추가 프로필 — "IDE·경험·관심·시간·첫 기여 여부" (기획서 표19).
 * v3 prototype의 #diagnose 화면(경험·관심 분야·투자 시간)을 이관하되, 이전 감사에서
 * 지적된 갭인 "주 IDE 선택"과 "첫 기여 여부" 필드를 추가해 기획서 SCR004 정의를
 * 완전히 커버하도록 보강했다. Phase 1은 선택 상태만 로컬로 들고 있고 저장(PUT
 * /users/me/onboarding)은 연결하지 않는다.
 */
export function ProfilePage() {
  const [ide, setIde] = useState<string>('VSCODE')
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null)

  return (
    <section>
      <h1>몇 가지만 알려주세요</h1>
      <p className="lede">더 잘 맞는 미션을 추천하는 데 쓰여요.</p>
      <div className="grid g2">
        <div className="card">
          <div className="eyebrow">경험</div>
          <div style={{ margin: '10px 0' }}>
            <div className="muted" style={{ fontSize: 12, marginBottom: 5 }}>
              프레임워크(React 등)
            </div>
            <span className="tag">없음</span>
            <span className="pill">보통</span>
            <span className="tag">능숙</span>
          </div>
          <div style={{ margin: '10px 0' }}>
            <div className="muted" style={{ fontSize: 12, marginBottom: 5 }}>
              Git 협업
            </div>
            <span className="tag">없음</span>
            <span className="pill">보통</span>
            <span className="tag">능숙</span>
          </div>
          <div style={{ margin: '10px 0' }}>
            <div className="muted" style={{ fontSize: 12, marginBottom: 5 }}>
              외부 PR 경험
            </div>
            <span className="pill">0회</span>
            <span className="tag">1~2회</span>
            <span className="tag">3회+</span>
          </div>

          <div className="eyebrow" style={{ marginTop: 16 }}>
            오픈소스 기여, 처음이세요?
          </div>
          <p className="muted" style={{ fontSize: 12, margin: '0 0 8px' }}>
            첫 기여자면 초보자 튜토리얼(SCR005)을 기본으로 보여드려요 (BR03, 스킵 가능).
          </p>
          <div className="row">
            <button
              type="button"
              className={isFirstTime === true ? 'pill' : 'tag'}
              onClick={() => setIsFirstTime(true)}
            >
              네, 처음이에요
            </button>
            <button
              type="button"
              className={isFirstTime === false ? 'pill' : 'tag'}
              onClick={() => setIsFirstTime(false)}
            >
              아니요, 해봤어요
            </button>
          </div>
        </div>

        <div className="card">
          <div className="eyebrow">관심 분야 · 투자 시간</div>
          <div style={{ margin: '8px 0' }}>
            <span className="pill">공익</span>
            <span className="tag">문서</span>
            <span className="pill">웹</span>
            <span className="tag">데이터</span>
          </div>
          <div className="muted" style={{ fontSize: 12, margin: '14px 0 5px' }}>
            주당 투자 가능 시간
          </div>
          <div className="btn full" style={{ justifyContent: 'space-between' }}>
            주 2~3시간 <span>▾</span>
          </div>

          <div className="muted" style={{ fontSize: 12, margin: '14px 0 5px' }}>
            주로 쓰는 IDE
          </div>
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
          <p className="note">Clone·IDE Handoff(SCR010)와 IDE 실행 단계에서 이 값으로 Deep Link를 만들어요.</p>

          <Link to="/recommend/repositories" className="btn p full lg" style={{ marginTop: 18 }}>
            추천 받기 →
          </Link>
        </div>
      </div>
    </section>
  )
}
