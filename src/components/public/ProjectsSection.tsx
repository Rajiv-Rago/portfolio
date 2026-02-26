import type { Project } from '../../lib/types'
import ProjectCard from './ProjectCard'
import { useScrollReveal } from '../../hooks/useScrollReveal'

function getGridClass(count: number): string {
  if (count === 1) return 'grid grid-cols-1 gap-5 max-w-[480px] max-md:grid-cols-1'
  if (count === 2) return 'grid grid-cols-2 gap-5 max-md:grid-cols-1'
  return 'grid grid-cols-3 gap-5 max-md:grid-cols-1'
}

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>()

  if (projects.length === 0) return null

  const allowFeaturedSpan = projects.length >= 3

  return (
    <section ref={ref} id="projects" className={`scroll-reveal ${isVisible ? 'is-visible' : ''} max-w-[1000px] mx-auto mb-20 px-12 max-md:px-6`}>
      <h2 className="text-2xl font-normal mb-6 inline-block relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[3px] after:rounded-sm after:bg-accent">
        Projects
      </h2>
      <div className={getGridClass(projects.length)}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} allowFeaturedSpan={allowFeaturedSpan} />
        ))}
      </div>
    </section>
  )
}
