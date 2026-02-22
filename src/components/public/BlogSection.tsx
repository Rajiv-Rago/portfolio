import type { BlogPost } from '../../lib/types'
import BlogPostCard from './BlogPostCard'

export default function BlogSection({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null

  return (
    <section id="blog" className="max-w-[1000px] mx-auto mb-20 px-12 max-md:px-6">
      <h2 className="text-2xl font-normal mb-6 inline-block relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[3px] after:rounded-sm after:bg-accent">
        Blog
      </h2>
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
