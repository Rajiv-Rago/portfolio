---
phase: 01
slug: email-infrastructure
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-06
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual verification (infrastructure configuration, not code) |
| **Config file** | N/A |
| **Quick run command** | `dig MX rajivrago.com +short && dig TXT rajivrago.com +short` |
| **Full suite command** | DNS verification commands + Gmail send/receive test |
| **Estimated runtime** | ~5 seconds (DNS commands) + manual email tests |

---

## Sampling Rate

- **After every task commit:** Run `dig` verification commands for DNS changes
- **After every plan wave:** Full send/receive test cycle (inbound + outbound + "Show original" authentication check)
- **Before `/gsd:verify-work`:** All 4 success criteria verified
- **Max feedback latency:** 5 seconds (DNS commands); manual email tests are async

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | EMAIL-04 (edge fix) | file check | `grep SENDER_EMAIL supabase/functions/contact-notify/index.ts` | N/A | ⬜ pending |
| 01-01-02 | 01 | 1 | EMAIL-04 | file check | `test -f docs/email-setup.md && echo "exists"` | ❌ W0 | ⬜ pending |
| 01-01-03 | 01 | 1 | EMAIL-01 | manual | Send email to mail@rajivrago.com, check Gmail inbox | N/A | ⬜ pending |
| 01-01-04 | 01 | 1 | EMAIL-03 | CLI | `dig MX rajivrago.com +short` | N/A | ⬜ pending |
| 01-01-05 | 01 | 1 | EMAIL-03 | CLI | `dig TXT rajivrago.com +short && dig TXT _dmarc.rajivrago.com +short` | N/A | ⬜ pending |
| 01-01-06 | 01 | 1 | EMAIL-02 | manual | Compose in Gmail as mail@rajivrago.com, verify recipient sees correct From | N/A | ⬜ pending |
| 01-01-07 | 01 | 1 | EMAIL-03 | manual | Gmail "Show original" — SPF PASS, DKIM PASS, DMARC PASS | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `docs/email-setup.md` — new file, covers EMAIL-04
- [ ] Edge function env var update — modifies existing `supabase/functions/contact-notify/index.ts`

*These are the only code/file changes. Everything else is dashboard configuration.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Inbound email forwarded to Gmail | EMAIL-01 | Requires external email send + Gmail inbox check | Send email from external account to mail@rajivrago.com, verify arrival in Gmail inbox |
| Outbound email sends as mail@rajivrago.com | EMAIL-02 | Requires Gmail UI + recipient mailbox check | Compose in Gmail with From: mail@rajivrago.com, send to test address, verify From header |
| SPF/DKIM/DMARC pass | EMAIL-03 | Requires Gmail "Show original" on received email | Open received email in Gmail, click "Show original", verify SPF/DKIM/DMARC all show PASS |
| Gmail "Send mail as" verification | EMAIL-02 | Requires manual Gmail Settings UI interaction | Gmail Settings > Accounts > Send mail as > Add, enter SMTP credentials, enter verification code |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s (DNS commands)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
