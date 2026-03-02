import { Download } from 'lucide-react'
import type { Profile } from '../../lib/types'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function HeroSection({ profile }: { profile: Profile }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div ref={ref} className={`scroll-reveal ${isVisible ? 'is-visible' : ''}`}>
      <div className="relative mx-12 mt-8 mb-16 p-12 rounded-[--radius-xl] bg-gradient-to-br from-accent-light via-gray-100 to-indigo-100 flex flex-col items-center text-center overflow-hidden max-md:mx-4 max-md:p-8">
        {/* Background pixel-art terminal */}
        <svg
          className="absolute -right-5 -top-5 w-[300px] h-[300px] opacity-10"
          viewBox="0 0 28 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Title bar */}
          <rect x="0" y="0" width="28" height="4" fill="#2563eb" />
          <rect x="1" y="1" width="2" height="2" fill="#ef4444" />
          <rect x="4" y="1" width="2" height="2" fill="#fbbf24" />
          <rect x="7" y="1" width="2" height="2" fill="#22c55e" />
          {/* Terminal body */}
          <rect x="0" y="4" width="28" height="16" fill="#1e3a5f" />
          {/* Code lines */}
          <rect x="2" y="6" width="10" height="1" fill="#60a5fa" />
          <rect x="4" y="8" width="14" height="1" fill="#93c5fd" />
          <rect x="4" y="10" width="8" height="1" fill="#60a5fa" />
          <rect x="2" y="12" width="12" height="1" fill="#93c5fd" />
          <rect x="4" y="14" width="6" height="1" fill="#60a5fa" />
          {/* Cursor */}
          <rect x="2" y="16" width="2" height="2" fill="#dbeafe" />
        </svg>

        {/* Avatar */}
        <div className="relative z-1 shrink-0 w-[130px] h-[130px] rounded-[--radius-xl] overflow-hidden shadow-lg shadow-accent/15 -rotate-3 mb-4">
          <img src="/Probably me.png" alt={`${profile.name}'s avatar`} className="w-full h-full object-cover" width={130} height={130} />
        </div>

        {/* Text */}
        <div className="relative z-1">
          <h1 className="text-4xl font-normal mb-1">Hey, I'm {profile.name.split(' ')[0]}</h1>
          <p className="text-lg text-accent font-semibold mb-4">{profile.title}</p>
          <p className="text-muted max-w-[440px] text-[0.95rem] mx-auto">{profile.bio}</p>
          {profile.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2 bg-accent text-white rounded-[--radius-md] text-sm font-semibold hover:bg-accent-dark transition-colors no-underline"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
