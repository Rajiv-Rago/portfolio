# Technology Stack

**Project:** Portfolio Email Infrastructure & UI/UX Polish
**Researched:** 2026-03-05
**Note:** WebSearch/WebFetch unavailable during research. Version numbers are from training data (cutoff May 2025). Verify versions with `npm view <pkg> version` before installing.

## Recommended Stack

This milestone adds zero-to-one npm dependencies. The email infrastructure is entirely service configuration (no code). The UI/UX work can be done with CSS alone or with one animation library.

### Email Infrastructure (No Code Dependencies)

These are service configurations, not npm packages.

| Technology | Purpose | Why | Confidence |
|------------|---------|-----|------------|
| Cloudflare Email Routing | Receive email at mail@rajivrago.com, forward to Gmail | Domain already on Cloudflare. Free. Zero maintenance. No server needed. | HIGH |
| Resend SMTP | Send email from Gmail as mail@rajivrago.com | Already using Resend API for contact notifications. SMTP access included in free tier (100 emails/day). Gmail "Send mail as" needs SMTP credentials. | HIGH |

**Resend SMTP Credentials (for Gmail "Send mail as"):**

| Setting | Value | Confidence |
|---------|-------|------------|
| SMTP Host | `smtp.resend.com` | HIGH |
| Port | `587` (STARTTLS) or `465` (SSL) | HIGH |
| Username | `resend` | HIGH |
| Password | Your Resend API key (same `RESEND_API_KEY` already in use) | HIGH |

**Cloudflare Email Routing:**
- No cost (included with Cloudflare free plan)
- Requires MX, SPF, and DMARC DNS records (Cloudflare auto-configures MX and SPF when enabled)
- Routes `mail@rajivrago.com` to personal Gmail inbox
- Confidence: HIGH

**DNS Records Required (all in Cloudflare dashboard):**

| Type | Name | Value | Purpose | Confidence |
|------|------|-------|---------|------------|
| MX | rajivrago.com | `route1.mx.cloudflare.net` (priority varies) | Cloudflare Email Routing | MEDIUM (auto-configured; exact values from CF dashboard) |
| MX | rajivrago.com | `route2.mx.cloudflare.net` | Cloudflare Email Routing | MEDIUM |
| MX | rajivrago.com | `route3.mx.cloudflare.net` | Cloudflare Email Routing | MEDIUM |
| TXT | rajivrago.com | `v=spf1 include:_spf.mx.cloudflare.net include:send.resend.com ~all` | Combined SPF for Cloudflare + Resend | HIGH |
| CNAME | `resend._domainkey` | Value from Resend dashboard | DKIM signing | HIGH (pattern; exact value from Resend) |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:mail@rajivrago.com` | DMARC policy | HIGH |

**CRITICAL:** Only one SPF TXT record per domain. Cloudflare and Resend SPF includes must be merged into one record. See PITFALLS.md for details.

**CRITICAL:** All email-related DNS records must be set to "DNS only" (gray cloud) in Cloudflare, NOT "Proxied" (orange cloud).

### UI/UX Animation: Decision Point

The existing research (ARCHITECTURE.md, FEATURES.md) recommends CSS-first with motion as an optional escalation. This is the right call. Here's the decision framework:

**Default recommendation: Extend existing CSS animations (no new dependencies)**

The site already has:
- `useScrollReveal` hook (IntersectionObserver-based)
- CSS `@keyframes fade-up` for scroll reveals
- Tailwind `hover:-translate-y-1 hover:shadow-lg hover:border-accent` on cards
- `prefers-reduced-motion` support throughout

What CSS can handle for this milestone:
- Staggered card reveals: `animation-delay: ${index * 100}ms` inline style
- Enhanced hover effects: Tailwind `hover:scale-[1.01]`, `hover:shadow-accent/10`
- Section heading animations: CSS `::after` pseudo-element width transition
- Link arrow animations: `hover:translate-x-1` on arrow icon/text

**Optional escalation: Install `motion` (formerly `framer-motion`)**

Install motion ONLY if the milestone requires:
- Spring physics (bouncy, natural-feeling animations vs linear CSS easing)
- Exit animations (elements animating out when removed from DOM)
- Layout animations (shared element transitions)
- Gesture-driven interactions (drag, pan, pinch)

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| `motion` | ^11.x (verify with `npm view motion version`) | React animation library, formerly framer-motion | MEDIUM (version needs npm verification) |

**If motion is installed, use it for ALL animations and migrate away from the CSS system.** Do not maintain two animation systems -- see PITFALLS.md Pitfall 8.

### What NOT to Install

| Library | Why Not |
|---------|---------|
| `nodemailer` | No mail server involved. Gmail sends via Resend SMTP. Cloudflare receives. Zero Node.js email code. |
| `@sendgrid/mail` | Resend already set up. Don't add a second email provider. |
| `framer-motion` | Old package name. If choosing this library, install `motion` instead. |
| `react-transition-group` | Legacy. CSS transitions or motion cover everything. |
| `lottie-react` | Heavy. Requires separate animation files. Overkill for micro-interactions. |
| `animate.css` | Tailwind utilities already cover this. Adding a CSS library creates conflicting approaches. |
| `GSAP` | Imperative API, commercial license for some features. Overkill for a portfolio. |
| `react-spring` | Smaller community. If you need spring physics, use motion instead. |
| `@formkit/auto-animate` | Too limited. Only handles mount/unmount. No spring/gesture/layout support. |
| `tailwind-merge` / `clsx` | Not needed. Current template literal className logic is fine for this codebase size. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not Alternative |
|----------|-------------|-------------|---------------------|
| Receiving email | Cloudflare Email Routing | ImprovMX, Forward Email | Domain already on Cloudflare. Free. No extra account. |
| Sending as custom domain | Resend SMTP | SendGrid SMTP, Mailgun SMTP, Zoho Mail | Already using Resend. SMTP is included. Zero additional cost or accounts. |
| Hosting email (full mailbox) | NOT recommended | Google Workspace, Zoho Mail, Fastmail | Overkill. Routing + SMTP relay achieves the same result for free with no mailbox management. |
| Animation (recommended) | CSS + Tailwind transitions | motion for everything | CSS covers the stated requirements. Save motion for when CSS falls short. |
| Animation (escalation) | motion | GSAP, react-spring, anime.js | motion has best React DX and largest community if a library is needed. |

## Installation

```bash
# If staying CSS-only (recommended default):
# No installation needed.

