# Portfolio - rajivrago.com

## What This Is

A personal portfolio and blog site for Rajiv Rago, a full-stack developer. Features a public portfolio with hero, projects, experience, and blog sections, plus an authenticated admin dashboard for managing all content. Built as a React SPA with Supabase as the backend. Email infrastructure enables direct contact via mail@rajivrago.com with polished UI animations throughout.

## Core Value

The portfolio must present Rajiv's work and make it effortless for visitors to get in touch.

## Requirements

### Validated

- ✓ Public portfolio with hero, projects, experience, and contact sections — existing
- ✓ Blog with markdown rendering and slug-based routing — existing
- ✓ Admin dashboard with CRUD for all content entities — existing
- ✓ Supabase Auth with email/password for admin access — existing
- ✓ Contact notification via Resend edge function — existing
- ✓ SEO with dynamic meta tags, OpenGraph, Twitter Cards, and JSON-LD — existing
- ✓ Scroll-reveal animations on portfolio sections — existing
- ✓ Responsive design with Tailwind CSS v4 — existing
- ✓ Error boundary with dev-mode stack traces — existing
- ✓ Database migrations system — existing
- ✓ Cloudflare Email Routing forwards mail@rajivrago.com to Gmail — v1.0
- ✓ Resend SMTP configured for Gmail "Send mail as" mail@rajivrago.com — v1.0
- ✓ DNS records configured: merged SPF, DKIM CNAMEs, DMARC policy — v1.0
- ✓ Setup guide with step-by-step instructions for email infrastructure — v1.0
- ✓ Contact section uses mailto link instead of form — v1.0
- ✓ Copy-to-clipboard button for email address with feedback — v1.0
- ✓ Admin messages view preserved for historical contact submissions — v1.0
- ✓ Hero avatar displays as clean pixel art without container or shadow — v1.0
- ✓ Hover micro-interactions on cards, links, and buttons — v1.0
- ✓ Staggered entrance animations on cards and list items — v1.0
- ✓ Visual section differentiation with alternate backgrounds, spacing, and rhythm — v1.0

### Active

(None — define with `/gsd:new-milestone`)

### Out of Scope

- Hero avatar entrance animation — deferred to v2 (ANIM-01)
- Orphaned ContactForm/useContactForm cleanup — deferred to v2 (CONT-04)
- Dark mode toggle — not requested
- CMS migration away from Supabase — current setup works
- Mobile app — web only
- Framer Motion / motion library — CSS-first approach covers all requirements
- Custom cursor effects — accessibility concern
- Parallax scrolling — performance and motion sensitivity issues
- Contact form chat widget — mailto is simpler and more direct

## Context

Shipped v1.0 with 3,983 LOC TypeScript/CSS.
Tech stack: React 19 + Vite 7 + Tailwind CSS v4 + Supabase.
Email: Cloudflare Email Routing (inbound) + Resend SMTP (outbound) for mail@rajivrago.com.
43 tests across 6 test files. TypeScript compiles cleanly.
Known tech debt: orphaned ContactForm.tsx and useContactForm.ts (CONT-04 deferred to v2).

## Constraints

- **Stack**: React 19 + Vite 7 + Tailwind CSS v4 + Supabase — no changes to core stack
- **Simplicity**: mailto: link over a form-to-email pipeline — reduce backend complexity
- **Performance**: Keep the site fast, no heavy animation libraries beyond what CSS can handle
- **Accessibility**: Maintain prefers-reduced-motion support, ARIA attributes

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| mailto: over contact form | Simpler, no backend needed for contact; reduces moving parts | ✓ Good — zero-friction contact |
| Cloudflare Email Routing + Resend SMTP | Free tiers sufficient; Cloudflare already manages the domain | ✓ Good — full SPF/DKIM/DMARC passing |
| Clean pixel art hero (no container) | User preference; current box shadow feels off | ✓ Good — 170px raw pixel art |
| CSS-first animations | Avoid dual animation system; CSS covers all requirements | ✓ Good — stagger + hover via pure CSS/Tailwind |
| Resend SPF on send subdomain | No SPF merge needed with Cloudflare root domain | ✓ Good — clean DNS separation |
| DMARC p=none with Cloudflare rua | Monitor before enforcement | ✓ Good — allows observation period |
| Vitest with globals:true | Cleaner test syntax, no per-file imports | ✓ Good — 43 tests passing |
| Stagger wrapper takes col-span from ProjectCard | Prevents duplicate CSS grid spanning | ✓ Good — clean grid layout |
| ContactSection excluded from stagger | User decision — contact should always be visible | ✓ Good |
| Mobile nav excluded from animated-underline | Hover underlines don't apply to tap | ✓ Good — appropriate UX |

---
*Last updated: 2026-03-06 after v1.0 milestone*
