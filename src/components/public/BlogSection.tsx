import { Link } from 'react-router-dom'
import type { BlogPost } from '../../lib/types'
import BlogPostCard from './BlogPostCard'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function BlogSection({ posts }: { posts: BlogPost[] }) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>()

  if (posts.length === 0) return null

  const displayed = posts.slice(0, 4)
  const hasMore = posts.length > 4

  return (
    <section ref={ref} id="blog" className={`scroll-reveal ${isVisible ? 'is-visible' : ''} max-w-[1000px] mx-auto mb-24 px-12 max-md:px-6`}>
      <h2 className="section-heading text-base font-heading uppercase tracking-widest mb-10 inline-block relative after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-full after:h-[2px] after:rounded-sm after:bg-accent/40 after:origin-left">
        <span className="text-muted">## </span>Blog
      </h2>
      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        {displayed.map((post, index) => (
          <div
            key={post.id}
            className={`stagger-item ${isVisible ? 'is-visible' : ''}`}
            style={{ '--stagger-index': index } as React.CSSProperties}
          >
            <BlogPostCard post={post} />
          </div>
        ))}
      </div>
      {hasMore && (
        <div className="mt-8 text-center">
          <Link to="/blog" className="text-sm text-accent font-medium hover:text-accent-dark transition-colors">
            View all posts &rarr;
          </Link>
        </div>
      )}
    </section>
  )
}
