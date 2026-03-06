import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { makeProject, makeExperience, makeBlogPost } from '../../../test/fixtures'
import ProjectsSection from '../ProjectsSection'
import ExperienceSection from '../ExperienceSection'
import BlogSection from '../BlogSection'

vi.mock('../../../hooks/useScrollReveal', () => ({
  useScrollReveal: () => ({ ref: { current: null }, isVisible: true }),
}))

describe('ProjectsSection stagger animation', () => {
  it('wraps each project card in a stagger-item div', () => {
    const projects = [
      makeProject({ id: 'p1' }),
      makeProject({ id: 'p2' }),
      makeProject({ id: 'p3' }),
    ]
    const { container } = render(<ProjectsSection projects={projects} />)
    const staggerItems = container.querySelectorAll('.stagger-item')

    expect(staggerItems.length).toBe(3)
  })

  it('sets --stagger-index CSS variable on each stagger-item', () => {
    const projects = [
      makeProject({ id: 'p1' }),
      makeProject({ id: 'p2' }),
      makeProject({ id: 'p3' }),
    ]
    const { container } = render(<ProjectsSection projects={projects} />)
    const staggerItems = container.querySelectorAll('.stagger-item')

    staggerItems.forEach((item, index) => {
      expect((item as HTMLElement).style.getPropertyValue('--stagger-index')).toBe(String(index))
    })
  })

  it('adds is-visible class when section is visible', () => {
    const projects = [makeProject({ id: 'p1' })]
    const { container } = render(<ProjectsSection projects={projects} />)
    const staggerItems = container.querySelectorAll('.stagger-item')

    for (const item of staggerItems) {
      expect(item.classList.contains('is-visible')).toBe(true)
    }
  })

  it('stagger wrapper handles col-span for featured projects', () => {
    const projects = [
      makeProject({ id: 'p1', is_featured: true }),
      makeProject({ id: 'p2' }),
      makeProject({ id: 'p3' }),
    ]
    const { container } = render(<ProjectsSection projects={projects} />)
    const staggerItems = container.querySelectorAll('.stagger-item')

    expect(staggerItems[0].classList.contains('col-span-2')).toBe(true)
  })
})

describe('ExperienceSection stagger animation', () => {
  it('wraps each experience card in a stagger-item div', () => {
    const experience = [
      makeExperience({ id: 'e1', start_date: '2023-01' }),
      makeExperience({ id: 'e2', start_date: '2022-06' }),
    ]
    const { container } = render(<ExperienceSection experience={experience} />)
    const staggerItems = container.querySelectorAll('.stagger-item')

    expect(staggerItems.length).toBe(2)
  })

  it('sets --stagger-index CSS variable on each stagger-item', () => {
    const experience = [
      makeExperience({ id: 'e1', start_date: '2023-01' }),
      makeExperience({ id: 'e2', start_date: '2022-06' }),
    ]
    const { container } = render(<ExperienceSection experience={experience} />)
    const staggerItems = container.querySelectorAll('.stagger-item')

    staggerItems.forEach((item, index) => {
      expect((item as HTMLElement).style.getPropertyValue('--stagger-index')).toBe(String(index))
    })
  })

  it('adds is-visible class when section is visible', () => {
    const experience = [makeExperience({ id: 'e1', start_date: '2023-01' })]
    const { container } = render(<ExperienceSection experience={experience} />)
    const staggerItems = container.querySelectorAll('.stagger-item')

    for (const item of staggerItems) {
      expect(item.classList.contains('is-visible')).toBe(true)
    }
  })
})

describe('BlogSection stagger animation', () => {
  it('wraps each blog post card in a stagger-item div', () => {
    const posts = [
      makeBlogPost({ id: 'b1' }),
      makeBlogPost({ id: 'b2' }),
    ]
    const { container } = render(
      <MemoryRouter>
        <BlogSection posts={posts} />
      </MemoryRouter>
    )
    const staggerItems = container.querySelectorAll('.stagger-item')

    expect(staggerItems.length).toBe(2)
  })

  it('sets --stagger-index CSS variable on each stagger-item', () => {
    const posts = [
      makeBlogPost({ id: 'b1' }),
      makeBlogPost({ id: 'b2' }),
    ]
    const { container } = render(
      <MemoryRouter>
        <BlogSection posts={posts} />
      </MemoryRouter>
    )
    const staggerItems = container.querySelectorAll('.stagger-item')

    staggerItems.forEach((item, index) => {
      expect((item as HTMLElement).style.getPropertyValue('--stagger-index')).toBe(String(index))
    })
  })

  it('adds is-visible class when section is visible', () => {
    const posts = [makeBlogPost({ id: 'b1' })]
    const { container } = render(
      <MemoryRouter>
        <BlogSection posts={posts} />
      </MemoryRouter>
    )
    const staggerItems = container.querySelectorAll('.stagger-item')

    for (const item of staggerItems) {
      expect(item.classList.contains('is-visible')).toBe(true)
    }
  })
})
