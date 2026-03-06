import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import ContactLinks from '../ContactLinks'

const TEST_EMAIL = 'mail@rajivrago.com'

const profile = {
  id: '1',
  name: 'Test',
  title: 'Dev',
  bio: '',
  avatar_url: null,
  email: TEST_EMAIL,
  contact_intro: null,
  github: 'https://github.com/test',
  linkedin: 'https://linkedin.com/in/test',
  website: null,
  resume_url: null,
  updated_at: '',
}

describe('ContactLinks – email copy', () => {
  beforeEach(() => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })
  })

  it('renders a mailto link with the correct email', () => {
    render(<ContactLinks profile={profile} />)
    const link = screen.getByRole('link', { name: new RegExp(TEST_EMAIL) })
    expect(link).toHaveAttribute('href', `mailto:${TEST_EMAIL}`)
  })

  it('displays the email address text', () => {
    render(<ContactLinks profile={profile} />)
    expect(screen.getByText(TEST_EMAIL)).toBeInTheDocument()
  })

  it('renders a copy email icon button', () => {
    render(<ContactLinks profile={profile} />)
    expect(screen.getByRole('button', { name: /copy email/i })).toBeInTheDocument()
  })

  it('calls navigator.clipboard.writeText with the email on copy click', async () => {
    const user = userEvent.setup()
    render(<ContactLinks profile={profile} />)

    const spy = vi.spyOn(navigator.clipboard, 'writeText')
    await user.click(screen.getByRole('button', { name: /copy email/i }))
    expect(spy).toHaveBeenCalledWith(TEST_EMAIL)
  })

  it('changes button label to "Copied" after clicking copy', async () => {
    const user = userEvent.setup()
    render(<ContactLinks profile={profile} />)

    await user.click(screen.getByRole('button', { name: /copy email/i }))
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument()
  })

  it('renders social links', () => {
    render(<ContactLinks profile={profile} />)
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
  })

  it('shows default contact intro when none provided', () => {
    render(<ContactLinks profile={profile} />)
    expect(screen.getByText(/I'd love to hear from you/)).toBeInTheDocument()
  })
})
