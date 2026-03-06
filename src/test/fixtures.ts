import type { Profile, Project, BlogPost, Experience } from '../lib/types'

export function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: 'profile-1',
    name: 'Rajiv Rago',
    title: 'Full Stack Developer',
    bio: 'Building web applications with modern technologies.',
    avatar_url: '/me.png',
    email: 'mail@rajivrago.com',
    contact_intro: 'Feel free to reach out!',
    github: 'https://github.com/rajivrago',
    linkedin: 'https://linkedin.com/in/rajivrago',
    website: 'https://rajivrago.com',
    resume_url: '/resume.pdf',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

export function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'project-1',
    title: 'Portfolio Website',
    description: 'A personal portfolio built with React and Supabase.',
    tech_stack: ['React', 'TypeScript', 'Tailwind CSS'],
    live_url: 'https://rajivrago.com',
    repo_url: 'https://github.com/rajivrago/portfolio',
    thumbnail: '/images/portfolio-thumb.png',
    thumbnail_position: 'center',
    thumbnail_mode: 'image',
    status: 'published',
    is_featured: false,
    sort_order: 0,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

export function makeBlogPost(overrides: Partial<BlogPost> = {}): BlogPost {
  return {
    id: 'post-1',
    title: 'Getting Started with React',
    slug: 'getting-started-with-react',
    body: 'React is a JavaScript library for building user interfaces.',
    excerpt: 'A beginner-friendly introduction to React.',
    tags: ['react', 'javascript'],
    status: 'published',
    published_at: '2026-01-15T00:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-15T00:00:00Z',
    ...overrides,
  }
}

export function makeExperience(overrides: Partial<Experience> = {}): Experience {
  return {
    id: 'exp-1',
    job_title: 'Senior Developer',
    company: 'Tech Corp',
    start_date: '2023-01-01',
    end_date: null,
    responsibilities: [
      'Led development of customer-facing web applications',
      'Mentored junior developers and conducted code reviews',
    ],
    company_logo: '/logos/techcorp.png',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}
