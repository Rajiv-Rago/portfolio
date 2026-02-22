import { Mail, Github, Linkedin, Globe } from 'lucide-react'
import type { Profile } from '../../lib/types'

export default function ContactLinks({ profile }: { profile: Profile }) {
  const links = [
    { url: profile.email ? `mailto:${profile.email}` : null, label: profile.email, icon: Mail, newTab: false },
    { url: profile.github, label: profile.github?.replace('https://', ''), icon: Github, newTab: true },
    { url: profile.linkedin, label: profile.linkedin?.replace('https://', ''), icon: Linkedin, newTab: true },
    { url: profile.website, label: profile.website?.replace('https://', ''), icon: Globe, newTab: true },
  ].filter((l) => l.url)

  return (
    <div className="flex flex-col gap-5">
      <p className="text-muted text-[0.95rem]">
        Feel free to reach out through any of these channels, or use the form to send me a message directly.
      </p>
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
