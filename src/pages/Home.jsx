// src/pages/Home.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import './Home.css'
import Header from '../components/Header'

function Home() {
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('date', { ascending: false })

      if (error) console.error('讀取消息失敗', error)
      else setAnnouncements(data)
    }

    fetchAnnouncements()
  }, [])

  // ✅ 新增：根據 type 決定樣式
  const getTagClass = (type) => {
    switch (type) {
      case '封廚房':
        return 'tag closed'
      case '活動':
        return 'tag event'
      case '社課':
        return 'tag club'
      case '截止日':
        return 'tag deadline'
      default:
        return 'tag'
    }
  }

  return (
    <div className="home-container">
      <Header />

      <div className="home-content">
        <h2 style={{ marginTop: '16px' }}>最新消息</h2>

        {announcements.length === 0 ? (
          <p>目前尚無公告。</p>
        ) : (
          <div className="announcement-list">
            {announcements.map((item) => (
              <div key={item.id} className="announcement-card">
                <div className="announcement-text">
                  <strong>{item.title}</strong>
                  <div className="announcement-meta">
                    <span className={getTagClass(item.type)}>
                      {item.type}
                    </span>
                    <span className="announcement-footer">{item.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
