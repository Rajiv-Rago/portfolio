# Email Infrastructure Setup Guide

Step-by-step instructions for configuring mail@rajivrago.com with inbound forwarding (Cloudflare Email Routing to Gmail) and outbound sending (Resend SMTP via Gmail "Send mail as").

**Important:** Follow sections in order. Each step depends on the previous one completing successfully.

## Prerequisites

- Cloudflare account with rajivrago.com domain (nameservers already pointing to Cloudflare)
- Resend account (same account used for the contact-notify edge function)
- Gmail account (referred to as `your-email@gmail.com` throughout this guide)

---

## Part 1: Cloudflare Email Routing (Inbound)

Cloudflare Email Routing forwards mail@rajivrago.com to your Gmail inbox.

### Steps

1. Log in to the Cloudflare dashboard and select the rajivrago.com domain.

2. Navigate to **Email > Email Routing** in the left sidebar.

3. If prompted about pre-existing MX records, **delete them**. Cloudflare Email Routing requires its own MX records and will auto-configure them.

4. Enable Email Routing if not already enabled.

5. Add a routing rule:
   - **Custom address:** `mail@rajivrago.com`
   - **Action:** Forward to
   - **Destination:** `your-email@gmail.com`

6. Cloudflare will send a verification email to `your-email@gmail.com`. Open Gmail and click the verification link.

7. Confirm Cloudflare has auto-configured its MX records:

   ```bash
   dig MX rajivrago.com +short
   ```

   Expected output (3 Cloudflare mail servers):
   ```
   86 route1.mx.cloudflare.net.
   12 route2.mx.cloudflare.net.
   97 route3.mx.cloudflare.net.
   ```

   The priority numbers may differ. What matters is that all three `routeN.mx.cloudflare.net` records are present.

8. **Test inbound routing:** Send an email from an external account (not Gmail) to mail@rajivrago.com. Confirm it arrives in your Gmail inbox.

### Troubleshooting

- **Email doesn't arrive:** Check Cloudflare Email Routing activity log (Email > Email Routing > Activity Log). It shows whether messages were received, forwarded, or dropped.
- **MX records not appearing:** Ensure you completed the Email Routing setup. Cloudflare auto-adds them only when routing is fully enabled.
- **DNS records showing orange cloud:** All email-related DNS records must be **"DNS only" (gray cloud)**, not proxied. Proxied email records will break routing.

---

## Part 2: Resend Domain Verification (Outbound DNS)

Verify rajivrago.com with Resend so it can send emails on behalf of the domain.

### Steps

