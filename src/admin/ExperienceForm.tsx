import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Experience } from '../lib/types'
import Input from '../components/ui/Input'
import TagInput from '../components/ui/TagInput'
import Button from '../components/ui/Button'

const schema = z.object({
  job_title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string(),
  responsibilities: z.array(z.string()).min(1, 'Add at least one responsibility'),
  company_logo: z.string(),
}).refine((data) => {
  if (data.end_date && data.start_date > data.end_date) return false
  return true
}, { message: 'Start date must be before end date', path: ['end_date'] })

type ExperienceFormData = z.infer<typeof schema>

interface ExperienceFormProps {
  experience?: Experience | null
  onSubmit: (data: ExperienceFormData) => Promise<void>
  onCancel: () => void
}

export default function ExperienceForm({ experience, onSubmit, onCancel }: ExperienceFormProps) {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<ExperienceFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      job_title: '',
      company: '',
      start_date: '',
      end_date: '',
      responsibilities: [],
      company_logo: '',
    },
  })

  useEffect(() => {
    if (experience) {
      reset({
        job_title: experience.job_title,
        company: experience.company,
        start_date: experience.start_date,
        end_date: experience.end_date ?? '',
        responsibilities: experience.responsibilities,
        company_logo: experience.company_logo ?? '',
      })
    }
  }, [experience, reset])

  const submit = async (data: ExperienceFormData) => {
    await onSubmit({
      ...data,
      end_date: data.end_date || '',
    })
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 max-w-xl">
      <Input label="Job Title" {...register('job_title')} error={errors.job_title?.message} />
      <Input label="Company" {...register('company')} error={errors.company?.message} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Start Date" type="month" {...register('start_date')} error={errors.start_date?.message} />
        <Input label="End Date" type="month" {...register('end_date')} error={errors.end_date?.message} placeholder="Leave empty for Present" />
      </div>
      <Controller
        name="responsibilities"
        control={control}
        render={({ field }) => (
          <TagInput
            label="Responsibilities"
            value={field.value}
            onChange={field.onChange}
            error={errors.responsibilities?.message}
            placeholder="Add bullet points..."
          />
        )}
      />
      <Input label="Company Logo URL" {...register('company_logo')} placeholder="https://..." />

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isSubmitting}>
          {experience ? 'Update' : 'Add'} Experience
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
