import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { ProfileProvider } from './ProfileContext'

import TabLayout from './TabLayout'
import LoginForm from './components/LoginForm'
import Home from './pages/Home'
import Calendar from './pages/Calendar'
import TestZone from './pages/TestZone'
import Blog from './pages/Blog'
import Rules from './pages/Rules'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // ✅ 僅接受有 provider_token 的 session，避免自動登入
      if (session?.provider_token) {
        setSession(session)
      } else {
        setSession(null)
      }
    }

    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => listener?.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: 'local' }) // ✅ 清除 local 登入
    setSession(null)
    window.location.href = '/' // 強制 reload 回首頁
  }

  if (!session) {
    return (
      <div style={{ padding: '32px' }}>
        <h1>🍳 歡迎來到蛋研社網站！</h1>
        <LoginForm
          onLogin={() =>
            supabase.auth.getSession().then(({ data }) => {
              if (data.session?.provider_token) {
                setSession(data.session)
              }
            })
          }
        />
      </div>
    )
  }

  return (
    <ProfileProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<TabLayout session={session} onLogout={handleLogout} />}
          >
            <Route index element={<Home />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="test" element={<TestZone />} />
            <Route path="blog" element={<Blog />} />
            <Route path="rules" element={<Rules />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProfileProvider>
  )
}

export default App
