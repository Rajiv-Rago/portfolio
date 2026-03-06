import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { makeProfile } from '../../../test/fixtures'
import HeroSection from '../HeroSection'

vi.mock('../../../hooks/useScrollReveal', () => ({
  useScrollReveal: () => ({ ref: { current: null }, isVisible: true }),
}))

describe('HeroSection', () => {
  it('renders avatar img with src="/me.png"', () => {
    render(<HeroSection profile={makeProfile()} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/me.png')
  })

  it('renders avatar with correct alt text', () => {
    render(<HeroSection profile={makeProfile({ name: 'Rajiv Rago' })} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', "Rajiv Rago's avatar")
  })

  it('renders avatar at 170x170 size', () => {
    render(<HeroSection profile={makeProfile()} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('width', '170')
    expect(img).toHaveAttribute('height', '170')
  })

  it('avatar img has no wrapper with shadow or rounded classes', () => {
    const { container } = render(<HeroSection profile={makeProfile()} />)
    const img = container.querySelector('img')!
    const parent = img.parentElement!

    expect(parent.className).not.toMatch(/shadow/)
    expect(parent.className).not.toMatch(/rounded/)
    expect(parent.className).not.toMatch(/overflow-hidden/)
  })

  it('section container does not have mx-12, p-12, or rounded classes', () => {
    const { container } = render(<HeroSection profile={makeProfile()} />)
    const innerDiv = container.querySelector('.flex.flex-col')!

    expect(innerDiv.className).not.toMatch(/mx-12/)
    expect(innerDiv.className).not.toMatch(/\bp-12\b/)
    expect(innerDiv.className).not.toMatch(/rounded/)
    expect(innerDiv.className).not.toMatch(/overflow-hidden/)
  })

  it('renders resume download link when resume_url exists', () => {
    render(<HeroSection profile={makeProfile({ resume_url: '/resume.pdf' })} />)
    const link = screen.getByRole('link', { name: /download resume/i })
    expect(link).toHaveAttribute('href', '/resume.pdf')
  })

  it('does not render resume link when resume_url is null', () => {
    render(<HeroSection profile={makeProfile({ resume_url: null })} />)
    expect(screen.queryByRole('link', { name: /download resume/i })).not.toBeInTheDocument()
  })

  it('resume link has transition-all and hover:-translate-y-0.5 classes', () => {
    render(<HeroSection profile={makeProfile({ resume_url: '/resume.pdf' })} />)
    const link = screen.getByRole('link', { name: /download resume/i })
    expect(link.className).toMatch(/transition-all/)
    expect(link.className).toMatch(/hover:-translate-y-0\.5/)
  })
})
