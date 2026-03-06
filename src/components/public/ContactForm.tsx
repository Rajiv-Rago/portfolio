import { Mail } from 'lucide-react'
import { useContactForm } from '../../hooks/useContactForm'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'

export default function ContactForm() {
  const { form, onSubmit, submitting, rateLimited, honeypotRef } = useContactForm()
  const { register, formState: { errors } } = form

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold">Send me a message</h3>

      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" tabIndex={-1} ref={honeypotRef} autoComplete="off" />
      </div>

      <Input
        label="Your Name"
        placeholder="Enter name"
        {...register('sender_name')}
        error={errors.sender_name?.message}
      />
      <Input
        label="Your Email"
        type="email"
        placeholder="Enter email"
        {...register('sender_email')}
        error={errors.sender_email?.message}
      />
      <Textarea
        label="Your Message"
        placeholder="Your message..."
        {...register('body')}
        error={errors.body?.message}
      />

      <div className="self-start">
        <Button type="submit" loading={submitting} disabled={rateLimited}>
          <Mail className="w-4 h-4" />
          {rateLimited ? 'Please wait...' : 'Send Message'}
        </Button>
      </div>
    </form>
  )
}
