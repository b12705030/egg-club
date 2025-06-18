import { createClient } from '@supabase/supabase-js'

// ✅ 換成你自己的 Supabase 專案資訊
const supabase = createClient(
  'https://apimbgxhxqmmpoxsufzm.supabase.co',        // 你的 Supabase URL
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwaW1iZ3hoeHFtbXBveHN1ZnptIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDE2OTc4OSwiZXhwIjoyMDY1NzQ1Nzg5fQ.YfE5XT_QTEexU-WLY-CgicCp7m9UDPC40m7eATvhgV8'               // ⚠️ 是 Service Role Key，不是 anon key
)

const members = [
  {
    email: 'b12705030@ntu.edu.tw',
    password: 'b12705030',
    profile: { name: '小黃', major: '資管二', family: '週二三家', identity: '蛋胞', year: 113 }
  },
  {
    email: 'egg001@ntu.edu.tw',
    password: 'egg001pw',
    profile: { name: '阿蛋', major: '政治三', family: '週二三家', identity: '家長', year: 112 }
  },
  {
    email: 'egg002@ntu.edu.tw',
    password: 'egg002pw',
    profile: { name: '蛋哥', major: '心理一', family: '週二四家', identity: '老人', year: 111 }
  },
  {
    email: 'egg003@ntu.edu.tw',
    password: 'egg003pw',
    profile: { name: '蛋寶', major: '電機三', family: '週二三家', identity: '蛋胞', year: 113 }
  },
  {
    email: 'egg004@ntu.edu.tw',
    password: 'egg004pw',
    profile: { name: '蛋仔', major: '法律二', family: '週二四家', identity: '蛋胞', year: 113 }
  }
]

async function registerAllMembers(members) {
  for (const member of members) {
    const { error: userError } = await supabase.auth.admin.createUser({
      email: member.email,
      password: member.password,
      email_confirm: true
    })

    if (userError) {
      console.error(`❌ 建立帳號失敗（${member.email}）：`, userError.message)
      continue
    }

    const { error: insertError } = await supabase
      .from('社團名單')
      .update({ email: member.email })
      .eq('name', member.profile.name)

    if (insertError) {
      console.error(`❌ 更新社團名單失敗（${member.email}）：`, insertError.message)
    } else {
      console.log(`✅ 註冊成功：${member.email}`)
    }
  }
}

registerAllMembers(members)
