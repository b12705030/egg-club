// src/pages/AdminPanel.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useProfile } from '../ProfileContext'
import './AdminPanel.css'
import { PiChalkboardTeacherDuotone } from "react-icons/pi"

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

function AdminPanel() {
  const { profile } = useProfile()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [type, setType] = useState('活動')
  const [date, setDate] = useState(null)  // 改成 Date 物件

  if (!profile || profile.identity !== '家長') {
    return <p style={{ padding: '24px' }}>🚫 無權限進入此頁面</p>
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('announcements').insert([{
      title,
      type,
      date: date?.toISOString().slice(0, 10)  // 傳到資料庫要轉成 yyyy-mm-dd
    }])
    if (error) {
      alert('新增失敗：' + error.message)
    } else {
      alert('新增成功！')
      setTitle('')
      setType('活動')
      setDate(null)
      navigate('/')
    }
  }

  return (
    <div className="admin-panel">
      <h2><PiChalkboardTeacherDuotone /> 幹部專區：新增公告</h2>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          標題：
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </label>

        <label>
          類型：
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="封廚房">封廚房</option>
            <option value="活動">活動</option>
            <option value="社課">社課</option>
            <option value="截止日">截止日</option>
          </select>
        </label>

        <label>
          日期：
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            placeholderText="選擇日期"
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

export default AdminPanel
