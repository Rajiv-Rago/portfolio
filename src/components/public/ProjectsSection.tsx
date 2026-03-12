import type { Project } from '../../lib/types'
import ProjectCard from './ProjectCard'
import { useScrollReveal } from '../../hooks/useScrollReveal'

function getGridClass(count: number): string {
  if (count === 1) return 'grid grid-cols-1 gap-6 max-w-[480px] max-md:grid-cols-1'
  if (count === 2) return 'grid grid-cols-2 gap-6 max-md:grid-cols-1'
  return 'grid grid-cols-3 gap-6 max-md:grid-cols-1'
}

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>()

  if (projects.length === 0) return null

  const allowFeaturedSpan = projects.length >= 3

  return (
    <section ref={ref} id="projects" className={`scroll-reveal ${isVisible ? 'is-visible' : ''} max-w-[1000px] mx-auto mb-24 px-12 max-md:px-6`}>
      <h2 className="section-heading text-base font-heading uppercase tracking-widest mb-10 inline-block relative after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-full after:h-[2px] after:rounded-sm after:bg-accent/40 after:origin-left">
        <span className="text-muted">## </span>Projects
      </h2>
      <div className={getGridClass(projects.length)}>
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`stagger-item ${isVisible ? 'is-visible' : ''} ${
              project.is_featured && allowFeaturedSpan ? 'col-span-2 max-md:col-span-1' : ''
            }`}
            style={{ '--stagger-index': index } as React.CSSProperties}
          >
            <ProjectCard project={project} allowFeaturedSpan={false} />
          </div>
        ))}
      </div>
    </section>
  )
}
