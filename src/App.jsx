import { useEffect, useState } from 'react';
import { supabase } from './supabase';

function App() {
  const [members, setMembers] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchMembers() {
      const { data, error } = await supabase
        .from('社團名單') // 或 'members'，看你的表名
        .select('*')
        .order('year', { ascending: false });

      console.log('🔥 Supabase 回傳資料:', data);
      console.log('❌ 錯誤:', error);

      if (error) {
        setErrorMsg('資料抓取失敗：' + error.message);
      } else if (data.length === 0) {
        setErrorMsg('資料表是空的（0 筆資料）');
      } else {
        setMembers(data);
      }
    }

    fetchMembers();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <h1>🍳 歡迎來到蛋研社網站！</h1>
      <p>這是我們的首頁，之後可以放活動、心得、食譜分享！</p>

      <h2 style={{ marginTop: '32px' }}>🥚 蛋研社會員名單</h2>

      {errorMsg ? (
        <p style={{ color: 'red' }}>{errorMsg}</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>名字</th>
              <th>系級</th>
              <th>家別</th>
              <th>身份</th>
              <th>屆別</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.major}</td>
                <td>{m.family}</td>
                <td>{m.identity}</td>
                <td>{m.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
