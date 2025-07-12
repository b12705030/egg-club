import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useProfile } from '../ProfileContext';
import './trial-form.css';
import { useNavigate } from 'react-router-dom';

export default function TrialRequestForm({ onSubmitSuccess }) {
  const { profile } = useProfile();
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    date: '',
    period: '',
    companion_name: '',
    t_level: 'T1',
    product: '',
    mould: '',
    oven_usage: '否',
    note: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  /* ➊ 只撈身份＝家長／老人做下拉 */
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('社團名單')
        .select('name, role')
        .in('role', ['家長', '老人']);
      setMembers(data || []);
    })();
  }, []);

  /* ➋ 表單更新 */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ➌ 送出檢查 → 寫入 DB */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 檢查 10 天內＆前一天 22:00 前
    const d = new Date(form.date);
    const today = new Date();
    const diff = (d - today) / (1000 * 60 * 60 * 24);
    if (diff > 10) return setError('僅能申請 10 天內時段');
    if (diff < 0) return setError('日期不可過去式');

    // 寫入
    const { error } = await supabase.from('kitchen_schedule').insert({
      date: form.date,
      period: form.period,
      type: '借用廚房',
      name: profile.name,
      companion_name: form.companion_name || null,
      t_level: form.t_level,
      product: form.product,
      mould: form.mould,
      oven_usage: form.oven_usage,
      note: form.note,
      status: '待審核',
    });

    if (error) setError(error.message);
    else {
      setError('');
      onSubmitSuccess?.();
      alert('已送出，待網管審核');
      // ✅ 自動跳回 TestZone 頁面
      navigate('/test');  // ← 這裡請確認你的路由是否為這條路徑
    }
  };

  /* ➍ 是否顯示「帶試作家長 / 老人」下拉 */
  const needCompanion = profile.role === '蛋胞';

  return (
    <div className="trial-form-wrapper">
        <form className="trial-form" onSubmit={handleSubmit}>
        <h3>試作申請表</h3>

        {/* 規則區塊（可折疊） */}
        <details className="rule-box">
            <summary>試作廚房規則 / 審核規定</summary>
            <pre className="rule-text">{ruleText}</pre>
        </details>

        {/* 日期 + 時段（只能選灰色時段，簡化用 select） */}
        <label>
            試作日期
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
        </label>

        <label>
            時段
            <select name="period" value={form.period} onChange={handleChange} required>
            <option value="">請選擇</option>
            <option value="上午">上午</option>
            <option value="下午">下午</option>
            <option value="晚上">晚上</option>
            </select>
        </label>

        {/* 蛋胞需帶家長 / 老人 */}
        {needCompanion && (
            <label>
            帶試作家長 / 老人
            <select
                name="companion_name"
                value={form.companion_name}
                onChange={handleChange}
                required
            >
                <option value="">請選擇</option>
                {members.map((m) => (
                <option key={m.name} value={m.name}>
                    {m.name}（{m.role}）
                </option>
                ))}
            </select>
            </label>
        )}

        {/* 其他欄位 */}
        <label>
            器具使用
            <select name="t_level" value={form.t_level} onChange={handleChange}>
            <option value="T1">T1</option>
            <option value="T2">T2</option>
            </select>
        </label>

        <label>
            詳細試作產品名稱
            <input name="product" value={form.product} onChange={handleChange} required />
        </label>

        <label>
            使用社團模具
            <input name="mould" value={form.mould} onChange={handleChange} />
        </label>

        <label>
            是否需要烤箱 / 時長
            <select name="oven_usage" value={form.oven_usage} onChange={handleChange}>
            <option>否</option>
            <option>是，小於 1.5 小時</option>
            <option>是，會使用 1.5~2 小時</option>
            <option>是，會使用 2~2.5 小時</option>
            <option>是，會使用超過 2.5 小時</option>
            </select>
        </label>

        <label>
            附註
            <textarea name="note" value={form.note} onChange={handleChange} rows={3} />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="submit-btn">
            送出申請
        </button>

        <p className="cancel-tip">
            倘無法試作，應於試作前一日中午 12:00 前通知網路廚管…
        </p>
        </form>
    </div>
  );
}

/* 試作規則文字可放外部檔，為了示範先放這裡 */
const ruleText = `
試作廚房規則~
希望試作的大家都能遵守廚房規則~

ㄧ、試作：                                                                                         
進廚房為非私人營利之使用，包含個人試作、活動試作（啡蛋週、校慶、杜鵑花  節、社團博覽會、社課或營隊教學、社大獎品）。                                                                                            
二、進入廚房與試作資格  ：                                                                                                                                        
1.非社員禁止進入廚房。攜帶非社員進廚房之社員一律退社，但老師與維修廠商不在此                                                                                    
2.社員始得申請試作；惟蛋胞須家長陪同方可試作，陪同之家長應實際出席協助蛋胞，倘臨時有事需自行尋找替代人選，並於事後通知廚管。

3.個人試作得使用美食社瓦斯爐。個人試作僅得使用試作文所申請的T1或T2器材。

4.各種試作所使用之器材，用畢後務必洗淨、擦乾、歸位，並於試作結束時確實上網清點（冰箱上有QR code），蛋胞試作由陪同家長負責監督清點。因特殊狀況而跨時段試作者， 僅須完成離開時該時段的器材清點。晚上活動試作限於翌日早上9時前收拾完畢。

5.試作完畢須將桌台與地板整理乾淨、清空垃圾桶、關閉烤箱與瓦斯、清理廚房洗手槽濾網，蛋胞試作由陪同家長監督清掃狀況。

三、處罰：                                                                                
1.為私人或其他團體營利使用廚房者，一律退社或拔除老人資格並賠償廚房使用費新台幣一千元。

2.違反本規則任一規定，且為未確實完成規則者（監督不實、表單填寫不實、清洗不完全、試作超時等），將依據身分進行懲處:
(1) 老人違規1次：禁用廚房半個月
(2) 家長違規1次：扣除點數一點
(3) 蛋胞違規1次：禁用廚房半個月，該時段負責之家長扣除點數一點
***超時致社團被記點者加倍處罰，並與社團一同承擔受罰處分。

3.違反任一規定，且為未執行規則者（未清點器材、家長於負責時段未出現），將依據身分進行懲處：
(1) 老人違規1次：禁用廚房一個月
(2) 家長違規1次：扣除點數兩點
(3) 蛋胞違規1次：禁用廚房一個月，該時段負責之家長扣除點數兩點

4.違規達3次者，將經社團開會決定懲處方式，最重以退社處分。個人試作超時達3次者， 一律退社或拔除老人資格。

5.試作逾時取消或未取消（未告知廚管），處分如下：前一日中午12點至晚上6點間取消：記1支警告。  前一日晚上6點後取消或未取消：記2支警告。倘蛋胞違規，連帶處分帶試作家長。

 6.警告效果
(1) 家長每計1支警告，扣除1點個人點數
(2) 蛋胞累計3支警告，禁作1個月
(3) 老人累計3支警告，禁作1個月

7.受罰者有疑義時，得於處分公告後3日內舉證申訴，逾時申訴視為未申訴而放棄權益。                                                                                        
8.每月於社團公布違規或收到警告之社員、家長及老人。
`;
