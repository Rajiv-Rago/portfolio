# Architecture

**Analysis Date:** 2026-03-05

## Pattern Overview

**Overall:** Single-Page Application (SPA) with client-side routing and a BaaS (Backend-as-a-Service) data layer

**Key Characteristics:**
- React SPA with Vite as build tool, deployed on Vercel
- Supabase provides database, auth, storage, and edge functions -- no custom backend server
- Two distinct application surfaces: public portfolio site and authenticated admin dashboard
- Data access via custom React hooks that call Supabase client directly -- no intermediate API layer
- Admin section is code-split (lazy-loaded) and guarded by Supabase Auth session

## Layers

**Routing Layer:**
- Purpose: Maps URL paths to page components and handles code splitting
- Location: `src/App.tsx`
- Contains: Route definitions, lazy imports, error boundary wrapper
- Depends on: `react-router-dom`, page components
- Used by: `src/main.tsx` (app entry point)

**Page Layer:**
- Purpose: Full-page compositions that orchestrate data fetching and section rendering
- Location: `src/pages/`
- Contains: `PortfolioPage.tsx`, `BlogListPage.tsx`, `BlogPage.tsx`, `NotFoundPage.tsx`
- Depends on: hooks (data fetching), public components (UI sections), layout components
- Used by: Router in `src/App.tsx`

**Admin Layer:**
- Purpose: Authenticated CRUD interface for managing all portfolio content
- Location: `src/admin/`
- Contains: Layout, guard, list views (`*Admin.tsx`), form views (`*Form.tsx`), detail views
- Depends on: admin hooks (`src/admin/hooks/`), shared UI components (`src/components/ui/`), Supabase client
- Used by: Lazy-loaded via `src/App.tsx` at `/admin/*` routes

**Hooks Layer (Data Access):**
- Purpose: Encapsulate all Supabase queries and mutations as reusable React hooks
- Location: `src/hooks/` (public), `src/admin/hooks/` (admin)
- Contains: One hook per domain entity, plus utility hooks (scroll, meta tags, contact form)
- Depends on: `src/lib/supabase.ts`, `src/lib/types.ts`
- Used by: Page and admin components

**Component Layer:**
- Purpose: Reusable UI elements split by audience
- Location: `src/components/public/` (portfolio sections), `src/components/ui/` (shared primitives), `src/components/layout/` (shell)
- Contains: Section components, form inputs, dialogs, loading states
- Depends on: Types, hooks, lucide-react icons
- Used by: Pages and admin views

**Library Layer:**
- Purpose: Shared utilities and configuration
- Location: `src/lib/`
- Contains: Supabase client singleton (`supabase.ts`), TypeScript interfaces (`types.ts`), utility functions (`slugify.ts`, `readingTime.ts`)
- Depends on: `@supabase/supabase-js`, environment variables
- Used by: All layers

**Database Layer:**
- Purpose: Schema definition and data persistence via Supabase PostgreSQL
- Location: `supabase/migrations/`
- Contains: SQL migration files with table definitions, RLS policies, triggers
- Depends on: Supabase PostgreSQL instance
- Used by: All data access hooks (indirectly via Supabase client)

**Edge Functions Layer:**
- Purpose: Server-side logic triggered by database events
- Location: `supabase/functions/`
- Contains: `contact-notify/index.ts` -- sends email via Resend API on contact form submission
- Depends on: Deno runtime, Resend API, database webhook trigger
- Used by: Triggered automatically on `contact_messages` INSERT

## Data Flow

**Public Portfolio View:**

1. `src/main.tsx` renders `<App />` inside `<BrowserRouter>` and `<StrictMode>`
2. Router matches `/` to `PortfolioPage`
3. `PortfolioPage` calls data hooks (`useProfile`, `useProjects`, `useExperience`, `useBlogPosts`)
4. Each hook runs a `useEffect` that queries Supabase via the anon client (RLS filters to published items only)
5. Data flows down as props to section components (`HeroSection`, `ProjectsSection`, etc.)
6. `useMetaTags` hook dynamically manages `<head>` meta tags and JSON-LD structured data

**Blog Post View:**

1. Router matches `/blog/:slug` to `BlogPage`
2. `BlogPage` extracts `slug` from URL params
3. Direct Supabase query fetches single published post by slug
4. Markdown body rendered via `react-markdown` with `remark-gfm` plugin

**Contact Form Submission:**

1. User fills form in `ContactForm` component
2. `useContactForm` hook validates with Zod schema via `react-hook-form`
3. Honeypot field checked (spam prevention)
4. Client-side rate limiting (60-second cooldown)
5. Data inserted into `contact_messages` table via Supabase anon client (RLS allows anon INSERT)
6. Database webhook triggers `contact-notify` edge function
7. Edge function sends email to owner via Resend API

**Admin CRUD Operations:**

