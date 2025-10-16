import React, { useState } from 'react'
import { api } from '../../utils/api'
import { getToken } from '../../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function CategoryCreatePage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const token = getToken()
      await api.categories.create({ name, description }, token)
      navigate('/categories')
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Category</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Name" value={name} onChange={(e)=> setName(e.target.value)} />
        <textarea className="w-full border rounded px-3 py-2" placeholder="Description" value={description} onChange={(e)=> setDescription(e.target.value)} />
        <button disabled={loading} className="rounded bg-blue-600 text-white px-3 py-2">{loading ? 'Creating...' : 'Create'}</button>
      </form>
    </div>
  )
}


