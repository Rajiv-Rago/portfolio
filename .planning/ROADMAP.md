# Roadmap: Portfolio - rajivrago.com

## Overview

This milestone adds email infrastructure, simplifies the contact experience, and polishes the UI/UX of an existing portfolio site. The work flows sequentially: email routing must work before the mailto link replaces the contact form, and the contact section must be finalized before animations target the final component structure. Three phases, each delivering a complete, verifiable capability.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Email Infrastructure** - Configure Cloudflare Email Routing, Resend SMTP, and DNS so mail@rajivrago.com works for send and receive
- [ ] **Phase 2: Contact Simplification** - Replace the contact form with a mailto link and copy button, preserving historical messages
- [ ] **Phase 3: UI/UX Polish** - Add micro-interactions, staggered animations, and visual section differentiation across the portfolio

## Phase Details

### Phase 1: Email Infrastructure
**Goal**: Visitors and Rajiv can exchange email through mail@rajivrago.com -- inbound routes to Gmail, outbound sends as mail@rajivrago.com from Gmail
**Depends on**: Nothing (first phase)
**Requirements**: EMAIL-01, EMAIL-02, EMAIL-03, EMAIL-04
**Success Criteria** (what must be TRUE):
  1. Sending an email to mail@rajivrago.com delivers it to Rajiv's Gmail inbox
  2. Rajiv can compose and send email from Gmail as mail@rajivrago.com, and recipients see that address
  3. Emails sent as mail@rajivrago.com pass SPF, DKIM, and DMARC checks (no spam flags)
  4. A setup guide document exists with step-by-step instructions for all manual configuration performed
**Plans**: TBD

Plans:
- [ ] 01-01: TBD

### Phase 2: Contact Simplification
**Goal**: Visitors can contact Rajiv directly via email link instead of filling out a form, with zero friction
**Depends on**: Phase 1
**Requirements**: CONT-01, CONT-02, CONT-03
**Success Criteria** (what must be TRUE):
  1. The contact section shows a mailto:mail@rajivrago.com link that opens the visitor's email client
  2. A copy-to-clipboard button copies the email address and shows visual confirmation
  3. The admin dashboard still displays historical contact form submissions
**Plans**: 2 plans

Plans:
- [ ] 02-01-PLAN.md — Data contract (contact_intro migration + types + admin form) and test infrastructure (vitest setup + failing EmailCTA tests)
- [ ] 02-02-PLAN.md — UI implementation (EmailCTA component, ContactSection and ContactLinks updates) with visual verification

### Phase 3: UI/UX Polish
**Goal**: The portfolio feels alive and polished -- interactive hover states, staggered reveals, and clear visual rhythm between sections
**Depends on**: Phase 2
**Requirements**: UIUX-01, UIUX-02, UIUX-03, UIUX-04
**Success Criteria** (what must be TRUE):
  1. The hero avatar renders as clean pixel art without any container, box shadow, or wrapper styling
  2. Cards, links, and buttons respond to hover with visible micro-interactions (scale, color shift, or shadow transitions)
  3. Cards and list items animate in with staggered timing when scrolled into view
  4. Sections are visually distinct through alternating backgrounds, spacing, or other rhythm-creating techniques
  5. All animations respect prefers-reduced-motion (disabled or minimal when preference is set)
**Plans**: TBD

Plans:
- [ ] 03-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Email Infrastructure | 0/0 | Not started | - |
| 2. Contact Simplification | 0/2 | Not started | - |
| 3. UI/UX Polish | 0/0 | Not started | - |
