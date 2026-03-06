# Phase 3: UI/UX Polish - Research

**Researched:** 2026-03-06
**Domain:** CSS animations, micro-interactions, Tailwind CSS v4
**Confidence:** HIGH

## Summary

Phase 3 is a CSS-first animation and polish phase. The existing codebase already has a working `useScrollReveal` hook with `prefers-reduced-motion` support, a `fade-up` keyframe animation, and consistent card hover patterns on ProjectCard and ExperienceCard. The work is extending these established patterns to new components (BlogPostCard, Navbar links, Footer, EmailCTA, Button) and adding staggered entrance timing for card grids.

The key technical challenge is implementing staggered animation-delay on child items within sections that already use `useScrollReveal` for section-level visibility. The recommended approach uses CSS custom properties (`--stagger-index`) set via inline style on each item, with a CSS rule that calculates `animation-delay` from the index. This is pure CSS, no motion libraries, and Tailwind v4 compatible.

**Primary recommendation:** Extend the existing `useScrollReveal` hook (or create a parallel `useStaggerReveal` hook) to observe a container and expose per-child stagger indexes. Use CSS `animation-delay: calc(var(--stagger-index) * 80ms)` on child items. All other work is Tailwind utility class additions.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Hero avatar: Remove container div wrapper entirely -- no shadow, no rounded corners, no overflow hidden. Raw `<img>` with `imageRendering: pixelated`. Increase size to 160-180px. Strip hero section's outer container styling (remove p-12, rounded-xl, mx-12).
- Stagger: ~80-100ms delay between items, fade-up style (same as existing scroll-reveal), applies to project cards, experience timeline cards, blog post cards. Does NOT apply to contact section. All cards visible within ~0.5s.
- Section differentiation: Uniform spacing, dividers between sections, NO alternating backgrounds -- keep uniform white.
- Blog post cards: Match existing ProjectCard/ExperienceCard hover pattern (translate-y lift + shadow + accent border).
- Navbar links: Animated underline that slides in on hover.
- Resume download button: Enhanced hover (darken bg + subtle lift).
- Email CTA and copy button: Enhanced hover treatment.
- Footer links: Hover effects consistent with navbar treatment.
- Existing ProjectCard and ExperienceCard hover effects: No changes.
- CSS-first approach only -- no motion libraries.

### Claude's Discretion
- Hero section vibe/accent touches after stripping container
- Exact avatar size within 160-180px range
- Section heading animation timing relative to card stagger (heading first vs all together)
- Divider style (thin accent line, full-width border, or other)
- Hero-to-first-section gap (same as others or larger)
- Exact hover animation curves and durations
- Footer hover style details

### Deferred Ideas (OUT OF SCOPE)
- Hero avatar entrance animation (pixel art assembles or fades in) -- tracked as ANIM-01 in v2 requirements
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| UIUX-01 | Hero avatar displays as clean pixel art without container or shadow | Remove wrapper div, strip section container classes, increase img size. Straightforward Tailwind class removal. |
| UIUX-02 | Hover micro-interactions on cards, links, and buttons | BlogPostCard needs existing hover pattern added. Navbar needs CSS ::after underline. Resume button, EmailCTA, copy button, footer links need hover enhancements. All achievable with Tailwind utilities + one CSS class for animated underline. |
| UIUX-03 | Staggered entrance animations on cards and list items | New `useStaggerReveal` hook or extension of `useScrollReveal`. CSS custom property `--stagger-index` on each child. CSS `animation-delay` calculation. Applies to ProjectsSection, ExperienceSection, BlogSection only. |
| UIUX-04 | Visual section differentiation with dividers, spacing, and rhythm | Add divider elements between sections in PortfolioPage.tsx. Uniform spacing already exists (mb-20). Divider can be a thin accent-colored `<hr>` or border element. |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | v4.2 | Utility-first styling | Already used throughout, v4 supports @utility and arbitrary properties |
| React | v19.2 | Component framework | Already in use |
| Vitest | v4.0 | Test framework | Already configured with jsdom + React Testing Library |

