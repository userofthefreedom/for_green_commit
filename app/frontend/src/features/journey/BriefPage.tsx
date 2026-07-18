import { useNavigate } from 'react-router-dom'

/**
 * SCR011 Repo·Issue Brief — "프로젝트 목적·문제·기대·완료 기준" (기획서 표19).
 * v3 prototype #analyze2 화면을 이관했다. 실제로는 Local GPU+RAG 분석 결과(원문 링크
 * 항상 동반)로 채워지지만, Phase 1은 고정 placeholder 텍스트를 보여준다.
 */
export function BriefPage() {
  const navigate = useNavigate()

  return (
    <>
      <h1>레포 &amp; 이슈, 쉽게 정리해줄게요</h1>
      <p className="lede">코드를 만지기 전에 "여기가 어떤 곳이고, 내가 뭘 고치는지"를 한눈에.</p>
      <div className="grid g2">
        <div className="card">
          <div className="eyebrow">이 레포는 어떤 곳? · TEAMMATES</div>
          <p>학생 피드백/세션 관리를 도와주는 교육용 오픈소스예요. Angular 프론트엔드 + Java 백엔드로 이루어져 있어요.</p>
          <div className="eyebrow" style={{ marginTop: 12 }}>
            기술 스택
          </div>
          <div>
            <span className="tag">TypeScript</span>
            <span className="tag">Angular</span>
            <span className="tag">Java</span>
          </div>
          <div className="callout g" style={{ marginTop: 12 }}>
            겁먹지 마세요 — 이번에 건드릴 건 이 중 아주 작은 부분이에요.
          </div>
        </div>
        <div className="card">
          <div className="eyebrow">네가 고른 이슈</div>
          <b style={{ display: 'block', fontSize: 15 }}>Typo in instructor help page</b>
          <p style={{ margin: '6px 0 12px' }}>강사 도움말 화면에 오타(Sessios→Sessions)가 있어요. 한 글자만 고치면 되는, 첫 기여로 딱 좋은 이슈예요.</p>
          <table className="kv">
            <tbody>
              <tr>
                <td>지금 문제</td>
                <td>도움말 문구에 오타(Sessios→Sessions)</td>
              </tr>
              <tr>
                <td>기대 결과</td>
                <td>올바른 문구로 표시</td>
              </tr>
              <tr>
                <td>완료 기준</td>
                <td>오타 수정 · 프론트 빌드 통과</td>
              </tr>
            </tbody>
          </table>
          <div className="callout b" style={{ marginTop: 10 }}>
            난이도: 쉬움 · 범위: 파일 1개, 국소 변경
          </div>
          <button type="button" className="btn p full lg" style={{ marginTop: 14 }} onClick={() => navigate('/journey/coach')}>
            학습하며 수정하기 →
          </button>
        </div>
      </div>
    </>
  )
}
