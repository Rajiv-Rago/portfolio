import { useState } from 'react'
import { format, parse } from 'date-fns'
import type { Experience } from '../../lib/types'

function formatDate(dateStr: string): string {
  const date = parse(dateStr, 'yyyy-MM', new Date())
  return format(date, 'MMM yyyy')
}

export default function ExperienceCard({ experience }: { experience: Experience }) {
  const [logoError, setLogoError] = useState(false)
  const isCurrent = !experience.end_date

  return (
    <div className="relative">
      {/* Timeline dot */}
      <div
        className={`absolute -left-8 top-2 w-3 h-3 rounded-full border-2 border-accent transition-colors ${
          isCurrent ? 'bg-accent shadow-sm shadow-accent/30' : 'bg-bg'
        }`}
      />

      {/* Content */}
      <div className="bg-surface border border-border/80 rounded-[--radius-lg] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/5 hover:border-accent/30">
        <div className="flex items-center gap-2.5 mb-1">
          {experience.company_logo && !logoError && (
            <img
              src={experience.company_logo}
              alt={`${experience.company} logo`}
              className="w-7 h-7 rounded-[--radius-sm] object-cover"
              loading="lazy"
              width={28}
              height={28}
              onError={() => setLogoError(true)}
            />
          )}
          <div>
            <div className="font-heading text-lg leading-snug">{experience.job_title}</div>
            <span className="text-accent text-sm font-medium">{experience.company}</span>
          </div>
        </div>
        <div className="text-muted text-xs mt-1.5 mb-3 tracking-wide">
          {formatDate(experience.start_date)} &mdash; {experience.end_date ? formatDate(experience.end_date) : 'Present'}
        </div>
        {experience.responsibilities.length > 0 && (
          <ul className="pl-5 list-disc marker:text-accent/40">
            {experience.responsibilities.map((item, i) => (
              <li key={i} className="text-sm text-muted mb-1 leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
