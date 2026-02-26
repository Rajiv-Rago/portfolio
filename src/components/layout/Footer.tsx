import { Github, Linkedin, Mail } from 'lucide-react'

interface FooterProps {
  name: string
  email?: string | null
  github?: string | null
  linkedin?: string | null
}

export default function Footer({ name, email, github, linkedin }: FooterProps) {
  const hasLinks = email || github || linkedin

  return (
    <footer className="text-center py-8 border-t border-border text-muted text-sm">
      {hasLinks && (
        <div className="flex justify-center gap-4 mb-3">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted hover:text-accent transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted hover:text-accent transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              aria-label="Email"
              className="text-muted hover:text-accent transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          )}
        </div>
      )}
      <p>&copy; {new Date().getFullYear()} {name}</p>
      <p className="text-xs text-muted/60 mt-1">Built with React &amp; Supabase</p>
    </footer>
  )
}
