import { useState } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { useTheme } from '../../hooks/useTheme'

interface NavbarProps {
  name: string
  sections: { id: string; label: string }[]
}

export default function Navbar({ name, sections }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const activeId = useScrollSpy(sections.map((s) => s.id))
  const { theme, toggleTheme } = useTheme()

  if (sections.length === 0) return null

  return (
    <nav className="flex justify-between items-center px-12 py-4 sticky top-0 z-10 bg-bg/90 backdrop-blur-xl border-b border-border/60 max-md:px-6">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        className="font-heading text-sm tracking-wider text-text hover:text-accent transition-colors cursor-pointer"
      >
        <span className="text-accent">&gt; </span>{name}
      </a>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-8">
        <ul className="flex gap-8">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`font-heading uppercase text-xs tracking-widest transition-colors animated-underline ${
                  activeId === s.id ? 'text-accent font-medium' : 'text-muted hover:text-accent'
                }`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={toggleTheme}
          className="text-muted hover:text-accent transition-colors p-1.5 rounded-[--radius-sm] hover:bg-accent-light cursor-pointer"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile toggle */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={toggleTheme}
          className="text-muted hover:text-accent transition-colors p-1.5 cursor-pointer"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button
          className="text-muted hover:text-text transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <ul className="absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-xl border-b border-border/60 flex flex-col py-5 px-6 gap-5 md:hidden shadow-lg shadow-text/5">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`font-heading uppercase text-xs tracking-widest ${activeId === s.id ? 'text-accent font-medium' : 'text-muted'}`}
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
