import { useState } from 'react';
import { supabase } from '../supabase';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setError(error.message);
    } else {
      onLogin();  // 通知 App 登入狀態更新
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '32px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '900' }}>登入</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '12px' }}
        />
        <input
          type="password"
          placeholder="密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: '12px' }}
        />
        <button type="submit" style={{ width: '100%' }}>登入</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p style={{ marginTop: '12px' }}>
        若忘記密碼請聯絡管理員。
      </p>
    </div>
  );
}

export default LoginForm;
