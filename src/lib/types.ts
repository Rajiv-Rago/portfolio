export interface Profile {
  id: string
  name: string
  title: string
  bio: string
  avatar_url: string | null
  email: string
  github: string | null
  linkedin: string | null
  website: string | null
  resume_url: string | null
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  tech_stack: string[]
  live_url: string | null
  repo_url: string | null
  thumbnail: string | null
  status: 'draft' | 'published'
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  job_title: string
  company: string
  start_date: string
  end_date: string | null
  responsibilities: string[]
  company_logo: string | null
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  body: string
  excerpt: string | null
  tags: string[]
  status: 'draft' | 'published'
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  sender_name: string
  sender_email: string
  subject: string
  body: string
  is_read: boolean
  created_at: string
}
