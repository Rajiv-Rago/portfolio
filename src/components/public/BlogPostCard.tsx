import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import type { BlogPost } from '../../lib/types'
import { getReadingTime } from '../../lib/readingTime'

export default function BlogPostCard({ post }: { post: BlogPost }) {
  const excerpt = post.excerpt || post.body.slice(0, 160) + '...'
  const readingTime = getReadingTime(post.body)

  return (
    <div className="group h-full bg-surface border border-border/80 rounded-[--radius-lg] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/8 hover:border-accent/40">
      {post.published_at && (
        <p className="text-xs text-accent/70 font-medium tracking-wider uppercase mb-3">
          {format(new Date(post.published_at), 'MMM d, yyyy')} &middot; {readingTime}
        </p>
      )}
      <h3 className="font-heading text-lg leading-snug mb-2 group-hover:text-accent transition-colors">{post.title}</h3>
      <p className="text-sm text-muted mb-4 leading-relaxed">{excerpt}</p>
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="font-heading text-[0.65rem] px-2 py-0.5 bg-accent-light text-accent rounded-[--radius-sm] border border-accent/15">
              {tag}
            </span>
          ))}
        </div>
      )}
      <Link to={`/blog/${post.slug}`} className="text-sm text-accent font-medium hover:text-accent-dark transition-colors">
        Read more &rarr;
      </Link>
    </div>
  )
}
