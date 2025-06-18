import { useProfile } from '../ProfileContext'
import { supabase } from '../supabase'

function Home() {
  const { profile, loading } = useProfile()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'  // 回首頁重新觸發登入判斷
  }

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

      {/* ⬇️ 登出按鈕放在最底下 */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button onClick={handleLogout} style={{ backgroundColor: '#ffdddd', color: '#444' }}>
          登出
        </button>
      </div>
    </div>
  )
}

export default Home
