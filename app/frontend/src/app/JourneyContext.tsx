import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { getJourney, patchJourneyStep, postJourney } from '../lib/api/endpoints'
import type { Journey, UpdateJourneyStepRequest } from '../lib/api/endpoints'

const STORAGE_KEY = 'green-commit:journeySessionId'

interface JourneyMeta {
  repositoryId: string
  repositoryName: string
  issueId: string
  issueTitle: string
}

interface JourneyContextValue {
  journey: Journey | null
  meta: JourneyMeta | null
  loading: boolean
  startJourney: (meta: JourneyMeta) => Promise<Journey>
  updateStep: (stepType: string, payload: UpdateJourneyStepRequest) => Promise<void>
}

const JourneyContext = createContext<JourneyContextValue>({
  journey: null,
  meta: null,
  loading: false,
  startJourney: async () => {
    throw new Error('JourneyProvider가 없습니다')
  },
  updateStep: async () => {},
})

/**
 * F008/부록B: 현재 진행 중인 Journey(9단계)를 화면 간에 공유한다. Journey 개요(SCR008) 이후
 * Fork/Clone/Brief/Coach/Ship 화면(Phase 5~6)이 모두 같은 세션을 참조해야 하므로, Issue
 * 선택 시점에 만든 세션을 Context+localStorage(새로고침 대비)로 들고 있는다.
 */
export function JourneyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [journey, setJourney] = useState<Journey | null>(null)
  const [meta, setMeta] = useState<JourneyMeta | null>(null)
  const [loading, setLoading] = useState(false)

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

  const value = useMemo<JourneyContextValue>(
    () => ({ journey, meta, loading, startJourney, updateStep }),
    [journey, meta, loading, startJourney, updateStep],
  )
  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}

export function useJourney() {
  return useContext(JourneyContext)
}
