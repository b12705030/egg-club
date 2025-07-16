import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom' // ✅ 加入這行
import { supabase } from '../supabase'
import { useProfile } from '../ProfileContext'

function Blog() {
  const { profile, loading } = useProfile()
  const [recipes, setRecipes] = useState([])
  const navigate = useNavigate() // ✅ 初始化 router

  useEffect(() => {
    async function fetchRecipes() {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('post_date', { ascending: false })

      if (error) {
        console.error('❌ 無法取得食譜資料：', error)
      } else {
        setRecipes(data)
      }
    }

    fetchRecipes()
  }, [])

  if (loading) return <p>載入中...</p>

  return (
    <div style={{ padding: '24px' }}>
      <h2>📖 食譜部落格</h2>

      {profile ? (
        <p>{profile.name} 的美味筆記本 📝</p>
      ) : (
        <p>查無個人資料，請聯絡管理員。</p>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '20px',
        marginTop: '24px'
      }}>
        {recipes.map((r) => (
          <div
            key={r.id}
            onClick={() => navigate(`/recipe/${r.id}`)} // ✅ 點擊跳轉
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '12px',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer' // ✅ 滑鼠提示
            }}
          >
            {r.cover_image_url ? (
              <img
                src={r.cover_image_url}
                alt={r.title}
                style={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  marginBottom: '8px'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '120px',
                background: '#eee',
                borderRadius: '6px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#aaa',
                fontSize: '0.8rem'
              }}>
                無圖片
              </div>
            )}

            <h4 style={{
              fontSize: '1rem',
              margin: '4px 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>{r.title}</h4>

            <p style={{ fontSize: '0.9rem', color: '#555' }}>{r.authors}</p>
            <p style={{ fontSize: '0.8rem', color: '#999' }}>{r.post_date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Blog
