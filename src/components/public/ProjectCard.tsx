import type { Project } from '../../lib/types'

const objectPositionMap = {
  top: 'object-top',
  center: 'object-center',
  bottom: 'object-bottom',
} as const

export default function ProjectCard({ project, allowFeaturedSpan = true }: { project: Project; allowFeaturedSpan?: boolean }) {
  const mode = project.thumbnail_mode ?? 'image'
  const position = project.thumbnail_position ?? 'center'
  const showImage = mode === 'image' && project.thumbnail
  const showLive = mode === 'live' && project.live_url

  return (
    <div
      className={`group h-full bg-surface border border-border/80 rounded-[--radius-lg] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-accent/8 hover:border-accent/40 ${
        project.is_featured && allowFeaturedSpan ? 'col-span-2 max-md:col-span-1' : ''
      }`}
    >
      {/* Thumbnail */}
      {showImage && (
        <div className="aspect-video overflow-hidden rounded-[--radius-md] mb-5 -mx-1 -mt-1">
          <img
            src={project.thumbnail!}
            alt={project.title}
            loading="lazy"
            width={600}
            height={337}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${objectPositionMap[position]}`}
          />
        </div>
      )}
      {showLive && (
        <div className="aspect-video overflow-hidden rounded-[--radius-md] mb-5 -mx-1 -mt-1 relative bg-surface">
          <iframe
            src={project.live_url!}
            title={`${project.title} live preview`}
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              width: '400%',
              height: '400%',
              transform: 'scale(0.25)',
              transformOrigin: 'top left',
            }}
          />
        </div>
      )}

      {/* Accent bar */}
      <div className={`${project.is_featured ? 'w-16' : 'w-8'} h-0.5 rounded-full bg-accent/50 mb-4`} />

      <h3 className="text-lg font-normal mb-1.5">{project.title}</h3>
      <p className="text-sm text-muted mb-4 leading-relaxed">{project.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.tech_stack.map((tech) => (
          <span
            key={tech}
            className="font-heading text-[0.65rem] px-2 py-0.5 bg-accent-light text-accent rounded-[--radius-sm] border border-accent/15"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      {(project.live_url || project.repo_url) && (
        <div className="flex gap-5 mt-4 pt-4 border-t border-border/50">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent font-medium hover:text-accent-dark transition-colors"
            >
              Live Demo &rarr;
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted font-medium hover:text-accent transition-colors"
            >
              Source Code &rarr;
            </a>
          )}
        </div>
      )}
    </div>
  )
}
