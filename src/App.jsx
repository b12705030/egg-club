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
import AdminPanel from './pages/AdminPanel'
import AddEventPage from './pages/AddEventForm'
import AnnouncementDetail from './pages/AnnouncementDetail'
import KitchenCalendar from './components/KitchenCalendar'

function App() {
  const [session, setSession] = useState(null)
  const [initialLoading, setInitialLoading] = useState(true) // ⬅️ 初次載入狀態

  useEffect(() => {
    const loadSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // ✅ 只接受登入過的 session
      if (session?.provider_token) {
        setSession(session)
      } else {
        setSession(null)
      }

      setInitialLoading(false)
    }

    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  // ✅ 修改這裡：使用 global 清除所有登入狀態
  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: 'global' })
    setSession(null)
    window.location.href = '/' // 回首頁刷新
  }

  if (initialLoading) return null // 或 return <p>載入中...</p>

  if (!session) {
    return (
      <div style={{ padding: '32px' }}>
        <h1 style={{ fontSize: '40px', fontWeight: '900' }}>
          🍳 歡迎來到蛋研社網站！
        </h1>
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
            <Route path="admin" element={<AdminPanel />} />
            <Route path="/add-event" element={<AddEventPage />} />
            <Route path="/announcement/:id" element={<AnnouncementDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProfileProvider>
  )
}

export default App
