# Codebase Concerns

**Analysis Date:** 2026-03-05

## Tech Debt

**No Test Coverage:**
- Issue: Zero test files exist in the project. No test framework configured (no jest, vitest, or testing-library in dependencies).
- Files: All files in `src/`
- Impact: Any code change risks introducing regressions with no safety net. Refactoring is high-risk.
- Fix approach: Add vitest + @testing-library/react. Prioritize testing hooks (`src/hooks/useContactForm.ts`, `src/admin/hooks/useAuth.ts`) and utility functions (`src/lib/readingTime.ts`, `src/lib/slugify.ts`) first, then admin CRUD operations.

**Duplicated Admin CRUD Hooks:**
- Issue: `useAdminProjects`, `useAdminBlog`, `useAdminExperience`, and `useAdminMessages` are near-identical implementations of fetch/create/update/delete against different Supabase tables. Each follows the exact same pattern with copy-pasted error handling.
- Files: `src/admin/hooks/useAdminProjects.ts`, `src/admin/hooks/useAdminBlog.ts`, `src/admin/hooks/useAdminExperience.ts`, `src/admin/hooks/useAdminMessages.ts`
- Impact: Bug fixes or pattern changes must be applied to 4 files. Error handling is duplicated with identical toast messages ("Something went wrong. Please try again.").
- Fix approach: Create a generic `useAdminCrud<T>` hook that accepts table name, select columns, and order config. Each specific hook becomes a thin wrapper.

**Duplicated Admin Page Components:**
- Issue: `ProjectsAdmin`, `ExperienceAdmin`, and `BlogAdmin` share identical structural patterns: loading state, form toggle, confirm dialog for deletion, table layout. The UI logic is repeated across all three.
- Files: `src/admin/ProjectsAdmin.tsx`, `src/admin/ExperienceAdmin.tsx`, `src/admin/BlogAdmin.tsx`
- Impact: UI consistency changes require updating three files. Adding features (search, pagination) must be done three times.
- Fix approach: Extract a shared `AdminListPage` component that accepts column definitions, form component, and CRUD hook.

**`postgres` Package in Frontend Dependencies:**
- Issue: The `postgres` npm package (a PostgreSQL client) is listed under `dependencies` in `package.json`, but it is only used by `scripts/migrate.js` (a Node.js CLI script). It is never imported in `src/`. This means it gets bundled into the frontend or at minimum inflates `node_modules` unnecessarily.
- Files: `package.json` (line 19), `scripts/migrate.js`
- Impact: Unnecessary dependency in production frontend bundle analysis. Minor security surface increase.
- Fix approach: Move `postgres` to `devDependencies` since it is only used in the migration script.

**No Error Handling on Public Data Fetches:**
- Issue: Public-facing hooks (`useProjects`, `useBlogPosts`, `useProfile`, `useExperience`) all ignore the `error` response from Supabase. If the Supabase API fails, users see an empty page or infinite skeleton with no feedback.
- Files: `src/hooks/useProjects.ts`, `src/hooks/useBlogPosts.ts`, `src/hooks/useProfile.ts`, `src/hooks/useExperience.ts`
- Impact: Network failures or Supabase outages result in a broken-looking page with no error messaging. The `PortfolioPage` shows `<PortfolioSkeleton />` indefinitely if profile fetch fails (line 47-48 in `src/pages/PortfolioPage.tsx`).
- Fix approach: Add error state to each hook. Return `{ data, loading, error }`. Show a user-friendly error UI when Supabase is unreachable.

**`useMetaTags` Creates Duplicate Meta Tags:**
- Issue: The `useMetaTags` hook appends new meta elements on every render cycle rather than finding and updating existing ones. If a user navigates between pages rapidly or if React re-renders, duplicate meta tags accumulate until the cleanup function runs.
- Files: `src/hooks/useMetaTags.ts`
- Impact: SEO crawlers may see duplicate or stale meta tags. Functional impact is minimal since cleanup runs on unmount/dependency change, but the approach is fragile.
- Fix approach: Use `react-helmet-async` or find existing meta tags by property name before creating new ones.

## Security Considerations

