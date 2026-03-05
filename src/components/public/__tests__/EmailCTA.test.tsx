import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import EmailCTA from '../EmailCTA'

const TEST_EMAIL = 'mail@rajivrago.com'

describe('EmailCTA', () => {
  beforeEach(() => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })
  })

  it('renders a mailto link with the correct email', () => {
    render(<EmailCTA email={TEST_EMAIL} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `mailto:${TEST_EMAIL}`)
  })

  it('displays the email address text', () => {
    render(<EmailCTA email={TEST_EMAIL} />)
    expect(screen.getByText(TEST_EMAIL)).toBeInTheDocument()
  })

  it('renders a "Copy Email" button', () => {
    render(<EmailCTA email={TEST_EMAIL} />)
    expect(screen.getByRole('button', { name: /copy email/i })).toBeInTheDocument()
  })

  it('calls navigator.clipboard.writeText with the email on copy click', async () => {
    const user = userEvent.setup()
    render(<EmailCTA email={TEST_EMAIL} />)

    const spy = vi.spyOn(navigator.clipboard, 'writeText')
    await user.click(screen.getByRole('button', { name: /copy email/i }))
    expect(spy).toHaveBeenCalledWith(TEST_EMAIL)
  })

  it('changes button text to "Copied!" after clicking copy', async () => {
    const user = userEvent.setup()
    render(<EmailCTA email={TEST_EMAIL} />)

    await user.click(screen.getByRole('button', { name: /copy email/i }))
    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument()
  })

  it('copy button click does not trigger mailto navigation', async () => {
    const user = userEvent.setup()
    const stopPropagation = vi.fn()

    const { container } = render(<EmailCTA email={TEST_EMAIL} />)
    const link = container.querySelector('a[href^="mailto:"]')!
    link.addEventListener('click', stopPropagation)

    await user.click(screen.getByRole('button', { name: /copy email/i }))
    expect(stopPropagation).not.toHaveBeenCalled()
  })
})
