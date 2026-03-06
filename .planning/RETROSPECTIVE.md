# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Portfolio MVP

**Shipped:** 2026-03-06
**Phases:** 3 | **Plans:** 6 | **Tasks:** 13

### What Was Built
- Email infrastructure: Cloudflare Email Routing + Resend SMTP with full DNS authentication
- Contact simplification: EmailCTA component with mailto link and copy-to-clipboard
- UI/UX polish: hover micro-interactions, stagger entrance animations, section dividers, clean pixel art hero

### What Worked
- Sequential phase dependencies enforced clean execution order (email -> contact -> animations)
- TDD approach for EmailCTA: 6 failing tests written first, then implementation made them pass
- CSS-first animation strategy kept bundle size zero and avoided library dependency
- Setup guide approach for manual infrastructure work (docs/email-setup.md)

### What Was Inefficient
- ROADMAP.md Phase 3 checkbox and progress table were not updated after execution (showed `[ ]` and `0/2` despite being complete)
- Nyquist validation was partial across all phases — validation files existed but none completed the full process

### Patterns Established
- Test fixture factories (makeProfile, makeProject, etc.) with Partial<T> overrides
- CSS animation pattern: `.class` for initial state, `.class.is-visible` for animated state, `@media reduced-motion` to disable
- Stagger wrapper pattern: div.stagger-item with --stagger-index CSS variable, useScrollReveal toggles is-visible
- Copy-to-clipboard with navigator.clipboard.writeText and textarea fallback
- Infrastructure setup guides in docs/ for manual dashboard configuration

### Key Lessons
1. Phase execution should auto-update ROADMAP.md checkboxes and progress table to avoid stale state
2. CSS-only animations are sufficient for portfolio-level interactivity — no need for Framer Motion
3. Resend SPF on send subdomain avoids DNS conflicts with Cloudflare root domain MX

### Cost Observations
- Model mix: primarily opus (quality profile)
- Sessions: ~5 sessions across 11 days
- Notable: most plans executed in 2-5 minutes each

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| v1.0 | 3 | 6 | First milestone — established TDD, CSS animation, and infrastructure guide patterns |

### Cumulative Quality

| Milestone | Tests | Test Files | Zero-Dep Additions |
|-----------|-------|------------|-------------------|
| v1.0 | 43 | 6 | 2 (CSS animations, clipboard API) |

### Top Lessons (Verified Across Milestones)

1. Sequential phase dependencies prevent integration issues (verified in v1.0: email -> contact -> polish)
2. TDD with failing tests first catches mock issues early (verified in v1.0: clipboard mock fix)
