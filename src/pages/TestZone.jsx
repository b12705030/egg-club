import React from 'react';
import { useProfile } from '../ProfileContext';
import KitchenCalendar from '../components/KitchenCalendar';
import MyReservationList from '../components/MyReservationList';

function TestZone() {
  const { profile, loading } = useProfile();

  if (loading) return <p>載入中...</p>;

  return profile ? (
    <div className="testzone-content">
      <KitchenCalendar />
      <MyReservationList />
    </div>
  ) : (
    <p>查無個人資料，請聯絡管理員。</p>
  );
}

export default TestZone;
