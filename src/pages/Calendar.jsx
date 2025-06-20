import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './Calendar.css'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useProfile } from '../ProfileContext'

function CalendarPage() {
  const { profile } = useProfile()
  const [markedDates, setMarkedDates] = useState({})

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
          const key = d.toISOString().split('T')[0]
          temp[key] = event.type
        }
      })

      setMarkedDates(temp)
    }

    fetchEvents()
  }, [])

  const getTileClass = ({ date }) => {
    const key = date.toISOString().slice(0, 10)
    const type = markedDates[key]
    return {
      '封廚房': 'tag-closed',
      '活動': 'tag-event',
      '社課': 'tag-club',
      '截止日': 'tag-deadline'
    }[type] || null
  }

  return (
    <div className="calendar-wrapper">
      <Calendar
        tileClassName={getTileClass}
        formatShortWeekday={(locale, date) => {
          const names = ['SUN', 'MON', 'THU', 'WED', 'THU', 'FRI', 'SAT']
          return names[date.getDay()]
        }}
        formatDay={(locale, date) => date.getDate()}
        locale="zh-TW"
        calendarType="gregory"  // ✅ 一週從星期日開始
      />
      <div className="calendar-legend">
        <span><span className="dot club"></span>社課</span>
        <span><span className="dot event"></span>活動</span>
        <span><span className="dot closed"></span>封廚房</span>
        <span><span className="dot deadline"></span>截止日</span>
      </div>
    </div>
  )
}

export default CalendarPage
