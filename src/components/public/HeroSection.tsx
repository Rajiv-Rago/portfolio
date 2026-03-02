import { Download } from 'lucide-react'
import type { Profile } from '../../lib/types'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function HeroSection({ profile }: { profile: Profile }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div ref={ref} className={`scroll-reveal ${isVisible ? 'is-visible' : ''}`}>
      <div className="relative mx-12 mt-8 mb-16 p-12 rounded-[--radius-xl] flex flex-col items-center text-center overflow-hidden max-md:mx-4 max-md:p-8">
        {/* Avatar */}
        <div className="relative z-1 shrink-0 w-[130px] h-[130px] rounded-[--radius-xl] overflow-hidden shadow-lg shadow-accent/15 mb-4">
          <img src="/me.png" alt={`${profile.name}'s avatar`} className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} width={130} height={130} />
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
