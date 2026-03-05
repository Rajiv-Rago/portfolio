# Portfolio - rajivrago.com

## What This Is

A personal portfolio and blog site for Rajiv Rago, a full-stack developer. Features a public portfolio with hero, projects, experience, and blog sections, plus an authenticated admin dashboard for managing all content. Built as a React SPA with Supabase as the backend.

## Core Value

The portfolio must present Rajiv's work and make it effortless for visitors to get in touch.

## Requirements

### Validated

- ✓ Public portfolio with hero, projects, experience, and contact sections — existing
- ✓ Blog with markdown rendering and slug-based routing — existing
- ✓ Admin dashboard with CRUD for all content entities — existing
- ✓ Supabase Auth with email/password for admin access — existing
- ✓ Contact form with Zod validation, honeypot spam prevention, and rate limiting — existing
- ✓ Contact notification via Resend edge function — existing
- ✓ SEO with dynamic meta tags, OpenGraph, Twitter Cards, and JSON-LD — existing
- ✓ Scroll-reveal animations on portfolio sections — existing
- ✓ Responsive design with Tailwind CSS v4 — existing
- ✓ Error boundary with dev-mode stack traces — existing
- ✓ Database migrations system — existing

### Active

- [ ] Email infrastructure: Cloudflare Email Routing (receive) + Resend SMTP (send as mail@rajivrago.com from Gmail)
- [ ] Replace contact form with mailto:mail@rajivrago.com link
- [ ] Fix hero avatar: remove container/shadow, show clean pixel art
- [ ] UI/UX overhaul: rethink flat sections, add hover effects, micro-interactions, and meaningful animations
- [ ] Setup guide for Resend SMTP and Cloudflare Email Routing

### Out of Scope

- Entrance animation for avatar — deferred to future milestone, track in planned updates
- Dark mode toggle — not requested
- CMS migration away from Supabase — current setup works
- Mobile app — web only

## Context

- Domain: rajivrago.com (on Cloudflare)
- Hosting: Vercel (static SPA)
- Backend: Supabase (PostgreSQL, Auth, Edge Functions)
- Email sending already configured via Resend edge function for contact notifications
- Pixel art avatar at `public/me.png`
- Contact form currently submits to Supabase `contact_messages` table

## Constraints

- **Stack**: React 19 + Vite 7 + Tailwind CSS v4 + Supabase — no changes to core stack
- **Simplicity**: mailto: link over a form-to-email pipeline — reduce backend complexity
- **Performance**: Keep the site fast, no heavy animation libraries beyond what Framer Motion or CSS can handle
- **Accessibility**: Maintain prefers-reduced-motion support, ARIA attributes

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| mailto: over contact form | Simpler, no backend needed for contact; reduces moving parts | — Pending |
| Cloudflare Email Routing + Resend SMTP | Free tiers sufficient; Cloudflare already manages the domain | — Pending |
| Clean pixel art hero (no container) | User preference; current box shadow feels off | — Pending |
| Polish + rethink UI sections | Site feels too static; needs more interactivity and visual interest | — Pending |

---
*Last updated: 2026-03-05 after initialization*
