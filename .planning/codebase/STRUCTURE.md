# Codebase Structure

**Analysis Date:** 2026-03-05

## Directory Layout

```
portfolio/
├── public/                  # Static assets served as-is
│   ├── favicon.svg
│   └── me.png
├── scripts/                 # CLI tools
│   └── migrate.js           # Database migration runner
├── src/                     # Application source code
│   ├── admin/               # Admin dashboard (lazy-loaded)
│   │   ├── hooks/           # Admin-specific data hooks
│   │   ├── AdminGuard.tsx   # Auth gate component
│   │   ├── AdminLayout.tsx  # Sidebar + routing shell
│   │   ├── DashboardHome.tsx
│   │   ├── ProjectsAdmin.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── ExperienceAdmin.tsx
│   │   ├── ExperienceForm.tsx
│   │   ├── BlogAdmin.tsx
│   │   ├── BlogForm.tsx
│   │   ├── MessagesAdmin.tsx
│   │   ├── MessageDetail.tsx
│   │   ├── ProfileSettings.tsx
│   │   └── LoginForm.tsx
│   ├── components/          # Shared React components
│   │   ├── layout/          # App shell (navbar, footer)
│   │   ├── public/          # Public portfolio sections
│   │   └── ui/              # Reusable form/UI primitives
│   ├── hooks/               # Public-facing data hooks
│   ├── lib/                 # Shared utilities and config
│   ├── pages/               # Top-level route components
│   ├── App.tsx              # Route definitions
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles + Tailwind theme
├── supabase/                # Backend (Supabase)
│   ├── functions/           # Edge functions (Deno)
│   │   └── contact-notify/  # Email notification on contact
│   └── migrations/          # SQL schema migrations
├── index.html               # HTML shell (Vite entry)
├── package.json
├── vite.config.ts
├── vercel.json              # SPA rewrite rules
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── eslint.config.js
```

## Directory Purposes

**`src/admin/`:**
- Purpose: Complete admin dashboard for managing portfolio content
- Contains: List views (`*Admin.tsx`), form views (`*Form.tsx`), detail views, auth guard, layout
- Key files: `AdminLayout.tsx` (sidebar + nested routes), `AdminGuard.tsx` (session check)
- Pattern: Each entity has a pair: list view + form component

**`src/admin/hooks/`:**
- Purpose: CRUD data hooks for admin operations
- Contains: One hook per entity (`useAdminProjects.ts`, `useAdminBlog.ts`, `useAdminExperience.ts`, `useAdminMessages.ts`), plus `useAuth.ts` and `useFileUpload.ts`
- Pattern: Each hook exposes `{ items, loading, create, update, remove, refetch }`

**`src/components/layout/`:**
- Purpose: App shell components used on the public portfolio page
- Contains: `Navbar.tsx` (sticky nav with scroll spy + mobile menu), `Footer.tsx` (social links + copyright)

**`src/components/public/`:**
- Purpose: Section-level components for the public portfolio
- Contains: `HeroSection.tsx`, `ProjectsSection.tsx`, `ProjectCard.tsx`, `ExperienceSection.tsx`, `ExperienceCard.tsx`, `BlogSection.tsx`, `BlogPostCard.tsx`, `ContactSection.tsx`, `ContactForm.tsx`, `ContactLinks.tsx`
- Pattern: Each section has a container component + card/item component

**`src/components/ui/`:**
- Purpose: Reusable UI primitives shared across public and admin
- Contains: `Button.tsx`, `Input.tsx`, `Textarea.tsx`, `TagInput.tsx`, `StatusBadge.tsx`, `ConfirmDialog.tsx`, `LoadingSpinner.tsx`, `Skeleton.tsx`, `PortfolioSkeleton.tsx`, `ErrorBoundary.tsx`
- Pattern: Most are `forwardRef` components with `label` + `error` props

**`src/hooks/`:**
- Purpose: Public-facing data fetching hooks (read-only)
- Contains: `useProfile.ts`, `useProjects.ts`, `useExperience.ts`, `useBlogPosts.ts`, `useContactForm.ts`, `useMetaTags.ts`, `useScrollSpy.ts`, `useScrollReveal.ts`

**`src/lib/`:**
- Purpose: Shared utilities, client configuration, and type definitions
- Contains: `supabase.ts` (Supabase client singleton), `types.ts` (all TypeScript interfaces), `slugify.ts`, `readingTime.ts`

**`src/pages/`:**
- Purpose: Top-level route page components
- Contains: `PortfolioPage.tsx` (main single-page portfolio), `BlogListPage.tsx` (all posts with tag filter), `BlogPage.tsx` (single post by slug), `NotFoundPage.tsx` (404)

**`supabase/migrations/`:**
- Purpose: Sequential SQL schema migrations
- Contains: `001_initial_schema.sql` (all tables, RLS, triggers, seed data), `002_thumbnail_options.sql` (adds thumbnail columns to projects)
- Naming: `NNN_description.sql` with zero-padded sequence numbers