### Supporting (already installed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @testing-library/react | v16.3 | Component testing | Testing hover states and class application |
| lucide-react | v0.575 | Icons | Already used for icons |

### No New Dependencies Needed
This phase requires zero new dependencies. All work is CSS/Tailwind class changes and minor React hook additions.

## Architecture Patterns

### Files to Modify

```
src/
  hooks/
    useScrollReveal.ts       # Extend or create useStaggerReveal alongside it
  index.css                  # Add stagger-item class, animated-underline class
  components/
    public/
      HeroSection.tsx        # Strip wrapper, resize avatar, simplify section
      BlogPostCard.tsx        # Add hover classes (already done on ProjectCard)
      ProjectsSection.tsx     # Add stagger indexes to children
      ExperienceSection.tsx   # Add stagger indexes to children
      BlogSection.tsx         # Add stagger indexes to children
      ContactSection.tsx      # NO stagger (per user decision)
      EmailCTA.tsx            # Enhanced hover on mailto link and copy button
    layout/
      Navbar.tsx             # Animated underline on nav links
      Footer.tsx             # Hover effects on icon links
    ui/
      Button.tsx             # (Optional) Add hover:translate-y for resume btn
  pages/
    PortfolioPage.tsx        # Add divider elements between sections
```

### Pattern 1: Staggered Animation via CSS Custom Properties
**What:** Each child item receives `style={{ '--stagger-index': index } as React.CSSProperties}` and a CSS class that uses `animation-delay: calc(var(--stagger-index) * 80ms)`.
**When to use:** When a container becomes visible (via IntersectionObserver) and its children should animate in sequentially.

**CSS (add to index.css):**
```css
.stagger-item {
  opacity: 0;
  transform: translateY(24px);
}

.stagger-item.is-visible {
  animation: fade-up 0.6s ease-out forwards;
  animation-delay: calc(var(--stagger-index, 0) * 80ms);
}

@media (prefers-reduced-motion: reduce) {
  .stagger-item { opacity: 1; transform: none; }
  .stagger-item.is-visible { animation: none; }
}
```

**React usage:**
```tsx
// In ProjectsSection.tsx (and similar)
const { ref, isVisible } = useScrollReveal<HTMLElement>()

{projects.map((project, index) => (
  <div
    key={project.id}
    className={`stagger-item ${isVisible ? 'is-visible' : ''}`}
    style={{ '--stagger-index': index } as React.CSSProperties}
  >
    <ProjectCard project={project} />
  </div>
))}
```

This pattern reuses the existing `fade-up` keyframe already defined in index.css and the existing `useScrollReveal` hook. The section-level observer triggers visibility for all children simultaneously, but CSS `animation-delay` creates the stagger effect. No new hook is strictly needed -- the existing `useScrollReveal` already returns `isVisible` which is applied to each child's class.

### Pattern 2: Animated Underline via ::after Pseudo-element
**What:** A sliding underline that grows from left to right on hover using CSS transforms.
**When to use:** Navbar links and footer links.

**CSS (add to index.css):**
```css
.animated-underline {
  position: relative;
  display: inline-block;
}

.animated-underline::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: var(--color-accent);
  transform: scaleX(0);
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

.animated-underline:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

@media (prefers-reduced-motion: reduce) {
  .animated-underline::after { transition: none; }
}
```

