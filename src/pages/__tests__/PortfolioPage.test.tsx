import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import { makeProfile, makeProject, makeExperience, makeBlogPost } from '../../test/fixtures'
import PortfolioPage from '../PortfolioPage'

vi.mock('../../hooks/useProfile', () => ({
  useProfile: () => ({ profile: makeProfile(), loading: false }),
}))

vi.mock('../../hooks/useProjects', () => ({
  useProjects: () => ({ projects: [makeProject({ id: 'p1' }), makeProject({ id: 'p2' })] }),
}))

vi.mock('../../hooks/useExperience', () => ({
  useExperience: () => ({ experience: [makeExperience({ id: 'e1' })] }),
}))

vi.mock('../../hooks/useBlogPosts', () => ({
  useBlogPosts: () => ({ posts: [makeBlogPost({ id: 'b1' })] }),
}))

vi.mock('../../hooks/useMetaTags', () => ({
  useMetaTags: () => {},
}))

vi.mock('../../hooks/useScrollReveal', () => ({
  useScrollReveal: () => ({ ref: { current: null }, isVisible: true }),
}))

vi.mock('../../hooks/useScrollSpy', () => ({
  useScrollSpy: () => 'projects',
}))

describe('PortfolioPage section dividers', () => {
  it('renders separator elements between sections', () => {
    render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    )
    const separators = screen.getAllByRole('separator')

    expect(separators.length).toBeGreaterThanOrEqual(4)
  })

  it('dividers use border-border class', () => {
    render(
      <MemoryRouter>
        <PortfolioPage />
      </MemoryRouter>
    )
    const separators = screen.getAllByRole('separator')

    for (const sep of separators) {
      expect(sep.className).toContain('border-border')
    }
  })
})
