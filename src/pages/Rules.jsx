// src/pages/Rule.jsx
import { useProfile } from '../ProfileContext'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

function Rule() {
  const { profile, loading } = useProfile()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: 'local' })
    window.location.href = '/'
  }

  if (loading) return <p>載入中...</p>

  return (
    <div>
      <h2>🍳 歡迎來到其他！</h2>

      {profile ? (
        <div style={{ marginTop: '16px' }}>
          <p><strong>姓名：</strong>{profile.name}</p>
          <p><strong>身份：</strong>{profile.identity}</p>
          <p><strong>系級：</strong>{profile.major}</p>
          <p><strong>家別：</strong>{profile.family}</p>
          <p><strong>屆別：</strong>{profile.year}</p>

          {/* ✅ 幹部專區按鈕（只有家長可見） */}
          {profile.identity === '家長' && (
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button onClick={() => navigate('/admin')} style={{
                backgroundColor: '#e6f2d9',
                color: '#2f4f2f',
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                ➕ 幹部專區
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>查無個人資料，請聯絡管理員。</p>
      )}

      {/* 登出按鈕 */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button onClick={handleLogout} style={{
          backgroundColor: '#ffdddd',
          color: '#444',
          padding: '10px 24px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '1rem',
          cursor: 'pointer'
        }}>
          登出
        </button>
      </div>
    </div>
  )
}

export default Rule
