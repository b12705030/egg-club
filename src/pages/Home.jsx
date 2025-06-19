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

  return (
    <div className="home-container"> {/* ✅ 外層固定全寬背景 */}
      <Header />

      <div className="home-content"> {/* ✅ 內部內容包一層 */}
        <h2 style={{ marginTop: '16px' }}>📢 最新消息</h2>

        {announcements.length === 0 ? (
          <p>目前尚無公告。</p>
        ) : (
          <div className="announcement-list">
            {announcements.map((item) => (
              <div key={item.id} className="announcement-card">
                <div className="announcement-text">
                  <strong>{item.title}</strong>
                  <span className={`tag ${item.type === '封廚房' ? 'closed' : 'event'}`}>
                    {item.type}
                  </span>
                </div>
                <div className="announcement-footer">{item.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
