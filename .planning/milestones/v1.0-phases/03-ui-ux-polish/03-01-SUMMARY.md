---
phase: 03-ui-ux-polish
plan: 01
subsystem: ui
tags: [css, animations, tailwind, pixel-art, hero, test-fixtures]

requires:
  - phase: 02-contact-simplification
    provides: Component structure that animations target
provides:
  - stagger-item CSS class with fade-up animation and CSS custom property delay
  - animated-underline CSS class with ::after pseudo-element hover effect
  - prefers-reduced-motion overrides for all new animation classes
  - Simplified HeroSection with raw pixel art avatar at 170px
  - Test fixture factory functions for Profile, Project, BlogPost, Experience
affects: [03-02-PLAN]

tech-stack:
  added: []
  patterns: [CSS custom property animation-delay, ::after pseudo-element underline, test fixture factories]

key-files:
  created:
    - src/test/fixtures.ts
    - src/test/fixtures.test.ts
    - src/components/public/__tests__/HeroSection.test.tsx
  modified:
    - src/index.css
    - src/components/public/HeroSection.tsx

key-decisions:
  - "Avatar size set to 170px (center of 160-180 range per user context)"
  - "Reduced-motion overrides in separate @media block for clarity"

patterns-established:
  - "Test fixture factories: makeProfile/makeProject/makeBlogPost/makeExperience with Partial<T> overrides"
  - "CSS animation pattern: .class for initial state, .class.is-visible for animated state, @media reduced-motion to disable"

requirements-completed: [UIUX-01]

duration: 2min
completed: 2026-03-06
---

# Phase 3 Plan 1: CSS Foundation and Hero Cleanup Summary

**stagger-item and animated-underline CSS animation classes with raw pixel art hero avatar at 170px**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-06T02:48:01Z
- **Completed:** 2026-03-06T02:50:01Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Added stagger-item CSS class using existing fade-up keyframe with CSS custom property delay (--stagger-index * 80ms)
- Added animated-underline CSS class with ::after pseudo-element that scales on hover
- Cleaned up HeroSection to render avatar as raw img at 170px with imageRendering pixelated, no wrapper div
- Created test fixture factories for all domain types (Profile, Project, BlogPost, Experience)
- All 22 tests passing across 3 test files

## Task Commits

Each task was committed atomically:

1. **Task 1: Add CSS animation classes and test fixtures** - `ba31afa` (feat)
2. **Task 2: Clean up HeroSection -- raw pixel art avatar** - `f9546ab` (feat)

## Files Created/Modified
- `src/index.css` - Added stagger-item, animated-underline classes with reduced-motion overrides
- `src/test/fixtures.ts` - Test factory functions for all domain types
- `src/test/fixtures.test.ts` - 8 tests verifying fixture factories
- `src/components/public/HeroSection.tsx` - Simplified hero with raw avatar img, no wrapper
- `src/components/public/__tests__/HeroSection.test.tsx` - 8 tests verifying hero cleanup

## Decisions Made
- Avatar size set to 170px (center of 160-180 range per user context)
- Placed reduced-motion overrides for new classes in a separate @media block after the animation classes for clarity, rather than merging into existing blocks

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- CSS classes stagger-item and animated-underline are ready for Plan 02 to apply across components
- Test fixtures available for all Plan 02 component tests
- HeroSection cleanup complete (UIUX-01 delivered)

## Self-Check: PASSED

All 6 files verified present. Both commit hashes (ba31afa, f9546ab) confirmed in git log. CSS classes stagger-item, animated-underline, and reduced-motion overrides confirmed in index.css. All 22 tests pass.

---
*Phase: 03-ui-ux-polish*
*Completed: 2026-03-06*
