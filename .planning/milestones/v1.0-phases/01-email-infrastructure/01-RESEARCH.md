# Phase 1: Email Infrastructure - Research

**Researched:** 2026-03-06
**Domain:** Email routing (Cloudflare Email Routing + Resend SMTP + Gmail), DNS configuration, Supabase Edge Functions
**Confidence:** HIGH

## Summary

Phase 1 is pure infrastructure configuration with one small code change. The email setup uses Cloudflare Email Routing for inbound mail (forwarding mail@rajivrago.com to Gmail) and Resend SMTP for outbound mail (Gmail "Send mail as" via smtp.resend.com). Both services are already in use or available: the domain is on Cloudflare and Resend is already integrated for the contact-notify edge function. The code change is updating the hardcoded `from` address in the edge function from `noreply@yourdomain.com` to a configurable env var.

A critical finding from this research is that the prior project-level research incorrectly assumed Resend's SPF record must be merged with Cloudflare's on the root domain. In reality, Resend's SPF and MX records go on the `send` subdomain (`send.rajivrago.com`), not the root domain. This means there is no SPF merge conflict -- Cloudflare's root-domain SPF and Resend's subdomain SPF coexist naturally. The DKIM record goes on `resend._domainkey.rajivrago.com`. The exact values for all records are dashboard-generated and must be copied from the Resend dashboard during setup.

The setup has a strict sequential dependency chain: Cloudflare Email Routing must work first (so the Gmail verification email for "Send mail as" can be received), then Resend domain verification, then Gmail "Send mail as" configuration. DNS propagation delays are the main risk -- wait and verify with `dig` before clicking Verify buttons.

**Primary recommendation:** Follow the dependency chain exactly. Do not skip verification steps between stages. The setup guide is the primary deliverable; the edge function fix is a small code change that rides along.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Setup guide location: `docs/email-setup.md` (new `docs/` directory)
- Setup guide format: Step-by-step walkthrough following the 11-step dependency chain with diagnostic commands (`dig`, `nslookup`) and troubleshooting
- Uses placeholder `your-email@gmail.com` for forwarding destination (repo is public)
- DMARC policy: Start with `p=none` (monitoring only), include `rua=mailto:mail@rajivrago.com`
- Final DMARC record: `v=DMARC1; p=none; rua=mailto:mail@rajivrago.com`
- Edge function fix: Update hardcoded `noreply@yourdomain.com` to `noreply@rajivrago.com`
- Make from address configurable via environment variable (new `SENDER_EMAIL` env var in Supabase Edge Function secrets)
- SPF merge: `v=spf1 include:_spf.mx.cloudflare.net include:send.resend.com ~all`

### Claude's Discretion
- Exact DNS record values (DKIM CNAMEs are dashboard-generated)
- Order of verification steps within the guide
- Environment variable naming convention for the sender email

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| EMAIL-01 | Cloudflare Email Routing forwards mail@rajivrago.com to Gmail | Cloudflare Email Routing docs verified: auto-configures MX records, requires destination email verification, locks DNS records when active. Setup is dashboard-only. |
| EMAIL-02 | Resend SMTP configured for Gmail "Send mail as" mail@rajivrago.com | Resend SMTP credentials verified: host `smtp.resend.com`, port 587/465, username `resend`, password = API key. Gmail "Send mail as" with external SMTP confirmed working in 2026. |
| EMAIL-03 | DNS records configured: merged SPF, DKIM CNAMEs, DMARC policy | **Correction from prior research:** Resend SPF goes on `send` subdomain, not root domain. No merge needed with Cloudflare's root SPF. DKIM is a single TXT record on `resend._domainkey`. DMARC goes on `_dmarc` as TXT. |
| EMAIL-04 | Setup guide document with step-by-step instructions for all manual config | Guide structure maps to the dependency chain: Cloudflare routing -> Resend verification -> Gmail "Send mail as". Includes `dig` verification commands at each step. |
</phase_requirements>

## Standard Stack

### Core (Service Configuration -- No npm Dependencies)

