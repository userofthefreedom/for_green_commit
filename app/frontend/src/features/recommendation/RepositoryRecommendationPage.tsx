import { useNavigate } from 'react-router-dom'

interface RepoCard {
  id: string
  name: string
  tagline: string
  fitScore: number
  languages: string[]
  goodFirstIssues: number
  evidence: string
  best?: boolean
}

// Phase 1 placeholder — 실제로는 GET /recommendations/repositories(개인화 추천, 표37)로 채워진다.
// "카드 세부속성" 갭 해소: 적합도·언어·good-first-issue 개수·추천 근거(Evidence)를 카드에 노출한다.
const MOCK_REPOS: RepoCard[] = [
  {
    id: 'teammates',
    name: 'TEAMMATES',
    tagline: '교육기관용 피드백/평가 관리 오픈소스 (Angular + Java)',
    fitScore: 94,
    languages: ['TypeScript', 'Java'],
    goodFirstIssues: 6,
    evidence: '최근 30일 활동 · "good first issue" 라벨 다수 · 사용 언어(JS/TS)와 70% 일치',
    best: true,
  },
  {
    id: 'docs-i18n',
    name: 'open-docs-i18n',
    tagline: '문서 다국어 번역/오타 교정 프로젝트',
    fitScore: 81,
    languages: ['Markdown'],
    goodFirstIssues: 12,
    evidence: '관심 분야 "문서"와 일치 · 리뷰 응답 평균 5시간',
  },
  {
    id: 'py-datatoolkit',
    name: 'py-datatoolkit',
    tagline: '데이터 전처리 유틸리티 라이브러리 (Python)',
    fitScore: 68,
    languages: ['Python'],
    goodFirstIssues: 3,
    evidence: '사용 언어(Python 20%)와 부분 일치 · 관심 분야 "데이터"와 일치',
  },
]

/**
 * SCR006 Repository 추천 — "프로젝트 설명과 적합도·Evidence" (기획서 표19).
 * v3 prototype #recommend 화면의 1단계(레포 선택)를 분리 이관했다. 레포를 고르면
 * SCR007 Issue 선택으로 넘어간다 (BR04: Repository 선택 후에만 해당 Issue 후보 노출).
 */
export function RepositoryRecommendationPage() {
  const navigate = useNavigate()

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0 }}>미션 찾기 — 레포부터 골라요</h1>
          <p className="lede" style={{ margin: '4px 0 0' }}>
            기여할 레포를 고르면, 그 레포의 Issue가 다음 화면에 떠요. 마음에 안 들면 언제든 레포를
            다시 고르세요.
          </p>
        </div>
        <button className="btn" type="button">
          🔄 새로고침
        </button>
      </div>

      <div className="eyebrow" style={{ marginTop: 16 }}>
        1. 레포 선택
      </div>
      <div className="grid g3" style={{ marginTop: 10 }}>
        {MOCK_REPOS.map((repo) => (
          <div key={repo.id} className={repo.best ? 'rec best' : 'rec'}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <b>{repo.name}</b>
              <span className="pill">적합도 {repo.fitScore}</span>
            </div>
            <p className="muted" style={{ fontSize: 13, margin: '8px 0' }}>
              {repo.tagline}
            </p>
            <div>
              {repo.languages.map((lang) => (
                <span key={lang} className="tag">
                  {lang}
                </span>
              ))}
              <span className="tag">good first issue {repo.goodFirstIssues}개</span>
            </div>
            <div className="callout b" style={{ marginTop: 10, fontSize: 12 }}>
              📎 {repo.evidence}
            </div>
            <button
              type="button"
              className="btn p full"
              style={{ marginTop: 12 }}
              onClick={() => navigate(`/recommend/issues?repositoryId=${repo.id}&repositoryName=${encodeURIComponent(repo.name)}`)}
            >
              이 레포 선택 →
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
