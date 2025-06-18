import { useProfile } from '../ProfileContext'

function Rules() {
  const { profile, loading } = useProfile()

  if (loading) return <p>載入中...</p>

  return (
    <div>
      <h2>📜 蛋研規則</h2>
      {profile ? (
        <p>{profile.name}，請詳閱本社團規範！</p>
      ) : (
        <p>查無個人資料，請聯絡管理員。</p>
      )}
    </div>
  )
}

export default Rules
