import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { makeProfile } from '../../../test/fixtures'
import Navbar from '../../layout/Navbar'
import Footer from '../../layout/Footer'
import EmailCTA from '../EmailCTA'

vi.mock('../../../hooks/useScrollSpy', () => ({
  useScrollSpy: () => 'projects',
}))

const sections = [
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
]

describe('Navbar hover interactions', () => {
  it('desktop nav links have animated-underline class', () => {
    const { container } = render(<Navbar name="Rajiv" sections={sections} />)
    const desktopList = container.querySelector('ul.hidden.md\\:flex')!
    const links = desktopList.querySelectorAll('a')

    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(link.className).toContain('animated-underline')
    }
  })

  it('mobile menu links do NOT have animated-underline class', async () => {
    const user = userEvent.setup()
    const { container } = render(<Navbar name="Rajiv" sections={sections} />)

    const toggle = screen.getByRole('button', { name: /open menu/i })
    await user.click(toggle)

    const mobileList = container.querySelector('ul.absolute')!
    const links = mobileList.querySelectorAll('a')

    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(link.className).not.toContain('animated-underline')
    }
  })
})

describe('Footer hover interactions', () => {
  it('icon links have hover:-translate-y-0.5 class', () => {
    const profile = makeProfile()
    const { container } = render(
      <Footer name={profile.name} email={profile.email} github={profile.github} linkedin={profile.linkedin} />
    )
    const links = container.querySelectorAll('a')

    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(link.className).toContain('hover:-translate-y-0.5')
    }
  })

  it('icon links have hover:scale-110 class', () => {
    const profile = makeProfile()
    const { container } = render(
      <Footer name={profile.name} email={profile.email} github={profile.github} linkedin={profile.linkedin} />
    )
    const links = container.querySelectorAll('a')

    for (const link of links) {
      expect(link.className).toContain('hover:scale-110')
    }
  })

  it('icon links use transition-all instead of transition-colors', () => {
    const profile = makeProfile()
    const { container } = render(
      <Footer name={profile.name} email={profile.email} github={profile.github} linkedin={profile.linkedin} />
    )
    const links = container.querySelectorAll('a')

    for (const link of links) {
      expect(link.className).toContain('transition-all')
      expect(link.className).not.toContain('transition-colors')
    }
  })
})

describe('EmailCTA hover interactions', () => {
  it('mailto link has hover:-translate-y-0.5 class', () => {
    const { container } = render(<EmailCTA email="mail@rajivrago.com" />)
    const link = container.querySelector('a[href^="mailto:"]')!

    expect(link.className).toContain('hover:-translate-y-0.5')
  })

  it('mailto link uses transition-all', () => {
    const { container } = render(<EmailCTA email="mail@rajivrago.com" />)
    const link = container.querySelector('a[href^="mailto:"]')!

    expect(link.className).toContain('transition-all')
    expect(link.className).not.toContain('transition-colors')
  })

  it('copy button has hover:-translate-y-0.5 class', () => {
    render(<EmailCTA email="mail@rajivrago.com" />)
    const button = screen.getByRole('button', { name: /copy email/i })

    expect(button.className).toContain('hover:-translate-y-0.5')
  })

  it('copy button has transition-all class', () => {
    render(<EmailCTA email="mail@rajivrago.com" />)
    const button = screen.getByRole('button', { name: /copy email/i })

    expect(button.className).toContain('transition-all')
  })
})
