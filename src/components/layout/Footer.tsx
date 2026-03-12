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
    <footer className="mt-12 border-t border-border/60">
      <div className="max-w-[1000px] mx-auto px-12 py-12 max-md:px-6 max-md:py-8">
        <div className="flex justify-between items-center max-md:flex-col max-md:gap-6 max-md:text-center">
          <div>
            <div className="font-heading text-sm tracking-wider mb-1">
              <span className="text-accent">{name}</span>
            </div>
            <p className="font-heading text-xs text-muted tracking-wide">&copy; {new Date().getFullYear()} &middot; Built with React &amp; Supabase</p>
          </div>
          {hasLinks && (
            <div className="flex gap-5">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="text-muted hover:text-accent hover:-translate-y-0.5 hover:scale-110 transition-all"
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
                  className="text-muted hover:text-accent hover:-translate-y-0.5 hover:scale-110 transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  aria-label="Email"
                  className="text-muted hover:text-accent hover:-translate-y-0.5 hover:scale-110 transition-all"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
