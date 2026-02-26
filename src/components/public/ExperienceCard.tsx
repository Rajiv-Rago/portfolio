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
        className={`absolute -left-8 top-1.5 w-3 h-3 rounded-full border-2 border-accent ${
          isCurrent ? 'bg-accent' : 'bg-surface'
        }`}
      />

      {/* Content */}
      <div className="bg-surface border border-border rounded-[--radius-lg] p-5 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-text/5 hover:border-accent">
        <div className="flex items-center gap-2 mb-1">
          <div className="font-heading font-normal text-lg">{experience.job_title}</div>
        </div>
        <div className="flex items-center gap-2">
          {experience.company_logo && !logoError && (
            <img
              src={experience.company_logo}
              alt={`${experience.company} logo`}
              className="w-6 h-6 rounded object-cover"
              loading="lazy"
              width={24}
              height={24}
              onError={() => setLogoError(true)}
            />
          )}
          <span className="text-accent text-sm font-semibold">{experience.company}</span>
        </div>
        <div className="text-muted text-xs mt-1 mb-3">
          {formatDate(experience.start_date)} — {experience.end_date ? formatDate(experience.end_date) : 'Present'}
        </div>
        {experience.responsibilities.length > 0 && (
          <ul className="pl-5 list-disc">
            {experience.responsibilities.map((item, i) => (
              <li key={i} className="text-sm text-muted mb-1">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