1. User navigates to `/admin/*` -- `AdminLayout` lazy-loaded
2. `AdminGuard` checks Supabase session via `useAuth` hook
3. If no session, `LoginForm` renders; login calls `supabase.auth.signInWithPassword`
4. Once authenticated, admin hooks fetch all records (no status filter, RLS grants full access)
5. Create/update/delete operations call Supabase directly, then refetch to sync local state
6. Toast notifications via `react-hot-toast` for all mutation outcomes

**State Management:**
- No global state management library -- each hook manages its own local state via `useState`
- Data is fetched once on mount via `useEffect` and stored in component-level state
- Admin hooks expose a `refetch` function called after every mutation to keep state fresh
- Auth state managed via Supabase's `onAuthStateChange` subscription in `useAuth`

## Key Abstractions

**Data Hooks (Public):**
- Purpose: Read-only data access for public-facing content
- Examples: `src/hooks/useProfile.ts`, `src/hooks/useProjects.ts`, `src/hooks/useBlogPosts.ts`, `src/hooks/useExperience.ts`
- Pattern: `useEffect` on mount -> Supabase query with status filter -> `useState` for data + loading

**Admin Hooks:**
- Purpose: Full CRUD operations for authenticated admin
- Examples: `src/admin/hooks/useAdminProjects.ts`, `src/admin/hooks/useAdminBlog.ts`, `src/admin/hooks/useAdminExperience.ts`, `src/admin/hooks/useAdminMessages.ts`
- Pattern: Same fetch pattern as public hooks, plus `create`, `update`, `remove` async functions that call Supabase and then `refetch`

**Form Components:**
- Purpose: Zod-validated forms with react-hook-form for each entity
- Examples: `src/admin/ProjectForm.tsx`, `src/admin/BlogForm.tsx`, `src/admin/ExperienceForm.tsx`
- Pattern: Zod schema -> `useForm` with `zodResolver` -> controlled inputs via `register`/`Controller` -> submit handler calls parent callback

**Admin List Views:**
- Purpose: Table display with inline edit/delete actions
- Examples: `src/admin/ProjectsAdmin.tsx`, `src/admin/BlogAdmin.tsx`, `src/admin/ExperienceAdmin.tsx`
- Pattern: List/form toggle via `showForm`/`editing` state; `ConfirmDialog` for deletions

**Scroll-Reveal Sections:**
- Purpose: Animate portfolio sections into view on scroll
- Examples: All public section components use `useScrollReveal`
- Pattern: `IntersectionObserver` sets `isVisible` flag -> CSS class toggles `fade-up` animation

## Entry Points

**Client Application:**
- Location: `src/main.tsx`
- Triggers: Browser loading `index.html` which imports `/src/main.tsx`
- Responsibilities: Creates React root, wraps app in `StrictMode`, `BrowserRouter`, and `Toaster`; preconnects to Supabase URL

**Application Router:**
- Location: `src/App.tsx`
- Triggers: Rendered by `main.tsx`
- Responsibilities: Defines all routes, wraps in `ErrorBoundary`, lazy-loads admin module

**Edge Function:**
- Location: `supabase/functions/contact-notify/index.ts`
- Triggers: Database webhook on INSERT into `contact_messages`
- Responsibilities: Sends notification email to portfolio owner via Resend API

**Migration Script:**
- Location: `scripts/migrate.js`
- Triggers: `npm run db:migrate`
- Responsibilities: Runs SQL migrations from `supabase/migrations/` against Supabase PostgreSQL, tracks applied migrations in `schema_migrations` table

## Error Handling

**Strategy:** Component-level error handling with a top-level ErrorBoundary fallback

**Patterns:**
- `ErrorBoundary` (`src/components/ui/ErrorBoundary.tsx`) wraps all routes -- catches render errors, shows dev-mode stack traces, offers "Try Again" and "Go Home" actions
- Supabase query errors in hooks are silently swallowed (data defaults to empty array/null, loading set to false)
- Admin mutation errors show toast notifications via `react-hot-toast` and re-throw to prevent form close
- Edge function errors return appropriate HTTP status codes and log to console
- Blog post 404s detected by checking query result and rendering `NotFoundPage`

## Cross-Cutting Concerns

**Logging:** `console.error` in ErrorBoundary and edge function only; no structured logging framework

**Validation:** Zod schemas for all forms (contact, login, project, blog, experience, profile); validated client-side via `react-hook-form` + `zodResolver`

**Authentication:** Supabase Auth with email/password; session checked via `useAuth` hook in `AdminGuard`; RLS policies enforce data access at the database level (anon = read published + insert messages; authenticated = full access)

**SEO:** Dynamic meta tags and JSON-LD structured data via `useMetaTags` hook; OpenGraph and Twitter Card support

**Accessibility:** ARIA attributes on form inputs, dialogs, and interactive elements; `prefers-reduced-motion` support disables animations; focus trap and keyboard navigation in `ConfirmDialog`

**Styling:** Tailwind CSS v4 with custom design tokens defined in `src/index.css` via `@theme` directive; CSS custom properties for colors, fonts, and border radii

---

*Architecture analysis: 2026-03-05*
