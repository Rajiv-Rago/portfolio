# Architecture Patterns

**Domain:** Email infrastructure + UI/UX animation layer for an existing React SPA portfolio
**Researched:** 2026-03-05
**Confidence:** MEDIUM (training data only; web verification unavailable)

## Current Architecture Snapshot

The portfolio is a React 19 SPA (Vite 7, Tailwind CSS v4) deployed on Vercel, backed by Supabase (PostgreSQL, Auth, Edge Functions). The domain rajivrago.com is on Cloudflare. The site has a public portfolio surface and an authenticated admin dashboard.

Key existing patterns relevant to this milestone:
- **Scroll-reveal:** `useScrollReveal` hook using `IntersectionObserver` + CSS `fade-up` keyframe animation with `prefers-reduced-motion` support
- **Contact form:** `ContactForm` + `useContactForm` hook inserts into Supabase `contact_messages` table, which triggers a `contact-notify` edge function via database webhook to send email through Resend API
- **Contact links:** `ContactLinks` component already renders a `mailto:` link from `profile.email`, alongside GitHub/LinkedIn/website links
- **Hover effects:** Already present on `ProjectCard` (`hover:-translate-y-1 hover:shadow-lg hover:border-accent`) and `ContactLinks` (`hover:border-accent hover:bg-accent-light`)

## Recommended Architecture for This Milestone

This milestone has two completely independent workstreams. They share no code, no data flow, and no dependencies on each other.

### Workstream A: Email Infrastructure (Zero Code Changes)

This is entirely external service configuration. No React components, no hooks, no build changes.

```
Inbound email flow:
  Internet -> mail@rajivrago.com
    -> Cloudflare Email Routing (MX records on rajivrago.com)
    -> Forward to personal Gmail inbox

Outbound email flow (reply as mail@rajivrago.com):
  Gmail "Send mail as" feature
    -> Resend SMTP relay (smtp.resend.com:587)
    -> Recipient sees "From: mail@rajivrago.com"
```

### Workstream B: Contact Section Simplification + UI/UX Animations (Code Changes)

This touches the React component layer only. No backend, no database, no edge functions.

```
Before:
  ContactSection -> ContactLinks + ContactForm
  ContactForm -> useContactForm -> Supabase -> contact-notify edge function -> Resend API

After:
  ContactSection -> ContactLinks (with mailto: as primary CTA)
  ContactForm: REMOVED
  useContactForm: REMOVED (or retained if keeping admin messages view)
```

## Component Boundaries

### Email Infrastructure Components (External)

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| Cloudflare DNS | MX + TXT (SPF/DKIM) records for rajivrago.com | Cloudflare Email Routing, mail senders (for SPF verification) |
| Cloudflare Email Routing | Receives mail at mail@rajivrago.com, forwards to Gmail | Gmail inbox (destination address) |
| Resend SMTP | Authenticates Gmail "Send mail as" relay requests | Gmail (as SMTP server), recipient mail servers |
| Resend DNS verification | DKIM signing for rajivrago.com via Resend | Recipient mail servers (for deliverability) |
| Gmail "Send mail as" | Sends outbound email through Resend SMTP as mail@rajivrago.com | Resend SMTP (smtp.resend.com:587) |

**Key boundary:** Cloudflare Email Routing and Resend SMTP are independent services. Cloudflare handles inbound, Resend handles outbound. They share the same domain but do not talk to each other.

### Contact Section Components (React)

| Component | Change | Communicates With |
|-----------|--------|-------------------|
| `ContactSection` | Simplify layout: remove grid, single column with links + mailto CTA | `ContactLinks` only |
| `ContactLinks` | Elevate mailto: link as primary action, keep social links | Profile data (props) |
| `ContactForm` | Remove entirely | N/A |
| `useContactForm` | Remove entirely | N/A |
| `contact-notify` edge function | Can be removed or retained for other use | N/A (orphaned if form removed) |
| `contact_messages` table | Orphaned; admin `MessagesAdmin` view becomes read-only archive | Supabase (existing data) |

**Key boundary:** The form removal is a subtraction. The only new code is updating `ContactSection` to not render `ContactForm` and adjusting layout classes.

