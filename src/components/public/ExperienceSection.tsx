import type { Experience } from '../../lib/types'
import ExperienceCard from './ExperienceCard'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function ExperienceSection({ experience }: { experience: Experience[] }) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>()

  if (experience.length === 0) return null

  return (
    <section ref={ref} id="experience" className={`scroll-reveal ${isVisible ? 'is-visible' : ''} max-w-[1000px] mx-auto mb-24 px-12 max-md:px-6`}>
      <h2 className="section-heading text-base font-heading uppercase tracking-widest mb-10 inline-block relative after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-full after:h-[2px] after:rounded-sm after:bg-accent/40 after:origin-left">
        <span className="text-muted">## </span>Experience
      </h2>
      <div className="relative pl-8">
        {/* Vertical timeline line */}
        <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-accent/30 via-border to-border/40" />
        <div className="flex flex-col gap-6">
          {experience.map((exp, index) => (
            <div
              key={exp.id}
              className={`stagger-item ${isVisible ? 'is-visible' : ''}`}
              style={{ '--stagger-index': index } as React.CSSProperties}
            >
              <ExperienceCard experience={exp} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
