# Phase 2: Contact Simplification - Research

**Researched:** 2026-03-06
**Domain:** React component refactoring, Clipboard API, mailto links, Supabase schema
**Confidence:** HIGH

## Summary

This phase replaces the existing contact form with a mailto link and copy-to-clipboard button. The implementation is straightforward -- it modifies three existing components (`ContactSection`, `ContactLinks`, and their imports) and creates one new component for the email CTA area on the right column. No new libraries are needed; everything uses React 19, existing UI components, Lucide icons, and the native Clipboard API.

The main architectural consideration is that the user wants intro text to be editable from the admin dashboard (pulled from profile/CMS), but the current `profile` table has no `contact_intro` field. This requires a small database migration and corresponding changes to the `Profile` type, `ProfileSettings` admin form, and the Supabase query. The MessagesAdmin component is completely independent and requires zero changes.

**Primary recommendation:** Add a `contact_intro` text column to the `profile` table via migration, then refactor ContactSection to swap the form for a mailto link + copy button, pulling intro text from `profile.contact_intro`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Keep 2-column grid: left side has intro text + social links, right side has email address + copy button
- Remove email from the left-side social links list (avoid duplication) -- left side shows only GitHub, LinkedIn, Website
- Right side: minimal style, no card wrapper -- just the email text and copy button
- The email area (right side) is a clickable mailto link that opens the visitor's email client
- On mobile (single column): social links first, email below
- Email address displayed at medium size (text-lg)
- Email address pulled from profile data in Supabase (not hardcoded)
- Use existing Button component (secondary or ghost variant) with text label "Copy Email"
- On click: button text swaps to "Copied!" with a checkmark for ~2 seconds, then reverts
- Copy button uses stopPropagation so it doesn't also trigger the mailto link
- Keep heading "Get in Touch"
- Intro text: warm and inviting tone, mentions what outreach is welcome (projects, collaborations, opportunities, casual hellos)
- Intro text pulled from profile/CMS (editable from admin dashboard), not hardcoded

### Claude's Discretion
- Mail icon color treatment
- Clipboard API fallback strategy
- Exact spacing and alignment between email text and copy button
- Button variant choice (secondary vs ghost)

### Deferred Ideas (OUT OF SCOPE)
- Clean up orphaned ContactForm and useContactForm code -- tracked as CONT-04 in v2 requirements
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONT-01 | Contact section uses mailto:mail@rajivrago.com link instead of form | Existing ContactSection swaps ContactForm for new EmailCTA component; mailto constructed from `profile.email` |
| CONT-02 | Copy-to-clipboard button for email address with feedback | Native Clipboard API (95.68% support), existing Button component, useState for copied state with setTimeout reset |
| CONT-03 | Admin messages view preserved for historical contact submissions | MessagesAdmin is fully independent; no changes needed -- verified by code inspection |
</phase_requirements>

## Standard Stack

### Core (already installed -- no new dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.0 | Component framework | Already in use |
| lucide-react | 0.575.0 | Mail, Check, Github, Linkedin, Globe icons | Already in use in ContactLinks |
| Tailwind CSS | 4.2.0 | Styling with custom theme tokens | Already in use |
| @supabase/supabase-js | 2.97.0 | Database queries for profile data | Already in use |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-hook-form | 7.71.2 | Admin form for editing contact_intro | Already used in ProfileSettings |
| zod | 4.3.6 | Validation schema for ProfileSettings | Already used |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native Clipboard API | clipboard-polyfill | Unnecessary -- 95.68% browser support, site is HTTPS on Vercel, no legacy browser requirement |
| New CopyButton component | Inline onClick in Button | Extract a component only if reused elsewhere; for now inline logic is simpler |

**Installation:**
```bash
# No new packages needed
```

## Architecture Patterns

### Recommended Component Structure
```
src/
├── components/
│   └── public/
│       ├── ContactSection.tsx    # MODIFY: swap ContactForm for EmailCTA
│       ├── ContactLinks.tsx      # MODIFY: remove email entry, update intro text
│       └── EmailCTA.tsx          # NEW: mailto link + copy button
├── admin/
│   └── ProfileSettings.tsx       # MODIFY: add contact_intro textarea field
├── lib/
│   └── types.ts                  # MODIFY: add contact_intro to Profile interface
└── hooks/
    └── useProfile.ts             # NO CHANGE: already selects * from profile
```

### Pattern 1: EmailCTA Component
**What:** A new component for the right column that renders the mailto link wrapping the email address and a copy button.
**When to use:** Replaces the ContactForm in the right column of ContactSection.
**Example:**
```typescript
// The mailto link wraps the entire email display area.
// The copy button sits inside the link but uses stopPropagation
// to prevent the mailto from firing when clicking copy.

function EmailCTA({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: hidden textarea + execCommand
      fallbackCopy(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col items-start gap-4">
      <a href={`mailto:${email}`} className="...">
        <Mail className="..." />
        <span className="text-lg">{email}</span>
      </a>
      <Button variant="ghost" onClick={handleCopy}>
        {copied ? <><Check className="w-4 h-4" /> Copied!</> : 'Copy Email'}
      </Button>
    </div>
  )
}
```

