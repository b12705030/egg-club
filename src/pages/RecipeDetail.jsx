import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [sections, setSections] = useState([])
  const [ingredientsMap, setIngredientsMap] = useState({})
  const [stepGroups, setStepGroups] = useState({})

  useEffect(() => {
    async function fetchData() {
      const { data: recipeData } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single()

      if (!recipeData) {
        alert('找不到食譜，將返回列表頁')
        navigate('/blog')
        return
      }
      setRecipe(recipeData)

      const { data: sectionData } = await supabase
        .from('recipe_ingredient_sections')
        .select('id, section, sort_order')
        .eq('recipe_id', id)
        .order('sort_order')
      setSections(sectionData || [])

      const sectionIds = sectionData?.map(s => s.id) || []
      if (sectionIds.length > 0) {
        const { data: ingredients } = await supabase
          .from('recipe_ingredients')
          .select('id, section_id, name, amount, sort_order')
          .in('section_id', sectionIds)

        const map = {}
        for (const ing of ingredients || []) {
          if (!map[ing.section_id]) map[ing.section_id] = []
          map[ing.section_id].push(ing)
        }
        for (const key in map) {
          map[key].sort((a, b) => a.sort_order - b.sort_order)
        }
        setIngredientsMap(map)
      }

      const { data: stepData } = await supabase
        .from('recipe_steps')
        .select('step_title, content, sort_order')
        .eq('recipe_id', id)
        .order('sort_order')

      const grouped = {}
      for (const step of stepData || []) {
        if (!grouped[step.step_title]) grouped[step.step_title] = []
        const lines = step.content.split('\n').filter(line => line.trim() !== '')
        grouped[step.step_title].push(...lines)
      }
      setStepGroups(grouped)
    }

    fetchData()
  }, [id, navigate])

  if (!recipe) return <p>載入中...</p>

  return (
    <div style={{ background: '#f5f5f5' }}>
      <img
        src={recipe.cover_image_url}
        alt={recipe.title}
        style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
      />

      <div style={{
        background: 'white',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        padding: '24px',
        marginTop: '-24px',
        position: 'relative',
        zIndex: 1
      }}>
        <button onClick={() => navigate('/blog')} style={{
          background: '#f5f5f5',
          padding: '8px 16px',
          borderRadius: '12px',
          border: 'none',
          marginBottom: '16px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>← 返回食譜列表</button>

        <h2 style={{ marginBottom: '4px' }}>{recipe.title}</h2>
        <p style={{ color: '#777', marginBottom: '16px' }}>{recipe.authors}</p>

        <h3 style={{ marginTop: '12px' }}>🍴 材料</h3>
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          paddingBottom: '12px',
          gap: '16px'
        }}>
          {sections.map((s) => (
            <div key={s.id} style={{
              flex: '0 0 auto',
              background: '#f8f8f8',
              borderRadius: '16px',
              padding: '16px',
              minWidth: '160px'
            }}>
              <h4 style={{ margin: '0 0 8px' }}>✓ {s.section}</h4>
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                {(ingredientsMap[s.id] || []).map((i) => (
                  <li key={i.id}>{i.name} {i.amount}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: '24px' }}>📝 做法</h3>
        {Object.entries(stepGroups).map(([title, steps]) => (
          <div key={title} style={{ marginBottom: '20px' }}>
            <h4 style={{ marginBottom: '8px' }}>🍳 {title}</h4>
            <ol style={{ paddingLeft: '20px', margin: 0 }}>
              {steps.map((line, idx) => (
                <li key={idx} style={{ marginBottom: '6px' }}>{line}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecipeDetail
