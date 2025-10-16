import React, { useState } from 'react'
import { api } from '../utils/api'
import { setToken, setUser } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const body = identifier.includes('@') ? { email: identifier, password } : { username: identifier, password }
      const res = await api.auth.login(body)
      setToken(res.token)
      setUser(res.user)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white rounded-lg shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold">Login</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input className="w-full border rounded px-3 py-2" placeholder="Email or Username" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button disabled={loading} className="w-full rounded bg-blue-600 text-white py-2 hover:bg-blue-700 disabled:opacity-50">{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  )
}