# If adding motion library (optional escalation):
npm install motion
```

Email infrastructure requires zero npm packages -- it is entirely Cloudflare dashboard + Resend dashboard + Gmail settings.

## Gmail "Send Mail As" Setup Steps

After DNS records are configured and Resend domain is verified:

1. Gmail Settings > Accounts and Import > "Send mail as" > "Add another email address"
2. Name: `Rajiv Rago`
3. Email: `mail@rajivrago.com`
4. Uncheck "Treat as an alias" (gives explicit control over which From address is used)
5. SMTP Server: `smtp.resend.com`
6. Port: `587`
7. Username: `resend`
8. Password: `[RESEND_API_KEY value]`
9. Secured connection using TLS
10. Gmail sends a verification email to `mail@rajivrago.com` (arrives via Cloudflare Email Routing)
11. Click the verification link or enter the code from the email
12. Optionally set as default "Send mail as" address
13. Enable "Reply from the same address the message was sent to"

**PREREQUISITE:** Cloudflare Email Routing must be working first (test by sending mail to `mail@rajivrago.com` from another account). See PITFALLS.md Pitfall 3.

**Confidence:** HIGH. Standard, well-documented flow.

## Edge Function Cleanup

The existing `contact-notify` edge function at `supabase/functions/contact-notify/index.ts` has a hardcoded placeholder domain (`noreply@yourdomain.com` on line 51). When removing the contact form:

1. If keeping the edge function for future use: update `from` to `Portfolio <noreply@rajivrago.com>` (after Resend domain verification)
2. If removing the contact form entirely: disable the database webhook trigger and optionally archive the edge function

See PITFALLS.md Pitfall 5.

## Sources

- Resend SMTP documentation: training data (HIGH confidence -- SMTP host/port/username pattern is standard and well-documented)
- Cloudflare Email Routing: training data (HIGH confidence -- Cloudflare's own product, stable feature)
- SPF/DKIM/DMARC DNS patterns: training data (HIGH confidence -- RFC standards, don't change)
- motion/framer-motion: training data (MEDIUM confidence on version/package name -- rebranding happened around v11, verify with `npm view motion version`)
- Codebase analysis: package.json, edge function, CSS animations, useScrollReveal hook (verified via file reads)

---

*Stack research: 2026-03-05*
