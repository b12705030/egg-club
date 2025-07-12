// src/components/KitchenCalendar.jsx
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { supabase } from '../supabase';
import './KitchenCalendar.css';

/* 顏色對照 */
const typeColorMap = {
  封廚房: '#f3c0c0',    // 粉紅
  社課:   '#aed9a3',    // 綠
  活動:   '#a0d8ef',    // 藍
  借用廚房: '#f7cb91',  // 橘
};

/* 將資料整理成 {date: {period: {...}}} */
function groupByDateAndPeriod(rows) {
  const grouped = {};
  rows.forEach(({ date, period, type, status }) => {
    if (!grouped[date]) grouped[date] = {};
    grouped[date][period] = { type, status };
  });
  return grouped;
}

const LegendItem = ({ color, label }) => (
  <div className="legend-item">
    <span className="legend-dot" style={{ backgroundColor: color }}></span>
    <span className="legend-label">{label}</span>
  </div>
);


const KitchenCalendar = () => {
  const [scheduleData, setScheduleData] = useState({});

  /* 讀取資料 */
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('kitchen_schedule')
        .select('*');
      if (error) {
        console.error('載入 kitchen_schedule 失敗：', error.message);
        return;
      }
      setScheduleData(groupByDateAndPeriod(data));
    })();
  }, []);

  /* 每格三顆點 */
  const tileContent = ({ date }) => {
    const ymd = date.toLocaleDateString('sv-SE'); // "2025-07-12"
    const dayData = scheduleData[ymd] || {};
    const periods = ['上午', '下午', '晚上'];

    return (
      <div className="kitchen-dot-container">
        {periods.map((p, idx) => {
          const info = dayData[p];
          const valid =
            info && !(info.type === '借用廚房' && info.status === '未通過');

          return (
            <div key={idx} className="kitchen-dot-wrapper">
              <div className="kitchen-dot kitchen-dot-bg" />
              {valid && (
                <div
                  className="kitchen-dot kitchen-dot-fg"
                  style={{ backgroundColor: typeColorMap[info.type] || '#ccc' }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="kitchen-calendar-wrapper">
      <Calendar
        tileContent={tileContent}
        tileClassName={() => 'react-calendar__tile kitchen-tile'}
        className="kitchen-calendar"
        calendarType="gregory"
        locale="en-US"
        formatDay={(locale, date) => date.getDate()} // 只顯示數字
        formatShortWeekday={(locale, date) =>
          date.toLocaleDateString(locale, { weekday: 'short' }).toUpperCase()
        } // 將週日～週六改為 SUN~SAT
      />

      {/* 👇 說明區塊 */}
      <div className="kitchen-legend">
        <div className="legend-row">
            <LegendItem color="#f3c0c0" label="封廚房" />
            <LegendItem color="#aed9a3" label="社課" />
            <LegendItem color="#f7cb91" label="已被借" />
            <LegendItem color="#a0d8ef" label="活動" />
        </div>
        <p className="legend-note">僅灰色時段可借用廚房，其餘時段皆已滿或不開放廚房！</p>
      </div>
    </div>
  );
};

export default KitchenCalendar;
