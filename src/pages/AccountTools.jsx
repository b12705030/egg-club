import { useState } from 'react'
import { useProfile } from '../ProfileContext'

function AccountTools() {
  const { profile } = useProfile()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTION_URL}/register-members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY}`,
        },
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || '註冊失敗')
      }

      const data = await res.json()
      setResult(data)
    } catch (err) {
        setResult({ error: '無法完成註冊，請稍後再試。', detail: err.message });
    }

    setLoading(false)
  }

  if (!profile || profile.identity !== '網管') {
    return <p style={{ padding: '24px' }}>🚫 無權限存取此頁面</p>
  }

  return (
    <div style={{ padding: '24px' }}>
      <h2>🛠️ 帳號註冊工具</h2>
      <p>將自動註冊社團名單中已有 email 的成員，並回傳帳號密碼清單。</p>
      <button onClick={handleRegister} disabled={loading} style={{
        marginTop: '16px',
        backgroundColor: '#f5e1c2',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}>
        {loading ? '註冊中...' : '開始註冊'}
      </button>

      {result && (
        <div style={{ marginTop: '24px' }}>
          <h4>📋 註冊結果：</h4>
          {result.error ? (
            <div style={{ color: 'red' }}>
                <p>❌ 無法完成註冊，請稍後再試。</p>
                <p style={{ fontSize: '0.9em', marginTop: '4px' }}>{result.detail}</p>
            </div>
          ) : (
            <ul>
              {result.map((acc, idx) => (
                <li key={idx}>
                  👤 <strong>{acc.name}</strong> ｜帳號：{acc.email}｜密碼：{acc.password}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default AccountTools
