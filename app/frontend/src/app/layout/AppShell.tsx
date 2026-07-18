import { Outlet, useLocation } from 'react-router-dom'
import { TopBar } from './TopBar'
import { JourneyRail } from './JourneyRail'

/**
 * 전역 레이아웃 셸: TopBar + (Journey 화면에서만) JourneyRail + <Outlet/>.
 * `/journey/*` 경로(SCR008~015)에서만 사이드 레일을 노출한다 — v3의 `.withrail` 패턴.
 */
export function AppShell() {
  const { pathname } = useLocation()
  const showRail = pathname.startsWith('/journey')

  return (
    <div>
      <TopBar />
      <main className="wrap">
        {showRail ? (
          <div className="withrail">
            <JourneyRail />
            <div>
              <Outlet />
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  )
}
