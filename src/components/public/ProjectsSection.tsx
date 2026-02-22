import type { Project } from '../../lib/types'
import ProjectCard from './ProjectCard'

export default function ProjectsSection({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null

  return (
    <section id="projects" className="max-w-[1000px] mx-auto mb-20 px-12 max-md:px-6">
      <h2 className="text-2xl font-normal mb-6 inline-block relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[3px] after:rounded-sm after:bg-accent">
        Projects
      </h2>
      <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