**Contact Form Spam Protection is Client-Side Only:**
- Risk: The honeypot field and rate limiting in `useContactForm` are entirely client-side. A direct POST to the Supabase `contact_messages` table via the anon key bypasses all protections.
- Files: `src/hooks/useContactForm.ts`, `supabase/migrations/001_initial_schema.sql` (line 123-124)
- Current mitigation: Honeypot field (line 28) and 60-second client-side rate limit (line 44-45). RLS allows anonymous inserts with `WITH CHECK (true)`.
- Recommendations: Add server-side rate limiting via Supabase Edge Function or database trigger. Consider adding reCAPTCHA or Turnstile. Add a Supabase RLS policy that rate-limits inserts per IP or per email, or use a Supabase Edge Function as the insert endpoint.

**No File Upload Validation:**
- Risk: The file upload hook accepts any file without validating type or size on the client or server. The `accept` attribute on inputs is advisory only and trivially bypassed.
- Files: `src/admin/hooks/useFileUpload.ts`, `src/admin/ProfileSettings.tsx` (lines 76-88)
- Current mitigation: `accept` attribute on file inputs (image/* and .pdf,.doc,.docx). Uploads require authentication (admin only).
- Recommendations: Validate file size (e.g., max 5MB) and MIME type in `useFileUpload` before uploading. Configure Supabase Storage bucket size limits and allowed MIME types.

**Supabase Anon Key Exposed in Frontend (Expected but Notable):**
- Risk: The Supabase anon key is in `VITE_SUPABASE_ANON_KEY`, which Vite embeds in the client bundle. This is by design for Supabase's architecture, but means RLS policies are the sole authorization layer.
- Files: `src/lib/supabase.ts`, `.env.example`
- Current mitigation: RLS policies in `supabase/migrations/001_initial_schema.sql` restrict reads to published content and allow anonymous inserts only on `contact_messages`.
- Recommendations: Audit RLS policies periodically. Ensure no future table additions accidentally expose data without RLS.

**No Input Sanitization on Markdown Rendering:**
- Risk: Blog post body content is rendered via `react-markdown` which is generally safe, but combined with `remark-gfm` and no explicit sanitization configuration, there is a theoretical XSS surface for admin-authored content.
- Files: `src/pages/BlogPage.tsx` (line 89)
- Current mitigation: `react-markdown` does not use `dangerouslySetInnerHTML` and sanitizes by default. Only authenticated admins can create blog posts.
- Recommendations: Low risk since only admins author content, but add `rehype-sanitize` plugin for defense-in-depth if the blog ever accepts external content.

**Edge Function Uses Hardcoded Placeholder Domain:**
- Risk: The contact notification edge function sends emails from `noreply@yourdomain.com`, which is a placeholder that was never updated.
- Files: `supabase/functions/contact-notify/index.ts` (line 52)
- Current mitigation: None. Emails sent from this address may be rejected by email providers or flagged as spam.
- Recommendations: Replace with actual verified domain in Resend. Make configurable via environment variable.

## Performance Bottlenecks

**PortfolioPage Fires Four Parallel Supabase Queries:**
- Problem: `PortfolioPage` calls `useProfile`, `useProjects`, `useExperience`, and `useBlogPosts`, each initiating an independent Supabase REST request on mount. This is 4 HTTP roundtrips before the page can render.
- Files: `src/pages/PortfolioPage.tsx` (lines 17-20)
- Cause: Each hook independently calls `supabase.from(...).select('*')` in its own `useEffect`.
- Improvement path: Consolidate into a single hook that uses `Promise.all` for all four queries, or implement a Supabase Edge Function that returns all portfolio data in one response. Alternatively, add client-side caching (e.g., `@tanstack/react-query`) to avoid refetching on navigation.

**All Supabase Queries Use `select('*')`:**
- Problem: Every data fetch selects all columns, including `body` on `blog_posts` which can contain large Markdown content. The blog list page fetches full post bodies just to display titles and excerpts.
- Files: `src/hooks/useBlogPosts.ts` (line 12), `src/hooks/useProjects.ts` (line 12), `src/hooks/useProfile.ts` (line 12), `src/hooks/useExperience.ts` (line 12), `src/admin/hooks/useAdminBlog.ts` (line 13)
- Cause: Convenience of `select('*')` during initial development.
- Improvement path: Use explicit column lists. For public blog list, select only `id, title, slug, excerpt, tags, published_at` (exclude `body`). For public projects, exclude any large text fields.

**Admin Refetches Entire List After Every Mutation:**
- Problem: After every create/update/delete, admin hooks call `fetch()` which re-queries the entire table from Supabase. For tables with many records, this is wasteful.
- Files: `src/admin/hooks/useAdminProjects.ts` (lines 25, 32, 39), `src/admin/hooks/useAdminBlog.ts`, `src/admin/hooks/useAdminExperience.ts`, `src/admin/hooks/useAdminMessages.ts`
- Cause: Simplicity of implementation — full refetch guarantees consistency.
- Improvement path: For a portfolio site this is fine at current scale. If data grows, use optimistic updates or patch local state instead of refetching.

**No Caching Layer:**
- Problem: Every page navigation triggers fresh Supabase queries. Navigating from the portfolio page to a blog post and back refetches all portfolio data.
- Files: All hooks in `src/hooks/`
- Cause: Hooks use local `useState` which resets on unmount.
- Improvement path: Add `@tanstack/react-query` or `swr` for client-side caching with stale-while-revalidate. This would also solve the error handling gap.

## Fragile Areas

**`useMetaTags` Dependency Array Includes Object References:**
- Files: `src/hooks/useMetaTags.ts` (line 66)
- Why fragile: The `article` and `jsonLd` parameters are objects that are recreated on every render (they are inline object literals in `PortfolioPage.tsx` lines 27-35 and `BlogPage.tsx` lines 28-35). This causes the `useEffect` to fire on every render, creating and removing meta tags repeatedly. The `useMemo` in `PortfolioPage` doesn't memoize the `jsonLd` object passed to `useMetaTags`.
- Safe modification: Memoize the options object before passing to `useMetaTags`, or have `useMetaTags` internally serialize and compare via `JSON.stringify`.
- Test coverage: None.

**Contact Form Rate Limit Resets on Navigation:**
- Files: `src/hooks/useContactForm.ts` (line 44-45)
- Why fragile: The 60-second rate limit is stored in React state (`useState`). Navigating away from the contact section and back resets the timer, allowing unlimited submissions.
- Safe modification: Use `sessionStorage` or a module-level variable to persist the rate limit across mounts.
- Test coverage: None.

**Supabase Client Has No Fallback for Missing Env Vars:**
- Files: `src/lib/supabase.ts`
- Why fragile: `createClient(supabaseUrl, supabaseAnonKey)` is called with potentially `undefined` values if `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are missing. This crashes the app at module load time with an unclear error.
- Safe modification: Add a guard: `if (!supabaseUrl || !supabaseAnonKey) throw new Error('Missing Supabase environment variables')`.
- Test coverage: None.

## Scaling Limits

**Single Profile Row Assumption:**
- Current capacity: The app assumes a single row in the `profile` table, fetched via `.single()`.
- Limit: Cannot support multiple portfolios or users. Adding a second profile row would break `useProfile`.
- Scaling path: Add a `user_id` column to `profile` and filter by authenticated user, or use a configuration approach.

**No Pagination on Admin Lists:**
- Current capacity: All admin list views fetch every row from their respective tables.
- Limit: Tables with 100+ entries will cause slow load times and large DOM.
- Scaling path: Add offset/limit pagination or cursor-based pagination to admin hooks and list components.

## Dependencies at Risk

**Pinned Deno Standard Library Version in Edge Function:**
- Risk: `supabase/functions/contact-notify/index.ts` imports from `https://deno.land/std@0.177.0/http/server.ts`, a specific Deno std version that may be outdated. Supabase Edge Functions may upgrade their Deno runtime, potentially causing incompatibilities.
- Impact: Edge function may stop working after a Supabase runtime upgrade.
- Migration plan: Update to latest Deno std import or use Supabase's recommended import pattern.

## Test Coverage Gaps

**Entire Codebase is Untested:**
- What's not tested: Every component, hook, utility function, and page.
- Files: All files in `src/`
- Risk: Any change can introduce regressions undetected. The contact form, admin authentication, CRUD operations, markdown rendering, and slug generation are all untested.
- Priority: High

**Critical Paths Without Tests (prioritized):**
1. `src/hooks/useContactForm.ts` - Public-facing form submission, honeypot, rate limiting
2. `src/admin/hooks/useAuth.ts` - Authentication flow
3. `src/lib/slugify.ts` - Blog URL generation (bugs cause broken links)
4. `src/lib/readingTime.ts` - Reading time calculation
5. `src/admin/hooks/useAdminBlog.ts` - Blog CRUD with published_at logic
6. `src/admin/BlogForm.tsx` - Auto-slug generation, excerpt fallback
7. `src/components/ui/ErrorBoundary.tsx` - Error catching behavior

---

*Concerns audit: 2026-03-05*
