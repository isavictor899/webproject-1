import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../supabase'

// Auto-generate a slug from a title
function slugify(text) {
  return text.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function PostEditor() {
  const { id }    = useParams()        // present when editing
  const navigate  = useNavigate()
  const isEditing = Boolean(id)

  // ── Form state ─────────────────────────────────────────────────────────────
  const [title,      setTitle]      = useState('')
  const [slug,       setSlug]       = useState('')
  const [category,   setCategory]   = useState('')
  const [excerpt,    setExcerpt]    = useState('')
  const [body,       setBody]       = useState('')
  const [published,  setPublished]  = useState(false)

  // ── Upload state ───────────────────────────────────────────────────────────
  const [coverFile,   setCoverFile]   = useState(null)
  const [coverPreview,setCoverPreview]= useState(null)
  const [existingCover, setExistingCover] = useState(null)

  const [attachFiles, setAttachFiles] = useState([])  // new files to upload
  const [existingFiles, setExistingFiles] = useState([]) // already saved URLs

  // ── UI state ───────────────────────────────────────────────────────────────
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState(null)
  const [success, setSuccess] = useState(false)

  // ── Load existing post when editing ───────────────────────────────────────
  useEffect(() => {
    if (!isEditing) return
    async function load() {
      const { data } = await supabase.from('posts').select('*').eq('id', id).single()
      if (data) {
        setTitle(data.title || '')
        setSlug(data.slug || '')
        setCategory(data.category || '')
        setExcerpt(data.excerpt || '')
        setBody(data.body || '')
        setPublished(data.published || false)
        setExistingCover(data.cover_url || null)
        setExistingFiles(data.files || [])
      }
    }
    load()
  }, [id, isEditing])

  // Auto-fill slug from title (only when creating new)
  useEffect(() => {
    if (!isEditing) setSlug(slugify(title))
  }, [title, isEditing])

  // ── Cover image preview ───────────────────────────────────────────────────
  function handleCoverChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  // ── Upload a file to Supabase Storage ─────────────────────────────────────
  async function uploadFile(bucket, file, folder = '') {
    const ext  = file.name.split('.').pop()
    const name = `${folder}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from(bucket).upload(name, file)
    if (error) throw error
    const { data } = supabase.storage.from(bucket).getPublicUrl(name)
    return data.publicUrl
  }

  // ── Save post ──────────────────────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // 1. Upload cover image if a new one was selected
      let cover_url = existingCover
      if (coverFile) {
        cover_url = await uploadFile('blog-images', coverFile, 'covers/')
      }

      // 2. Upload any new attachment files
      const newFileUrls = await Promise.all(
        attachFiles.map(f => uploadFile('blog-files', f, 'attachments/'))
      )
      const files = [...existingFiles, ...newFileUrls]

      // 3. Build the post payload
      const payload = {
        title,
        slug,
        category,
        excerpt,
        body,
        published,
        cover_url,
        files,
        published_at: published ? new Date().toISOString() : null,
      }

      if (isEditing) {
        const { error } = await supabase.from('posts').update(payload).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('posts').insert([payload])
        if (error) throw error
      }

      setSuccess(true)
      setTimeout(() => navigate('/admin'), 1200)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function removeExistingFile(url) {
    setExistingFiles(prev => prev.filter(f => f !== url))
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-offwhite font-sans">
      {/* Top bar */}
      <div className="bg-primary text-white px-6 py-4 flex items-center justify-between shadow">
        <Link to="/admin" className="flex items-center gap-2 text-white text-opacity-80 hover:text-white text-sm transition">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>
        <span className="font-heading font-bold">{isEditing ? 'Edit Post' : 'New Post'}</span>
        <div className="w-24"></div>
      </div>

      <div className="container max-w-3xl mx-auto px-6 py-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
            <i className="fas fa-exclamation-circle mr-2"></i>{error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl mb-6">
            <i className="fas fa-check-circle mr-2"></i>Post saved! Redirecting…
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">

          {/* Title */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-wider">Post Details</h2>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
                placeholder="Enter post title…"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-accent text-lg font-heading font-bold text-primary" />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Slug (URL)</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">/blog/</span>
                <input type="text" value={slug} onChange={e => setSlug(e.target.value)}
                  placeholder="my-post-url"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-accent text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
              <input type="text" value={category} onChange={e => setCategory(e.target.value)}
                placeholder="e.g. News, Tips, Promotions"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-accent text-sm" />
            </div>
          </div>

          {/* Cover image */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-wider">Cover Image</h2>
            {(coverPreview || existingCover) && (
              <img src={coverPreview || existingCover} alt="Cover preview"
                className="w-full h-52 object-cover rounded-xl mb-4" />
            )}
            <label className="flex items-center justify-center gap-3 border-2 border-dashed border-gray-200 hover:border-accent rounded-xl p-6 cursor-pointer transition-colors group">
              <i className="fas fa-cloud-upload-alt text-2xl text-gray-300 group-hover:text-accent transition"></i>
              <span className="text-sm text-gray-400 group-hover:text-accent transition">
                {coverPreview || existingCover ? 'Replace cover image' : 'Upload cover image'}
              </span>
              <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
            </label>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-wider">Excerpt</h2>
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)}
              rows="3" placeholder="Short summary shown on the blog listing page…"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-accent text-sm resize-none" />
          </div>

          {/* Body */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-wider">
              Body Content
              <span className="ml-2 text-xs text-gray-400 font-normal normal-case">(HTML supported)</span>
            </h2>
            <textarea value={body} onChange={e => setBody(e.target.value)}
              rows="14" placeholder="Write your post content here. You can use HTML tags like <p>, <h2>, <strong>, <ul>, <li>, <img>…"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-accent text-sm font-mono resize-y" />
            <p className="text-xs text-gray-400 mt-2">
              <i className="fas fa-info-circle mr-1"></i>
              Basic HTML: <code>&lt;p&gt;</code>, <code>&lt;h2&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;a href=""&gt;</code>, <code>&lt;img src=""&gt;</code>
            </p>
          </div>

          {/* File attachments */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="font-heading font-bold text-primary mb-4 text-sm uppercase tracking-wider">File Attachments</h2>

            {/* Existing files */}
            {existingFiles.length > 0 && (
              <ul className="mb-4 space-y-2">
                {existingFiles.map((url, i) => (
                  <li key={i} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                    <a href={url} target="_blank" rel="noopener noreferrer"
                      className="text-accent text-sm truncate hover:underline">
                      <i className="fas fa-file mr-2"></i>{url.split('/').pop()}
                    </a>
                    <button type="button" onClick={() => removeExistingFile(url)}
                      className="text-red-400 hover:text-red-600 ml-3 text-xs">
                      <i className="fas fa-times"></i>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* New files */}
            {attachFiles.length > 0 && (
              <ul className="mb-4 space-y-2">
                {attachFiles.map((f, i) => (
                  <li key={i} className="flex items-center justify-between bg-green-50 px-4 py-2 rounded-lg">
                    <span className="text-green-700 text-sm truncate">
                      <i className="fas fa-file-plus mr-2"></i>{f.name}
                    </span>
                    <button type="button"
                      onClick={() => setAttachFiles(prev => prev.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-600 ml-3 text-xs">
                      <i className="fas fa-times"></i>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <label className="flex items-center justify-center gap-3 border-2 border-dashed border-gray-200 hover:border-accent rounded-xl p-5 cursor-pointer transition-colors group">
              <i className="fas fa-paperclip text-xl text-gray-300 group-hover:text-accent transition"></i>
              <span className="text-sm text-gray-400 group-hover:text-accent transition">
                Attach files (PDF, DOCX, images…)
              </span>
              <input type="file" multiple
                onChange={e => setAttachFiles(prev => [...prev, ...Array.from(e.target.files)])}
                className="hidden" />
            </label>
          </div>

          {/* Publish toggle + Save */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setPublished(p => !p)}
                className={`w-12 h-6 rounded-full transition-colors relative ${published ? 'bg-accent' : 'bg-gray-200'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${published ? 'translate-x-7' : 'translate-x-1'}`}></span>
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {published ? 'Published — visible to everyone' : 'Draft — not visible yet'}
              </span>
            </label>

            <button type="submit" disabled={saving}
              className="bg-primary hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-xl transition disabled:opacity-60 w-full sm:w-auto">
              {saving
                ? <span><i className="fas fa-spinner fa-spin mr-2"></i>Saving…</span>
                : <span><i className="fas fa-save mr-2"></i>{isEditing ? 'Save Changes' : 'Create Post'}</span>
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
