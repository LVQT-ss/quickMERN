import React, { useEffect, useState } from 'react'
import { api } from '../../utils/api'
import { getToken } from '../../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function PostCreatePage() {
  const [title, setTitle] = useState('')
  const [introduction, setIntroduction] = useState('')
  const [status, setStatus] = useState('draft')
  const [categories, setCategories] = useState([])
  const [selected, setSelected] = useState([])
  const [sections, setSections] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.categories.list().then(setCategories).catch(e=> setError(e.message))
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const token = getToken()
      const post = await api.posts.create({ title, introduction, status, category_ids: selected }, token)
      for (const [index, s] of sections.entries()) {
        const sectionPayload = {
          title: s.title,
          content: s.content,
          order_index: Number.isFinite(s.order_index) ? s.order_index : index + 1,
        }
        const createdSection = await api.posts.sections.add(post.id, sectionPayload, token)
        if (Array.isArray(s.images)) {
          for (const [i, img] of s.images.entries()) {
            const imagePayload = {
              image_url: img.image_url,
              caption: img.caption || '',
              order_index: Number.isFinite(img.order_index) ? img.order_index : i + 1,
              section_id: createdSection.id,
            }
            await api.posts.images.add(post.id, imagePayload, token)
          }
        }
      }
      navigate(`/posts/${post.id}`)
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  const toggleCat = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id])
  }

  const addSection = () => {
    setSections(prev => [...prev, { title: '', content: '', order_index: prev.length + 1, images: [] }])
  }

  const updateSection = (idx, key, value) => {
    setSections(prev => prev.map((s, i) => i === idx ? { ...s, [key]: value } : s))
  }

  const removeSection = (idx) => {
    setSections(prev => prev.filter((_, i) => i !== idx))
  }

  const addImageToSection = (sIdx) => {
    setSections(prev => prev.map((s, i) => i === sIdx ? { ...s, images: [...(s.images||[]), { image_url: '', caption: '', order_index: (s.images?.length||0) + 1 }] } : s))
  }

  const updateImageInSection = (sIdx, imgIdx, key, value) => {
    setSections(prev => prev.map((s, i) => {
      if (i !== sIdx) return s
      const imgs = (s.images||[]).map((img, j) => j === imgIdx ? { ...img, [key]: value } : img)
      return { ...s, images: imgs }
    }))
  }

  const removeImageFromSection = (sIdx, imgIdx) => {
    setSections(prev => prev.map((s, i) => {
      if (i !== sIdx) return s
      return { ...s, images: (s.images||[]).filter((_, j) => j !== imgIdx) }
    }))
  }

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Post</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Title" value={title} onChange={(e)=> setTitle(e.target.value)} />
        <textarea className="w-full border rounded px-3 py-2" placeholder="Introduction" value={introduction} onChange={(e)=> setIntroduction(e.target.value)} />
        <select className="border rounded px-3 py-2" value={status} onChange={(e)=> setStatus(e.target.value)}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <div className="space-y-1">
          <div className="font-medium">Categories</div>
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <label key={c.id} className="inline-flex items-center gap-2 border rounded px-2 py-1">
                <input type="checkbox" checked={selected.includes(c.id)} onChange={()=> toggleCat(c.id)} />
                {c.name}
              </label>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">Sections</div>
            <button type="button" onClick={addSection} className="text-blue-600">Add section</button>
          </div>
          {sections.map((s, idx) => (
            <div key={idx} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Section {idx + 1}</div>
                <button type="button" onClick={()=> removeSection(idx)} className="text-red-600 text-sm">Remove</button>
              </div>
              <input className="w-full border rounded px-3 py-2" placeholder="Section title" value={s.title} onChange={(e)=> updateSection(idx, 'title', e.target.value)} />
              <textarea className="w-full border rounded px-3 py-2" placeholder="Section content" value={s.content} onChange={(e)=> updateSection(idx, 'content', e.target.value)} />
              <input className="w-full border rounded px-3 py-2" placeholder="Order index" type="number" value={s.order_index} onChange={(e)=> updateSection(idx, 'order_index', Number(e.target.value))} />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Images</div>
                  <button type="button" onClick={()=> addImageToSection(idx)} className="text-blue-600 text-sm">Add image</button>
                </div>
                {(s.images||[]).map((img, j) => (
                  <div key={j} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
                    <input className="border rounded px-3 py-2" placeholder="Image URL" value={img.image_url} onChange={(e)=> updateImageInSection(idx, j, 'image_url', e.target.value)} />
                    <input className="border rounded px-3 py-2" placeholder="Caption" value={img.caption} onChange={(e)=> updateImageInSection(idx, j, 'caption', e.target.value)} />
                    <div className="flex items-center gap-2">
                      <input className="border rounded px-3 py-2 w-full" placeholder="Order" type="number" value={img.order_index} onChange={(e)=> updateImageInSection(idx, j, 'order_index', Number(e.target.value))} />
                      <button type="button" onClick={()=> removeImageFromSection(idx, j)} className="text-red-600 text-sm">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button disabled={loading} className="rounded bg-blue-600 text-white px-3 py-2">{loading ? 'Creating...' : 'Create'}</button>
      </form>
    </div>
  )
}


