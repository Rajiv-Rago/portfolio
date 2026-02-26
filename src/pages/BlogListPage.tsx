import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useBlogPosts } from '../hooks/useBlogPosts'
import { useMetaTags } from '../hooks/useMetaTags'
import BlogPostCard from '../components/public/BlogPostCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function BlogListPage() {
  const { posts, loading } = useBlogPosts()
  const [activeTag, setActiveTag] = useState<string | null>(null)

  useMetaTags({ title: 'Blog \u2014 Portfolio' })

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach(post => post.tags.forEach(tag => tagSet.add(tag)))
    return Array.from(tagSet).sort()
  }, [posts])

  const filtered = activeTag ? posts.filter(p => p.tags.includes(activeTag)) : posts

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div className="max-w-[1000px] mx-auto px-12 py-12 max-md:px-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-accent font-medium hover:underline mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to portfolio
      </Link>

      <h1 className="text-3xl font-normal mb-6">Blog</h1>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTag(null)}
            className={`text-xs font-semibold px-3 py-1 rounded-[--radius-sm] transition-colors cursor-pointer ${
              !activeTag ? 'bg-accent text-white' : 'bg-accent-light text-accent hover:bg-accent/10'
            }`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`text-xs font-semibold px-3 py-1 rounded-[--radius-sm] transition-colors cursor-pointer ${
                activeTag === tag ? 'bg-accent text-white' : 'bg-accent-light text-accent hover:bg-accent/10'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-muted text-center py-12">
          {activeTag ? `No posts found with tag "${activeTag}"` : 'No blog posts yet.'}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
          {filtered.map(post => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
