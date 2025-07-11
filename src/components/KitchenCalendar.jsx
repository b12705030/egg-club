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
    </div>
  );
};

export default KitchenCalendar;
