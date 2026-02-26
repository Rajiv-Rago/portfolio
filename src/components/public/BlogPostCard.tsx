import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import type { BlogPost } from '../../lib/types'
import { getReadingTime } from '../../lib/readingTime'

export default function BlogPostCard({ post }: { post: BlogPost }) {
  const excerpt = post.excerpt || post.body.slice(0, 160) + '...'
  const readingTime = getReadingTime(post.body)

  return (
    <div className="h-full bg-surface border border-border rounded-[--radius-lg] p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-text/5 hover:border-accent">
      <h3 className="font-heading text-lg font-normal mb-1">{post.title}</h3>
      {post.published_at && (
        <p className="text-xs text-muted mb-2">
          {format(new Date(post.published_at), 'MMMM d, yyyy')} &middot; {readingTime}
        </p>
      )}
      <p className="text-sm text-muted mb-3">{excerpt}</p>
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag) => (
            <span key={tag} className="text-[0.7rem] font-semibold px-2 py-0.5 bg-accent-light text-accent rounded-[--radius-sm]">
              {tag}
            </span>
          ))}
        </div>
      )}
      <Link to={`/blog/${post.slug}`} className="text-sm text-accent font-medium hover:underline">
        Read more &rarr;
      </Link>
    </div>
  )
}
