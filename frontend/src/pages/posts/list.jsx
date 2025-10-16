import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../../utils/api'

export default function PostsListPage() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  const status = searchParams.get('status') || ''
  const category = searchParams.get('category') || ''

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([
      api.posts.list({ status: status || undefined, category: category || undefined }),
      api.categories.list(),
    ]).then(([p, c]) => {
      if (!active) return
      setPosts(p)
      setCategories(c)
      setError('')
    }).catch(err => setError(err.message)).finally(() => setLoading(false))
    return () => { active = false }
  }, [status, category])

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Link to="/posts/new" className="rounded bg-blue-600 px-3 py-2 text-white">New Post</Link>
      </div>
      <div className="flex gap-2 mb-4">
        <select className="border rounded px-2 py-1" value={status} onChange={(e)=> setSearchParams(prev => { const p = new URLSearchParams(prev); const v=e.target.value; if(v) p.set('status', v); else p.delete('status'); return p })}>
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <select className="border rounded px-2 py-1" value={category} onChange={(e)=> setSearchParams(prev => { const p = new URLSearchParams(prev); const v=e.target.value; if(v) p.set('category', v); else p.delete('category'); return p })}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid gap-3">
        {posts.map(p => (
          <Link key={p.id} to={`/posts/${p.id}`} className="block border rounded p-3 hover:bg-gray-50">
            <div className="font-medium">{p.title}</div>
            <div className="text-sm text-gray-600">{p.status}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}


