import { useState } from 'react'
import { Mail, Check } from 'lucide-react'
import Button from '../ui/Button'

export default function EmailCTA({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation()
    e.preventDefault()

    try {
      await navigator.clipboard.writeText(email)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = email
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">
      <a
        href={`mailto:${email}`}
        className="flex items-center gap-3 no-underline text-text text-lg font-medium hover:text-accent hover:-translate-y-0.5 transition-all"
      >
        <Mail className="w-5 h-5 shrink-0 text-accent" />
        {email}
      </a>
      <Button variant="ghost" className="hover:-translate-y-0.5 transition-all" onClick={handleCopy}>
        {copied ? (
          <>
            <Check className="w-4 h-4" /> Copied!
          </>
        ) : (
          'Copy Email'
        )}
      </Button>
    </div>
  )
}