### Animation Layer Components (React + CSS)

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `src/index.css` | Global keyframe definitions, scroll-reveal base styles | All animated components via CSS classes |
| `useScrollReveal` | IntersectionObserver-based visibility detection | Section components (provides `ref` + `isVisible`) |
| Section components | Apply animation classes based on `isVisible` | `useScrollReveal` (hook consumer) |
| Individual cards/elements | Hover microinteractions via Tailwind utility classes | CSS (self-contained) |

**Decision point: Framer Motion vs CSS-only.**

The site currently uses pure CSS animations with `IntersectionObserver`. This approach works well for the existing fade-up pattern. The question is whether the planned UI/UX overhaul (hover effects, micro-interactions, staggered reveals) justifies adding Framer Motion (~30KB gzipped).

**Recommendation: Start with CSS + extend `useScrollReveal`, add Motion only if needed.**

Rationale:
- The existing `useScrollReveal` pattern is clean and works
- CSS `transition` and `@keyframes` handle hover effects and simple entrance animations
- Staggered reveals can be done with CSS `animation-delay` and the existing IntersectionObserver
- Framer Motion's value is in layout animations, gesture-driven interactions, `AnimatePresence` for mount/unmount transitions, and spring physics -- none of which are described in the current requirements
- Adding a dependency for "hover effects and micro-interactions" is overengineering when Tailwind's `hover:`, `transition-*`, and `group-hover:` utilities already cover these cases

**If Framer Motion is added later:** The package is now called `motion` (not `framer-motion`) since v11+. Install via `npm install motion`. The API uses `<motion.div>` components. It is compatible with React 19. (MEDIUM confidence -- based on training data, verify package name and compatibility at install time.)

## Data Flow

### Email Routing Data Flow

```
INBOUND:
1. Someone sends email to mail@rajivrago.com
2. DNS MX records point to Cloudflare's mail servers
3. Cloudflare Email Routing rule: mail@rajivrago.com -> personal@gmail.com
4. Email arrives in Gmail inbox

OUTBOUND:
1. In Gmail, click "Compose" or "Reply"
2. Select "From: mail@rajivrago.com" in the sender dropdown
3. Gmail connects to smtp.resend.com:587 (TLS)
4. Authenticates with Resend API key
5. Resend relays the email, DKIM-signed for rajivrago.com
6. Recipient receives email from mail@rajivrago.com
```

No data touches the React application or Supabase. This is purely external service orchestration.

### Contact Section Data Flow (After Simplification)

```
BEFORE (7 steps):
  User fills form -> Zod validation -> honeypot check -> rate limit check
  -> Supabase INSERT -> database webhook -> edge function -> Resend API -> owner email

AFTER (1 step):
  User clicks mailto: link -> email client opens with pre-filled "To" address
```

The entire Supabase contact pipeline becomes unnecessary. The `contact_messages` table and `MessagesAdmin` view can be retained as a read-only archive of past messages, or removed in a cleanup phase.

### Animation Data Flow

```
Page load:
1. PortfolioPage renders section components
2. Each section calls useScrollReveal() -> creates IntersectionObserver
3. Section starts with opacity:0, translateY(24px) via .scroll-reveal class
4. User scrolls -> IntersectionObserver fires -> isVisible = true
5. .is-visible class applied -> CSS fade-up animation plays (0.6s ease-out)
6. Observer disconnects (one-shot)

Hover interactions (existing + enhanced):
1. User hovers over interactive element (card, link, button)
2. CSS transition utilities handle property changes (transform, shadow, color, background)
3. No JavaScript involved
```

For enhanced animations (staggered children, per-card delays), the flow extends:

```
Staggered reveal:
1. Parent section becomes visible via useScrollReveal
2. Parent passes isVisible to children (or children observe themselves)
3. Each child has animation-delay based on index: style={{ animationDelay: `${index * 100}ms` }}
4. CSS handles the rest
```

## Patterns to Follow

### Pattern 1: CSS-First Animation with Progressive Enhancement

