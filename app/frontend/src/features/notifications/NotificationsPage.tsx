interface NotificationRow {
  id: string
  icon: string
  message: string
  time: string
  unread?: boolean
}

// Phase 1 placeholder — 실제로는 GET /notifications(표37)로 채워진다.
// F018 "알림 보관함"은 표21 "필수 확장" 항목이라 MVP는 단순 조회만 실제 동작한다.
const MOCK_NOTIFICATIONS: NotificationRow[] = [
  { id: '1', icon: '💬', message: 'jiyeong/teammates #12603에 새 리뷰 코멘트가 달렸어요', time: '10분 전', unread: true },
  { id: '2', icon: '✅', message: '내 PR이 머지됐어요 — 축하해요!', time: '3시간 전', unread: true },
  { id: '3', icon: '🔁', message: 'CI 재실행 결과: 통과', time: '어제' },
]

/**
 * SCR016 알림 — "새 Review·Merge·변경 요청" (기획서 표19).
 * v3 prototype #notifs 화면을 이관했다.
 */
export function NotificationsPage() {
  return (
    <section>
      <h1>알림 보관함 🔔</h1>
      <p className="lede">코멘트가 달리거나 머지되면 여기에 모여요. (GitHub 알림을 폴링해 가져와요)</p>
      <div className="card">
        {MOCK_NOTIFICATIONS.map((n) => (
          <div key={n.id} className={n.unread ? 'nrow unread' : 'nrow'}>
            <div className="nic">{n.icon}</div>
            <div style={{ flex: 1 }}>
              <div>{n.message}</div>
              <div className="muted" style={{ fontSize: 12 }}>
                {n.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
