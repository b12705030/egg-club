import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import { useProfile } from '../ProfileContext'
import './Blog.css'
import { FiHeart } from 'react-icons/fi'

function Blog() {
  const { profile, loading } = useProfile()
  const [recipes, setRecipes] = useState([])
  const navigate = useNavigate()

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
    <div className="blog-wrapper">
      <div className="blog-container">
        <div className="recipe-grid">
          {recipes.map((r) => (
            <div
              key={r.id}
              className="recipe-card"
              onClick={() => navigate(`/recipe/${r.id}`)}
            >
              <div className="image-wrapper">
                <img src={r.cover_image_url} alt={r.title} className="recipe-image" />
                <div className="heart-icon"><FiHeart /></div>
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