**What:** Use CSS transitions and keyframes as the base, only add JS animation libraries for behaviors CSS cannot express.

**When:** Always start here. Escalate to Motion library only for layout animations, gesture handling, or spring physics.

**Example (staggered card reveal):**
```typescript
// In a section component
{items.map((item, index) => (
  <div
    key={item.id}
    className={`scroll-reveal ${isVisible ? 'is-visible' : ''}`}
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <Card item={item} />
  </div>
))}
```

```css
/* In index.css -- already exists, just needs delay support */
.scroll-reveal.is-visible {
  animation: fade-up 0.6s ease-out forwards;
  /* animation-delay set inline via style prop */
}
```

### Pattern 2: Tailwind Utility Hover Microinteractions

**What:** Use Tailwind's built-in transition and transform utilities for hover effects. No custom CSS needed.

**When:** Hover states on cards, buttons, links, tags.

**Example (enhanced project card):**
```typescript
<div className="transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/10 hover:border-accent">
```

Already partially implemented in `ProjectCard`. Extend to `ExperienceCard`, `BlogPostCard`, `ContactLinks` items.

### Pattern 3: Configuration-as-Documentation for Email Setup

**What:** Since email infrastructure is pure configuration (no code), the "architecture" is a setup guide. Document the exact DNS records, service settings, and verification steps.

**When:** For this milestone's email workstream.

**Structure:**
```
docs/setup/
  email-routing.md    # Cloudflare Email Routing setup steps
  resend-smtp.md      # Resend SMTP + Gmail "Send mail as" setup steps
```

Or inline in a single setup guide as specified in PROJECT.md's active requirements.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Keeping the Contact Form "Just in Case"

**What:** Leaving `ContactForm` and `useContactForm` in the codebase but hidden, thinking it might be useful later.

**Why bad:** Dead code accumulates. The Supabase edge function, database webhook, and table become orphaned infrastructure that still needs maintenance. The `useContactForm` hook imports Supabase client, Zod, react-hook-form -- all unused.

**Instead:** Remove `ContactForm`, `useContactForm`, and the `ContactForm` import from `ContactSection`. If the `contact-notify` edge function and webhook are no longer needed, document that they can be removed. Keep `MessagesAdmin` if you want to read historical messages, but stop accepting new ones.

### Anti-Pattern 2: Adding Framer Motion for Simple Transitions

**What:** Installing `motion` (Framer Motion) to achieve hover effects, fade-ins, or staggered reveals that CSS handles natively.

**Why bad:** Adds ~30KB to bundle, introduces a new API surface to learn and maintain, creates inconsistency between CSS-animated and Motion-animated components. The existing `useScrollReveal` + CSS keyframes pattern is simpler and faster.

**Instead:** Exhaust CSS capabilities first. The threshold for adding Motion should be: "I need layout animations (shared layout), exit animations (AnimatePresence for unmounting), or spring physics (drag, gestures)." None of the current requirements hit that threshold.

### Anti-Pattern 3: Mixing Email Sending Paths

**What:** Keeping the Resend API edge function for contact notifications AND setting up Resend SMTP for Gmail "Send mail as," potentially with overlapping DKIM/SPF records.

**Why bad:** Two separate Resend integrations for different purposes creates confusion. The edge function uses Resend's HTTP API with an API key; Gmail uses Resend's SMTP with different credentials. If one breaks, debugging is harder because the configurations are entangled.

**Instead:** If the contact form is removed, the edge function is no longer needed. Resend's role simplifies to SMTP relay only. One integration, one purpose.

## Suggested Build Order

The two workstreams are independent, but within each there is a natural order.

### Phase 1: Email Infrastructure (no code, all configuration)

Order matters because DNS propagation takes time and each step depends on the previous.