**Source:** [30 Seconds of Code - Hover Underline Animation](https://www.30secondsofcode.org/css/s/hover-underline-animation/)

### Pattern 3: Section Dividers
**What:** Thin horizontal dividers between sections to create visual rhythm.
**When to use:** Between each section in PortfolioPage.tsx.

**Implementation approach:**
```tsx
// In PortfolioPage.tsx
function SectionDivider() {
  return (
    <div className="max-w-[1000px] mx-auto px-12 max-md:px-6">
      <hr className="border-t border-border" />
    </div>
  )
}

// Usage between sections:
<HeroSection profile={profile} />
<SectionDivider />
<ProjectsSection projects={projects} />
<SectionDivider />
<ExperienceSection experience={experience} />
// etc.
```

The divider uses the existing `border-border` theme color and matches the max-width/padding of section content. This complements the existing accent-colored underline bars on section headings without competing with them.

### Anti-Patterns to Avoid
- **Wrapping each card in its own IntersectionObserver:** Wasteful -- one observer per section is enough. The section visibility triggers stagger on all children via CSS delay.
- **Using JavaScript setTimeout for stagger delays:** Fragile, harder to maintain, doesn't respect `prefers-reduced-motion` as cleanly as CSS.
- **Adding Framer Motion or any motion library:** Explicitly out of scope per REQUIREMENTS.md. CSS handles all needed effects.
- **Applying stagger to contact section:** User explicitly said no stagger on contact items.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-triggered visibility | Custom scroll listeners | Existing `useScrollReveal` hook | Already handles IntersectionObserver + prefers-reduced-motion |
| Stagger timing | JS setTimeout chains | CSS `animation-delay` with custom properties | Declarative, respects reduced-motion, no JS timing issues |
| Animated underline | JS hover event handlers | CSS `::after` + `transform: scaleX()` | Pure CSS, hardware-accelerated, zero JS |
| Reduced motion handling | Per-component checks | `@media (prefers-reduced-motion: reduce)` in CSS | Already established pattern in index.css |

**Key insight:** Every animation in this phase can be achieved with CSS alone. The only React changes are adding class names and inline style attributes for stagger indexes.

## Common Pitfalls

### Pitfall 1: Forgetting prefers-reduced-motion on new animations
**What goes wrong:** New stagger and underline animations play for users who have reduced motion enabled.
**Why it happens:** Easy to add new CSS animations and forget the media query override.
**How to avoid:** Every new animation class in index.css must have a corresponding `@media (prefers-reduced-motion: reduce)` rule that disables it. The existing codebase already does this consistently.
**Warning signs:** Any animation class without a reduced-motion override.

### Pitfall 2: Stagger delay causing items to remain invisible too long
**What goes wrong:** With many items and long delays, the last item takes several seconds to appear.
**Why it happens:** 6 items * 200ms = 1.2s total delay before last item even starts animating.
**How to avoid:** Keep delay to 80ms. With 5-6 items: last item starts at 400-480ms, finishes by ~1s. User specified "all visible within ~0.5s" -- with 80ms delay and 0.6s animation, a 5-item grid completes at 0.92s total. Consider capping at 5-6 items or reducing delay slightly.
**Warning signs:** Total stagger time (count * delay) exceeding 500ms.

### Pitfall 3: Stagger wrapper breaking grid layout
**What goes wrong:** Wrapping each card in a stagger `<div>` can break CSS grid behavior (grid expects direct children).
**Why it happens:** Adding an intermediate div between the grid container and the card component.
**How to avoid:** Apply stagger classes directly to the card's root element, or apply them to the wrapper div that also receives grid sizing. For ProjectCard, the wrapping div must also carry grid-spanning classes.
**Warning signs:** Cards not spanning correctly, grid gaps looking wrong.

### Pitfall 4: Avatar imageRendering not taking effect
**What goes wrong:** Pixel art looks blurry despite `imageRendering: pixelated`.
**Why it happens:** Browser needs the image displayed at an integer multiple of its native resolution. Odd sizes or CSS transform/filter can interfere.
**How to avoid:** Set explicit width/height on the img element matching the desired display size. Avoid transform scale on the avatar.
**Warning signs:** Blurry pixel art edges.

### Pitfall 5: Animated underline clipping on navbar
**What goes wrong:** The `::after` pseudo-element underline is invisible or clipped.
**Why it happens:** Parent element has `overflow: hidden` or the link needs `position: relative` and `display: inline-block`.
**How to avoid:** Ensure the nav link has `relative inline-block` positioning. Check navbar container doesn't clip overflow.
**Warning signs:** Underline doesn't appear on hover despite correct CSS.

## Code Examples

### Hero Section Cleanup (UIUX-01)

Current hero has nested wrappers. After cleanup:

```tsx
// Simplified HeroSection structure
<div ref={ref} className={`scroll-reveal ${isVisible ? 'is-visible' : ''}`}>
  <div className="mt-8 mb-16 flex flex-col items-center text-center max-md:px-4">
    <img
      src="/me.png"
      alt={`${profile.name}'s avatar`}
      className="mb-4"
      style={{ imageRendering: 'pixelated' }}
      width={170}
      height={170}
    />
    {/* Text content unchanged */}
  </div>
</div>
```

Key changes: Remove the inner container's `mx-12 p-12 rounded-[--radius-xl] overflow-hidden`. Remove the avatar wrapper div with its `shadow-lg rounded-[--radius-xl] overflow-hidden`. Raw `<img>` with explicit dimensions (170px recommended -- center of 160-180 range).

### BlogPostCard Hover Enhancement (UIUX-02)

BlogPostCard already has `hover:-translate-y-1 hover:shadow-lg hover:shadow-text/5 hover:border-accent` on its root div. Checking the actual code -- yes, it already has this exact pattern. No changes needed for BlogPostCard hover since it already matches ProjectCard.

Wait -- re-reading the CONTEXT.md: "Blog post cards: match existing ProjectCard/ExperienceCard hover pattern (translate-y lift + shadow + accent border)". Looking at the current BlogPostCard code, it already has `transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-text/5 hover:border-accent`. This is already implemented. The planner should verify this and skip if already correct.

### Navbar Animated Underline (UIUX-02)

```tsx
// In Navbar.tsx desktop links
<a
  href={`#${s.id}`}
  className={`text-sm font-medium transition-colors animated-underline ${
    activeId === s.id ? 'text-accent' : 'text-muted hover:text-accent'
  }`}
>
  {s.label}
</a>
```

### Resume Button Enhanced Hover (UIUX-02)

Current: `hover:bg-accent-dark transition-colors`
Enhanced: `hover:bg-accent-dark hover:-translate-y-0.5 transition-all`

### Stagger on ProjectsSection (UIUX-03)

```tsx
<div className={getGridClass(projects.length)}>
  {projects.map((project, index) => (
    <div
      key={project.id}
      className={`stagger-item ${isVisible ? 'is-visible' : ''} ${
        project.is_featured && allowFeaturedSpan ? 'col-span-2 max-md:col-span-1' : ''
      }`}
      style={{ '--stagger-index': index } as React.CSSProperties}
    >
      <ProjectCard project={project} allowFeaturedSpan={false} />
    </div>
  ))}
</div>
```

Note: The featured span class must be on the stagger wrapper (not inside ProjectCard) to maintain grid layout. Pass `allowFeaturedSpan={false}` to ProjectCard since the wrapper handles spanning.

### Section Dividers in PortfolioPage (UIUX-04)

```tsx
<main>
  <HeroSection profile={profile} />
  <SectionDivider />
  <ProjectsSection projects={projects} />
  <SectionDivider />
  <ExperienceSection experience={experience} />
  <SectionDivider />
  <BlogSection posts={posts} />
  <SectionDivider />
  <ContactSection profile={profile} />
</main>
```

The divider should only render between non-empty sections. May need conditional rendering.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JS-based animation libraries (GSAP, Framer Motion) | CSS animations + IntersectionObserver | 2023-2024 | For simple animations, CSS is sufficient and more performant |
| nth-child CSS selectors for stagger | CSS custom properties (--index) | 2022+ | Scalable to any number of items without hardcoded selectors |
| text-decoration for underlines | ::after pseudo-element | Longstanding | Full control over animation, thickness, color, position |
| Tailwind v3 plugins for animation-delay | Tailwind v4 @utility or inline style with custom property | 2024-2025 | v4's @utility makes custom utilities cleaner, but inline --stagger-index is simpler |

**Deprecated/outdated:**
- Tailwind v3 animation-delay plugins (e.g., `tailwindcss-animation-delay`): Not needed in v4, use CSS custom properties instead
- `@apply` for complex animations: Better to write actual CSS rules in index.css for multi-property animation classes

## Open Questions

1. **Grid spanning with stagger wrappers**
   - What we know: ProjectCard uses `col-span-2` for featured projects. Adding a wrapper div for stagger classes means the span must move to the wrapper.
   - What's unclear: Whether removing `allowFeaturedSpan` from ProjectCard's internal logic and moving it to the wrapper creates any visual regression.
   - Recommendation: Test visually after implementation. The wrapper approach should work since grid layout operates on direct children.

2. **Heading animation timing relative to card stagger**
   - What we know: Section headings are currently part of the section's scroll-reveal (they animate in with the section). Cards would stagger after the section becomes visible.
   - What's unclear: Whether headings should animate before the stagger starts, or simultaneously.
   - Recommendation: Keep headings as part of section scroll-reveal (they appear instantly when section enters viewport). Stagger items animate after with their delays. This naturally creates a "heading first, then cards cascade" effect since stagger-item has its own opacity:0 initial state.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.0 + React Testing Library 16.3 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| UIUX-01 | Hero avatar renders without wrapper/shadow/container | unit | `npx vitest run src/components/public/__tests__/HeroSection.test.tsx -x` | No - Wave 0 |
| UIUX-02 | Hover classes present on interactive elements | unit | `npx vitest run src/components/public/__tests__/HoverInteractions.test.tsx -x` | No - Wave 0 |
| UIUX-03 | Stagger items have correct CSS custom properties and classes | unit | `npx vitest run src/components/public/__tests__/StaggerAnimation.test.tsx -x` | No - Wave 0 |
| UIUX-04 | Section dividers render between sections | unit | `npx vitest run src/pages/__tests__/PortfolioPage.test.tsx -x` | No - Wave 0 |
| ALL | Animations disabled with prefers-reduced-motion | unit | `npx vitest run src/__tests__/ReducedMotion.test.tsx -x` | No - Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/components/public/__tests__/HeroSection.test.tsx` -- covers UIUX-01: avatar renders as raw img without wrapper div, no shadow classes, correct size
- [ ] `src/components/public/__tests__/HoverInteractions.test.tsx` -- covers UIUX-02: verify hover classes on BlogPostCard, Navbar links have animated-underline class, resume button has lift class
- [ ] `src/components/public/__tests__/StaggerAnimation.test.tsx` -- covers UIUX-03: stagger-item class and --stagger-index CSS variable present on card wrappers
- [ ] `src/pages/__tests__/PortfolioPage.test.tsx` -- covers UIUX-04: divider elements render between sections
- [ ] CSS classes (`stagger-item`, `animated-underline`) in `index.css` -- covers UIUX-03/UIUX-02: verified by snapshot or class existence tests

Note: CSS animation behavior (actual visual animation, timing, etc.) cannot be tested in jsdom. Tests verify correct classes and attributes are applied. Visual verification requires manual browser testing.

## Sources

### Primary (HIGH confidence)
- Existing codebase analysis -- `useScrollReveal.ts`, `index.css`, all component files read directly
- [Tailwind CSS v4 docs - Adding Custom Styles](https://tailwindcss.com/docs/adding-custom-styles) -- @utility syntax, arbitrary properties

### Secondary (MEDIUM confidence)
- [Cloud Four - Staggered Animations with CSS Custom Properties](https://cloudfour.com/thinks/staggered-animations-with-css-custom-properties/) -- CSS custom property stagger pattern
- [30 Seconds of Code - Hover Underline Animation](https://www.30secondsofcode.org/css/s/hover-underline-animation/) -- ::after scaleX underline technique
- [Blurp Tech - Animation Delay in Tailwind v4](https://blurp.dev/blog/tailwind-animation-delay-property) -- @utility anim-delay pattern (not needed, using inline custom properties instead)

### Tertiary (LOW confidence)
- None -- all findings verified against codebase and official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries, all changes use existing tools
- Architecture: HIGH -- patterns verified against existing codebase structure, CSS techniques well-documented
- Pitfalls: HIGH -- derived from direct code analysis (grid spanning, reduced-motion, stagger timing)

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (stable CSS techniques, unlikely to change)
