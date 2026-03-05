# External Integrations

**Analysis Date:** 2026-03-05

## APIs & External Services

**Supabase (Primary Backend):**
- Provides database, authentication, file storage, and edge functions
- SDK: `@supabase/supabase-js` ^2.97.0
- Client initialized in `src/lib/supabase.ts`
- Auth: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars
- Used throughout all data hooks (`src/hooks/*.ts`, `src/admin/hooks/*.ts`)

**Resend (Email Delivery):**
- Sends contact form notification emails to site owner
- Called from Supabase Edge Function (`supabase/functions/contact-notify/index.ts`)
- API endpoint: `https://api.resend.com/emails`
- Auth: `RESEND_API_KEY` env var (set in Supabase Edge Function secrets)
- Triggered automatically via database webhook on INSERT into `contact_messages`

## Data Storage

**Database:**
- PostgreSQL (Supabase-managed)
- Connection (migrations only): `DATABASE_URL` env var
- Client (app): `@supabase/supabase-js` via `src/lib/supabase.ts`
- Migration tool: Custom script `scripts/migrate.js` using `postgres` npm package
- Migration files: `supabase/migrations/001_initial_schema.sql`, `supabase/migrations/002_thumbnail_options.sql`
- Migration tracking: `schema_migrations` table

**Tables:**
| Table | Public Access | Authenticated Access | Used By |
|-------|--------------|---------------------|---------|
| `profile` | SELECT (all) | Full CRUD | `src/hooks/useProfile.ts`, `src/admin/ProfileSettings.tsx` |
| `projects` | SELECT (published only) | Full CRUD | `src/hooks/useProjects.ts`, `src/admin/hooks/useAdminProjects.ts` |
| `experience` | SELECT (all) | Full CRUD | `src/hooks/useExperience.ts`, `src/admin/hooks/useAdminExperience.ts` |
| `blog_posts` | SELECT (published only) | Full CRUD | `src/hooks/useBlogPosts.ts`, `src/admin/hooks/useAdminBlog.ts` |
| `contact_messages` | INSERT only | Full CRUD | `src/hooks/useContactForm.ts`, `src/admin/hooks/useAdminMessages.ts` |

**Row-Level Security (RLS):**
- All tables have RLS enabled
- `anon` role: read-only for public content, insert-only for contact messages
- `authenticated` role: full access to all tables
- Defined in `supabase/migrations/001_initial_schema.sql`

**File Storage (Supabase Storage):**
- Bucket: `avatars` - Profile avatar images (`src/admin/ProfileSettings.tsx`)
- Bucket: `resumes` - Resume/CV file uploads (`src/admin/ProfileSettings.tsx`)
- Upload/remove via `src/admin/hooks/useFileUpload.ts`
- Public URLs generated via `supabase.storage.from(bucket).getPublicUrl()`
- Project thumbnails stored as URLs in the `thumbnail` column (likely also Supabase Storage)

**Caching:**
- None (all data fetched fresh on component mount)

## Authentication & Identity

**Auth Provider:**
- Supabase Auth (email/password)
- Implementation: `src/admin/hooks/useAuth.ts`
- Login: `supabase.auth.signInWithPassword({ email, password })`
- Session management: `supabase.auth.getSession()` + `onAuthStateChange` listener
- Route guard: `src/admin/AdminGuard.tsx` - blocks admin routes for unauthenticated users
- Admin panel lazy-loaded at `/admin/*` route (`src/App.tsx`)
- No OAuth/social login providers configured
- No user registration flow (admin-only, single-user setup)

## Monitoring & Observability

**Error Tracking:**
- None (no Sentry, Datadog, etc.)
- Client-side: `ErrorBoundary` component (`src/components/ui/ErrorBoundary.tsx`)

**Logs:**
- `console.error` in Edge Function (`supabase/functions/contact-notify/index.ts`)
- No structured logging framework

## CI/CD & Deployment

**Hosting:**
- Vercel (static SPA deployment)
- Config: `vercel.json` with SPA fallback rewrite rule
- Build command: `tsc -b && vite build` (via `npm run build`)

**CI Pipeline:**
- Not detected (no `.github/workflows/`, no CI config files)

**Supabase Edge Functions:**
- `contact-notify` function at `supabase/functions/contact-notify/index.ts`
- Deployed separately to Supabase (not part of Vercel build)
- Triggered by database webhook on `contact_messages` INSERT

## Environment Configuration

**Required env vars (client-side, in `.env`):**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous API key

**Required env vars (migration script, in `.env`):**
- `DATABASE_URL` - Direct PostgreSQL connection string (Supabase)

**Required env vars (Edge Function secrets, set in Supabase dashboard):**
- `OWNER_EMAIL` - Email address to receive contact notifications
- `RESEND_API_KEY` - Resend API key for email delivery

**Secrets location:**
- `.env` file at project root (gitignored, `.env.example` present)
- Edge Function secrets managed via Supabase dashboard

## Webhooks & Callbacks

**Incoming:**
- Database webhook on `contact_messages` INSERT triggers `contact-notify` Edge Function
- Configured in Supabase dashboard (not in code)

**Outgoing:**
- Resend API call from `contact-notify` Edge Function sends email to `OWNER_EMAIL`

## Integration Architecture

```
[Browser] --> [Vercel (Static SPA)]
    |
    v
[Supabase Client JS SDK]
    |
    ├── Database (PostgreSQL) -- queries via supabase.from().select/insert/update/delete
    ├── Auth -- supabase.auth.signInWithPassword / getSession / onAuthStateChange
    └── Storage -- supabase.storage.from(bucket).upload / getPublicUrl / remove

[Supabase Database Webhook]
    |
    v
[contact-notify Edge Function (Deno)]
    |
    v
[Resend API] --> Email to OWNER_EMAIL
```

---

*Integration audit: 2026-03-05*
