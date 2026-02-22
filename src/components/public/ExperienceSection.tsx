import type { Experience } from '../../lib/types'
import ExperienceCard from './ExperienceCard'

export default function ExperienceSection({ experience }: { experience: Experience[] }) {
  if (experience.length === 0) return null

  return (
    <section id="experience" className="max-w-[1000px] mx-auto mb-20 px-12 max-md:px-6">
      <h2 className="text-2xl font-normal mb-6 inline-block relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[3px] after:rounded-sm after:bg-accent">
        Experience
      </h2>
      <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
        {experience.map((exp) => (
          <ExperienceCard key={exp.id} experience={exp} />
        ))}
      </div>
    </section>
  )
}
