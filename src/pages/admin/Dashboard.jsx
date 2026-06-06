import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabase'

export default function Dashboard() {
  const [posts,   setPosts]   = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('id, title, slug, published, published_at, category')
      .order('created_at', { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchPosts() }, [])

  async function togglePublish(post) {
    await supabase.from('posts').update({ published: !post.published }).eq('id', post.id)
    fetchPosts()
  }

  async function deletePost(id) {
    if (!confirm('Delete this post? This cannot be undone.')) return
    await supabase.from('posts').delete().eq('id', id)
    fetchPosts()
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-offwhite font-sans">
      {/* Top bar */}
      <div className="bg-primary text-white px-6 py-4 flex items-center justify-between shadow">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <i className="fas fa-leaf text-white text-sm"></i>
          </div>
          <span className="font-heading font-bold">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white text-opacity-70 hover:text-white text-sm transition">
            <i className="fas fa-external-link-alt mr-1"></i>View Site
          </Link>
          <button onClick={logout} className="text-sm bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition">
            <i className="fas fa-sign-out-alt mr-1"></i>Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-5xl">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold text-primary">Blog Posts</h1>
            <p className="text-gray-400 text-sm mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
          </div>
          <Link to="/admin/new"
            className="inline-flex items-center gap-2 bg-accent hover:bg-green-600 text-white font-bold px-5 py-3 rounded-xl transition shadow">
            <i className="fas fa-plus"></i> New Post
          </Link>
        </div>

        {/* Posts table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow">
            <i className="fas fa-newspaper text-5xl text-gray-200 mb-4 block"></i>
            <p className="text-gray-400 mb-6">No posts yet.</p>
            <Link to="/admin/new" className="bg-accent text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition">
              Create your first post
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 hidden md:table-cell">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400 hidden md:table-cell">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-primary max-w-xs truncate">{post.title}</td>
                    <td className="px-6 py-4 text-gray-400 hidden md:table-cell">{post.category || '—'}</td>
                    <td className="px-6 py-4 text-gray-400 hidden md:table-cell">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString('en-KE') : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => togglePublish(post)}
                        className={`text-xs font-bold px-3 py-1 rounded-full transition ${post.published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link to={`/blog/${post.slug}`} target="_blank"
                          className="text-gray-400 hover:text-accent transition" title="Preview">
                          <i className="fas fa-eye"></i>
                        </Link>
                        <Link to={`/admin/edit/${post.id}`}
                          className="text-gray-400 hover:text-primary transition" title="Edit">
                          <i className="fas fa-pencil-alt"></i>
                        </Link>
                        <button onClick={() => deletePost(post.id)}
                          className="text-gray-400 hover:text-red-500 transition" title="Delete">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
