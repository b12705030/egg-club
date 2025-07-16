import { useProfile } from '../ProfileContext'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

import { FaRegCalendarCheck } from "react-icons/fa";
import { FaUserLock } from "react-icons/fa";

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

          {/* ✅ 家長與網管共用：幹部專區 */}
          {['家長', '網管'].includes(profile.identity) && (
            <div style={{ marginTop: '24px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <button onClick={() => navigate('/admin')}>
                + 幹部專區
              </button>
              <button onClick={() => navigate('/add-recipe')}>
                + 新增食譜
              </button>
            </div>
          )}

          {/* ✅ 僅網管專屬：審核時段 */}
          {profile.identity === '網管' && (
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <button onClick={() => navigate('/review')}>
                    <FaRegCalendarCheck /> 審核時段
                </button>
                <button onClick={() => navigate('/account-tools')}>
                    <FaUserLock /> 管理註冊帳號
                </button>
            </div>
          )}
        </div>
      ) : (
        <p>查無個人資料，請聯絡管理員。</p>
      )}
    </div>
  )
}

export default Rule
