import { useContactForm } from '../../hooks/useContactForm'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'

export default function ContactForm() {
  const { form, onSubmit, submitting, rateLimited, honeypotRef } = useContactForm()
  const { register, formState: { errors } } = form

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <input type="text" tabIndex={-1} ref={honeypotRef} autoComplete="off" />
      </div>

      <Input
        label="Name"
        placeholder="Your name"
        {...register('sender_name')}
        error={errors.sender_name?.message}
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        {...register('sender_email')}
        error={errors.sender_email?.message}
      />
      <Input
        label="Subject"
        placeholder="What's this about?"
        {...register('subject')}
        error={errors.subject?.message}
      />
      <Textarea
        label="Message"
        placeholder="Your message..."
        {...register('body')}
        error={errors.body?.message}
      />

      <div className="self-start">
        <Button type="submit" loading={submitting} disabled={rateLimited}>
          {rateLimited ? 'Please wait...' : 'Send Message'}
        </Button>
      </div>
    </form>
  )
}
