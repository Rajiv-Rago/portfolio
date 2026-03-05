# Testing Patterns

**Analysis Date:** 2026-03-05

## Test Framework

**Runner:**
- No test framework is installed or configured
- No test runner config files exist (no `jest.config.*`, `vitest.config.*`, or similar)
- No `test` script in `package.json`

**Current State:**
- Zero test files exist in the project source code
- The codebase has no unit, integration, or end-to-end tests

## Recommended Setup

Given the existing stack (Vite + React + TypeScript), the natural test framework would be:

**Runner:**
- Vitest (native Vite integration, compatible with existing `vite.config.ts`)
- Config would go in: `vitest.config.ts` or extend existing `vite.config.ts`

**Assertion Library:**
- Vitest built-in (`expect`, `describe`, `it`)

**React Testing:**
- `@testing-library/react` + `@testing-library/jest-dom`

**Recommended install:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Recommended config (`vitest.config.ts`):**
```typescript
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
}))
```

**Recommended run commands:**
```bash
npx vitest              # Watch mode
npx vitest run          # Run all tests once
npx vitest --coverage   # Coverage report
```

## Test File Organization

**Recommended location:** Co-located with source files

**Recommended naming:**
- `{filename}.test.ts` for utilities
- `{filename}.test.tsx` for components and hooks

**Recommended structure:**
```
src/
├── lib/
│   ├── slugify.ts
│   ├── slugify.test.ts
│   ├── readingTime.ts
│   └── readingTime.test.ts
├── hooks/
│   ├── useProjects.ts
│   └── useProjects.test.tsx
├── components/
│   └── ui/
│       ├── Button.tsx
│       └── Button.test.tsx
└── test/
    └── setup.ts          # Test setup (jsdom, custom matchers)
```

## What to Test First (Priority Order)

**1. Pure utility functions** (easiest, most value):
- `src/lib/slugify.ts` - string transformation, multiple edge cases
- `src/lib/readingTime.ts` - markdown stripping and word counting

```typescript
// Example: src/lib/slugify.test.ts
import { describe, it, expect } from 'vitest'
import { slugify } from './slugify'

describe('slugify', () => {
  it('converts text to lowercase kebab-case', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('removes special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world')
  })

  it('trims leading/trailing hyphens', () => {
    expect(slugify(' -hello- ')).toBe('hello')
  })

  it('collapses multiple hyphens', () => {
    expect(slugify('hello---world')).toBe('hello-world')
  })
})
```

**2. UI components** (visual and interaction):
- `src/components/ui/Button.tsx` - variants, loading state, disabled state
- `src/components/ui/Input.tsx` - label, error display, accessibility attributes
- `src/components/ui/Textarea.tsx` - same patterns as Input
- `src/components/ui/TagInput.tsx` - keyboard interaction, add/remove tags
- `src/components/ui/ConfirmDialog.tsx` - open/close, focus trap, keyboard handling
- `src/components/ui/StatusBadge.tsx` - status rendering

**3. Custom hooks** (with Supabase mocking):
- `src/hooks/useContactForm.ts` - form validation, submission, rate limiting
- `src/hooks/useScrollReveal.ts` - IntersectionObserver behavior
- `src/hooks/useScrollSpy.ts` - active section detection

**4. Admin CRUD hooks:**
- `src/admin/hooks/useAdminProjects.ts`
- `src/admin/hooks/useAdminBlog.ts`
- `src/admin/hooks/useAdminExperience.ts`
- `src/admin/hooks/useAdminMessages.ts`

## Mocking

**Framework:** Vitest built-in mocking (`vi.mock`, `vi.fn`, `vi.spyOn`)

**What to mock:**
- `src/lib/supabase.ts` - mock the Supabase client for all data hooks
- `react-hot-toast` - mock `toast.success` and `toast.error` to assert notifications
- `IntersectionObserver` - mock for scroll-based hooks
- `window.matchMedia` - mock for reduced motion detection

**Recommended Supabase mock pattern:**
```typescript
// Mock Supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      then: vi.fn((cb) => cb({ data: mockData, error: null })),
    })),
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        remove: vi.fn(),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/file.png' } })),
      })),
    },
  },
}))
```

**What NOT to mock:**
- Zod schemas -- test actual validation behavior
- React component rendering -- use Testing Library for real DOM assertions
- CSS classes -- assert behavior, not styling

## Fixtures and Factories

**Recommended test data location:** `src/test/fixtures.ts`

**Example factory pattern:**
```typescript
// src/test/fixtures.ts
import type { Project, BlogPost, Profile, Experience, ContactMessage } from '../lib/types'

export function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'project-1',
    title: 'Test Project',
    description: 'A test project',
    tech_stack: ['React', 'TypeScript'],
    live_url: null,
    repo_url: null,
    thumbnail: null,
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
    title: 'Test Post',
    slug: 'test-post',
    body: 'This is a test blog post with enough words to calculate reading time.',
    excerpt: 'Test excerpt',
    tags: ['test'],
    status: 'published',
    published_at: '2026-01-01T00:00:00Z',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

export function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: 'profile-1',
    name: 'Test User',
    title: 'Software Engineer',
    bio: 'A test bio',
    avatar_url: null,
    email: 'test@example.com',
    github: null,
    linkedin: null,
    website: null,
    resume_url: null,
    updated_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}
```

## Coverage

**Requirements:** None enforced (no testing infrastructure exists)

**Recommended targets:**
- `src/lib/` - 100% (pure functions, easy to test)
- `src/components/ui/` - 90%+ (reusable components)
- `src/hooks/` - 80%+ (data fetching with mocked Supabase)
- `src/admin/hooks/` - 80%+ (CRUD operations)
- `src/components/public/` - 70%+ (rendering with props)
- `src/admin/` - 60%+ (admin pages, form integration)
- `src/pages/` - 50%+ (page-level integration)

## Test Types

**Unit Tests:**
- Pure utility functions in `src/lib/`
- Individual UI components in `src/components/ui/`
- Isolated hook behavior with mocked dependencies

**Integration Tests:**
- Admin pages (form submission flow, list/edit toggle)
- Page components (data loading, rendering sections)
- Contact form (validation + submission + toast notifications)

**E2E Tests:**
- Not used
- Playwright or Cypress would be recommended if added
- Key flows to cover: portfolio page load, blog navigation, admin login + CRUD

## Common Patterns

**Async Testing (recommended):**
```typescript
import { renderHook, waitFor } from '@testing-library/react'

it('fetches projects on mount', async () => {
  const { result } = renderHook(() => useProjects())

  expect(result.current.loading).toBe(true)

  await waitFor(() => {
    expect(result.current.loading).toBe(false)
  })

  expect(result.current.projects).toHaveLength(2)
})
```

**Component Testing (recommended):**
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

it('shows error message when provided', () => {
  render(<Input label="Name" error="Required" />)

  expect(screen.getByRole('alert')).toHaveTextContent('Required')
  expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
})
```

**Form Validation Testing (recommended):**
```typescript
it('validates required fields', async () => {
  const user = userEvent.setup()
  render(<ContactForm />)

  await user.click(screen.getByRole('button', { name: /send/i }))

  expect(screen.getByText('Name is required')).toBeInTheDocument()
  expect(screen.getByText('Email is required')).toBeInTheDocument()
})
```

---

*Testing analysis: 2026-03-05*
