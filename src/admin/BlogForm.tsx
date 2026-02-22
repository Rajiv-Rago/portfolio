import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { BlogPost } from '../lib/types'
import { slugify } from '../lib/slugify'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import TagInput from '../components/ui/TagInput'
import Button from '../components/ui/Button'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  body: z.string().min(1, 'Body is required'),
  excerpt: z.string(),
  tags: z.array(z.string()),
  status: z.enum(['draft', 'published']),
})

type BlogFormData = z.infer<typeof schema>

interface BlogFormProps {
  post?: BlogPost | null
  onSubmit: (data: BlogFormData) => Promise<void>
  onCancel: () => void
}

export default function BlogForm({ post, onSubmit, onCancel }: BlogFormProps) {
  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<BlogFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      slug: '',
      body: '',
      excerpt: '',
      tags: [],
      status: 'draft',
    },
  })

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        slug: post.slug,
        body: post.body,
        excerpt: post.excerpt ?? '',
        tags: post.tags,
        status: post.status,
      })
    }
  }, [post, reset])

  const title = watch('title')

  useEffect(() => {
    if (!post) {
      setValue('slug', slugify(title))
    }
  }, [title, post, setValue])

  const submit = async (data: BlogFormData) => {
    const payload = {
      ...data,
      excerpt: data.excerpt || data.body.slice(0, 160),
    }
    await onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 max-w-2xl">
      <Input label="Title" {...register('title')} error={errors.title?.message} />
      <Input label="Slug" {...register('slug')} error={errors.slug?.message} />
      <Textarea
        label="Body (Markdown)"
        {...register('body')}
        error={errors.body?.message}
        className="min-h-[300px] font-mono text-sm"
      />
      <Textarea label="Excerpt" {...register('excerpt')} placeholder="Auto-generated from body if left empty" className="min-h-[60px]" />
      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <TagInput label="Tags" value={field.value} onChange={field.onChange} />
        )}
      />
      <label className="flex items-center gap-2 text-sm">
        <select {...register('status')} className="border border-border rounded-[--radius-md] px-2 py-1 text-sm bg-surface">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isSubmitting}>
          {post ? 'Update' : 'Add'} Post
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
