import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useProfile } from '../ProfileContext'
import './Blog.css'
import { FiHeart } from 'react-icons/fi'
import { FaHeart, FaSearch } from 'react-icons/fa'

function Blog() {
  const { profile, loading } = useProfile()
  const [recipes, setRecipes] = useState([])
  const [likedRecipes, setLikedRecipes] = useState(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  // ✅ 取得喜歡過的食譜
  useEffect(() => {
    async function fetchLikes() {
      if (profile?.id) {
        const { data: liked, error: likeErr } = await supabase
          .from('liked_recipes')
          .select('recipe_id')
          .eq('user_id', profile.id)

        if (!likeErr) {
          setLikedRecipes(new Set(liked.map((r) => r.recipe_id)))
        }
      }
    }

    fetchLikes()
  }, [profile])

  // ✅ 搜尋食譜（支援模糊搜尋）
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      let query = supabase
        .from('recipes')
        .select('*')
        .order('post_date', { ascending: false })

      if (searchTerm.trim()) {
        // ✅ 模糊搜尋：標題、作者、食材與步驟文字
        query = query.or(
          `title.ilike.%${searchTerm}%,authors.ilike.%${searchTerm}%,ingredients_text.ilike.%${searchTerm}%,steps_text.ilike.%${searchTerm}%`
        )
      }

      const { data, error } = await query
      if (!error) setRecipes(data)
    }, 300) // debounce 300ms

    return () => clearTimeout(delayDebounce)
  }, [searchTerm])

  const toggleLike = async (recipeId) => {
    if (!profile?.id) return alert('請先登入')

    if (likedRecipes.has(recipeId)) {
      const { error } = await supabase
        .from('liked_recipes')
        .delete()
        .match({ user_id: profile.id, recipe_id: recipeId })

      if (error) {
        console.error('❌ 取消失敗：', error)
        alert(`取消喜歡失敗：${error.message}`)
        return
      }

      setLikedRecipes((prev) => {
        const updated = new Set(prev)
        updated.delete(recipeId)
        return updated
      })
    } else {
      const { error } = await supabase
        .from('liked_recipes')
        .insert([{ user_id: profile.id, recipe_id: recipeId }])

      if (error) {
        console.error('❌ 新增失敗：', error.message)
        alert('新增喜歡失敗')
        return
      }

      setLikedRecipes((prev) => new Set([...prev, recipeId]))
    }
  }

  if (loading) return <p>載入中...</p>

  return (
    <div className="blog-wrapper">
      <div className="blog-container">
        <div className="search-bar-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-bar"
            placeholder="搜尋食譜..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="recipe-grid">
          {recipes.map((r) => (
            <div
              key={r.id}
              className="recipe-card"
              onClick={() => navigate(`/recipe/${r.id}`)}
            >
              <div className="image-wrapper">
                <img src={r.cover_image_url} alt={r.title} className="recipe-image" />
                <div
                  className="heart-icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLike(r.id)
                  }}
                >
                  {likedRecipes.has(r.id) ? <FaHeart color="#e74c3c" /> : <FiHeart />}
                </div>
              </div>
              <div className="recipe-info">
                <div className="recipe-title">{r.title}</div>
                <div className="recipe-authors">{r.authors}</div>
              </div>
            </div>
          ))}
        </div>
        {/* ✅ 沒有搜尋結果時顯示提示文字 */}
        {recipes.length === 0 && (
          <div className="no-results-message">
            查無符合的食譜，請嘗試其他關鍵字...
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
