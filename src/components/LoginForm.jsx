// src/components/LoginForm.jsx
import { useState } from 'react'
import { supabase } from '../supabase'
import './LoginForm.css'  // 新增的樣式檔

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
    } else {
      onLogin()
    }
  }

  return (
    <div className="login-wrapper">
      <h2 className="login-title">登入系統</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">登入</button>
        {error && <p className="login-error">{error}</p>}
      </form>
      <p className="login-note">若忘記密碼請聯絡管理員。</p>
    </div>
  )
}

export default LoginForm
