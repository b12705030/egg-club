import { useProfile } from '../ProfileContext'

function Home() {
  const { profile, loading } = useProfile()

  if (loading) return <p>載入中...</p>

  return (
    <div>
      <h2>🍳 歡迎來到主畫面！</h2>
      {profile ? (
        <div style={{ marginTop: '16px' }}>
          <p><strong>姓名：</strong>{profile.name}</p>
          <p><strong>身份：</strong>{profile.identity}</p>
          <p><strong>系級：</strong>{profile.major}</p>
          <p><strong>家別：</strong>{profile.family}</p>
          <p><strong>屆別：</strong>{profile.year}</p>
        </div>
      ) : (
        <p>查無個人資料，請聯絡管理員。</p>
      )}
    </div>
  )
}

export default Home