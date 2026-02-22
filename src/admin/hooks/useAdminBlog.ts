import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import type { BlogPost } from '../../lib/types'
import toast from 'react-hot-toast'

export function useAdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    setPosts(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const create = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
    const payload = {
      ...post,
      published_at: post.status === 'published' ? new Date().toISOString() : null,
    }
    const { error } = await supabase.from('blog_posts').insert(payload)
    if (error) { toast.error('Something went wrong. Please try again.'); throw error }
    toast.success('Post added')
    await fetch()
  }

  const update = async (id: string, post: Partial<BlogPost>, wasPublished: boolean) => {
    const payload = { ...post }
    if (post.status === 'published' && !wasPublished) {
      payload.published_at = new Date().toISOString()
    }
    const { error } = await supabase.from('blog_posts').update(payload).eq('id', id)
    if (error) { toast.error('Something went wrong. Please try again.'); throw error }
    toast.success('Post updated')
    await fetch()
  }

  const remove = async (id: string) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id)
    if (error) { toast.error('Something went wrong. Please try again.'); throw error }
    toast.success('Post deleted')
    await fetch()
  }

  return { posts, loading, create, update, remove, refetch: fetch }
}
