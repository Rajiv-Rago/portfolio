import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useScrollSpy } from '../../hooks/useScrollSpy'

interface NavbarProps {
  name: string
  sections: { id: string; label: string }[]
}

export default function Navbar({ name, sections }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const activeId = useScrollSpy(sections.map((s) => s.id))

  if (sections.length === 0) return null

  return (
    <nav className="flex justify-between items-center px-12 py-4 sticky top-0 z-10 bg-bg/85 backdrop-blur-lg border-b border-border max-md:px-6">
      <div className="font-heading text-xl text-text tracking-wide">{name}</div>

      {/* Desktop */}
      <ul className="hidden md:flex gap-8">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                activeId === s.id ? 'text-accent' : 'text-muted'
              }`}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile toggle */}
      <button
        className="md:hidden text-muted hover:text-text"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <ul className="absolute top-full left-0 right-0 bg-surface border-b border-border flex flex-col py-4 px-6 gap-4 md:hidden shadow-lg">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`text-sm font-medium ${activeId === s.id ? 'text-accent' : 'text-muted'}`}
                onClick={() => setMenuOpen(false)}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
