import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/AuthContext'

/**
 * SCR002 GitHub 회원가입 — "필수 계정·권한·자동화 추가 동의" (기획서 표19).
 * 실제 GitHub OAuth 흐름에서는 사용자가 Landing의 "GitHub로 시작하기"를 누르면 GitHub
 * 인증 화면으로 이동했다가 `?code=...`를 달고 이 라우트(`/auth/callback`)로 돌아온다.
 * 여기서 코드 교환 + 계정 생성(BR01) + Fork·PR 보조 자동화에 대한 "추가" 동의를 받는다.
 * v3 prototype의 #login 화면(권한 안내 체크리스트) 카피를 이관했다.
 *
 * Phase 1은 실제 `code` 교환 로직이 없는 스텁이다 — 버튼을 누르면 로그인에 성공한 것으로
 * 가정하고 GitHub 분석 화면으로 진행한다. AuthGuard 밖 라우트.
 */
export function AuthCallbackPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  function handleContinue() {
    // TODO(Phase 2): location.search의 code로 POST /auth/github/callback 호출,
    // 세션 확립 후 이동. 지금은 로그인 성공을 가정한 스텁이다.
    login()
    navigate('/onboarding/analysis')
  }

  return (
    <section>
      <h1>GitHub 계정으로 시작하기</h1>
      <p className="lede">
        가입은 GitHub 하나로 끝. 이때 받은 권한으로 나중에 Fork·PR을 <b>자동화</b>할 수 있어요.
      </p>
      <div className="grid g2">
        <div className="card">
          <div className="eyebrow">이 권한을 받아요 (읽기 + 기여 동작)</div>
          <div className="check">
            <span className="cb on">✓</span>공개 저장소·활동 읽기 (추천·분석용)
          </div>
          <div className="check">
            <span className="cb on">✓</span>내 Fork 생성 / PR 열기 (자동화용)
          </div>
          <div className="check muted">
            <span className="cb">×</span>비공개 저장소·이메일은 건드리지 않아요
          </div>
          <p className="note">
            권한은 언제든 설정에서 해제할 수 있어요. 자동화는 항상 사용자가 버튼을 눌러 확인한
            뒤에만 실행돼요 (BR06).
          </p>
        </div>
        <div className="card">
          <h3>로그인 / 회원가입</h3>
          <button className="btn p full lg" onClick={handleContinue}>
            ⌥ GitHub 계정으로 계속
          </button>
          <p className="note" style={{ marginTop: 14 }}>
            다른 로그인 수단은 제공하지 않아요. 기여 작업이 전부 GitHub에서 일어나기 때문에
            GitHub 계정 하나로 통일했어요.
          </p>
        </div>
      </div>
    </section>
  )
}
