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
  const [date, setDate] = useState(null)
  const [content, setContent] = useState('')

  // 允許進入的身份清單
  const allowedRoles = ['家長', '網管'];

  if (!profile || !allowedRoles.includes(profile.identity)) {
    // 🚫 若使用者不存在，或其身分不在允許清單，直接顯示無權限訊息
    return <p style={{ padding: '24px' }}>🚫 無權限進入此頁面</p>;
  }

  // ✅ 避免 toISOString() 造成時差的手動格式化
  const formatDate = (date) => {
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('announcements').insert([{
      title,
      type,
      date: formatDate(date),  // ✅ 使用格式化後的字串
      content
    }])
    if (error) {
      alert('新增失敗：' + error.message)
    } else {
      alert('新增成功！')
      setTitle('')
      setType('活動')
      setDate(null)
      setContent('')
      navigate('/')
    }
  }

  return (
    <div className="admin-panel">
      <h2 style={{ fontSize: '24px', fontWeight: '900' }}>
        <PiChalkboardTeacherDuotone /> 幹部專區：新增公告
      </h2>
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

        <label>
          活動內容：
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="請輸入詳細內容"
            rows={4}
            required
          />
        </label>

        <button type="submit">新增</button>
      </form>
    </div>
  )
}

export default AdminPanel
