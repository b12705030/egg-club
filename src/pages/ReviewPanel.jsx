// src/pages/ReviewPanel.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useProfile } from '../ProfileContext';
import './ReviewPanel.css';

export default function ReviewPanel() {
  const { profile } = useProfile();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!profile || profile.identity !== '網管') return;

    (async () => {
      const { data } = await supabase
        .from('kitchen_schedule')
        .select('*')
        .eq('status', '待審核')
        .order('date', { ascending: true });

      setRequests(data || []);
    })();
  }, [profile]);

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from('kitchen_schedule')
      .update({ status })
      .eq('id', id);

    if (!error) {
      setRequests((prev) => prev.filter((r) => r.id !== id));
      alert(`已更新為「${status}」`);
    } else {
      alert('更新失敗：' + error.message);
    }
  };

  if (!profile || profile.identity !== '網管') {
    return <p style={{ padding: '24px' }}>🚫 無權限查看此頁面</p>;
  }

  return (
    <div className="review-section">
      <h2 className="review-title">待審核申請</h2>

      {requests.length === 0 ? (
        <p>目前沒有待審核項目。</p>
      ) : (
        requests.map((r) => (
          <div key={r.id} className="review-card">
            <div className="review-info">
              <p><strong>申請人：</strong>{r.name}</p>
              <p><strong>日期：</strong>{r.date}</p>
              <p><strong>時段：</strong>{r.period}</p>
              <p><strong>產品：</strong>{r.product}</p>
              <p><strong>T等級：</strong>{r.t_level}</p>
              <p><strong>使用模具：</strong>{r.mould}</p>
              <p><strong>烤箱：</strong>{r.oven_usage}</p>
              {r.companion_name && <p><strong>陪同：</strong>{r.companion_name}</p>}
              {r.note && <p><strong>附註：</strong>{r.note}</p>}
            </div>

            <div className="review-buttons">
              <button className="approve" onClick={() => updateStatus(r.id, '已核准')}>核准</button>
              <button className="reject" onClick={() => updateStatus(r.id, '未通過')}>拒絕</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
