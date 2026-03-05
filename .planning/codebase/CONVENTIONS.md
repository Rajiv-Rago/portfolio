# Coding Conventions

**Analysis Date:** 2026-03-05

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `ProjectCard.tsx`, `AdminGuard.tsx`, `ErrorBoundary.tsx`)
- Custom hooks: camelCase with `use` prefix (e.g., `useProjects.ts`, `useAdminBlog.ts`, `useScrollReveal.ts`)
- Utility modules: camelCase (e.g., `readingTime.ts`, `slugify.ts`)
- Type definitions: camelCase (e.g., `types.ts`)
- Client modules: camelCase (e.g., `supabase.ts`)

**Functions:**
- React components: PascalCase function declarations with `export default`
- Custom hooks: camelCase with `use` prefix, exported as named exports
- Utility functions: camelCase, exported as named exports
- Event handlers inside components: `handle` prefix (e.g., `handleSubmit`, `handleDelete`, `handleLogout`)

**Variables:**
- camelCase for all local variables and state
- Boolean state: descriptive names (`loading`, `submitting`, `rateLimited`, `showForm`, `uploading`)
- CRUD operations in hooks: `create`, `update`, `remove`, `fetch`, `refetch`

**Types:**
- Interfaces: PascalCase, used for data models and component props (e.g., `Profile`, `Project`, `ButtonProps`)
- Zod-inferred types: PascalCase with `Data` suffix (e.g., `ContactFormData`, `ProjectFormData`, `LoginData`)
- Zod schemas: camelCase `schema` or descriptive name like `contactSchema`
- Props interfaces: `{ComponentName}Props` (e.g., `NavbarProps`, `FooterProps`, `LoginFormProps`)

## Code Style

**Formatting:**
- No Prettier or formatting tool configured
- Consistent 2-space indentation throughout
- Single quotes for strings
- No semicolons (consistent across entire codebase)
- Trailing commas in multiline structures

**Linting:**
- ESLint 9 flat config at `eslint.config.js`
- Extends: `@eslint/js` recommended, `typescript-eslint` recommended, `react-hooks` recommended, `react-refresh` Vite config
- Targets `**/*.{ts,tsx}` files
- Ignores `dist/` directory
- Run with `npm run lint`

**TypeScript:**
- Strict mode enabled in `tsconfig.app.json`
- `noUnusedLocals` and `noUnusedParameters` enforced
- `noFallthroughCasesInSwitch` enabled
- `verbatimModuleSyntax` enabled -- use `import type` for type-only imports
- Target: ES2022

## Import Organization

**Order:**
1. React imports (`react`, `react-dom`, `react-router-dom`)
2. Third-party libraries (`date-fns`, `lucide-react`, `react-hook-form`, `zod`, `react-hot-toast`, `react-markdown`)
3. Internal modules -- relative paths only (`../lib/supabase`, `../lib/types`, `../../hooks/useProjects`)
4. CSS imports (only in `src/main.tsx`: `./index.css`)

**Path Style:**
- All imports use relative paths -- no path aliases configured
- Type-only imports use `import type` syntax (e.g., `import type { Project } from '../lib/types'`)
- Components import from `../components/ui/` or `../components/public/`

**Path Aliases:**
- None configured. Use relative paths exclusively.

## Component Patterns

**Public-facing components** (`src/components/public/`):
- Receive data via props, never fetch directly
- Use `export default function ComponentName()` syntax
- Integrate `useScrollReveal` hook for scroll animations on section components
- Return `null` when data array is empty (graceful degradation)

```tsx
// Pattern: Section component
export default function ProjectsSection({ projects }: { projects: Project[] }) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>()
  if (projects.length === 0) return null

  return (
    <section ref={ref} id="projects" className={`scroll-reveal ${isVisible ? 'is-visible' : ''} ...`}>
      {/* content */}
    </section>
  )
}
```

**UI components** (`src/components/ui/`):
- Use `forwardRef` for form elements (`Input`, `Textarea`, `Button`)
- Set `displayName` on forwardRef components
- Export as `export default`
- Accept `className` prop for style extension with default empty string
- Spread remaining props onto underlying DOM element

```tsx
// Pattern: forwardRef UI component
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    // component body
  }
)
Input.displayName = 'Input'
export default Input
```

**Admin components** (`src/admin/`):
- Use CRUD hooks from `src/admin/hooks/`
- Manage local UI state (`editing`, `showForm`, `deleting`, `deleteLoading`)
- Follow list/form toggle pattern: show list by default, swap to form when adding/editing
- Use `ConfirmDialog` for destructive actions

**Data-fetching hooks** (`src/hooks/`):
- Follow consistent pattern: `useState` + `useEffect` + Supabase query
- Return `{ data, loading }` object
- Use nullish coalescing: `data ?? []` for arrays, `data` for nullable singles
- Public hooks filter by `status: 'published'`

```tsx
// Pattern: Public data hook
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        setProjects(data ?? [])
        setLoading(false)
      })
  }, [])

  return { projects, loading }
}
```

**Admin CRUD hooks** (`src/admin/hooks/`):
- Use `useCallback` for the fetch function
- Return `{ items, loading, create, update, remove, refetch }`
- Each mutation: call Supabase, handle error with toast, show success toast, re-fetch list
- Throw error after toast on failure to let callers know