### Pattern 2: Database Migration for contact_intro
**What:** Add a `contact_intro` text column to the `profile` table so the intro text is editable from the admin dashboard.
**When to use:** Required because the user decision says "Intro text pulled from profile/CMS (editable from admin dashboard), not hardcoded."
**Example:**
```sql
-- supabase/migrations/003_contact_intro.sql
ALTER TABLE profile ADD COLUMN contact_intro text;

UPDATE profile SET contact_intro = 'I''d love to hear from you! Whether you have a project in mind, want to collaborate, or just want to say hello -- don''t hesitate to reach out.';
```

### Pattern 3: Filtering Email from ContactLinks
**What:** Remove the email entry from the social links array in ContactLinks.
**When to use:** User decision says left side shows only GitHub, LinkedIn, Website.
**Example:**
```typescript
// Before: includes Mail entry
const links = [
  { url: profile.email ? `mailto:${profile.email}` : null, label: profile.email, icon: Mail },
  // ...
]

// After: remove the email entry entirely
const links = [
  { url: profile.github, label: profile.github?.replace('https://', ''), icon: Github, newTab: true },
  { url: profile.linkedin, label: profile.linkedin?.replace('https://', ''), icon: Linkedin, newTab: true },
  { url: profile.website, label: profile.website?.replace('https://', ''), icon: Globe, newTab: true },
].filter((l) => l.url)
```

### Anti-Patterns to Avoid
- **Hardcoding the email address:** The email must come from `profile.email`. The mailto destination is dynamic.
- **Hardcoding intro text:** The user explicitly wants this editable from admin. Add the `contact_intro` column.
- **Wrapping the copy button inside the anchor tag DOM hierarchy without stopPropagation:** Clicking the button would trigger the mailto link. Must call `e.stopPropagation()` and `e.preventDefault()` on the button click handler.
- **Deleting ContactForm/useContactForm:** Explicitly deferred to CONT-04 (v2). Leave the files in place -- they just won't be imported anymore.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Clipboard access | Custom clipboard manager | `navigator.clipboard.writeText()` | Native API, 95.68% support, async, secure context only (site is HTTPS) |
| Copy button UI | Custom animated button | Existing `Button` component + useState toggle | Button already has variants, loading state, and proper styling |
| Icon library | SVG sprites or custom icons | `lucide-react` (Mail, Check, Copy) | Already installed and used throughout the app |

## Common Pitfalls

### Pitfall 1: Copy Button Triggering mailto
**What goes wrong:** If the copy button is rendered inside a clickable mailto link area, clicking the button opens the email client AND copies.
**Why it happens:** Click events bubble up through the DOM.
**How to avoid:** Call `e.stopPropagation()` AND `e.preventDefault()` in the copy button's onClick handler. Place the button as a sibling to (not inside) the anchor tag, or ensure proper event handling if nested.
**Warning signs:** During manual testing, clicking "Copy Email" opens the email client.

### Pitfall 2: Clipboard API Fails Silently in Non-Secure Context
**What goes wrong:** `navigator.clipboard` is `undefined` when the page is served over HTTP (not HTTPS).
**Why it happens:** The Clipboard API requires a secure context (HTTPS or localhost).
**How to avoid:** This site is deployed on Vercel (HTTPS) so it won't be an issue in production. For local dev (`localhost`), it also works. Add a try/catch with a fallback regardless.
**Warning signs:** `navigator.clipboard is undefined` in console during dev.

### Pitfall 3: Forgetting to Update the Profile Type
**What goes wrong:** TypeScript compilation fails or `profile.contact_intro` is `undefined` at runtime.
**Why it happens:** Adding a column to the database without updating the TypeScript `Profile` interface.
**How to avoid:** Update `Profile` in `src/lib/types.ts` to include `contact_intro: string | null`. Also update the `ProfileSettings` Zod schema and form.
**Warning signs:** TypeScript errors on `profile.contact_intro`.

### Pitfall 4: Migration Not Run on Remote Database
**What goes wrong:** New `contact_intro` column exists locally but not in production Supabase.
**Why it happens:** Migration created but not applied via Supabase dashboard or CLI.
**How to avoid:** Document migration application as part of the deployment checklist. The existing migration system uses `node scripts/migrate.js`.
**Warning signs:** Runtime error: column `contact_intro` does not exist.

## Code Examples

