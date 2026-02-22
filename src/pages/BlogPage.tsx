import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { BlogPost } from '../lib/types'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import NotFoundPage from './NotFoundPage'

export default function BlogPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotFound(true)
        } else {
          setPost(data)
        }
        setLoading(false)
      })
  }, [slug])

  if (loading) return <LoadingSpinner fullScreen />
  if (notFound || !post) return <NotFoundPage />

  return (
    <div className="max-w-[700px] mx-auto px-6 py-12">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-accent font-medium hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to portfolio
      </Link>

      <article>
        <h1 className="text-3xl font-normal mb-2">{post.title}</h1>
        {post.published_at && (
          <p className="text-sm text-muted mb-1">{format(new Date(post.published_at), 'MMMM d, yyyy')}</p>
        )}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-8">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs font-semibold px-2 py-0.5 bg-accent-light text-accent rounded-[--radius-sm]">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="prose prose-slate max-w-none [&_h2]:font-heading [&_h3]:font-heading [&_a]:text-accent">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
        </div>
      </article>
    </div>
  )
}
