import { Download } from 'lucide-react'
import type { Profile } from '../../lib/types'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function HeroSection({ profile }: { profile: Profile }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div ref={ref} className={`scroll-reveal ${isVisible ? 'is-visible' : ''}`}>
      <div className="mt-8 mb-16 flex flex-col items-center text-center max-md:px-4">
        <img
          src="/me.png"
          alt={`${profile.name}'s avatar`}
          className="mb-4"
          style={{ imageRendering: 'pixelated' }}
          width={170}
          height={170}
        />

        <div>
          <h1 className="text-4xl font-normal mb-1">Hey, I'm {profile.name.split(' ')[0]}</h1>
          <p className="text-lg text-accent font-semibold mb-4">{profile.title}</p>
          <p className="text-muted max-w-[440px] text-[0.95rem] mx-auto">{profile.bio}</p>
          {profile.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2 bg-accent text-white rounded-[--radius-md] text-sm font-semibold hover:bg-accent-dark hover:-translate-y-0.5 transition-all no-underline"
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