| Service | Purpose | Why Standard | Confidence |
|---------|---------|--------------|------------|
| Cloudflare Email Routing | Forward mail@rajivrago.com to Gmail | Domain already on Cloudflare. Free. Auto-configures MX records. | HIGH |
| Resend SMTP | Gmail "Send mail as" relay for outbound email | Already using Resend API for contact-notify. SMTP included in free tier. | HIGH |
| Gmail "Send mail as" | Send/reply as mail@rajivrago.com from Gmail | Standard Gmail feature. Works with external SMTP servers. Confirmed functional in 2026. | HIGH |

### Supporting

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `dig` CLI | Verify DNS record propagation | After adding DNS records, before clicking Verify in dashboards |
| `nslookup` CLI | Alternative DNS verification | If `dig` unavailable |
| Gmail "Show original" | Verify SPF/DKIM/DMARC pass | After sending test email to confirm authentication passes |

### What NOT to Install

| Library | Why Not |
|---------|---------|
| `nodemailer` | No mail server involved. Gmail sends via Resend SMTP. |
| `@sendgrid/mail` | Resend already in use. |
| Any email npm package | This is service configuration, not code. |

## Architecture Patterns

### Recommended Structure

```
docs/
  email-setup.md          # Setup guide (new - EMAIL-04)
supabase/
  functions/
    contact-notify/
      index.ts            # Edge function fix (existing - update from field)
```

### Pattern 1: Inbound Email Flow
**What:** Cloudflare Email Routing receives mail at mail@rajivrago.com and forwards to Gmail
**How it works:**
```
Internet -> mail@rajivrago.com
  -> DNS MX records point to Cloudflare mail servers (auto-configured)
  -> Cloudflare Email Routing rule: mail@rajivrago.com -> your-email@gmail.com
  -> Email arrives in Gmail inbox
```

### Pattern 2: Outbound Email Flow
**What:** Gmail sends email as mail@rajivrago.com through Resend SMTP
**How it works:**
```
Gmail "Send mail as" -> select From: mail@rajivrago.com
  -> Gmail connects to smtp.resend.com:587 (TLS)
  -> Authenticates: username=resend, password=RESEND_API_KEY
  -> Resend relays email, DKIM-signed for rajivrago.com
  -> Recipient sees From: mail@rajivrago.com
```

### Pattern 3: Edge Function Environment Variable
**What:** Replace hardcoded sender domain with configurable env var
**Current (broken):**
```typescript
from: 'Portfolio <noreply@yourdomain.com>',
```
**Fixed:**
```typescript
const SENDER_EMAIL = Deno.env.get('SENDER_EMAIL') ?? 'noreply@rajivrago.com'
// ...
from: `Portfolio <${SENDER_EMAIL}>`,
```

### DNS Record Architecture

**Root domain (rajivrago.com):**

| Type | Name | Value | Purpose | Source |
|------|------|-------|---------|--------|
| MX | @ | `route1.mx.cloudflare.net` (+ route2, route3) | Cloudflare Email Routing | Auto-configured by Cloudflare |
| TXT | @ | `v=spf1 include:_spf.mx.cloudflare.net ~all` | SPF for Cloudflare inbound | Auto-configured by Cloudflare |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:mail@rajivrago.com` | DMARC policy | Manual (user decision) |

**Resend subdomain records (for outbound sending):**

| Type | Name | Value | Purpose | Source |
|------|------|-------|---------|--------|
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` (priority 10) | Resend bounce processing | Resend dashboard |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | SPF for Resend outbound | Resend dashboard |
| TXT | `resend._domainkey` | (long DKIM public key value) | DKIM signing | Resend dashboard |

**Key insight:** Resend's SPF and MX records go on the `send` subdomain, NOT the root domain. This means Cloudflare's root-domain SPF record does NOT need to be modified to include Resend. They coexist without conflict.

