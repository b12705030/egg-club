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
  const [likedRecipes, setLikedRecipes] = useState(new Set()) // ✅ 喜歡過的食譜 ID 集合
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('post_date', { ascending: false })

      if (!error) setRecipes(data)

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

    fetchData()
  }, [profile])

  const toggleLike = async (recipeId) => {
    if (!profile?.id) return alert('請先登入')

    if (likedRecipes.has(recipeId)) {
      const { error } = await supabase
        .from('liked_recipes')
        .delete()
        .match({ user_id: profile.id, recipe_id: recipeId })

      if (error) {
        console.error('❌ 新增失敗：', error) // ✅ 印出整個錯誤物件
        alert(`新增喜歡失敗：${error.message}`)
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
        .insert([{ user_id: profile.id, recipe_id: recipeId }]) // ✅ 這裡要加中括號

      if (error) {
        console.error('❌ 新增失敗：', error.message)
        alert('新增喜歡失敗')
        return
      }

      setLikedRecipes((prev) => new Set([...prev, recipeId]))
    }
  }


  if (loading) return <p>載入中...</p>

  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          {filteredRecipes.map((r) => (
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
      </div>
    </div>
  )
}

export default Blog
