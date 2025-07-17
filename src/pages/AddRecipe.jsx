import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'
import './AddRecipe.css'

function AddRecipe() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [authors, setAuthors] = useState('')
  const [coverFile, setCoverFile] = useState(null)  // ✅ 改為 File 狀態
  const [sections, setSections] = useState([
    { section: '', bulkText: '' }
  ])
  const [steps, setSteps] = useState([
    { step_title: '', content: '' }
  ])

  const [yieldInfo, setYieldInfo] = useState('')

  const handleAddSection = () => {
    setSections([...sections, { section: '', bulkText: '' }])
  }

  const handleAddStep = () => {
    setSteps([...steps, { step_title: '', content: '' }])
  }

  const parseBulkText = (text) => {
    const lines = text.trim().split('\n')
    return lines.map(line => {
      const match = line.trim().match(/^(.+?)\s+([\d.]+.*)$/)
      if (match) {
        return { name: match[1], amount: match[2] }
      } else {
        return { name: line.trim(), amount: '' }
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // ✅ 圖片上傳到 Supabase
    let imageUrl = ''
    if (coverFile) {
      const fileExt = coverFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `cover-images/${fileName}`

      const { error: uploadError } = await supabase
        .storage
        .from('recipe-covers')
        .upload(filePath, coverFile)

      if (uploadError) {
        alert('圖片上傳失敗')
        return
      }

      const { data: publicUrlData } = supabase
        .storage
        .from('recipe-covers')
        .getPublicUrl(filePath)

      imageUrl = publicUrlData.publicUrl
    }

    const { data: recipeData, error: recipeError } = await supabase
      .from('recipes')
      .insert({ title, authors, cover_image_url: imageUrl, yield_info: yieldInfo })
      .select()
      .single()

    if (recipeError) {
      alert('新增食譜失敗')
      return
    }

    const recipeId = recipeData.id

    for (let i = 0; i < sections.length; i++) {
      const { section, bulkText } = sections[i]
      const parsedIngredients = parseBulkText(bulkText)

      const { data: secData, error: secErr } = await supabase
        .from('recipe_ingredient_sections')
        .insert({ recipe_id: recipeId, section, sort_order: i })
        .select()
        .single()
      if (secErr) continue

      const sectionId = secData.id

      const ingInserts = parsedIngredients.map((ing, j) => ({
        recipe_id: recipeId,
        section_id: sectionId,
        name: ing.name,
        amount: ing.amount,
        sort_order: j,
      }))
      await supabase.from('recipe_ingredients').insert(ingInserts)
    }

    const stepInserts = steps.map((s, i) => ({
      recipe_id: recipeId,
      step_title: s.step_title,
      content: s.content,
      sort_order: i,
    }))
    await supabase.from('recipe_steps').insert(stepInserts)

    alert('新增成功！')
    navigate('/blog')
  }

  return (
    <div className="add-recipe-wrapper">
      <div className="add-recipe-form">
        <h2>新增食譜</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-row-detail">
            <input placeholder="標題" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input placeholder="作者" value={authors} onChange={(e) => setAuthors(e.target.value)} />
          </div>
          <div className="input-row-detail">
            <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} />
          </div>
          <div className="input-row-detail">
            <input
                placeholder="份量（例如：6 個、1 條、約 3～4 人份）"
                value={yieldInfo}
                onChange={(e) => setYieldInfo(e.target.value)}
            />
          </div>

          <h3 className="section-title">食材區塊</h3>
          {sections.map((s, idx) => (
            <div key={idx} className="section-block">
              <h4>第 {idx + 1} 區塊名稱</h4>
              <input
                placeholder="例如：蛋糕體、果醬"
                value={s.section}
                onChange={(e) => {
                  const updated = [...sections]
                  updated[idx].section = e.target.value
                  setSections(updated)
                }}
              />
              <textarea
                placeholder={`可貼上多筆：\n如「中筋麵粉 100 g」一行一筆`}
                value={s.bulkText}
                onChange={(e) => {
                  const updated = [...sections]
                  updated[idx].bulkText = e.target.value
                  setSections(updated)
                }}
                style={{
                  width: '100%', marginTop: '0px', borderRadius: '8px',
                  padding: '8px', fontSize: '14px', border: '1px solid #ccc'
                }}
              />
            </div>
          ))}
          <button type="button" className="add-button" onClick={handleAddSection}>
            + 新增食材區塊
          </button>

          <h3 className="section-title">步驟</h3>
          {steps.map((s, idx) => (
            <div key={idx} className="input-row-detail">
              <input
                placeholder="小標題"
                value={s.step_title}
                onChange={(e) => {
                  const updated = [...steps]
                  updated[idx].step_title = e.target.value
                  setSteps(updated)
                }}
              />
              <textarea
                placeholder="步驟內容（請直接換行，勿編號）"
                value={s.content}
                onChange={(e) => {
                  const updated = [...steps]
                  updated[idx].content = e.target.value
                  setSteps(updated)
                }}
              />
            </div>
          ))}
          <button type="button" className="add-button" onClick={handleAddStep}>
            + 新增步驟
          </button>

          <button type="submit" className="save-button">儲存食譜</button>
        </form>
      </div>
    </div>
  )
}

export default AddRecipe