### Anti-Patterns to Avoid
- **Merging SPF when unnecessary:** Do not add `include:send.resend.com` to the root SPF record. Resend's SPF belongs on the `send` subdomain as configured by their dashboard.
- **Adding DNS records with Cloudflare proxy (orange cloud):** All email DNS records must be "DNS only" (gray cloud). Proxied records break email routing.
- **Clicking Verify immediately after adding DNS records:** DNS propagation can take 1-60 minutes. Always verify with `dig` first.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Inbound email forwarding | Custom mail server, email processing code | Cloudflare Email Routing | Free, zero maintenance, auto-configured MX records |
| Outbound SMTP relay | Custom SMTP server, nodemailer | Resend SMTP via Gmail "Send mail as" | Already integrated, free tier (100/day), standard SMTP |
| Email authentication (SPF/DKIM/DMARC) | Manual TXT record calculation | Dashboard-generated values from Cloudflare + Resend | RFC-compliant, auto-generated, error-prone to manual craft |
| Setup documentation | Wiki, Notion, Google Doc | Markdown in `docs/email-setup.md` | Version-controlled, lives with the code |

## Common Pitfalls

### Pitfall 1: Gmail Verification Email Never Arrives
**What goes wrong:** Gmail "Send mail as" sends a verification email to mail@rajivrago.com. If Cloudflare Email Routing is not yet working, the email is lost.
**Why it happens:** The dependency chain is violated -- Gmail setup was attempted before confirming inbound routing works.
**How to avoid:** Complete Cloudflare Email Routing first. Send a test email from an external account to mail@rajivrago.com and confirm it arrives in Gmail. Only then proceed to Gmail "Send mail as."
**Warning signs:** Verification email doesn't arrive within 2 minutes. Check Cloudflare Email Routing activity log.

### Pitfall 2: DNS Propagation False Alarm
**What goes wrong:** After adding Resend DNS records, clicking Verify immediately shows "verification failed." Records are correct but DNS hasn't propagated.
**Why it happens:** DNS propagation delay (1-60 minutes, even on Cloudflare).
**How to avoid:** Wait 10 minutes. Verify records with `dig` before using dashboard Verify buttons:
```bash
dig TXT send.rajivrago.com
dig TXT resend._domainkey.rajivrago.com
```
**Warning signs:** `dig` returns expected values but dashboard still says "pending." Wait longer.

### Pitfall 3: Conflicting MX Records
**What goes wrong:** Pre-existing MX records from a previous email provider prevent Cloudflare Email Routing from working.
**Why it happens:** Cloudflare prompts to delete existing MX records when enabling Email Routing, but users may not follow through.
**How to avoid:** Delete ALL existing MX records before enabling Cloudflare Email Routing. Cloudflare will auto-add its own.
**Warning signs:** Cloudflare Email Routing activity log shows no inbound activity after sending test emails.

### Pitfall 4: Cloudflare Proxy on Email Records
**What goes wrong:** DNS records for email are set to "Proxied" (orange cloud) instead of "DNS only" (gray cloud).
**Why it happens:** Cloudflare defaults new records to proxied. Email records must not be proxied.
**How to avoid:** Verify every email-related DNS record is set to "DNS only." Cloudflare's auto-configured records for Email Routing should already be DNS-only, but Resend records added manually must be set correctly.
**Warning signs:** DKIM verification fails despite correct record values.

### Pitfall 5: Edge Function Uses Unverified Sender Domain
**What goes wrong:** The contact-notify edge function sends from `noreply@yourdomain.com` (placeholder). Resend rejects it as an unverified domain.
**Why it happens:** Placeholder was never updated after initial development.
**How to avoid:** Update to `noreply@rajivrago.com` via env var after Resend domain verification completes. The domain must be verified in Resend before the edge function can send from it.
**Warning signs:** Resend dashboard shows failed sends. Edge function returns 500 errors.

## Code Examples

### Edge Function Fix (contact-notify/index.ts)

Current code (line 6-7, line 51):
```typescript
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL') ?? ''
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
```

```typescript
from: 'Portfolio <noreply@yourdomain.com>',
```

Fixed code:
```typescript
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL') ?? ''
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const SENDER_EMAIL = Deno.env.get('SENDER_EMAIL') ?? 'noreply@rajivrago.com'
```

```typescript
from: `Portfolio <${SENDER_EMAIL}>`,
```

