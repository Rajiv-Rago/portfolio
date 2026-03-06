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
    <section ref={ref} id="blog" className={`scroll-reveal ${isVisible ? 'is-visible' : ''} max-w-[1000px] mx-auto mb-20 px-12 max-md:px-6`}>
      <h2 className="text-2xl font-normal mb-6 inline-block relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[3px] after:rounded-sm after:bg-accent">
        Blog
      </h2>
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
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
        <div className="mt-6 text-center">
          <Link to="/blog" className="text-sm text-accent font-medium hover:underline">
            View all posts &rarr;
          </Link>
        </div>
      )}
    </section>
  )
}
