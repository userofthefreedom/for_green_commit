import { Link } from 'react-router-dom'

/**
 * SCR001 Landing — "서비스 가치와 'GitHub로 시작 / 오픈소스가 처음' 분기" (기획서 표19).
 * docs/green-commit-prototype-v3.html의 #landing 화면 카피를 그대로 이관했다.
 * AuthGuard 밖 라우트 — 로그인 없이도 누구나 볼 수 있다.
 */
export function LandingPage() {
  return (
    <section>
      <div className="hero">
        <h1>코드 정답 대신, 스스로 답할 질문으로.</h1>
        <p>
          AI 시대의 주니어는 빨라지지만 얕아지기 쉽습니다. Green Commit은 AI를{' '}
          <b>생각하게 만드는 방식</b>으로 쓰게 해서, 실제 오픈소스 기여로 진짜 실력을 남깁니다.
        </p>
        <div className="center row" style={{ justifyContent: 'center' }}>
          <Link
            to="/login"
            className="btn lg"
            style={{ background: '#fff', color: 'var(--green-d)', border: 'none', fontWeight: 700 }}
          >
            GitHub로 시작하기 →
          </Link>
          <Link
            to="/login"
            className="btn lg"
            style={{ background: 'transparent', color: '#fff', border: '1px solid #ffffff88' }}
          >
            오픈소스가 처음이에요
          </Link>
        </div>
      </div>
      <div className="grid g3" style={{ marginTop: 22 }}>
        <div className="card">
          <div className="eyebrow">일반 AI</div>
          <b>"코드 정답"을 바로 줍니다</b>
          <p className="muted" style={{ margin: '8px 0 0' }}>
            한 연구에선 AI로 배운 개발자의 이해도가 17% 낮았고, 생산성 향상은 유의하지 않았어요.
          </p>
        </div>
        <div className="card" style={{ border: '2px solid var(--green)' }}>
          <div className="eyebrow">Green Commit</div>
          <b>"질문·근거·검증"을 줍니다</b>
          <p className="muted" style={{ margin: '8px 0 0' }}>
            스스로 생각·근거 인용·질문 — 고득점 학습자가 보인 인지적 관여를 습관으로.
          </p>
        </div>
        <div className="card">
          <div className="eyebrow">결과</div>
          <b>진짜 머지되는 PR</b>
          <p className="muted" style={{ margin: '8px 0 0' }}>
            첫 오픈소스 기여를 끝까지 완주해요.
          </p>
        </div>
      </div>
    </section>
  )
}
