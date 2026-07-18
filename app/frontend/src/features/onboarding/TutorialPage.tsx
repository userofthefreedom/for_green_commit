import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/AuthContext'
import { postTutorialProgress } from '../../lib/api/endpoints'

/**
 * SCR005 초보자 튜토리얼 — "오픈소스와 Fork→Merge 흐름" (기획서 표19, BR03).
 * v3 prototype의 #onboard 화면 카피를 그대로 이관했다. BR03에 따라 "오픈소스가
 * 처음"인 사용자에게 기본 노출되지만 스킵도 허용된다.
 * Phase 3: 완료/스킵 상태를 실제로 POST /tutorial/progress에 저장한 뒤 추천 화면으로 이동한다.
 */
export function TutorialPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)

  async function finish(skipped: boolean) {
    if (!user) return
    setSaving(true)
    try {
      await postTutorialProgress({
        userId: user.id,
        completed: !skipped,
        skipped,
        currentStep: 'DONE',
      })
    } finally {
      navigate('/recommend/repositories')
    }
  }

  return (
    <section>
      <h1>오픈소스가 뭐예요? 🌍</h1>
      <p className="lede">코딩은 좀 하지만 "오픈소스 기여"가 뭔지 감이 안 온다면 — 3분이면 충분해요.</p>
      <div className="grid g2">
        <div className="card">
          <div className="eyebrow">What · 오픈소스가 뭔가요</div>
          <p>
            <b>누구나 코드를 볼 수 있고, 누구나 개선에 참여할 수 있게 공개된 프로젝트</b>예요. 네가
            매일 쓰는 브라우저·라이브러리·앱의 상당수가 오픈소스로 만들어졌어요.
          </p>
          <p className="muted" style={{ fontSize: 13 }}>
            전 세계 개발자들이 조금씩 고쳐가며 함께 키우는 거예요. 그리고 그 "조금"에{' '}
            <b>너도 낄 수 있어요.</b>
          </p>
        </div>
        <div className="card praisecard">
          <div className="eyebrow">이런 것도 다 '기여'예요</div>
          <div className="check">
            <span className="cb on">✓</span>문서의 오타 한 글자 고치기
          </div>
          <div className="check">
            <span className="cb on">✓</span>영어 문서를 한국어로 번역
          </div>
          <div className="check">
            <span className="cb on">✓</span>예제 코드 하나 추가
          </div>
          <div className="callout g" style={{ marginTop: 10 }}>
            거창한 기능이 아니어도 돼요. <b>작은 것부터가 진짜 시작</b>이에요.
          </div>
        </div>
      </div>
      <div className="card" style={{ marginTop: 18 }}>
        <div className="eyebrow">How · 기여는 이렇게 굴러가요</div>
        <div className="flowline" style={{ margin: '6px 0 10px' }}>
          <span className="fchip">
            1 Fork
            <br />
            <span className="muted" style={{ fontWeight: 400, fontSize: 11 }}>
              내 계정으로 복사
            </span>
          </span>
          <span>→</span>
          <span className="fchip">
            2 고치기
            <br />
            <span className="muted" style={{ fontWeight: 400, fontSize: 11 }}>
              내 복사본에서
            </span>
          </span>
          <span>→</span>
          <span className="fchip">
            3 PR
            <br />
            <span className="muted" style={{ fontWeight: 400, fontSize: 11 }}>
              반영 요청
            </span>
          </span>
          <span>→</span>
          <span className="fchip">
            4 리뷰
            <br />
            <span className="muted" style={{ fontWeight: 400, fontSize: 11 }}>
              메인테이너 피드백
            </span>
          </span>
          <span>→</span>
          <span className="fchip">
            5 Merge
            <br />
            <span className="muted" style={{ fontWeight: 400, fontSize: 11 }}>
              원본에 합쳐짐 🎉
            </span>
          </span>
        </div>
        <div className="callout b">
          복잡해 보여도 괜찮아요. Green Commit이 <b>단계마다 옆에서 코치</b>하고, 익숙해진 단계는{' '}
          <b>자동화·건너뛰기</b>도 돼요.
        </div>
      </div>
      <div className="center row" style={{ marginTop: 22, justifyContent: 'center' }}>
        <button className="btn sm" onClick={() => void finish(true)} disabled={saving}>
          건너뛰기
        </button>
        <button className="btn p lg" onClick={() => void finish(false)} disabled={saving}>
          좋아, 시작해볼래 →
        </button>
      </div>
    </section>
  )
}
