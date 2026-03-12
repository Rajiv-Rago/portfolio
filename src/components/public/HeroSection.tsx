import { Download } from 'lucide-react'
import type { Profile } from '../../lib/types'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function HeroSection({ profile }: { profile: Profile }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <section ref={ref} className={`scroll-reveal ${isVisible ? 'is-visible' : ''}`}>
      <div className="relative max-w-[1000px] mx-auto px-12 pt-20 pb-24 flex flex-col items-center text-center max-md:px-6 max-md:pt-14 max-md:pb-16">
        {/* Radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, rgba(167,139,250,0.04) 40%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        {/* Avatar */}
        <img
          src="/me.png"
          alt={`${profile.name}'s avatar`}
          className="relative z-1 mb-8"
          style={{
            imageRendering: 'pixelated',
            filter: 'drop-shadow(0 0 24px rgba(34,211,238,0.3)) drop-shadow(0 0 48px rgba(167,139,250,0.15))',
          }}
          width={170}
          height={170}
        />

        {/* Status badge */}
        <div className="relative z-1 flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-accent/20 bg-accent-light">
          <span className="w-2 h-2 rounded-full bg-accent pulse-dot" />
          <span className="font-heading text-xs text-accent tracking-wide">Available for work</span>
        </div>

        {/* Text */}
        <div className="relative z-1">
          <h1 className="text-5xl font-normal leading-tight mb-2 max-md:text-4xl text-gradient">
            Hey, I'm {profile.name.split(' ')[0]}
          </h1>
          <p className="text-lg text-accent font-heading font-medium tracking-wide mb-5">
            {profile.title?.replace(/\s+/g, '_').toLowerCase() ?? ''}
          </p>
          <p className="text-muted max-w-[480px] mx-auto leading-relaxed">{profile.bio}</p>
          {profile.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-7 px-6 py-2.5 border border-accent text-accent rounded-[--radius-md] text-sm font-medium hover:bg-accent hover:text-bg hover:-translate-y-0.5 transition-all hover:shadow-lg hover:shadow-accent/20 no-underline"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
