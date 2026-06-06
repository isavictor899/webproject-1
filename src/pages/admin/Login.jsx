import { useState } from 'react'
import { supabase } from '../../supabase'

export default function AdminLogin() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
    // App.jsx listens for auth changes and redirects automatically on success
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-xl mb-4">
            <i className="fas fa-leaf text-accent text-2xl"></i>
          </div>
          <h1 className="font-heading text-2xl font-bold text-primary">Admin Login</h1>
          <p className="text-gray-400 text-sm mt-1">House of Essential Commodities</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6">
            <i className="fas fa-exclamation-circle mr-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-accent text-sm"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-600 text-xs font-bold uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-accent text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? <span><i className="fas fa-spinner fa-spin mr-2"></i>Logging in…</span> : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}
