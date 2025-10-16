import React, { useEffect, useState } from 'react'
import { api } from '../../utils/api'
import { getToken } from '../../utils/auth'
import { useNavigate, useParams } from 'react-router-dom'

export default function CategoryEditPage() {
  const { id } = useParams()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.categories.list().then(cs => {
      const c = cs.find(x => String(x.id) === String(id))
      if (c) { setName(c.name||''); setDescription(c.description||'') }
    }).catch(e=> setError(e.message))
  }, [id])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const token = getToken()
      await api.categories.update(id, { name, description }, token)
      navigate('/categories')
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit Category</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Name" value={name} onChange={(e)=> setName(e.target.value)} />
        <textarea className="w-full border rounded px-3 py-2" placeholder="Description" value={description} onChange={(e)=> setDescription(e.target.value)} />
        <button disabled={loading} className="rounded bg-blue-600 text-white px-3 py-2">{loading ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  )
}


