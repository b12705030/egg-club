import { useState } from 'react'
import { supabase } from './supabase'

export default function LoginAndProfile() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    setProfile(null)

    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (loginError) {
      setError('登入失敗：' + loginError.message)
      setLoading(false)
      return
    }

    const userEmail = loginData.user.email
    const { data: profileData, error: profileError } = await supabase
      .from('社團名單')
      .select('*')
      .eq('email', userEmail)
      .single()

    if (profileError) {
      setError('無法讀取個人資料：' + profileError.message)
    } else {
      setProfile(profileData)
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: '24px', maxWidth: '480px', margin: 'auto' }}>
      <h2>🍳 社員登入</h2>

      {!profile && (
        <>
          <div>
            <label>Email：</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
            />
          </div>

          <div>
            <label>密碼：</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
            />
          </div>

          <button onClick={handleLogin} disabled={loading}>
            {loading ? '登入中...' : '登入'}
          </button>

          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}

      {profile && (
        <div style={{ marginTop: '24px' }}>
          <h3>👋 歡迎，{profile.name}！</h3>
          <p><strong>身份：</strong>{profile.identity}</p>
          <p><strong>系級：</strong>{profile.major}</p>
          <p><strong>家別：</strong>{profile.family}</p>
          <p><strong>屆別：</strong>{profile.year}</p>
        </div>
      )}
    </div>
  )
}
