import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { useFileUpload } from './hooks/useFileUpload'
import type { Profile } from '../lib/types'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Button from '../components/ui/Button'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  bio: z.string().min(1, 'Bio is required'),
  email: z.string().email('Please enter a valid email'),
  contact_intro: z.string(),
  avatar_url: z.string(),
  github: z.string(),
  linkedin: z.string(),
  website: z.string(),
  resume_url: z.string(),
})

type ProfileFormData = z.infer<typeof schema>

export default function ProfileSettings() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const { upload: uploadAvatar, uploading: uploadingAvatar } = useFileUpload('avatars')
  const { upload: uploadResume, uploading: uploadingResume } = useFileUpload('resumes')

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    supabase.from('profile').select('*').single().then(({ data }) => {
      if (data) {
        setProfile(data)
        reset({
          name: data.name,
          title: data.title,
          bio: data.bio,
          email: data.email,
          contact_intro: data.contact_intro ?? '',
          avatar_url: data.avatar_url ?? '',
          github: data.github ?? '',
          linkedin: data.linkedin ?? '',
          website: data.website ?? '',
          resume_url: data.resume_url ?? '',
        })
      }
      setLoading(false)
    })
  }, [reset])

  const onSubmit = async (data: ProfileFormData) => {
    if (!profile) return
    const payload = {
      ...data,
      contact_intro: data.contact_intro || null,
      avatar_url: data.avatar_url || null,
      github: data.github || null,
      linkedin: data.linkedin || null,
      website: data.website || null,
      resume_url: data.resume_url || null,
    }
    const { error } = await supabase.from('profile').update(payload).eq('id', profile.id)
    if (error) {
      toast.error('Something went wrong. Please try again.')
    } else {
      toast.success('Profile updated')
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadAvatar(file, `avatar.${file.name.split('.').pop()}`)
    if (url) setValue('avatar_url', url)
  }

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadResume(file, `resume.${file.name.split('.').pop()}`)
    if (url) setValue('resume_url', url)
  }

  if (loading) return <LoadingSpinner fullScreen />

  return (
    <div>
      <h1 className="text-2xl font-normal mb-6">Profile Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
        <Input label="Name" {...register('name')} error={errors.name?.message} />
        <Input label="Title" {...register('title')} error={errors.title?.message} />
        <Textarea label="Bio" {...register('bio')} error={errors.bio?.message} className="min-h-[80px]" />
        <Textarea label="Contact Intro" {...register('contact_intro')} error={errors.contact_intro?.message} className="min-h-[80px]" />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />

        <div className="space-y-1">
          <Input label="Avatar URL" {...register('avatar_url')} placeholder="https://..." />
          <div className="flex items-center gap-2">
            <label className="text-xs text-accent cursor-pointer hover:underline">
              Upload avatar
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </label>
            {uploadingAvatar && <LoadingSpinner />}
          </div>
        </div>

        <Input label="GitHub" {...register('github')} placeholder="https://github.com/..." />
        <Input label="LinkedIn" {...register('linkedin')} placeholder="https://linkedin.com/in/..." />
        <Input label="Website" {...register('website')} placeholder="https://..." />

        <div className="space-y-1">
          <Input label="Resume URL" {...register('resume_url')} placeholder="https://..." />
          <div className="flex items-center gap-2">
            <label className="text-xs text-accent cursor-pointer hover:underline">
              Upload resume
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
            </label>
            {uploadingResume && <LoadingSpinner />}
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" loading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
