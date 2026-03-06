import { describe, it, expect } from 'vitest'
import { makeProfile, makeProject, makeBlogPost, makeExperience } from './fixtures'

describe('Test fixtures', () => {
  describe('makeProfile', () => {
    it('returns a valid Profile with defaults', () => {
      const profile = makeProfile()
      expect(profile.id).toBeDefined()
      expect(profile.name).toBeDefined()
      expect(profile.email).toBeDefined()
      expect(profile.title).toBeDefined()
      expect(profile.bio).toBeDefined()
      expect(profile.updated_at).toBeDefined()
    })

    it('accepts overrides', () => {
      const profile = makeProfile({ name: 'Custom Name', email: 'custom@example.com' })
      expect(profile.name).toBe('Custom Name')
      expect(profile.email).toBe('custom@example.com')
    })
  })

  describe('makeProject', () => {
    it('returns a valid Project with defaults', () => {
      const project = makeProject()
      expect(project.id).toBeDefined()
      expect(project.title).toBeDefined()
      expect(project.tech_stack).toBeInstanceOf(Array)
      expect(project.status).toBe('published')
      expect(project.thumbnail_position).toBe('center')
      expect(project.thumbnail_mode).toBe('image')
    })

    it('accepts overrides', () => {
      const project = makeProject({ title: 'My Project', is_featured: true })
      expect(project.title).toBe('My Project')
      expect(project.is_featured).toBe(true)
    })
  })

  describe('makeBlogPost', () => {
    it('returns a valid BlogPost with defaults', () => {
      const post = makeBlogPost()
      expect(post.id).toBeDefined()
      expect(post.title).toBeDefined()
      expect(post.slug).toBeDefined()
      expect(post.body).toBeDefined()
      expect(post.tags).toBeInstanceOf(Array)
      expect(post.status).toBe('published')
    })

    it('accepts overrides', () => {
      const post = makeBlogPost({ title: 'Custom Post', status: 'draft' })
      expect(post.title).toBe('Custom Post')
      expect(post.status).toBe('draft')
    })
  })

  describe('makeExperience', () => {
    it('returns a valid Experience with defaults', () => {
      const exp = makeExperience()
      expect(exp.id).toBeDefined()
      expect(exp.job_title).toBeDefined()
      expect(exp.company).toBeDefined()
      expect(exp.start_date).toBeDefined()
      expect(exp.responsibilities).toBeInstanceOf(Array)
      expect(exp.responsibilities.length).toBeGreaterThan(0)
    })

    it('accepts overrides', () => {
      const exp = makeExperience({ company: 'Acme Corp', end_date: '2025-12-31' })
      expect(exp.company).toBe('Acme Corp')
      expect(exp.end_date).toBe('2025-12-31')
    })
  })
})
