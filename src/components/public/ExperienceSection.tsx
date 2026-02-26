import type { Experience } from '../../lib/types'
import ExperienceCard from './ExperienceCard'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function ExperienceSection({ experience }: { experience: Experience[] }) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>()

  if (experience.length === 0) return null

  return (
    <section ref={ref} id="experience" className={`scroll-reveal ${isVisible ? 'is-visible' : ''} max-w-[1000px] mx-auto mb-20 px-12 max-md:px-6`}>
      <h2 className="text-2xl font-normal mb-6 inline-block relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[3px] after:rounded-sm after:bg-accent">
        Experience
      </h2>
      <div className="relative pl-8">
        {/* Vertical timeline line */}
        <div className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-border" />
        <div className="flex flex-col gap-6">
          {experience.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
        </div>
      </div>
    </section>
  )
}
