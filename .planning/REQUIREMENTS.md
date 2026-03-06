# Requirements: Portfolio - rajivrago.com

**Defined:** 2026-03-05
**Core Value:** The portfolio must present Rajiv's work and make it effortless for visitors to get in touch.

## v1 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Email Infrastructure

- [x] **EMAIL-01**: Cloudflare Email Routing forwards mail@rajivrago.com to Gmail
- [x] **EMAIL-02**: Resend SMTP configured for Gmail "Send mail as" mail@rajivrago.com
- [x] **EMAIL-03**: DNS records configured: merged SPF, DKIM CNAMEs, DMARC policy
- [x] **EMAIL-04**: Setup guide document with step-by-step instructions for all manual config

### Contact

- [x] **CONT-01**: Contact section uses mailto:mail@rajivrago.com link instead of form
- [x] **CONT-02**: Copy-to-clipboard button for email address with feedback
- [x] **CONT-03**: Admin messages view preserved for historical contact submissions

### UI/UX

- [ ] **UIUX-01**: Hero avatar displays as clean pixel art without container or shadow
- [ ] **UIUX-02**: Hover micro-interactions on cards, links, and buttons
- [ ] **UIUX-03**: Staggered entrance animations on cards and list items
- [ ] **UIUX-04**: Visual section differentiation with alternate backgrounds, spacing, and rhythm

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Animation

- **ANIM-01**: Hero avatar entrance animation (pixel art assembles or fades in creatively)

### Contact

- **CONT-04**: Clean up orphaned ContactForm and useContactForm code

## Out of Scope

| Feature | Reason |
|---------|--------|
| Dark mode toggle | Not requested |
| Framer Motion / motion library | CSS-first approach covers all requirements; avoid dual animation system |
| Custom cursor effects | Anti-feature for portfolio sites; accessibility concern |
| Parallax scrolling | Anti-feature; performance and motion sensitivity issues |
| Contact form chat widget | Anti-feature; mailto is simpler and more direct |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| EMAIL-01 | Phase 1 | Complete |
| EMAIL-02 | Phase 1 | Complete |
| EMAIL-03 | Phase 1 | Complete |
| EMAIL-04 | Phase 1 | Complete |
| CONT-01 | Phase 2 | Complete |
| CONT-02 | Phase 2 | Complete |
| CONT-03 | Phase 2 | Complete |
| UIUX-01 | Phase 3 | Pending |
| UIUX-02 | Phase 3 | Pending |
| UIUX-03 | Phase 3 | Pending |
| UIUX-04 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 11 total
- Mapped to phases: 11
- Unmapped: 0

---
*Requirements defined: 2026-03-05*
*Last updated: 2026-03-05 after roadmap creation*