1. Log in to the [Resend dashboard](https://resend.com/domains).

2. Navigate to **Domains > Add Domain**.

3. Enter `rajivrago.com` and click Add.

4. Resend will display DNS records to add. Copy each record and add it in the Cloudflare DNS dashboard. The records follow this pattern:

   **SPF record (TXT on `send` subdomain):**
   | Type | Name | Value |
   |------|------|-------|
   | TXT | `send` | `v=spf1 include:amazonses.com ~all` |

   **DKIM record (TXT on `resend._domainkey`):**
   | Type | Name | Value |
   |------|------|-------|
   | TXT | `resend._domainkey` | *(long DKIM public key -- copy from Resend dashboard)* |

   **MX record (on `send` subdomain):**
   | Type | Name | Value | Priority |
   |------|------|-------|----------|
   | MX | `send` | `feedback-smtp.us-east-1.amazonses.com` | 10 |

   **Use the exact values from the Resend dashboard.** The values above are representative; your dashboard may show different region-specific hostnames or key values.

5. When adding each record in Cloudflare, make sure the proxy status is **"DNS only" (gray cloud)**. This is critical -- proxied records will prevent verification.

6. **Wait at least 10 minutes** for DNS propagation before proceeding.

7. Verify records have propagated using `dig`:

   ```bash
   # SPF on send subdomain
   dig TXT send.rajivrago.com +short
   # Expected: "v=spf1 include:amazonses.com ~all"

   # DKIM
   dig TXT resend._domainkey.rajivrago.com +short
   # Expected: long DKIM key string starting with "p="

   # MX on send subdomain
   dig MX send.rajivrago.com +short
   # Expected: 10 feedback-smtp.us-east-1.amazonses.com.
   ```

8. Once `dig` confirms the records are visible, go back to the Resend dashboard and click **Verify**.

### Troubleshooting

- **`dig` shows expected values but Resend says "pending":** DNS propagation can take up to 60 minutes in rare cases. Wait and retry.
- **`dig` returns empty:** Double-check the record name in Cloudflare. The `send` subdomain means the Name field should be `send`, not `send.rajivrago.com` (Cloudflare appends the domain automatically).
- **Records are proxied (orange cloud):** Edit each record in Cloudflare and toggle to "DNS only."

### Note on SPF records

Resend's SPF record goes on the `send` subdomain (`send.rajivrago.com`), **not** the root domain. This means it does not conflict with Cloudflare's root-domain SPF record (`v=spf1 include:_spf.mx.cloudflare.net ~all`). The two SPF records coexist on different DNS names.

If for any reason the Resend dashboard shows records that should go on the root domain instead of the `send` subdomain, **follow the dashboard values** -- they take precedence over this guide.

---

## Part 3: DMARC Record

DMARC tells receiving mail servers how to handle messages that fail SPF/DKIM checks.

### Steps

1. In the Cloudflare DNS dashboard, add a TXT record:

   | Type | Name | Value |
   |------|------|-------|
   | TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:mail@rajivrago.com` |

2. Verify:

   ```bash
   dig TXT _dmarc.rajivrago.com +short
   # Expected: "v=DMARC1; p=none; rua=mailto:mail@rajivrago.com"
   ```

### Notes

- `p=none` is monitoring-only: no emails are rejected based on DMARC. This is the right starting policy while setting up infrastructure.
- `rua=mailto:mail@rajivrago.com` sends aggregate authentication reports to your address, so you can monitor for failures.
- **After verifying everything works reliably**, consider tightening to `p=quarantine` or `p=reject` for stronger protection against spoofing.

---

## Part 4: Edge Function Sender Update

The `contact-notify` edge function sends notification emails via Resend when someone submits the contact form. It needs a `SENDER_EMAIL` secret so it sends from the verified domain.

### Steps

1. In the [Supabase dashboard](https://supabase.com/dashboard), navigate to your project.

2. Go to **Edge Functions > Secrets**.

3. Add a new secret:
   - **Name:** `SENDER_EMAIL`
   - **Value:** `noreply@rajivrago.com`

4. The code change to read this secret is handled separately (see the edge function update in the codebase). The function falls back to `noreply@rajivrago.com` if the secret is not set.

### Note

The domain must be verified with Resend (Part 2) before the edge function can successfully send from `noreply@rajivrago.com`. If the domain is not yet verified, Resend will reject the send request.

---

## Part 5: Gmail "Send Mail As" (Outbound)

Configure Gmail to send emails as mail@rajivrago.com using Resend SMTP.

**Prerequisite:** Cloudflare Email Routing must be working (Part 1) because Gmail sends a verification email to mail@rajivrago.com during setup.

### Steps

1. Open Gmail and go to **Settings** (gear icon) > **See all settings**.

2. Navigate to the **Accounts and Import** tab.

3. In the "Send mail as" section, click **Add another email address**.

4. Enter:
   - **Name:** Your name (as you want it to appear in sent emails)
   - **Email address:** `mail@rajivrago.com`
   - **Uncheck** "Treat as an alias"

5. Click **Next Step**.

6. Enter SMTP settings:

   | Setting | Value |
   |---------|-------|
   | SMTP Server | `smtp.resend.com` |
   | Port | `587` |
   | Username | `resend` |
   | Password | *(your Resend API key -- the same `RESEND_API_KEY` used in the edge function)* |

7. Select **Secured connection using TLS**.

8. Click **Add Account**.

9. Gmail sends a verification email to mail@rajivrago.com. This email routes through Cloudflare Email Routing and arrives in your Gmail inbox (this is why Part 1 must work first).

10. Open the verification email and either click the confirmation link or copy the verification code and enter it.

11. Back in Gmail Settings > Accounts and Import:
    - Click **make default** next to mail@rajivrago.com
    - Under "When replying to a message," select **Reply from the same address the message was sent to**

### Troubleshooting

- **Verification email never arrives:** Confirm Cloudflare Email Routing is working by sending a test email from an external account to mail@rajivrago.com. Check the Email Routing activity log.
- **SMTP authentication fails:** Verify you're using the correct Resend API key. The username is literally `resend`, not your email address.
- **Port 587 blocked:** Try port 465 with SSL instead of TLS.

---

## Part 6: Verification Checklist

Run through all checks to confirm the full email infrastructure is working.

### DNS Verification

Run all five `dig` commands and confirm expected output:

```bash
# 1. Cloudflare MX records (inbound routing)
dig MX rajivrago.com +short
# Expected: route1/2/3.mx.cloudflare.net

# 2. Root domain SPF (Cloudflare)
dig TXT rajivrago.com +short
# Expected (among other records): "v=spf1 include:_spf.mx.cloudflare.net ~all"

# 3. Send subdomain SPF (Resend)
dig TXT send.rajivrago.com +short
# Expected: "v=spf1 include:amazonses.com ~all"

# 4. DKIM (Resend)
dig TXT resend._domainkey.rajivrago.com +short
# Expected: DKIM public key

# 5. DMARC
dig TXT _dmarc.rajivrago.com +short
# Expected: "v=DMARC1; p=none; rua=mailto:mail@rajivrago.com"
```

### Functional Tests

1. **Inbound test:** Send an email from an external account to mail@rajivrago.com. Confirm it arrives in Gmail.

2. **Outbound test:** In Gmail, compose a new email. Select `mail@rajivrago.com` in the "From" dropdown. Send to an external address. Confirm the recipient receives it with the correct From address.

3. **Authentication test:** Ask the recipient to open the email and click **"Show original"** (in Gmail: three dots menu > Show original). Verify:
   - **SPF:** PASS
   - **DKIM:** PASS
   - **DMARC:** PASS

4. **Contact form test:** Submit the portfolio contact form. Confirm the notification email arrives from `noreply@rajivrago.com` (requires the edge function update and Supabase secret from Part 4).

### All Checks Passing?

If all DNS records resolve correctly, inbound forwarding works, outbound sending works, and SPF/DKIM/DMARC all pass, the email infrastructure is complete.
