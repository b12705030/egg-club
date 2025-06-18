import { useProfile } from '../ProfileContext'

function Blog() {
  const { profile, loading } = useProfile()

  if (loading) return <p>載入中...</p>

  return (
    <div>
      <h2>📖 食譜部落格</h2>
      {profile ? (
        <p>{profile.name} 的美味筆記本 📝</p>
      ) : (
        <p>查無個人資料，請聯絡管理員。</p>
      )}
    </div>
  )
}

export default Blog
