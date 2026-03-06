---
phase: 02-contact-simplification
plan: 01
subsystem: database, ui, testing
tags: [supabase, vitest, testing-library, react, zod, tdd]

requires:
  - phase: none
    provides: existing Profile type and ProfileSettings form
provides:
  - contact_intro column on profile table via migration
  - Updated Profile interface with contact_intro field
  - Admin form field for editing contact intro text
  - Vitest test infrastructure configured with jsdom
  - Failing EmailCTA tests (TDD RED) for Plan 02 to implement against
affects: [02-contact-simplification]

tech-stack:
  added: [vitest, "@testing-library/react", "@testing-library/jest-dom", "@testing-library/user-event", jsdom]
  patterns: [TDD red-green-refactor, vitest with globals and jsdom environment]

key-files:
  created:
    - supabase/migrations/003_contact_intro.sql
    - vitest.config.ts
    - src/test/setup.ts
    - src/components/public/__tests__/EmailCTA.test.tsx
  modified:
    - src/lib/types.ts
    - src/admin/ProfileSettings.tsx
    - package.json

key-decisions:
  - "contact_intro column is nullable text -- component provides fallback if null"
  - "Vitest configured with globals: true for cleaner test syntax"

patterns-established:
  - "Test files in __tests__/ directories adjacent to components"
  - "Vitest setup file at src/test/setup.ts with jest-dom matchers"

requirements-completed: [CONT-01, CONT-02]

duration: 2min
completed: 2026-03-06
---

# Phase 02 Plan 01: Data Contract and Test Infrastructure Summary

**contact_intro migration and Profile type update, vitest configured with 6 failing EmailCTA tests (TDD RED)**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-05T17:24:40Z
- **Completed:** 2026-03-05T17:27:12Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Added contact_intro column to profile table with seed value via SQL migration
- Extended Profile interface and ProfileSettings admin form with contact_intro field
- Set up vitest with jsdom, testing-library, and jest-dom matchers
- Wrote 6 failing tests for EmailCTA component covering mailto link, email display, copy button, clipboard API, copied feedback, and event propagation

## Task Commits

Each task was committed atomically:

1. **Task 1: Add contact_intro to data layer** - `2487505` (feat)
2. **Task 2: Set up vitest and write failing EmailCTA tests** - `fffa3b6` (test)

## Files Created/Modified
- `supabase/migrations/003_contact_intro.sql` - ALTER TABLE adding contact_intro column with seed value
- `src/lib/types.ts` - Profile interface with contact_intro: string | null
- `src/admin/ProfileSettings.tsx` - Zod schema, form reset, submit payload, and textarea for contact_intro
- `vitest.config.ts` - Test runner config with jsdom environment and globals
- `src/test/setup.ts` - jest-dom/vitest matcher setup
- `src/components/public/__tests__/EmailCTA.test.tsx` - 6 failing tests for EmailCTA component
- `package.json` - Added vitest and testing-library dev dependencies

## Decisions Made
- contact_intro column is nullable text -- the component will provide a sensible fallback if null, matching the research recommendation
- Vitest configured with `globals: true` for cleaner test syntax (no need to import describe/it/expect in every file)
- Copy button stopPropagation test validates the button is a sibling of the mailto link (not nested inside it), preventing event bubbling

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Plan 02 can implement EmailCTA component to make the 6 failing tests pass (TDD GREEN)
- Plan 02 can modify ContactSection and ContactLinks to use the new EmailCTA component
- Migration file is ready but needs to be run against the remote Supabase database before deployment

## Self-Check: PASSED

All 6 created/modified files verified present. Both task commits (2487505, fffa3b6) verified in git log.

---
*Phase: 02-contact-simplification*
*Completed: 2026-03-06*