### DNS Verification Commands

```bash
# Verify Cloudflare MX records
dig MX rajivrago.com +short

# Verify Cloudflare SPF (root domain)
dig TXT rajivrago.com +short

# Verify Resend SPF (send subdomain)
dig TXT send.rajivrago.com +short

# Verify Resend DKIM
dig TXT resend._domainkey.rajivrago.com +short

# Verify DMARC
dig TXT _dmarc.rajivrago.com +short
```

### Gmail "Send Mail As" SMTP Settings

| Setting | Value |
|---------|-------|
| SMTP Server | `smtp.resend.com` |
| Port | `587` (TLS) or `465` (SSL) |
| Username | `resend` |
| Password | Resend API key (same `RESEND_API_KEY` used in edge function) |
| Connection security | TLS |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| 3 DKIM CNAME records (old Resend) | 1 DKIM TXT record (`resend._domainkey`) | ~2024-2025 (Resend simplified) | Fewer records to manage |
| SPF merged on root domain | SPF on `send` subdomain (Resend default) | Resend uses custom return-path subdomain | No root-domain SPF conflict with Cloudflare |
| Manual DNS record entry | Domain Connect auto-setup (Resend + Cloudflare) | Available since ~2024 | One-click DNS setup option |
| `framer-motion` package name | `motion` package name | v11 (2024) | Not relevant to this phase |

**Correction from prior project research:**
- Prior research stated: "CRITICAL: Only one SPF TXT record per domain. Cloudflare and Resend SPF includes must be merged into one record: `v=spf1 include:_spf.mx.cloudflare.net include:send.resend.com ~all`"
- **Actual finding:** Resend's SPF record goes on the `send` subdomain, not the root domain. No merge is needed. The root domain SPF (`include:_spf.mx.cloudflare.net`) and the `send` subdomain SPF (`include:amazonses.com`) are independent records on different DNS names.
- However, the CONTEXT.md locked decision includes a merged SPF record. The setup guide should note both approaches: the dashboard-generated records (which use the subdomain pattern) and the merged pattern (if for any reason the dashboard shows root-domain records). Dashboard values always take precedence.

## Open Questions

1. **Exact Resend DNS record values**
   - What we know: Record types and naming patterns are confirmed (MX on `send`, TXT on `send`, TXT on `resend._domainkey`)
   - What's unclear: The exact DKIM key value and the exact MX server hostname (region-specific, e.g., `feedback-smtp.us-east-1.amazonses.com`)
   - Recommendation: Copy values directly from Resend dashboard during setup. Do not pre-fill the guide with placeholder values.

2. **Whether Cloudflare has existing MX records**
   - What we know: The domain is on Cloudflare and Cloudflare Email Routing has not been enabled yet
   - What's unclear: Whether there are any pre-existing MX records from a previous configuration
   - Recommendation: Check Cloudflare DNS dashboard and delete any existing MX records before enabling Email Routing.

3. **"Treat as alias" checkbox in Gmail**
   - What we know: The CONTEXT.md says to uncheck it. Research shows checking it is the more common recommendation, and the behavioral difference is minimal for this use case.
   - What's unclear: The exact user preference
   - Recommendation: Follow the CONTEXT.md decision (uncheck). The checkbox primarily affects whether Gmail auto-CCs the primary address on replies -- unchecking gives more explicit control over which From address is used.

4. **Resend Domain Connect auto-setup vs manual**
   - What we know: Resend offers a "Sign in to Cloudflare" button that auto-configures DNS records via Domain Connect
   - What's unclear: Whether this auto-setup works correctly for domains that also use Cloudflare Email Routing
   - Recommendation: Document both options in the setup guide. Manual setup gives more control and visibility into what records are created.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual verification (infrastructure configuration, not code) |
