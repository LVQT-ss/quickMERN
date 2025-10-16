import React, { useEffect, useState } from 'react'
import { api } from '../../utils/api'
import { getToken } from '../../utils/auth'
import { Link } from 'react-router-dom'

export default function UsersListPage() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const token = getToken()
      const data = await api.users.list(token)
      setUsers(data)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => { load() }, [])

  const remove = async (id) => {
    try {
      const token = getToken()
      await api.users.remove(id, token)
      await load()
    } catch (err) { setError(err.message) }
  }

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="divide-y border rounded">
        {users.map(u => (
          <div key={u.id} className="p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{u.username} <span className="text-xs text-gray-500">({u.role})</span></div>
              <div className="text-sm text-gray-600">{u.email}</div>
            </div>
            <div className="flex gap-2">
              <Link to={`/users/${u.id}`} className="text-blue-600">View</Link>
              <button onClick={()=> remove(u.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


