import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useProfile } from '../ProfileContext';
import './KitchenReservation.css';

import { LuCalendarCheck } from "react-icons/lu";
import { TbCalendarTime } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';  // ✅ 加上頁面跳轉

const statusColor = {
  已核准: '#ffe08a',
  待審核: '#d4e1ff',
  未通過: '#f7c0c0',
  '不需審核': '#d0d0d0',
};

const periodToTime = {
  上午: '08:00–12:30',
  下午: '12:30–17:00',
  晚上: '17:00–21:00',
};

export default function MyReservationList() {
  const { profile, loading } = useProfile();
  const [records, setRecords] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();  // ✅ 初始化 useNavigate

  useEffect(() => {
    if (!profile || loading) return;

    (async () => {
      const { data, error } = await supabase
        .from('kitchen_schedule')
        .select('*')
        .eq('name', profile.name)
        .order('date', { ascending: true });

      if (error) {
        setFetchError(error.message);
      } else {
        setRecords(data);
      }
    })();
  }, [profile, loading]);

  if (loading) return null;
  if (fetchError) return <p style={{ color: 'red' }}>{fetchError}</p>;

  return (
    <>
      {/* ✅ 標題列＋按鈕 */}
      <div className="kitchen-section-header">
        <h2 className="kitchen-section-title">你預約的廚房時段</h2>
        <button className="apply-trial-btn" onClick={() => navigate('/trial-request')}>
          + 申請試作
        </button>
      </div>

      {/* ✅ 預約紀錄區 */}
      {records.length === 0 ? (
        <p>目前沒有預約紀錄。</p>
      ) : (
        records.map((r) => (
          <div key={`${r.date}-${r.period}`} className="kitchen-reservation-card">
            <div className="kitchen-reservation-info">
              <div className="info-row">
                <span className="icon"><LuCalendarCheck /></span>
                <span>日期：{r.date}</span>
              </div>
              <div className="info-row">
                <span className="icon"><TbCalendarTime /></span>
                <span>時段：{periodToTime[r.period] ?? r.period}</span>
              </div>
            </div>
            <div
              className="status-label"
              style={{ backgroundColor: statusColor[r.status] || '#e0e0e0' }}
            >
              {r.status}
            </div>
          </div>
        ))
      )}
    </>
  );
}
