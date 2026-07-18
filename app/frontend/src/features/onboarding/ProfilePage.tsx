import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/AuthContext'
import { putUserOnboarding } from '../../lib/api/endpoints'
import type { ExperienceLevel, PrimaryIde } from '../../lib/api/endpoints'

const IDE_OPTIONS: { id: PrimaryIde; label: string }[] = [
  { id: 'VSCODE', label: 'VS Code' },
  { id: 'INTELLIJ_IDEA', label: 'IntelliJ / JetBrains' },
  { id: 'OTHER', label: '기타' },
]
const EXPERIENCE_OPTIONS: { id: ExperienceLevel; label: string }[] = [
  { id: 'FIRST_TIME', label: '0회' },
  { id: 'ONE_TO_TWO', label: '1~2회' },
  { id: 'THREE_PLUS', label: '3회+' },
]
const CONFIDENCE_OPTIONS = [
  { id: 1, label: '없음' },
  { id: 2, label: '보통' },
  { id: 3, label: '능숙' },
]
const INTEREST_OPTIONS = ['공익', '문서', '웹', '데이터', '테스트', '버그']
const WEEKLY_HOURS_OPTIONS = [
  { id: 1, label: '주 1시간 미만' },
  { id: 3, label: '주 2~3시간' },
  { id: 5, label: '주 4~6시간' },
  { id: 8, label: '주 7시간+' },
]

/**
 * SCR004 추가 프로필 — "IDE·경험·관심·시간·첫 기여 여부" (기획서 표13/표19).
 * Phase 3: 실제로 PUT /users/me/onboarding에 저장하고, BR03에 따라 제출 직후 분기한다 —
 * 첫 기여자면 튜토리얼(SCR005)로 기본 진입시키고, 아니면 바로 추천으로 건너뛴다.
 */
export function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [ide, setIde] = useState<PrimaryIde>('VSCODE')
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('FIRST_TIME')
  const [gitPrConfidence, setGitPrConfidence] = useState<number>(1)
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null)
  const [interests, setInterests] = useState<string[]>([])
  const [weeklyHours, setWeeklyHours] = useState<number>(3)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleInterest(tag: string) {
    setInterests((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  async function handleSubmit() {
    if (!user) return
    if (isFirstTime === null) {
      setError('오픈소스 기여가 처음인지 알려주세요.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await putUserOnboarding({
        userId: user.id,
        primaryIde: ide,
        experienceLevel,
        firstTimeContributor: isFirstTime,
        interestAreas: interests.join(','),
        contributionTypes: interests.join(','),
        weeklyHours,
        gitPrConfidence,
      })
      // BR03: 첫 기여자는 튜토리얼로, 아니면 바로 추천으로.
      navigate(isFirstTime ? '/onboarding/tutorial' : '/recommend/repositories')
    } catch {
      setError('저장에 실패했어요. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <h1>몇 가지만 알려주세요</h1>
      <p className="lede">더 잘 맞는 미션을 추천하는 데 쓰여요.</p>
      <div className="grid g2">
        <div className="card">
          <div className="eyebrow">경험</div>
          <div style={{ margin: '10px 0' }}>
            <div className="muted" style={{ fontSize: 12, marginBottom: 5 }}>
              Git 협업 자신감
            </div>
            <div className="row">
              {CONFIDENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={gitPrConfidence === opt.id ? 'pill' : 'tag'}
                  onClick={() => setGitPrConfidence(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ margin: '10px 0' }}>
            <div className="muted" style={{ fontSize: 12, marginBottom: 5 }}>
              외부 PR 경험
            </div>
            <div className="row">
              {EXPERIENCE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={experienceLevel === opt.id ? 'pill' : 'tag'}
                  onClick={() => setExperienceLevel(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
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
            {INTEREST_OPTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={interests.includes(tag) ? 'pill' : 'tag'}
                onClick={() => toggleInterest(tag)}
                style={{ marginRight: 6, marginBottom: 6 }}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="muted" style={{ fontSize: 12, margin: '14px 0 5px' }}>
            주당 투자 가능 시간
          </div>
          <div className="row">
            {WEEKLY_HOURS_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={weeklyHours === opt.id ? 'pill' : 'tag'}
                onClick={() => setWeeklyHours(opt.id)}
              >
                {opt.label}
              </button>
            ))}
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

          {error && (
            <p className="muted" style={{ color: 'var(--amber, #b7791f)' }}>
              {error}
            </p>
          )}
          <button className="btn p full lg" style={{ marginTop: 18 }} onClick={handleSubmit} disabled={saving}>
            {saving ? '저장 중…' : '추천 받기 →'}
          </button>
        </div>
      </div>
    </section>
  )
}
