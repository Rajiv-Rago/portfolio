# Phase 1: Email Infrastructure - Context

**Gathered:** 2026-03-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Configure email infrastructure so mail@rajivrago.com works for both sending and receiving. Inbound email routes through Cloudflare Email Routing to Gmail. Outbound email sends via Resend SMTP through Gmail's "Send mail as" feature. All DNS records (SPF, DKIM, DMARC) configured for deliverability. A setup guide documents the full process. No app UI changes — this is service configuration only, plus one edge function fix.

</domain>

<decisions>
## Implementation Decisions

### Setup Guide
- Location: `docs/email-setup.md` (new `docs/` directory)
- Format: Step-by-step walkthrough following the 11-step dependency chain
- Includes diagnostic commands (`dig`, `nslookup`) and troubleshooting for common pitfalls
- Uses placeholder `your-email@gmail.com` for the forwarding destination (repo is public)

### DMARC Policy
- Start with `p=none` (monitoring only) — lenient during initial setup, tighten later once verified
- Include reporting: `rua=mailto:mail@rajivrago.com` for aggregate authentication failure reports
- Final DMARC record: `v=DMARC1; p=none; rua=mailto:mail@rajivrago.com`

### Edge Function Fix
- Fix the hardcoded `noreply@yourdomain.com` in `contact-notify` during this phase (natural time since we're verifying the domain with Resend)
- Use `noreply@rajivrago.com` as the sender address
- Make the from address configurable via environment variable (new `SENDER_EMAIL` env var in Supabase Edge Function secrets)

### Claude's Discretion
- Exact DNS record values (DKIM CNAMEs are dashboard-generated)
- Order of verification steps within the guide
- Environment variable naming convention for the sender email

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `supabase/functions/contact-notify/index.ts`: Edge function that sends via Resend API — needs `from` field updated from hardcoded placeholder to env var

### Established Patterns
- Edge function secrets managed via Supabase dashboard (`OWNER_EMAIL`, `RESEND_API_KEY` already exist)
- Resend API already integrated — same API key can generate SMTP credentials

### Integration Points
- Cloudflare DNS dashboard: MX records, SPF TXT, DKIM CNAMEs, DMARC TXT
- Resend dashboard: Domain verification, SMTP credentials
- Gmail Settings: "Send mail as" configuration
- Supabase dashboard: Edge function secrets (add `SENDER_EMAIL`)

</code_context>

<specifics>
## Specific Ideas

- The setup guide should follow the strict 11-step dependency chain from research (Cloudflare routing first, Resend verification second, Gmail "Send mail as" last)
- SPF merge is critical: single record `v=spf1 include:_spf.mx.cloudflare.net include:send.resend.com ~all`
- Guide should warn about DNS propagation delay (wait 10 minutes before clicking Verify in Resend)
- Gmail "Send mail as" settings: set mail@rajivrago.com as default sender, enable "Reply from the same address the message was sent to"

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-email-infrastructure*
*Context gathered: 2026-03-06*
