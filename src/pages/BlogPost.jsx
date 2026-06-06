import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../supabase'

export default function BlogPost() {
  const { slug } = useParams()
  const [post,    setPost]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()

      if (error || !data) setNotFound(true)
      else setPost(data)
      setLoading(false)
    }
    fetchPost()
  }, [slug])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-offwhite">
      <div className="inline-block w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-offwhite text-center px-6">
      <i className="fas fa-search text-5xl text-gray-300 mb-4"></i>
      <h2 className="font-heading text-3xl text-primary mb-3">Post Not Found</h2>
      <p className="text-gray-500 mb-6">This post may have been removed or the link is incorrect.</p>
      <Link to="/blog" className="bg-accent text-white px-6 py-3 rounded-full font-bold hover:bg-green-600 transition">Back to Blog</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Cover image */}
      {post.cover_url && (
        <div className="w-full h-72 md:h-96 overflow-hidden">
          <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="container max-w-3xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link to="/blog" className="inline-flex items-center text-accent text-sm font-semibold mb-8 hover:underline">
          <i className="fas fa-arrow-left mr-2"></i> Back to Blog
        </Link>

        {/* Meta */}
        {post.category && (
          <span className="text-xs font-bold uppercase tracking-widest text-accent mb-3 block">{post.category}</span>
        )}
        <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary mb-4 leading-tight">
          {post.title}
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          <i className="fas fa-calendar-alt mr-1"></i>
          {new Date(post.published_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        {/* Divider */}
        <div className="w-16 h-1 bg-accent mb-10 rounded"></div>

        {/* Body — rendered as HTML from the editor */}
        <div
          className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
          style={{ lineHeight: '1.9' }}
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {/* Attached files */}
        {post.files && post.files.length > 0 && (
          <div className="mt-12 p-6 bg-offwhite rounded-xl border border-gray-100">
            <h3 className="font-heading font-bold text-primary mb-4">
              <i className="fas fa-paperclip mr-2 text-accent"></i>Attachments
            </h3>
            <ul className="space-y-2">
              {post.files.map((url, i) => {
                const name = url.split('/').pop()
                return (
                  <li key={i}>
                    <a href={url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center text-accent hover:underline text-sm font-medium">
                      <i className="fas fa-file-download mr-2"></i>{name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
