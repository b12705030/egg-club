import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './Calendar.css'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useProfile } from '../ProfileContext'
import { useNavigate } from 'react-router-dom'

function CalendarPage() {
  const { profile } = useProfile()
  const [markedDates, setMarkedDates] = useState({})
  const [selectedEvent, setSelectedEvent] = useState(null)
  const navigate = useNavigate()

  // ✅ 修正：不受時區影響的日期 key 生成
  const toDateKey = (date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from('calendar_events').select('*')
      if (error) return console.error(error)

      const temp = {}
      data.forEach(event => {
        const start = new Date(event.start_date)
        const end = new Date(event.end_date)
        for (
          let d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
          d <= end;
          d.setDate(d.getDate() + 1)
        ) {
          const key = toDateKey(d)
          temp[key] = {
            type: event.type,
            title: event.title
          }
        }
      })
      setMarkedDates(temp)
    }

    fetchEvents()
  }, [])

  const getTileClass = ({ date }) => {
    const key = toDateKey(date)
    const info = markedDates[key]
    return {
      '封廚房': 'tile-closed',
      '活動': 'tile-event',
      '社課': 'tile-club',
      '截止日': 'tile-deadline',
    }[info?.type] || null
  }

  return (
    <div className="calendar-wrapper">
      <Calendar
        tileClassName={getTileClass}
        formatShortWeekday={(locale, date) => {
          const names = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
          return names[date.getDay()]
        }}
        formatDay={(locale, date) => date.getDate()}
        locale="zh-TW"
        calendarType="gregory"
        prevLabel="‹"
        nextLabel="›"
        showDoubleView={false}
        showFixedNumberOfWeeks={true}
        navigationLabel={({ date }) => (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 'bold',
            fontSize: '20px',
            width: '160px',
          }}>
            <span>{date.toLocaleString('en-US', { month: 'long' })} {date.getFullYear()}</span>
          </div>
        )}
        onClickDay={(value) => {
          const key = toDateKey(value)
          const info = markedDates[key]
          if (info) {
            setSelectedEvent({
              date: key,
              title: info.title,
              type: info.type
            })
          } else {
            setSelectedEvent(null)
          }
        }}
      />

      {/* ✅ 活動資訊卡片 */}
      {selectedEvent && (
        <div style={{
          marginTop: '16px',
          backgroundColor: '#fff7ed',
          border: '1px solid #ccc',
          borderRadius: '12px',
          padding: '16px',
          maxWidth: '360px',
          marginLeft: 'auto',
          marginRight: 'auto',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'left',
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{selectedEvent.title}</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
            類型：{selectedEvent.type}<br />
            日期：{selectedEvent.date}
          </p>
        </div>
      )}

      <div className="calendar-legend">
        <span><span className="dot club"></span>社課</span>
        <span><span className="dot event"></span>活動</span>
        <span><span className="dot closed"></span>封廚房</span>
        <span><span className="dot deadline"></span>截止日</span>
      </div>

      {['家長', '網管'].includes(profile?.identity) && (
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/add-event')}
            style={{
              backgroundColor: '#e6f2d9',
              color: '#2f4f2f',
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ➕ 新增活動
          </button>
        </div>
      )}
    </div>
  )
}

export default CalendarPage
