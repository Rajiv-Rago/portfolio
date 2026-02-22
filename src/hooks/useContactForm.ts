import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const contactSchema = z.object({
  sender_name: z.string().min(1, 'Name is required'),
  sender_email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

export function useContactForm() {
  const [submitting, setSubmitting] = useState(false)
  const [rateLimited, setRateLimited] = useState(false)
  const honeypotRef = useRef<HTMLInputElement>(null)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { sender_name: '', sender_email: '', subject: '', body: '' },
  })

  const onSubmit = async (data: ContactFormData) => {
    if (honeypotRef.current?.value) return

    if (rateLimited) {
      toast.error('Please wait before sending another message')
      return
    }

    setSubmitting(true)

    const { error } = await supabase.from('contact_messages').insert(data)

    if (error) {
      toast.error('Something went wrong. Please try again.')
    } else {
      toast.success("Message sent! I'll get back to you soon.")
      form.reset()
      setRateLimited(true)
      setTimeout(() => setRateLimited(false), 60000)
    }

    setSubmitting(false)
  }

  return { form, onSubmit: form.handleSubmit(onSubmit), submitting, rateLimited, honeypotRef }
}
