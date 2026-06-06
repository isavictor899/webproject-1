import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabase'

import Home       from './pages/Home'
import Blog       from './pages/Blog'
import BlogPost   from './pages/BlogPost'
import AdminLogin from './pages/admin/Login'
import Dashboard  from './pages/admin/Dashboard'
import PostEditor from './pages/admin/PostEditor'

function ProtectedRoute({ session, children }) {
  if (!session) return <Navigate to="/admin/login" replace />
  return children
}

export default function App() {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => listener.subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-offwhite">
        <div className="text-primary font-heading text-xl animate-pulse">Loading…</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/"           element={<Home />} />
      <Route path="/blog"       element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />

      <Route path="/admin/login" element={session ? <Navigate to="/admin" replace /> : <AdminLogin />} />

      <Route path="/admin" element={
        <ProtectedRoute session={session}><Dashboard /></ProtectedRoute>
      } />
      <Route path="/admin/new" element={
        <ProtectedRoute session={session}><PostEditor /></ProtectedRoute>
      } />
      <Route path="/admin/edit/:id" element={
        <ProtectedRoute session={session}><PostEditor /></ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
