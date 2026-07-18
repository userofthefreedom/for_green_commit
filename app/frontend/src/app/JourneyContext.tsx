import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'
import {
  getJourney,
  getPullRequestStatus,
  patchJourneyStep,
  postJourney,
  postPullRequest,
} from '../lib/api/endpoints'
import type { Journey, PullRequestLink, PullRequestStatus, UpdateJourneyStepRequest } from '../lib/api/endpoints'

const STORAGE_KEY = 'green-commit:journeySessionId'

interface JourneyMeta {
  repositoryId: string
  repositoryName: string
  issueId: string
  issueTitle: string
}

interface PullRequestState {
  link: PullRequestLink
  status: PullRequestStatus
}

interface JourneyContextValue {
  journey: Journey | null
  meta: JourneyMeta | null
  loading: boolean
  pullRequest: PullRequestState | null
  startJourney: (meta: JourneyMeta) => Promise<Journey>
  updateStep: (stepType: string, payload: UpdateJourneyStepRequest) => Promise<void>
  registerPullRequest: (prUrl: string) => Promise<PullRequestState>
}

const JourneyContext = createContext<JourneyContextValue>({
  journey: null,
  meta: null,
  loading: false,
  pullRequest: null,
  startJourney: async () => {
    throw new Error('JourneyProvider가 없습니다')
  },
  updateStep: async () => {},
  registerPullRequest: async () => {
    throw new Error('JourneyProvider가 없습니다')
  },
})

/** "https://github.com/{owner}/{repo}/pull/{number}" 형태만 지원한다(BR10: 사용자가 등록한 PR만). */
function parsePullRequestUrl(url: string): { owner: string; repo: string; number: number } | null {
  const match = url.trim().match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/i)
  if (!match) return null
  return { owner: match[1], repo: match[2], number: Number(match[3]) }
}

/**
 * F008/부록B: 현재 진행 중인 Journey(9단계)를 화면 간에 공유한다. Journey 개요(SCR008) 이후
 * Fork/Clone/Brief/Coach/Ship 화면이 모두 같은 세션을 참조해야 하므로, Issue 선택 시점에
 * 만든 세션을 Context+localStorage(새로고침 대비)로 들고 있는다.
 * Phase 6: PR 등록(F016) + 등록 직후 1회 상태 조회(F017 MVP 슬라이스)도 여기서 함께 관리해
 * Ship/Monitoring/Result 화면이 같은 결과를 공유한다.
 */
export function JourneyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [journey, setJourney] = useState<Journey | null>(null)
  const [meta, setMeta] = useState<JourneyMeta | null>(null)
  const [loading, setLoading] = useState(false)
  const [pullRequest, setPullRequest] = useState<PullRequestState | null>(null)

  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY)
    if (!savedId || !user) return
    setLoading(true)
    getJourney(savedId)
      .then(setJourney)
      .catch(() => localStorage.removeItem(STORAGE_KEY))
      .finally(() => setLoading(false))
  }, [user])

  const startJourney = useCallback(async (newMeta: JourneyMeta) => {
    if (!user) throw new Error('로그인이 필요해요')
    setLoading(true)
    try {
      const created = await postJourney({
        userId: user.id,
        repositoryId: newMeta.repositoryId,
        issueId: newMeta.issueId,
      })
      setJourney(created)
      setMeta(newMeta)
      setPullRequest(null)
      localStorage.setItem(STORAGE_KEY, created.sessionId)
      return created
    } finally {
      setLoading(false)
    }
  }, [user])

  const updateStep = useCallback(
    async (stepType: string, payload: UpdateJourneyStepRequest) => {
      if (!journey) return
      const updated = await patchJourneyStep(journey.sessionId, stepType, payload)
      setJourney(updated)
    },
    [journey],
  )

  const registerPullRequest = useCallback(
    async (prUrl: string) => {
      if (!user) throw new Error('로그인이 필요해요')
      const parsed = parsePullRequestUrl(prUrl)
      if (!parsed) {
        throw new Error('PR 주소는 https://github.com/{owner}/{repo}/pull/{번호} 형태여야 해요.')
      }
      const link = await postPullRequest({
        userId: user.id,
        sessionId: journey?.sessionId,
        repoOwner: parsed.owner,
        repoName: parsed.repo,
        prNumber: parsed.number,
        prUrl,
      })
      // F017 MVP 슬라이스: 등록 직후 1회만 실제 GitHub 공개 API로 상태를 조회한다(주기 폴링은 보류).
      const status = await getPullRequestStatus(link.id)
      const result: PullRequestState = { link, status }
      setPullRequest(result)
      return result
    },
    [user, journey],
  )

  const value = useMemo<JourneyContextValue>(
    () => ({ journey, meta, loading, pullRequest, startJourney, updateStep, registerPullRequest }),
    [journey, meta, loading, pullRequest, startJourney, updateStep, registerPullRequest],
  )
  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}

export function useJourney() {
  return useContext(JourneyContext)
}