**`supabase/functions/contact-notify/`:**
- Purpose: Supabase Edge Function for email notifications
- Contains: `index.ts` (Deno-based HTTP handler triggered by database webhook)

## Key File Locations

**Entry Points:**
- `index.html`: Vite HTML entry with `<div id="root">`
- `src/main.tsx`: React bootstrap (createRoot, BrowserRouter, Toaster)
- `src/App.tsx`: Route definitions and ErrorBoundary wrapper

**Configuration:**
- `vite.config.ts`: Vite + React + Tailwind CSS plugins
- `vercel.json`: SPA fallback rewrite rule (`/(.*) -> /index.html`)
- `tsconfig.json`: Root TypeScript config (references app + node configs)
- `tsconfig.app.json`: App-specific TS config (strict, ESNext, React JSX)
- `eslint.config.js`: ESLint flat config
- `src/index.css`: Tailwind import + custom `@theme` design tokens + global styles

**Core Logic:**
- `src/lib/supabase.ts`: Supabase client initialization from env vars
- `src/lib/types.ts`: All domain model interfaces (Profile, Project, Experience, BlogPost, ContactMessage)
- `src/hooks/useContactForm.ts`: Contact form with Zod validation, honeypot, rate limiting
- `src/admin/hooks/useAuth.ts`: Supabase Auth session management

**Database:**
- `supabase/migrations/001_initial_schema.sql`: Complete schema (5 tables, RLS policies, triggers, seed)
- `supabase/migrations/002_thumbnail_options.sql`: Schema migration adding thumbnail_position and thumbnail_mode
- `scripts/migrate.js`: Migration runner (reads SQL files, tracks applied in `schema_migrations`)

## Naming Conventions

**Files:**
- React components: PascalCase (`ProjectCard.tsx`, `AdminLayout.tsx`)
- Hooks: camelCase with `use` prefix (`useProfile.ts`, `useAdminProjects.ts`)
- Utilities: camelCase (`slugify.ts`, `readingTime.ts`)
- Config/types: camelCase (`supabase.ts`, `types.ts`)
- Migrations: `NNN_snake_case.sql` (`001_initial_schema.sql`)

**Directories:**
- All lowercase, descriptive (`admin`, `hooks`, `components`, `public`, `ui`, `layout`, `lib`, `pages`)

**Component Naming:**
- Admin list views: `{Entity}Admin.tsx` (e.g., `ProjectsAdmin.tsx`, `BlogAdmin.tsx`)
- Admin forms: `{Entity}Form.tsx` (e.g., `ProjectForm.tsx`, `BlogForm.tsx`)
- Public sections: `{Entity}Section.tsx` (e.g., `ProjectsSection.tsx`, `ExperienceSection.tsx`)
- Public cards: `{Entity}Card.tsx` (e.g., `ProjectCard.tsx`, `ExperienceCard.tsx`)

**Exports:**
- Components: `export default function ComponentName`
- Hooks: `export function useHookName`
- Utilities: `export function functionName`

## Where to Add New Code

**New Public Section (e.g., Skills, Education):**
- Type definition: Add interface to `src/lib/types.ts`
- Database: Add migration file `supabase/migrations/NNN_description.sql`
- Public hook: Create `src/hooks/use{Entity}.ts`
- Section component: Create `src/components/public/{Entity}Section.tsx`
- Card component: Create `src/components/public/{Entity}Card.tsx`
- Wire into: `src/pages/PortfolioPage.tsx` (import hook + render section)

**New Admin CRUD View:**
- Admin hook: Create `src/admin/hooks/useAdmin{Entity}.ts`
- List view: Create `src/admin/{Entity}Admin.tsx`
- Form view: Create `src/admin/{Entity}Form.tsx`
- Wire into: `src/admin/AdminLayout.tsx` (add route + nav item)

**New Shared UI Component:**
- Create in `src/components/ui/{ComponentName}.tsx`
- Follow `forwardRef` pattern if wrapping native elements
- Include `label` and `error` props for form components

**New Utility Function:**
- Create in `src/lib/{functionName}.ts`
- Use named exports

**New Page Route:**
- Create page component in `src/pages/{PageName}Page.tsx`
- Add `<Route>` in `src/App.tsx`

**New Supabase Edge Function:**
- Create directory `supabase/functions/{function-name}/`
- Add `index.ts` with Deno `serve()` handler

**New Database Migration:**
- Create `supabase/migrations/NNN_description.sql` (next sequence number)
- Run with `npm run db:migrate`

## Special Directories

**`public/`:**
- Purpose: Static assets served by Vite at root path
- Generated: No
- Committed: Yes

**`supabase/migrations/`:**
- Purpose: SQL migration files run in order against database
- Generated: No (hand-written)
- Committed: Yes

**`supabase/functions/`:**
- Purpose: Supabase Edge Functions deployed to Supabase platform
- Generated: No
- Committed: Yes

**`.planning/`:**
- Purpose: GSD planning and codebase analysis documents
- Generated: Yes (by tooling)
- Committed: Per project convention

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes (`npm install`)
- Committed: No (gitignored)

---

*Structure analysis: 2026-03-05*
