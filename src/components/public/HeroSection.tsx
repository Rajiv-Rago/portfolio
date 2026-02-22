import { Download } from 'lucide-react'
import type { Profile } from '../../lib/types'

export default function HeroSection({ profile }: { profile: Profile }) {
  return (
    <div className="relative mx-12 mt-8 mb-16 p-12 rounded-[--radius-xl] bg-gradient-to-br from-accent-light via-gray-100 to-indigo-100 flex items-center gap-12 overflow-hidden max-md:flex-col max-md:text-center max-md:mx-4 max-md:p-8">
      {/* Background blob */}
      <svg
        className="absolute -right-15 -top-15 w-[300px] h-[300px] opacity-12"
        viewBox="0 0 300 300"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="150" cy="150" r="140" fill="#2563eb" />
      </svg>

      {/* Avatar */}
      <div className="shrink-0 w-[130px] h-[130px] rounded-[--radius-xl] overflow-hidden shadow-lg shadow-accent/15 -rotate-3 max-md:rotate-0">
        {profile.avatar_url ? (
          <img src={profile.avatar_url} alt={`${profile.name}'s avatar`} className="w-full h-full object-cover" />
        ) : (
          <svg viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg" aria-label={`${profile.name}'s avatar`}>
            <rect width="130" height="130" rx="24" fill="#dbeafe" />
            <circle cx="65" cy="48" r="20" fill="#2563eb" opacity=".5" />
            <ellipse cx="65" cy="105" rx="34" ry="28" fill="#2563eb" opacity=".35" />
          </svg>
        )}
      </div>

      {/* Text */}
      <div className="relative z-1">
        <h1 className="text-4xl font-normal mb-1">Hey, I'm {profile.name.split(' ')[0]}</h1>
        <p className="text-lg text-accent font-semibold mb-4">{profile.title}</p>
        <p className="text-muted max-w-[440px] text-[0.95rem] max-md:mx-auto">{profile.bio}</p>
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
  )
}