| Config file | N/A |
| Quick run command | `dig MX rajivrago.com +short && dig TXT rajivrago.com +short` |
| Full suite command | See DNS verification commands + Gmail send/receive test |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| EMAIL-01 | Inbound email forwarded to Gmail | manual | Send test email to mail@rajivrago.com, check Gmail inbox | N/A |
| EMAIL-02 | Outbound email sends as mail@rajivrago.com | manual | Compose in Gmail with From: mail@rajivrago.com, verify recipient sees correct address | N/A |
| EMAIL-03 | SPF/DKIM/DMARC pass | manual + CLI | `dig TXT rajivrago.com +short` + Gmail "Show original" on received email | N/A |
| EMAIL-03 | DKIM verification | manual + CLI | `dig TXT resend._domainkey.rajivrago.com +short` | N/A |
| EMAIL-03 | DMARC record | CLI | `dig TXT _dmarc.rajivrago.com +short` | N/A |
| EMAIL-04 | Setup guide exists | file check | `test -f docs/email-setup.md && echo "exists"` | Wave 0 |
| EMAIL-04 (edge fix) | Edge function uses env var | unit | Verify `SENDER_EMAIL` env var read in index.ts | Wave 0 |

### Sampling Rate
- **Per task commit:** Run `dig` verification commands for DNS changes
- **Per wave merge:** Full send/receive test cycle (inbound + outbound + "Show original" authentication check)
- **Phase gate:** All 4 success criteria verified before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `docs/email-setup.md` -- new file, covers EMAIL-04
- [ ] Edge function env var update -- modifies existing `supabase/functions/contact-notify/index.ts`

## Sources

### Primary (HIGH confidence)
- [Cloudflare Email Routing docs](https://developers.cloudflare.com/email-routing/get-started/enable-email-routing/) -- setup process, DNS auto-configuration, MX record handling
- [Cloudflare Email DNS records](https://developers.cloudflare.com/email-routing/setup/email-routing-dns-records/) -- required MX and SPF records
- [Resend SMTP docs](https://resend.com/docs/send-with-smtp) -- SMTP host/port/username/password confirmed
- [Resend Cloudflare guide](https://resend.com/docs/knowledge-base/cloudflare) -- DNS record setup specific to Cloudflare, Domain Connect option, proxy settings
- [Resend Create Domain API](https://resend.com/docs/api-reference/domains/create-domain) -- reveals actual DNS record structure: SPF on `send` subdomain, DKIM on `resend._domainkey`, MX on `send` subdomain, Amazon SES infrastructure
- [Resend account quotas](https://resend.com/docs/knowledge-base/account-quotas-and-limits) -- free tier: 100 emails/day, 3000/month
- [Cloudflare SPF troubleshooting](https://developers.cloudflare.com/email-routing/troubleshooting/email-routing-spf-records/) -- confirms only one SPF record per domain name
- Codebase: `supabase/functions/contact-notify/index.ts` -- confirmed hardcoded `noreply@yourdomain.com` on line 51

### Secondary (MEDIUM confidence)
- [Gmail "Send mail as" help](https://support.google.com/mail/answer/22370?hl=en) -- feature confirmed available, content not fully extractable
- [dmarc.wiki Resend guide](https://dmarc.wiki/resend) -- SPF on `send` subdomain, DKIM details, DMARC recommendations
- [GMass deliverability analysis](https://www.gmass.co/blog/gmail-send-mail-as-setting-affects-email-deliverability/) -- "Treat as alias" has no external impact
- Multiple web sources confirming Gmail "Send mail as" with external SMTP still functional in 2026

### Tertiary (LOW confidence)
- Exact number and format of Resend DKIM records -- may be 1 TXT record or 3 CNAME records depending on account/region. Dashboard is authoritative.

## Metadata

**Confidence breakdown:**
- Cloudflare Email Routing: HIGH -- official docs verified, stable product
- Resend SMTP credentials: HIGH -- official docs confirmed (host, port, username, password)
- DNS record architecture: HIGH -- Resend API response reveals subdomain pattern, Cloudflare guide confirms
- Gmail "Send mail as": HIGH -- confirmed working with external SMTP in 2026, standard feature
- Edge function fix: HIGH -- direct codebase read, trivial change
- Exact Resend DNS values: MEDIUM -- pattern known but exact values are dashboard-generated per account

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (30 days -- stable infrastructure, unlikely to change)
