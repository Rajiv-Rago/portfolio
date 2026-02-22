import { format, parse } from 'date-fns'
import type { Experience } from '../../lib/types'

function formatDate(dateStr: string): string {
  const date = parse(dateStr, 'yyyy-MM', new Date())
  return format(date, 'MMM yyyy')
}

export default function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <div className="bg-surface border border-border rounded-[--radius-lg] p-6 transition-colors hover:border-accent">
      <div className="font-heading font-normal text-lg">{experience.job_title}</div>
      <div className="text-accent text-sm font-semibold">{experience.company}</div>
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
  )
}
