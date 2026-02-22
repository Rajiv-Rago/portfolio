import type { Project } from '../../lib/types'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      className={`bg-surface border border-border rounded-[--radius-lg] p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-text/5 hover:border-accent ${
        project.is_featured ? 'col-span-2 max-md:col-span-1' : ''
      }`}
    >
      {/* Color bar */}
      <div className={`${project.is_featured ? 'w-20' : 'w-10'} h-1 rounded-sm bg-accent mb-4`} />

      <h3 className="text-lg font-normal mb-1">{project.title}</h3>
      <p className="text-sm text-muted mb-3">{project.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.tech_stack.map((tech) => (
          <span
            key={tech}
            className="text-[0.7rem] font-semibold px-2 py-0.5 bg-accent-light text-accent rounded-[--radius-sm]"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      {(project.live_url || project.repo_url) && (
        <div className="flex gap-4 mt-3">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent font-medium hover:underline"
            >
              Live Demo &rarr;
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent font-medium hover:underline"
            >
              Source Code &rarr;
            </a>
          )}
        </div>
      )}
    </div>
  )
}