```
Step 1: Cloudflare Email Routing
  - Add email routing rule: mail@rajivrago.com -> personal Gmail
  - Cloudflare auto-configures MX and SPF records
  - Verify by sending a test email to mail@rajivrago.com
  Depends on: Cloudflare managing rajivrago.com DNS (already true)

Step 2: Resend domain verification
  - Add rajivrago.com as a sending domain in Resend dashboard
  - Add DKIM records (3 CNAME records) to Cloudflare DNS
  - Wait for verification (usually minutes, can take hours)
  Depends on: Resend account (already exists -- used for contact-notify edge function)

Step 3: Gmail "Send mail as" configuration
  - In Gmail Settings > Accounts > "Send mail as" > Add another email
  - SMTP server: smtp.resend.com
  - Port: 587 (TLS) or 465 (SSL)
  - Username: resend
  - Password: Resend API key (re_xxxx)
  - Verify via confirmation email (arrives via Cloudflare Email Routing from Step 1)
  Depends on: Steps 1 and 2 both complete
```

### Phase 2: Contact Section Simplification (small code change)

```
Step 1: Update ContactSection
  - Remove ContactForm import and rendering
  - Adjust layout from 2-column grid to single column
  - Update descriptive text (remove "use the form" language)
  Depends on: Nothing (can be done in parallel with Phase 1)

Step 2: Clean up orphaned code
  - Delete src/components/public/ContactForm.tsx
  - Delete src/hooks/useContactForm.ts
  - Optionally remove contact-notify edge function and webhook
  - Keep MessagesAdmin for historical message viewing
  Depends on: Step 1

Step 3: Update ContactLinks styling
  - Make mailto: link visually prominent as primary CTA
  - Possibly add a brief call-to-action paragraph above the links
  Depends on: Step 1
```

### Phase 3: UI/UX Animation Polish (code changes)

This should come after the contact simplification so the animation work applies to the final component structure.

```
Step 1: Enhance scroll-reveal with stagger support
  - Extend useScrollReveal or create useStaggerReveal for child animations
  - Add animation-delay support to .scroll-reveal CSS
  - Apply to ProjectsSection cards, ExperienceSection cards, BlogSection cards
  Depends on: Nothing

Step 2: Add hover microinteractions across all interactive elements
  - Standardize hover patterns on cards (lift + shadow + border color)
  - Add hover effects to tag pills, nav links, footer links
  - Use Tailwind transition utilities (no custom CSS)
  Depends on: Nothing

Step 3: Hero section polish
  - Remove avatar container/shadow per PROJECT.md requirement
  - Consider subtle entrance animation for text elements (typed effect or stagger)
  - Note: avatar entrance animation is explicitly out of scope
  Depends on: Nothing

Step 4: Section visual differentiation
  - Address "flat sections" concern from PROJECT.md
  - Options: alternating background colors, subtle dividers, varying layouts
  - This is primarily a design/CSS task, not an architecture concern
  Depends on: Steps 1-3 complete for consistent animation baseline
```

### Dependency Graph

```
Email Routing (Phase 1)    Contact Simplification (Phase 2)    UI/UX Polish (Phase 3)
       |                            |                                  |
  [CF Email Routing]          [Update ContactSection]           [Stagger reveals]
       |                            |                           [Hover effects]
  [Resend domain verify]     [Clean up dead code]              [Hero polish]
       |                            |                                  |
  [Gmail Send-As]            [Style ContactLinks]              [Section differentiation]
       |                            |                                  |
       v                            v                                  v
  (Independent)              (Independent)                     (Depends on Phase 2
                                                                for final component
                                                                structure)
```

Phase 1 and Phase 2 can run in parallel. Phase 3 should follow Phase 2.

## Scalability Considerations

Not applicable for this milestone. This is a static portfolio site with no scaling concerns. Email routing handles individual emails; UI animations are client-side CSS.

## Sources

- Codebase analysis: `src/hooks/useScrollReveal.ts`, `src/hooks/useContactForm.ts`, `src/components/public/ContactSection.tsx`, `src/components/public/ContactForm.tsx`, `src/components/public/ContactLinks.tsx`, `src/components/public/ProjectCard.tsx`, `src/index.css`
- Architecture context: `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/STRUCTURE.md`
- Project requirements: `.planning/PROJECT.md`
- Cloudflare Email Routing, Resend SMTP, Motion library: Training data (MEDIUM confidence -- unable to verify against live documentation during this session)

---

*Architecture research: 2026-03-05*
