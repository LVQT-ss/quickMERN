import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../utils/api'

export default function CategoriesListPage() {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.categories.list().then(setCategories).catch(e=> setError(e.message))
  }, [])

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Link to="/categories/new" className="rounded bg-blue-600 text-white px-3 py-2">New Category</Link>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="space-y-2">
        {categories.map(c => (
          <div key={c.id} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-gray-600">{c.description}</div>
            </div>
            <Link to={`/categories/${c.id}/edit`} className="text-blue-600">Edit</Link>
          </div>
        ))}
      </div>
    </div>
  )
}