```tsx
// Pattern: Admin CRUD hook mutation
const create = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
  const { error } = await supabase.from('projects').insert(project)
  if (error) { toast.error('Something went wrong. Please try again.'); throw error }
  toast.success('Project added')
  await fetch()
}
```

## Form Handling

**Stack:** react-hook-form + zod + @hookform/resolvers

**Pattern:**
1. Define Zod schema at top of file (module-level `const schema = z.object({...})`)
2. Infer TypeScript type from schema (`type FormData = z.infer<typeof schema>`)
3. Initialize `useForm` with `zodResolver(schema)` and `defaultValues`
4. For edit forms: use `useEffect` to `reset()` form when entity prop changes
5. Use `Controller` for non-standard inputs (e.g., `TagInput`)
6. Wire errors as `errors.fieldName?.message`

```tsx
// Pattern: Form component
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  // ...
})

type FormData = z.infer<typeof schema>

export default function EntityForm({ entity, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', /* ... */ },
  })

  useEffect(() => {
    if (entity) reset({ /* map entity fields */ })
  }, [entity, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <Input label="Title" {...register('title')} error={errors.title?.message} />
      <Button type="submit" loading={isSubmitting}>
        {entity ? 'Update' : 'Add'} Entity
      </Button>
      <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
    </form>
  )
}
```

## Error Handling

**Patterns:**
- Global: `ErrorBoundary` component wraps entire app at `src/App.tsx`
  - Shows error details in dev mode (`import.meta.env.DEV`)
  - Shows user-friendly message in production
- Supabase mutations: check `{ error }` from response, show `toast.error()` with generic message
- Auth errors: try/catch with `throw error` pattern, caught by calling component
- Form validation: Zod schemas handle all validation, errors displayed inline via `error` prop
- Data loading: loading states with `LoadingSpinner`, empty states with inline messages
- No global error logging service -- errors logged to `console.error` only in `ErrorBoundary`

**Toast notifications:**
- Library: `react-hot-toast`
- Positioned at bottom-right (configured in `src/main.tsx`)
- Success: `toast.success('Entity added/updated/deleted')`
- Error: `toast.error('Something went wrong. Please try again.')`
- Consistent generic error message across all mutations

## Styling

**Framework:** Tailwind CSS v4 via `@tailwindcss/vite` plugin

**Design tokens** defined in `src/index.css` via `@theme`:
- Colors: `bg`, `surface`, `text`, `muted`, `accent`, `accent-light`, `accent-dark`, `border`, `danger`, `danger-light`, `success`, `success-light`, `warning`
- Fonts: `--font-heading` (Georgia serif), `--font-body` (system sans-serif)
- Radii: `--radius-sm` (6px), `--radius-md` (8px), `--radius-lg` (16px), `--radius-xl` (24px)

**Usage patterns:**
- Use semantic color tokens: `text-muted`, `bg-surface`, `border-border`, `text-accent`
- Use CSS variable syntax for radii: `rounded-[--radius-md]`, `rounded-[--radius-lg]`
- Responsive: use `max-md:` prefix for mobile overrides (mobile-last approach)
- Hover states: `hover:text-accent`, `hover:border-accent`, `hover:-translate-y-1`
- Transitions: always include `transition-colors` or `transition-all`
- String concatenation for conditional classes (no clsx/classnames library)

**Animations:**
- Scroll reveal: `scroll-reveal` / `is-visible` CSS classes + `useScrollReveal` hook
- Loading skeleton: `skeleton` CSS class with shimmer animation
- Respects `prefers-reduced-motion: reduce` throughout

## Logging

**Framework:** `console` (browser native)

**Patterns:**
- Only used in `ErrorBoundary.componentDidCatch`: `console.error('ErrorBoundary caught:', error, errorInfo)`
- No other logging in the codebase
- No structured logging or external service

## Comments

**When to Comment:**
- JSX section comments used sparingly in complex layouts: `{/* Sidebar */}`, `{/* Thumbnail */}`, `{/* Mobile nav */}`
- No JSDoc or TSDoc used anywhere
- No TODO/FIXME comments in source code
- No explanatory comments on functions or hooks

## Function Design

**Size:** Functions are short. Most components under 100 lines. Hooks under 50 lines.

**Parameters:**
- Components receive typed props objects (interfaces or inline types)
- Hooks receive primitive parameters when needed (e.g., `useFileUpload(bucket: string)`)
- Inline destructuring in component signatures

**Return Values:**
- Hooks return plain objects: `{ data, loading, create, update, remove }`
- Components return JSX or `null`

## Module Design

**Exports:**
- One component per file, exported as `export default`
- Hooks exported as named exports: `export function useProjects()`
- Utility functions exported as named exports: `export function slugify()`
- Types exported as named exports: `export interface Project`
- No barrel files (no `index.ts` re-exports)

**Barrel Files:** Not used. Import directly from the file.

## Accessibility

**Patterns used consistently:**
- `aria-label` on icon-only buttons
- `aria-invalid` and `aria-describedby` on form inputs with errors
- `role="alert"` on error messages
- `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby` on `ConfirmDialog`
- Focus trap in `ConfirmDialog` with keyboard navigation
- `prefers-reduced-motion` respected in animations
- Semantic HTML (`<nav>`, `<main>`, `<footer>`, `<article>`, `<section>`)
- External links include `rel="noopener noreferrer"`

---

*Convention analysis: 2026-03-05*
