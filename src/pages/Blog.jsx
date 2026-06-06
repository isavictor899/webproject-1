import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase'

export default function Blog() {
  const [posts,   setPosts]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, slug, excerpt, cover_url, published_at, category')
        .eq('published', true)
        .order('published_at', { ascending: false })

      if (!error) setPosts(data || [])
      setLoading(false)
    }
    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-offwhite font-sans">
      {/* Header */}
      <div className="bg-primary text-white py-24 px-6 text-center">
        <Link to="/" className="inline-flex items-center text-accent text-sm font-semibold mb-6 hover:underline">
          <i className="fas fa-arrow-left mr-2"></i> Back to Home
        </Link>
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
        <p className="text-white text-opacity-80 max-w-xl mx-auto">
          News, tips, and updates from House of Essential Commodities
        </p>
      </div>

      {/* Posts grid */}
      <div className="container mx-auto px-6 py-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500">Loading posts…</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <i className="fas fa-newspaper text-5xl mb-4 block"></i>
            <p className="text-xl">No posts published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex flex-col">
                {/* Cover image */}
                <div className="h-52 overflow-hidden bg-gray-100">
                  {post.cover_url
                    ? <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-300"><i className="fas fa-image text-4xl"></i></div>
                  }
                </div>
                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {post.category && (
                    <span className="text-xs font-bold uppercase tracking-widest text-accent mb-2">{post.category}</span>
                  )}
                  <h2 className="font-heading text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed flex-grow">{post.excerpt}</p>
                  <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                    <span><i className="fas fa-calendar-alt mr-1"></i>
                      {new Date(post.published_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="text-accent font-semibold">Read more →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
