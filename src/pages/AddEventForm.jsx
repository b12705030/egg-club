import { useState } from 'react'
import { supabase } from '../supabase'
import './AdminPanel.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { PiCalendarPlusDuotone } from "react-icons/pi"

export default function AddEventForm({ onEventAdded }) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState('社課')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  // ✅ 避免時區錯誤：正確格式化為 yyyy-MM-dd（sv-SE 是瑞典格式）
  const formatDate = (date) => {
    return date?.toLocaleDateString('sv-SE')  // e.g. 2025-06-09
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('calendar_events').insert([{
      title,
      type,
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
    }])
    if (error) {
      alert('❌ 新增失敗：' + error.message)
    } else {
      alert('✅ 活動已新增！')
      setTitle('')
      setType('社課')
      setStartDate(null)
      setEndDate(null)
      if (onEventAdded) onEventAdded()
    }
  }

  return (
    <div className="admin-panel">
      <h2 style={{ fontSize: '24px', fontWeight: '900' }}>
        <PiCalendarPlusDuotone /> 幹部專區：新增活動
      </h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          活動名稱：
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          類型：
          <select
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="社課">社課</option>
            <option value="活動">活動</option>
            <option value="封廚房">封廚房</option>
            <option value="截止日">截止日</option>
          </select>
        </label>

        <label>
          開始日期：
          <DatePicker
            selected={startDate}
            onChange={d => setStartDate(d)}
            placeholderText="選擇開始日期"
            dateFormat="yyyy-MM-dd"
            className="date-picker"
            required
          />
        </label>

        <label>
          結束日期：
          <DatePicker
            selected={endDate}
            onChange={d => setEndDate(d)}
            placeholderText="選擇結束日期"
            dateFormat="yyyy-MM-dd"
            className="date-picker"
            required
          />
        </label>

        <button type="submit">新增</button>
      </form>
    </div>
  )
}
