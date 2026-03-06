---
phase: 3
slug: ui-ux-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-06
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.0 + React Testing Library 16.3 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 0 | UIUX-01 | unit | `npx vitest run src/components/public/__tests__/HeroSection.test.tsx -x` | No - W0 | pending |
| 03-01-02 | 01 | 0 | UIUX-02 | unit | `npx vitest run src/components/public/__tests__/HoverInteractions.test.tsx -x` | No - W0 | pending |
| 03-01-03 | 01 | 0 | UIUX-03 | unit | `npx vitest run src/components/public/__tests__/StaggerAnimation.test.tsx -x` | No - W0 | pending |
| 03-01-04 | 01 | 0 | UIUX-04 | unit | `npx vitest run src/pages/__tests__/PortfolioPage.test.tsx -x` | No - W0 | pending |
| 03-01-05 | 01 | 0 | ALL | unit | `npx vitest run src/__tests__/ReducedMotion.test.tsx -x` | No - W0 | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `src/components/public/__tests__/HeroSection.test.tsx` — covers UIUX-01: avatar renders as raw img without wrapper, no shadow, correct size
- [ ] `src/components/public/__tests__/HoverInteractions.test.tsx` — covers UIUX-02: hover classes on BlogPostCard, animated-underline on Navbar links, resume button lift
- [ ] `src/components/public/__tests__/StaggerAnimation.test.tsx` — covers UIUX-03: stagger-item class and --stagger-index CSS variable on card wrappers
- [ ] `src/pages/__tests__/PortfolioPage.test.tsx` — covers UIUX-04: divider elements between sections

*Note: CSS animation behavior cannot be tested in jsdom. Tests verify correct classes and attributes.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Stagger animation timing feels smooth | UIUX-03 | CSS animation timing not observable in jsdom | Open browser, scroll to project cards, verify 80ms stagger delay between items |
| Animated underline slides in on hover | UIUX-02 | ::after pseudo-element hover not testable in jsdom | Hover over navbar links, verify underline slides from left to right |
| Pixel art renders crisp at 170px | UIUX-01 | imageRendering requires real browser rendering | View hero avatar in browser, verify no blurring |
| prefers-reduced-motion disables animations | ALL | Requires real media query evaluation | Enable reduced motion in OS settings, reload page, verify no animations |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
