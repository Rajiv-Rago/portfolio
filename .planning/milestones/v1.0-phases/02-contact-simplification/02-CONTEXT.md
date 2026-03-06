# Phase 2: Contact Simplification - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the contact form with a mailto link and copy-to-clipboard button. Preserve historical contact form submissions in the admin dashboard. The contact section layout changes but the admin MessagesAdmin view stays intact.

</domain>

<decisions>
## Implementation Decisions

### Section layout
- Keep 2-column grid: left side has intro text + social links, right side has email address + copy button
- Remove email from the left-side social links list (avoid duplication) — left side shows only GitHub, LinkedIn, Website
- Right side: minimal style, no card wrapper — just the email text and copy button
- The email area (right side) is a clickable mailto link that opens the visitor's email client
- On mobile (single column): social links first, email below

### Email presentation
- Email address displayed at medium size (text-lg)
- Email address pulled from profile data in Supabase (not hardcoded)
- Mail icon color: Claude's discretion (whatever looks best with the minimal style)

### Copy-to-clipboard
- Use existing Button component (secondary or ghost variant) with text label "Copy Email"
- On click: button text swaps to "Copied!" with a checkmark for ~2 seconds, then reverts
- Copy button uses stopPropagation so it doesn't also trigger the mailto link
- Clipboard API fallback behavior: Claude's discretion

### Section messaging
- Keep heading "Get in Touch"
- Intro text: warm and inviting tone, mentions what outreach is welcome (projects, collaborations, opportunities, casual hellos)
- Intro text pulled from profile/CMS (editable from admin dashboard), not hardcoded

### Claude's Discretion
- Mail icon color treatment
- Clipboard API fallback strategy
- Exact spacing and alignment between email text and copy button
- Button variant choice (secondary vs ghost)

</decisions>

<specifics>
## Specific Ideas

- 2-column layout should match the visual balance of the existing grid (was links + form, now links + email CTA)
- The email section should feel minimal — no card, no box, just the address and action
- Warm tone: "I'd love to hear from you" style, not corporate

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Button` component (`src/components/ui/Button.tsx`): Has primary/secondary/danger/ghost variants with loading state — use for the copy button
- `ContactLinks` component (`src/components/public/ContactLinks.tsx`): Already renders social links from profile data — modify to remove email entry
- `ContactSection` component (`src/components/public/ContactSection.tsx`): 2-column grid container with scroll-reveal — modify in place
- `useScrollReveal` hook: Already used by ContactSection for entrance animation
- Lucide icons: `Mail`, `Github`, `Linkedin`, `Globe` already imported in ContactLinks

### Established Patterns
- Profile data flows from Supabase via `Profile` type — email comes from `profile.email`
- Styling: Tailwind CSS v4, custom theme tokens (text-accent, text-muted, border-border, bg-surface, etc.)
- Responsive: `max-md:` prefix for mobile breakpoints, grid-cols-2 to grid-cols-1

### Integration Points
- `ContactSection` receives `profile` prop — email address available via `profile.email`
- Admin dashboard `MessagesAdmin` (`src/admin/MessagesAdmin.tsx`) is independent — no changes needed
- `ContactForm` and `useContactForm` will become unused after this phase (cleanup deferred to CONT-04 in v2)

</code_context>

<deferred>
## Deferred Ideas

- Clean up orphaned ContactForm and useContactForm code — tracked as CONT-04 in v2 requirements

</deferred>

---

*Phase: 02-contact-simplification*
*Context gathered: 2026-03-06*