### Clipboard Fallback (execCommand)
```typescript
// Source: MDN Web Docs / web.dev clipboard patterns
function fallbackCopyToClipboard(text: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    document.body.removeChild(textarea)
  }
}
```

### Complete Copy Handler Pattern
```typescript
// Source: web.dev copy-text pattern
const handleCopy = async (e: React.MouseEvent) => {
  e.stopPropagation()
  e.preventDefault()

  let success = false
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(email)
      success = true
    } catch {
      success = fallbackCopyToClipboard(email)
    }
  } else {
    success = fallbackCopyToClipboard(email)
  }

  if (success) {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
}
```

### ContactSection After Refactor
```typescript
// ContactSection.tsx -- showing the structural change
import ContactLinks from './ContactLinks'
import EmailCTA from './EmailCTA'

export default function ContactSection({ profile }: { profile: Profile }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div ref={ref} id="contact" className={`scroll-reveal ${isVisible ? 'is-visible' : ''} ...`}>
      <h2 className="...">Get in Touch</h2>
      <div className="grid grid-cols-2 gap-12 max-md:grid-cols-1 max-md:gap-8">
        <ContactLinks profile={profile} />
        <EmailCTA email={profile.email} />
      </div>
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `document.execCommand('copy')` | `navigator.clipboard.writeText()` | Chrome 66 (2018), Baseline 2025 | Async, promise-based, secure context only |
| Contact forms for portfolios | Direct mailto + copy email | Trend 2023-present | Less friction, fewer moving parts, no backend needed |

**Deprecated/outdated:**
- `document.execCommand('copy')`: Deprecated but still works as a fallback in all browsers. Use only as fallback behind the Clipboard API.

## Open Questions

1. **contact_intro column: nullable or NOT NULL with default?**
   - What we know: The user wants intro text pulled from CMS. The `bio` column is NOT NULL.
   - What's unclear: Whether to make `contact_intro` nullable (with a hardcoded default in the component) or NOT NULL with a seed default.
   - Recommendation: Make it nullable (`text DEFAULT NULL`). The component should have a sensible fallback string if the field is null, ensuring the section always renders text even if the admin hasn't set it yet. The migration seeds the existing row with a default value.

2. **Should the copy button be inside or beside the mailto anchor?**
   - What we know: User wants the email area to be a clickable mailto link. The copy button must not trigger mailto.
   - What's unclear: DOM nesting -- button inside anchor is technically invalid HTML.
   - Recommendation: Render them as siblings in a flex container. The anchor wraps only the icon + email text. The button is a sibling element below or beside it.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None currently installed |
| Config file | none -- see Wave 0 |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONT-01 | Mailto link renders with correct href from profile.email | unit | `npx vitest run src/components/public/__tests__/EmailCTA.test.tsx` | -- Wave 0 |
| CONT-02 | Copy button calls clipboard API and shows "Copied!" feedback | unit | `npx vitest run src/components/public/__tests__/EmailCTA.test.tsx` | -- Wave 0 |
| CONT-03 | MessagesAdmin still renders and lists historical messages | manual-only | Visual check in admin dashboard | N/A (no changes to this component) |

### Sampling Rate
- **Per task commit:** N/A (no test framework)
- **Per wave merge:** N/A
- **Phase gate:** Manual verification of mailto link, copy button, and admin messages view

### Wave 0 Gaps
- [ ] Install test framework: `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`
- [ ] Create `vitest.config.ts` with jsdom environment
- [ ] Create `src/components/public/__tests__/EmailCTA.test.tsx` -- covers CONT-01, CONT-02
- [ ] Create `src/test/setup.ts` -- shared test setup (jest-dom matchers)

*Note: CONT-03 requires no code changes (MessagesAdmin is untouched), so manual verification that it still works is sufficient.*

## Sources

### Primary (HIGH confidence)
- Codebase inspection: `ContactSection.tsx`, `ContactLinks.tsx`, `ContactForm.tsx`, `Button.tsx`, `types.ts`, `ProfileSettings.tsx`, `MessagesAdmin.tsx`, `001_initial_schema.sql`
- [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText) - writeText method, secure context requirement
- [Can I Use: clipboard.writeText](https://caniuse.com/mdn-api_clipboard_writetext) - 95.68% global support, Chrome 66+, Firefox 63+, Safari 13.1+

### Secondary (MEDIUM confidence)
- [web.dev copy-text pattern](https://web.dev/patterns/clipboard/copy-text) - fallback strategy using execCommand

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - no new libraries, all existing dependencies
- Architecture: HIGH - small component refactor, verified against actual codebase
- Pitfalls: HIGH - clipboard API behavior well-documented, DOM event bubbling is fundamental
- Database migration: HIGH - simple ALTER TABLE, pattern matches existing migrations

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (stable -- no fast-moving dependencies)
