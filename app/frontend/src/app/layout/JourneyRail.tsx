import { useLocation } from 'react-router-dom'

const MACRO_STEPS = [
  { key: 'overview', label: 'Journey 개요', path: '/journey/overview' },
  { key: 'fork', label: 'Fork', path: '/journey/fork' },
  { key: 'clone', label: 'Clone·환경', path: '/journey/clone' },
  { key: 'brief', label: 'Repo·Issue Brief', path: '/journey/brief' },
  { key: 'coach', label: '질문 Coach', path: '/journey/coach' },
  { key: 'ship', label: 'Commit·PR', path: '/journey/ship' },
  { key: 'monitoring', label: 'PR Monitoring', path: '/journey/monitoring' },
  { key: 'result', label: '결과', path: '/journey/result' },
]

/**
 * Journey 진행 사이드바. v3의 `renderRails()` / `.rail` 사이드바를 정적 placeholder로
 * 이관했다. 실제로는 사용자별 완료/스킵 상태(JourneyStep, StepPreference 엔티티)로
 * 채워지지만 Phase 1은 현재 라우트를 기준으로 한 정적 하이라이트만 제공한다.
 */
export function JourneyRail() {
  const { pathname } = useLocation()
  const currentIndex = MACRO_STEPS.findIndex((step) => pathname.startsWith(step.path))

  return (
    <aside className="rail">
      <h4>기여 여정</h4>
      {MACRO_STEPS.map((step, index) => {
        const state = index === currentIndex ? 'cur' : index < currentIndex ? 'done' : ''
        return (
          <div key={step.key} className={['rstep', state].filter(Boolean).join(' ')}>
            <span className="n">{state === 'done' ? '✓' : index + 1}</span>
            {step.label}
          </div>
        )
      })}
    </aside>
  )
}
