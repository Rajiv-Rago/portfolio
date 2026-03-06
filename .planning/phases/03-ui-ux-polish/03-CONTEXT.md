# Phase 3: UI/UX Polish - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Add micro-interactions, staggered animations, and visual section differentiation across the portfolio. The hero avatar gets cleaned up to show raw pixel art. All animations respect prefers-reduced-motion. CSS-first approach only — no motion libraries.

</domain>

<decisions>
## Implementation Decisions

### Hero avatar cleanup
- Remove the container div wrapper entirely — no shadow, no rounded corners, no overflow hidden
- Raw `<img>` with `imageRendering: pixelated`, no decoration
- Increase size from 130x130 to 160-180px for more visual impact without the container's visual weight
- Strip the hero section's outer container styling too (remove p-12, rounded-xl, mx-12) — let content breathe with just centering and spacing

### Staggered entrance animations
- Quick cascade timing: ~80-100ms delay between each item
- Animation style: fade-up (same translateY + opacity as existing scroll-reveal)
- Applies to: project cards, experience timeline cards, blog post cards
- Does NOT apply to: contact section items
- All cards visible within ~0.5s of section entering viewport

### Section visual differentiation
- Uniform spacing between all sections (no varied gaps)
- Dividers between sections to create visual rhythm
- No alternating backgrounds — keep uniform white
- Divider style and hero-to-first-section gap: Claude's discretion

### Hover micro-interactions
- Blog post cards: match existing ProjectCard/ExperienceCard hover pattern (translate-y lift + shadow + accent border)
- Navbar links: animated underline that slides in on hover
- Resume download button: enhanced hover (darken bg + subtle lift)
- Email CTA and copy button: enhanced hover treatment
- Footer links: hover effects consistent with navbar treatment
- Existing ProjectCard and ExperienceCard hover effects are already good — no changes needed

### Claude's Discretion
- Hero section vibe/accent touches after stripping container
- Exact avatar size within 160-180px range
- Section heading animation timing relative to card stagger (heading first vs all together)
- Divider style (thin accent line, full-width border, or other)
- Hero-to-first-section gap (same as others or larger)
- Exact hover animation curves and durations
- Footer hover style details

</decisions>

<specifics>
## Specific Ideas

- Quick cascade stagger should feel snappy and modern, not slow and dramatic
- Heading underline styling already exists on section headers (accent-colored bar) — dividers should complement this
- Pixel art avatar should be the raw image with hard edges showing — that's the aesthetic

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useScrollReveal` hook (`src/hooks/useScrollReveal.ts`): IntersectionObserver-based, already handles prefers-reduced-motion. Needs extension or new hook for per-item stagger delay
- `scroll-reveal` / `is-visible` CSS classes (`src/index.css`): fade-up keyframe animation. Stagger can build on this pattern with CSS animation-delay
- `Button` component: already has `transition-colors` — enhance hover
- Existing card hover patterns: `hover:-translate-y-1 hover:shadow-lg hover:shadow-text/5 hover:border-accent` on ProjectCard

### Established Patterns
- Tailwind CSS v4 with custom theme tokens (text-accent, bg-surface, border-border, etc.)
- `prefers-reduced-motion: reduce` media queries in index.css disable animations
- Section components use `useScrollReveal` and apply `scroll-reveal ${isVisible ? 'is-visible' : ''}` classes
- No path aliases — all relative imports

### Integration Points
- `HeroSection.tsx`: avatar wrapper div and section container styling to remove
- `ProjectsSection.tsx`, `ExperienceSection.tsx`, `BlogSection.tsx`: need stagger logic added to child items
- `BlogPostCard.tsx`: needs hover classes added
- `Navbar.tsx`: nav links need animated underline
- `Footer.tsx`: links need hover effects
- `ContactSection.tsx` / `EmailCTA.tsx`: CTA hover enhancement
- `PortfolioPage.tsx`: section wrapper may need divider elements between sections
- `src/index.css`: new CSS keyframes/classes for stagger animation-delay

</code_context>

<deferred>
## Deferred Ideas

- Hero avatar entrance animation (pixel art assembles or fades in) — tracked as ANIM-01 in v2 requirements

</deferred>

---

*Phase: 03-ui-ux-polish*
*Context gathered: 2026-03-06*
