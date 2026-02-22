import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Project } from '../lib/types'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import TagInput from '../components/ui/TagInput'
import Button from '../components/ui/Button'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  tech_stack: z.array(z.string()).min(1, 'Add at least one technology'),
  live_url: z.string().url('Please enter a valid URL').or(z.literal('')),
  repo_url: z.string().url('Please enter a valid URL').or(z.literal('')),
  thumbnail: z.string(),
  status: z.enum(['draft', 'published']),
  is_featured: z.boolean(),
  sort_order: z.number(),
})

type ProjectFormData = z.infer<typeof schema>

interface ProjectFormProps {
  project?: Project | null
  onSubmit: (data: ProjectFormData) => Promise<void>
  onCancel: () => void
}

export default function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<ProjectFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      tech_stack: [],
      live_url: '',
      repo_url: '',
      thumbnail: '',
      status: 'draft',
      is_featured: false,
      sort_order: 0,
    },
  })

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description,
        tech_stack: project.tech_stack,
        live_url: project.live_url ?? '',
        repo_url: project.repo_url ?? '',
        thumbnail: project.thumbnail ?? '',
        status: project.status,
        is_featured: project.is_featured,
        sort_order: project.sort_order,
      })
    }
  }, [project, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <Input label="Title" {...register('title')} error={errors.title?.message} />
      <Textarea label="Description" {...register('description')} error={errors.description?.message} />
      <Controller
        name="tech_stack"
        control={control}
        render={({ field }) => (
          <TagInput
            label="Tech Stack"
            value={field.value}
            onChange={field.onChange}
            error={errors.tech_stack?.message}
            placeholder="React, TypeScript..."
          />
        )}
      />
      <Input label="Live URL" {...register('live_url')} error={errors.live_url?.message} placeholder="https://..." />
      <Input label="Repo URL" {...register('repo_url')} error={errors.repo_url?.message} placeholder="https://..." />
      <Input label="Thumbnail URL" {...register('thumbnail')} placeholder="https://..." />
      <Input label="Sort Order" type="number" {...register('sort_order', { valueAsNumber: true })} />

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <select {...register('status')} className="border border-border rounded-[--radius-md] px-2 py-1 text-sm bg-surface">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('is_featured')} className="accent-accent" />
          Featured
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isSubmitting}>
          {project ? 'Update' : 'Add'} Project
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
