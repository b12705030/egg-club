// ✅ 1. 建立 contexts/ProfileContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from "./supabase";

const ProfileContext = createContext()

export function ProfileProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // 初始化 session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  // 讀取 profile 資料
  useEffect(() => {
    if (session) {
      const fetchProfile = async () => {
        setLoading(true)
        const { data, error } = await supabase
          .from('社團名單')
          .select('*')
          .eq('email', session.user.email)
          .single()

        if (error) {
          console.error('❌ 查詢社團名單失敗：', error.message)
          setProfile(null)
        } else {
          setProfile(data)
        }
        setLoading(false)
      }

      fetchProfile()
    } else {
      setProfile(null)
      setLoading(false)
    }
  }, [session])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setProfile(null)
  }

  return (
    <ProfileContext.Provider value={{ session, profile, loading, handleLogout }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext)
}
