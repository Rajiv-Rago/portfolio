import { useState } from 'react'
import { Github, Linkedin, Globe, Mail, Copy, Check } from 'lucide-react'
import type { Profile } from '../../lib/types'

export default function ContactLinks({ profile }: { profile: Profile }) {
  const [copied, setCopied] = useState(false)

  const links = [
    { url: profile.github, label: profile.github?.replace('https://', ''), icon: Github, newTab: true },
    { url: profile.linkedin, label: profile.linkedin?.replace('https://', ''), icon: Linkedin, newTab: true },
    { url: profile.website, label: profile.website?.replace('https://', ''), icon: Globe, newTab: true },
  ].filter((l) => l.url)

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = profile.email
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
    <div className="flex flex-col gap-5">
      <p className="text-muted text-[0.95rem]">
        {profile.contact_intro ?? "I'd love to hear from you! Whether you have a project in mind, want to collaborate, or just want to say hello \u2014 don't hesitate to reach out."}
      </p>

      <div className="flex items-center gap-3 px-4 py-3 border border-border rounded-[10px] transition-all hover:border-accent hover:bg-accent-light">
        <a
          href={`mailto:${profile.email}`}
          className="flex items-center gap-3 no-underline text-text text-sm font-medium flex-1"
        >
          <Mail className="w-5 h-5 shrink-0 text-accent" />
          {profile.email}
        </a>
        <button
          type="button"
          onClick={handleCopyEmail}
          className="p-1 rounded-[--radius-md] text-muted hover:text-accent transition-colors cursor-pointer"
          aria-label={copied ? 'Copied' : 'Copy email'}
          title={copied ? 'Copied!' : 'Copy email'}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {links.map((link) => (
        <a
          key={link.url}
          href={link.url!}
          target={link.newTab ? '_blank' : undefined}
          rel={link.newTab ? 'noopener noreferrer' : undefined}
          className="flex items-center gap-3 no-underline text-text text-sm font-medium px-4 py-3 border border-border rounded-[10px] transition-all hover:border-accent hover:bg-accent-light"
        >
          <link.icon className="w-5 h-5 shrink-0 text-accent" />
          {link.label}
        </a>
      ))}
    </div>
  )
}
