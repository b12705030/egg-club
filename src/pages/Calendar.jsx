import { useProfile } from '../ProfileContext'

function Calendar() {
  const { profile, loading } = useProfile()

  if (loading) return <p>載入中...</p>

  return (
    <div>
      <h2>📅 行事曆</h2>
      {profile ? (
        <p>哈囉 {profile.name}，這是你的行事曆頁面！</p>
      ) : (
        <p>查無個人資料，請聯絡管理員。</p>
      )}
    </div>
  )
}

export default Calendar
