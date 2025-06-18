import { useProfile } from '../ProfileContext'

function TestZone() {
  const { profile, loading } = useProfile()

  if (loading) return <p>載入中...</p>

  return (
    <div>
      <h2>🧪 試做專區</h2>
      {profile ? (
        <p>{profile.name}，歡迎來到試做專區！</p>
      ) : (
        <p>查無個人資料，請聯絡管理員。</p>
      )}
    </div>
  )
}

export default TestZone
