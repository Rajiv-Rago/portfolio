# Technology Stack

**Analysis Date:** 2026-03-05

## Languages

**Primary:**
- TypeScript ~5.9.3 - All frontend and admin source code (`src/**/*.ts`, `src/**/*.tsx`)
- SQL - Database migrations (`supabase/migrations/*.sql`)

**Secondary:**
- TypeScript (Deno) - Supabase Edge Functions (`supabase/functions/contact-notify/index.ts`)
- JavaScript (ESM) - Migration runner script (`scripts/migrate.js`)
- CSS - Global styles with Tailwind v4 (`src/index.css`)

## Runtime

**Environment:**
- Node.js v22.x (v22.17.0 detected on dev machine)
- Deno (Supabase Edge Functions runtime, using `deno.land/std@0.177.0`)

**Package Manager:**
- npm 11.x (11.7.0 detected)
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 19.2.x - UI library (`src/main.tsx`, `src/App.tsx`)
- React Router DOM 7.13.x - Client-side routing (`src/App.tsx`)
- Tailwind CSS 4.2.x - Utility-first CSS framework, integrated via Vite plugin (`@tailwindcss/vite`)

**Form Handling:**
- React Hook Form 7.71.x - Form state management (`src/hooks/useContactForm.ts`, `src/admin/ProfileSettings.tsx`)
- @hookform/resolvers 5.2.x - Zod integration for form validation
- Zod 4.3.x - Schema validation for forms (`src/hooks/useContactForm.ts`)

**Build/Dev:**
- Vite 7.3.x - Build tool and dev server (`vite.config.ts`)
- @vitejs/plugin-react 5.1.x - React Fast Refresh and JSX transform

**Linting:**
- ESLint 9.39.x - Flat config format (`eslint.config.js`)
- typescript-eslint 8.48.x - TypeScript ESLint rules
- eslint-plugin-react-hooks 7.0.x - React hooks linting
- eslint-plugin-react-refresh 0.4.x - React Refresh boundary linting

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` ^2.97.0 - Supabase client for database, auth, and storage. The entire data layer depends on this. (`src/lib/supabase.ts`)
- `react-router-dom` ^7.13.0 - All page routing and navigation (`src/App.tsx`)
- `zod` ^4.3.6 - Form validation schemas throughout admin and contact forms

**UI/UX:**
- `lucide-react` ^0.575.0 - Icon library used across components
- `react-hot-toast` ^2.6.0 - Toast notifications for user feedback (`src/main.tsx` mounts `<Toaster />`)
- `react-markdown` ^10.1.0 - Renders blog post content as markdown
- `remark-gfm` ^4.0.1 - GitHub Flavored Markdown plugin for react-markdown

**Utilities:**
- `date-fns` ^4.1.0 - Date formatting
- `postgres` ^3.4.8 - Direct PostgreSQL client used only in migration script (`scripts/migrate.js`), not in the frontend

## TypeScript Configuration

**App config (`tsconfig.app.json`):**
- Target: ES2022
- Module: ESNext with bundler resolution
- Strict mode enabled
- JSX: react-jsx
- `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly` enforced
- `verbatimModuleSyntax` enabled (requires explicit `type` imports)
- Includes: `src/`

**Node config (`tsconfig.node.json`):**
- Target: ES2023
- Module: ESNext with bundler resolution
- Includes: `vite.config.ts` only

**Root (`tsconfig.json`):**
- Project references pointing to `tsconfig.app.json` and `tsconfig.node.json`

## Configuration

**Environment:**
- Vite env vars prefixed with `VITE_` exposed to client (`import.meta.env`)
- Required client-side env vars:
  - `VITE_SUPABASE_URL` - Supabase project URL
  - `VITE_SUPABASE_ANON_KEY` - Supabase anonymous/public key
- Required for migrations only:
  - `DATABASE_URL` - Direct PostgreSQL connection string
- Required for Edge Functions:
  - `OWNER_EMAIL` - Email to receive contact notifications
  - `RESEND_API_KEY` - Resend API key for sending emails
- `.env.example` file present at project root

**Build:**
- `vite.config.ts` - Vite with React and Tailwind CSS plugins
- `eslint.config.js` - ESLint flat config
- `vercel.json` - SPA rewrite rule (`/(.*) -> /index.html`)

**Tailwind CSS v4:**
- Uses CSS-based configuration via `@theme` directive in `src/index.css`
- No `tailwind.config.js` file (v4 approach)
- Custom design tokens defined: colors (bg, surface, text, muted, accent, border, danger, success, warning), fonts (heading: serif, body: system sans-serif), border radii (sm/md/lg/xl)

## Platform Requirements

**Development:**
- Node.js 22.x
- npm 11.x
- A Supabase project with tables created via migrations
- `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Production:**
- Deployed to Vercel (static SPA)
- Supabase handles backend (database, auth, storage, edge functions)
- No server-side rendering - purely client-side React app

**Scripts:**
- `npm run dev` - Start Vite dev server
- `npm run build` - TypeScript check + Vite production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally
- `npm run db:migrate` - Run SQL migrations against Supabase PostgreSQL

---

*Stack analysis: 2026-03-05*
