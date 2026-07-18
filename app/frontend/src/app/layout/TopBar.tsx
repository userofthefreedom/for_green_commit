import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../AuthContext'

const NAV_ITEMS = [
  { to: '/recommend/repositories', label: '미션 찾기' },
  { to: '/contributions', label: '나의 기여' },
  { to: '/notifications', label: '알림' },
  { to: '/settings', label: '설정' },
]

/**
 * 상시 노출 상단바 (모든 화면 공통). v3 prototype의 `.topbar`를 이관했다.
 * XP 바 / 레벨 / 머지 배지 사다리 / "사고 관여 N회" 칩은 F023(최소 게임화, 표21 "선택"
 * 우선순위)의 실데이터 연동 전까지 하드코딩된 placeholder 값을 보여준다 — 화면이 비어
 * 보이지 않게 UI 요소만 유지하고 집계 로직은 만들지 않는다.
 */
export function TopBar() {
  const { status, user, logout } = useAuth()

  return (
    <header className="topbar">
      <Link to="/" className="brand" style={{ textDecoration: 'none', color: 'inherit' }}>
        <span className="leaf">🌱</span>Green Commit
      </Link>
      <nav className="nav">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'on' : '')}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="spacer" />
      <div className="lvlbox" title="XP — placeholder, F023 미연동">
        <div className="t">
          <b>Contributor Lv.4</b>
          <span>1,280 / 2,000</span>
        </div>
        <div className="xptrack">
          <div className="xpfill" style={{ width: '64%' }} />
        </div>
      </div>
      <div className="badgeladder" title="머지 배지 사다리 — placeholder, F023 미연동">
        🏅 배지 3단계
      </div>
      <div className="thinkchip" title="사고 역량 지도 관여 횟수 — placeholder, F023 미연동">
        🧠 사고 관여 4회
      </div>
      <Link to="/notifications" className="bell" title="알림 보관함">
        🔔<span className="bdot">2</span>
      </Link>
      {status === 'authenticated' && user ? (
        <button
          className="avatar"
          title={`${user.githubLogin} · 로그아웃`}
          onClick={() => void logout()}
          style={{ border: 'none', cursor: 'pointer', backgroundImage: user.avatarUrl ? `url(${user.avatarUrl})` : undefined, backgroundSize: 'cover' }}
        >
          {!user.avatarUrl && user.githubLogin.charAt(0).toUpperCase()}
        </button>
      ) : (
        <Link to="/login" className="btn sm">
          로그인
        </Link>
      )}
    </header>
  )
}
