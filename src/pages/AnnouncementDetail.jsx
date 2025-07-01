import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import './Home.css' // ✅ 沿用首頁樣式

function AnnouncementDetail() {
  const { id } = useParams()
  const [announcement, setAnnouncement] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAnnouncement = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('id', id)
        .single()

      if (error) console.error('讀取失敗', error)
      else setAnnouncement(data)
    }

    fetchAnnouncement()
  }, [id])

  if (!announcement) return <p style={{ padding: '24px' }}>載入中...</p>

  return (
    <div className="home-container">
      <div className="home-content" style={{ maxWidth: '720px', margin: '0 auto' }}>
        
        {/* ✅ 返回鍵：改成更美觀且直覺 */}
        <div
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            color: '#5b4b3f',
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '20px',
            transition: 'opacity 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.7)}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
        >
          <span style={{
            fontSize: '16px',
            lineHeight: '1',
            display: 'inline-block',
          }}>←</span>
          返回
        </div>

        {/* ✅ 公告卡片 */}
        <div className="announcement-card">
          <div className="announcement-text">
            <strong style={{ fontSize: '18px' }}>{announcement.title}</strong>

            <div className="announcement-meta">
              <span className={`tag ${mapTagClass(announcement.type)}`}>
                {announcement.type}
              </span>
              <span className="announcement-footer">{announcement.date}</span>
            </div>

            <div className="announcement-content" style={{ fontSize: '15px', lineHeight: '1.6' }}>
              {announcement.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ✅ 對應公告類型 → 樣式 class
function mapTagClass(type) {
  switch (type) {
    case '封廚房':
      return 'closed'
    case '活動':
      return 'event'
    case '社課':
      return 'club'
    case '截止日':
      return 'deadline'
    default:
      return ''
  }
}

export default AnnouncementDetail
