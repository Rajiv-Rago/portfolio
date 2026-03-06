---
phase: 2
slug: contact-simplification
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-06
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest + @testing-library/react |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `npx vitest run src/components/public/__tests__/EmailCTA.test.tsx` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/components/public/__tests__/EmailCTA.test.tsx`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 0 | CONT-01, CONT-02 | unit | `npx vitest run src/components/public/__tests__/EmailCTA.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | CONT-01 | unit | `npx vitest run src/components/public/__tests__/EmailCTA.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | CONT-02 | unit | `npx vitest run src/components/public/__tests__/EmailCTA.test.tsx` | ❌ W0 | ⬜ pending |
| 02-01-04 | 01 | 1 | CONT-03 | manual | Visual check in admin dashboard | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom` — install test framework
- [ ] `vitest.config.ts` — vitest config with jsdom environment
- [ ] `src/test/setup.ts` — shared test setup (jest-dom matchers)
- [ ] `src/components/public/__tests__/EmailCTA.test.tsx` — stubs for CONT-01, CONT-02

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| MessagesAdmin still displays historical submissions | CONT-03 | No code changes to this component — just verify it still works | Navigate to admin dashboard > Messages. Verify list renders with existing data. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
