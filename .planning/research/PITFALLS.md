# Domain Pitfalls

**Domain:** Portfolio email infrastructure + UI/UX polish
**Researched:** 2026-03-05
**Confidence:** HIGH (training data + codebase analysis; no live web verification available)

## Critical Pitfalls

Mistakes that cause broken email delivery, lost visitor contacts, or rework.

### Pitfall 1: Cloudflare Email Routing Silently Conflicts with Existing MX Records

**What goes wrong:** Cloudflare Email Routing requires its own MX records (`route1.mx.cloudflare.net`, `route2.mx.cloudflare.net`, `route3.mx.cloudflare.net`). If rajivrago.com has any pre-existing MX records (from a previous email provider, or default registrar records), Cloudflare will either refuse to enable Email Routing or, worse, routing will be inconsistent -- some mail hits the old MX, some hits Cloudflare's.

**Why it happens:** Cloudflare's dashboard usually auto-adds MX records when Email Routing is enabled, but it does not always delete conflicting records. Users assume enabling the toggle is sufficient.

**Consequences:** Emails to mail@rajivrago.com silently bounce or go to a dead mailbox. No error is visible to the sender or recipient. Lost visitor contacts with zero indication.

**Prevention:**
1. Before enabling Email Routing, go to Cloudflare DNS > rajivrago.com and delete ALL existing MX records.
2. Enable Email Routing. Verify Cloudflare added its three MX records.
3. Also verify the SPF TXT record includes `include:_spf.mx.cloudflare.net`. Cloudflare usually auto-adds this too, but verify.
4. Send a test email from an external account (Gmail, Outlook) to mail@rajivrago.com and confirm delivery.

**Detection:** Send test emails from multiple providers (Gmail, Outlook, ProtonMail). Check Cloudflare Email Routing dashboard for the "Activity" log -- if it shows no activity after sending test emails, MX records are wrong.

**Phase:** Email infrastructure setup (first task before SMTP configuration).

---

### Pitfall 2: Resend Domain Verification Requires Specific DNS Records That Conflict with Cloudflare's

**What goes wrong:** Resend requires you to verify domain ownership by adding DKIM (CNAME) records and potentially an SPF record to rajivrago.com's DNS. Since Cloudflare is already managing DNS and has its own SPF record for Email Routing, adding Resend's SPF alongside Cloudflare's can result in an invalid SPF configuration. SPF allows only one TXT record per domain -- multiple `v=spf1` records cause a "permerror" and email gets rejected.

**Why it happens:** Both Cloudflare Email Routing and Resend want SPF authority. Users add a second SPF record instead of merging the `include:` directives into one record.

**Consequences:** Outbound email from Resend (and the existing contact-notify edge function) gets flagged as spam or rejected by receiving mail servers due to SPF failure. Gmail will show "This message may not have been sent by: rajivrago.com."

**Prevention:**
1. Do NOT create a second SPF TXT record. Merge Resend's include into the existing Cloudflare SPF record.
2. The final SPF record should look like: `v=spf1 include:_spf.mx.cloudflare.net include:send.resend.com ~all`
3. Add Resend's DKIM CNAME records as instructed by Resend dashboard (these don't conflict with anything).
4. Verify with an SPF checker tool (e.g., mxtoolbox.com/spf.aspx) that only one SPF record exists.

**Detection:** After setup, send an email via Resend to a Gmail account. Open the email, click "Show original" -- check that SPF says "PASS", DKIM says "PASS". If either says "FAIL" or "PERMERROR", DNS records need fixing.

**Phase:** Email infrastructure setup, immediately after Cloudflare Email Routing is confirmed working.

---

### Pitfall 3: Gmail "Send Mail As" SMTP Verification Email Never Arrives

**What goes wrong:** When configuring Gmail's "Send mail as" feature with Resend SMTP, Gmail sends a verification code email to the address being added (mail@rajivrago.com). This email must arrive for setup to proceed. If Cloudflare Email Routing is not yet working, or if the routing destination is a different Gmail address than the one being configured, the verification email gets lost.

**Why it happens:** The setup order matters. Gmail sends the verification to mail@rajivrago.com, which Cloudflare must route to the personal Gmail account that is performing the setup. If routing is not configured, or routes to a different address, the code never arrives.

**Consequences:** Setup stalls. Users repeatedly click "Send verification" and get nothing. They think Resend SMTP is broken when it is actually the inbound routing that is not working.

**Prevention:**
1. Complete Cloudflare Email Routing first. Verify mail@rajivrago.com forwards to the Gmail account.
2. Only then start Gmail "Send mail as" configuration.
3. Resend SMTP settings for Gmail: Server: `smtp.resend.com`, Port: `465` (SSL) or `587` (TLS), Username: `resend`, Password: the Resend API key.
4. When Gmail prompts for the verification code, check the Gmail inbox (where Cloudflare routes to), not the mail@rajivrago.com inbox directly.

**Detection:** If verification email does not arrive within 2 minutes, check Cloudflare Email Routing activity log. If it shows no inbound activity, the routing is not configured or MX records are wrong.

**Phase:** Email infrastructure setup, after both Cloudflare routing AND Resend domain verification are confirmed.

---

### Pitfall 4: Removing the Contact Form Loses the Submission History and Notification Pipeline

**What goes wrong:** The current contact form writes to the `contact_messages` Supabase table and triggers the `contact-notify` edge function for email notifications. Replacing it with a `mailto:` link eliminates all of this: no submission history, no notification pipeline, no admin messages view. But the admin dashboard still has `MessagesAdmin`, `MessageDetail`, and `useAdminMessages` components that reference the now-unused table.

**Why it happens:** The replacement is treated as a simple UI swap (remove form, add mailto link) without considering the downstream infrastructure that depends on the form.

**Consequences:**
1. Dead admin pages: MessagesAdmin renders an empty list forever, confusing the admin.
2. Orphaned code: `useContactForm`, `ContactForm`, `useAdminMessages`, `MessagesAdmin`, `MessageDetail`, the contact-notify edge function, and the `contact_messages` table all become dead weight.
3. Orphaned database webhook: The database webhook trigger for `contact_messages` INSERT still exists even though nothing writes to it.

**Prevention:**
1. When replacing the form with mailto, also:
   - Remove or hide the Messages admin section from the dashboard nav.
   - Remove `ContactForm.tsx`, `useContactForm.ts` (or leave with a comment for potential revert).
   - Consider keeping the `contact_messages` table for historical data but removing the edge function webhook trigger.
   - Update `ContactSection.tsx` to remove the form column and adjust the layout (currently a 2-column grid: links + form).
   - Update the `ContactLinks` text that says "or use the form to send me a message directly."
2. Document the removal in case you want to revert later.

**Detection:** After removing the form, navigate to `/admin/messages` and verify it either shows a sensible empty state or has been removed from navigation.

**Phase:** Contact form replacement phase.

---

### Pitfall 5: Edge Function Still Sends From `noreply@yourdomain.com`

**What goes wrong:** The existing `contact-notify` edge function (line 51) hardcodes `from: 'Portfolio <noreply@yourdomain.com>'`. This was never updated to the actual domain. Even if the contact form is being replaced with mailto, this edge function is still deployed and may still fire if there are existing database webhooks or if the form is reinstated later.

**Why it happens:** Placeholder was left from initial development. CONCERNS.md already flags this.

**Consequences:** If the edge function fires, Resend rejects the send (unverified sender domain) or the email goes to spam. This is a pre-existing bug, but the email infrastructure milestone is the natural place to fix it.

**Prevention:**
1. If keeping the edge function: update `from` to use the verified Resend domain (`noreply@rajivrago.com` or `mail@rajivrago.com`).
2. If removing the contact form entirely: disable the database webhook and optionally delete/archive the edge function.
3. Make the `from` address configurable via environment variable rather than hardcoded.

**Detection:** Check Resend dashboard for failed sends. Search edge function for `yourdomain.com`.

**Phase:** Email infrastructure setup (fix during Resend domain verification).

## Moderate Pitfalls

### Pitfall 6: `mailto:` Links Do Not Work for Users Without a Configured Email Client

**What goes wrong:** Clicking `mailto:mail@rajivrago.com` opens the system default email client. Many users (especially on desktop) have no email client configured -- they use Gmail, Outlook, or other webmail exclusively in the browser. The click either does nothing, opens an empty/unconfigured Mail.app, or shows an OS error dialog.

**Why it happens:** The assumption that `mailto:` is universally functional. It is not. On mobile it works well (opens default mail app). On desktop, particularly developer/tech audiences, many use only webmail.

**Consequences:** Visitors who want to contact cannot. Unlike the current form (which guarantees the message is sent), mailto depends on the visitor's setup. Some visitors will silently give up.

**Prevention:**
1. Display the email address as visible, copyable text alongside (or instead of) just a clickable link. This way, users can manually copy and paste into their webmail.
2. Consider a pattern like: `<a href="mailto:mail@rajivrago.com">mail@rajivrago.com</a>` -- the email text IS the link, so users can both click and visually see/copy the address.
3. This is already partially handled in `ContactLinks.tsx` which shows the email as visible text. Verify the text remains visible and selectable after the redesign.

**Detection:** Test on a machine with no email client configured. The link should still be useful because the address is visible.

**Phase:** Contact form replacement phase.

---

### Pitfall 7: Animation Overload Degrades Performance and Feels Unprofessional

**What goes wrong:** When adding micro-interactions, hover effects, and animations to a static site, there is a strong tendency to add too many. Every card animates in, every hover has a bounce, every section fades and slides. The result feels like a template site from 2015 rather than a polished portfolio.

**Why it happens:** Each animation looks good in isolation. The cumulative effect is only visible when viewing the full page, and by that point the developer has normalized each individual effect.

**Consequences:**
1. Performance: Multiple simultaneous CSS animations or JS-driven animations cause layout thrashing, especially on scroll. Mobile devices stutter.
2. Professionalism: Over-animated sites signal "learning CSS" rather than "senior developer."
3. Accessibility: Even with `prefers-reduced-motion`, some users find excessive motion distracting.

**Prevention:**
1. Limit to 2-3 animation types across the entire site. The existing scroll-reveal (fade-up) is one. Add at most: subtle hover scale on cards, and one entrance animation for the hero.
2. Use CSS transitions (not keyframe animations) for hover effects -- they are GPU-composited and performant.
3. Only animate `transform` and `opacity`. Never animate `width`, `height`, `top`, `left`, `margin`, or `padding` -- these trigger layout recalculation.
4. Review the full page top-to-bottom in one scroll before shipping. If it feels "busy," remove animations.
5. Test on a throttled CPU (Chrome DevTools > Performance > CPU throttle 4x) to catch jank.

**Detection:** Record a screen capture of scrolling through the full page. Watch at 1x speed. If anything feels distracting, remove it.

**Phase:** UI/UX overhaul phase.

---

### Pitfall 8: Adding Framer Motion to an Existing CSS Animation System Creates Conflicts

**What goes wrong:** The codebase already has a CSS-based animation system (`scroll-reveal` classes + `useScrollReveal` hook + `@keyframes fade-up`). Adding Framer Motion alongside this creates two competing animation systems. Components animated by Framer Motion behave differently from CSS-animated ones (different easing, different timing, different reveal patterns). Worse, if Framer Motion and CSS both try to set `opacity` or `transform` on the same element, they fight.

**Why it happens:** Framer Motion is the default recommendation for React animations, and it is tempting to add it for new interactions while leaving existing CSS animations in place.

**Consequences:**
1. Visual inconsistency: Some sections fade-up via CSS, others spring-in via Framer Motion.
2. Double-animation bugs: An element with both `scroll-reveal` CSS class and Framer Motion's `initial`/`animate` props gets animated twice.
3. Bundle size: Framer Motion adds ~32KB gzipped to the bundle. For a portfolio site that already has working CSS animations, this is significant overhead.

**Prevention:**
1. Choose one system and commit to it. The existing CSS approach is lightweight and working. Extend it rather than replacing it.
2. If Framer Motion is chosen for new interactions (e.g., layout animations, drag, gesture-based interactions that CSS cannot do), migrate ALL existing CSS animations to Framer Motion first, then add new ones.
3. If staying with CSS: add new animations as CSS transitions/keyframes and extend `useScrollReveal` or create sibling hooks.
4. The PROJECT.md constraint says "no heavy animation libraries beyond what Framer Motion or CSS can handle" -- this does not mandate Framer Motion. CSS is sufficient for scroll-reveal, hover effects, and micro-interactions.

**Detection:** Search the codebase for both `framer-motion` imports and `.scroll-reveal` classes. If both exist on the same page, there is a conflict risk.

**Phase:** UI/UX overhaul phase (decide before writing any animation code).

---

### Pitfall 9: Removing Container/Shadow from Avatar Without Addressing Layout Shift

**What goes wrong:** The hero avatar currently sits inside a `div` with `w-[130px] h-[130px] rounded-[--radius-xl] overflow-hidden shadow-lg`. Removing the container/shadow means the `img` element needs its own explicit dimensions. If the image loads slowly and has no dimensional container, the text below shifts up then down when the image appears (Cumulative Layout Shift / CLS).

**Why it happens:** The container div currently provides the dimensions. Removing it and putting the image standalone without explicit `width`/`height` or an aspect-ratio container causes the browser to not know the image dimensions until it loads.

**Consequences:** Visible layout jank on first load. CLS hurts Core Web Vitals score. The hero section is the first thing visitors see, so jank there is particularly bad.

**Prevention:**
1. Keep explicit `width` and `height` attributes on the `<img>` tag (already present: `width={130} height={130}`).
2. After removing the container div, apply sizing directly to the `<img>`: `className="w-[130px] h-[130px]"`.
3. Keep `imageRendering: 'pixelated'` for the pixel art aesthetic.
4. Test with network throttling (Chrome DevTools > Slow 3G) to verify no layout shift.

**Detection:** Lighthouse audit > CLS score. Or visually: throttle network to Slow 3G and watch the hero load.

**Phase:** Hero avatar fix phase.

---

### Pitfall 10: DKIM/SPF DNS Propagation Delay Causes "Setup Failed" False Alarm

**What goes wrong:** After adding Resend's DKIM CNAME records and the merged SPF record to Cloudflare DNS, the user clicks "Verify" in Resend's dashboard immediately. DNS propagation can take 1-60 minutes even on Cloudflare (which is usually fast). Resend reports "verification failed," the user thinks they entered the records wrong, deletes and re-adds them, and enters a frustrating debug loop.

**Why it happens:** DNS propagation delay, even with Cloudflare's fast DNS, can be non-zero for new CNAME records. Resend's verification check is a point-in-time DNS lookup.

**Consequences:** Wasted time debugging correct DNS records. Risk of introducing actual errors by repeatedly editing records.

**Prevention:**
1. Add all DNS records, then wait 10 minutes before clicking Verify in Resend.
2. Use `dig` or `nslookup` to independently confirm the records are live before using Resend's verify button:
   ```bash
   dig CNAME resend._domainkey.rajivrago.com
   dig TXT rajivrago.com
   ```
3. If Resend still fails, check for typos in CNAME targets (they usually end in `.resend.com`).

**Detection:** Run DNS lookups locally. If they return the expected values, the records are propagated and Resend should verify.

**Phase:** Email infrastructure setup.

## Minor Pitfalls

### Pitfall 11: Gmail "Send Mail As" Default Reply-From Confusion

**What goes wrong:** After setting up "Send mail as" in Gmail, the user must explicitly select `mail@rajivrago.com` as the "From" address when composing. Gmail defaults to the primary Gmail address. If the user forgets, they send professional replies from their personal Gmail address, undermining the whole point of the custom domain.

**Prevention:**
1. In Gmail Settings > Accounts > "Send mail as," set `mail@rajivrago.com` as the default.
2. Enable "Reply from the same address the message was sent to" so replies to mail@rajivrago.com automatically use that address.

**Phase:** Email infrastructure setup (post-verification configuration step).

---

### Pitfall 12: `mailto:` Link with Pre-filled Subject Gets URL-Encoding Bugs

**What goes wrong:** If the mailto link is enhanced with a pre-filled subject (`mailto:mail@rajivrago.com?subject=Portfolio%20Inquiry`), special characters in the subject or body parameter break across email clients. Ampersands, quotes, and non-ASCII characters are handled inconsistently.

**Prevention:**
1. Keep the mailto link simple: `mailto:mail@rajivrago.com` with no query parameters. Let the visitor write their own subject.
2. If a subject is needed, use only ASCII alphanumeric characters and `%20` for spaces.

**Phase:** Contact form replacement phase.

---

### Pitfall 13: Removing Grid Layout When Contact Form Is Gone

**What goes wrong:** `ContactSection.tsx` uses a `grid grid-cols-2` layout with ContactLinks on the left and ContactForm on the right. Removing ContactForm without adjusting the grid leaves ContactLinks in a half-width column on the left with empty space on the right.

**Prevention:**
1. When removing ContactForm, switch to a single-column or centered layout.
2. Consider centering the contact links or redesigning the section to look intentional as a standalone element rather than a grid orphan.

**Detection:** Visual review after removing the form component.

**Phase:** Contact form replacement phase.

---

### Pitfall 14: CSS Hover Effects Break on Touch Devices

**What goes wrong:** When adding hover effects to cards (scale, shadow, border color changes), they "stick" on touch devices. A user taps a card, the hover state activates and remains active until they tap elsewhere. This looks like a visual bug.

**Prevention:**
1. Use `@media (hover: hover)` to scope hover-only effects to devices that actually support hover.
2. Pattern: `@media (hover: hover) { .card:hover { transform: scale(1.02); } }`
3. In Tailwind v4, use `hover:` utilities which should respect this, but verify on actual mobile devices.

**Detection:** Test on a real phone or use Chrome DevTools device emulation with touch simulation enabled.

**Phase:** UI/UX overhaul phase.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Cloudflare Email Routing | Conflicting MX records (Pitfall 1) | Delete ALL existing MX before enabling; verify with test email |
| Resend domain verification | SPF record conflict (Pitfall 2) | Merge into single SPF record; verify with mxtoolbox |
| Resend domain verification | DNS propagation false alarm (Pitfall 10) | Wait 10 min; use `dig` to confirm before clicking Verify |
| Gmail Send Mail As | Verification email lost (Pitfall 3) | Complete Cloudflare routing first; check correct inbox |
| Gmail Send Mail As | Wrong default From address (Pitfall 11) | Set custom domain as default sender in Gmail settings |
| Contact form removal | Orphaned admin pages and code (Pitfall 4) | Remove/hide Messages admin; clean up dead components |
| Contact form removal | Grid layout orphan (Pitfall 13) | Redesign ContactSection for single-column |
| Contact form removal | mailto UX gap (Pitfall 6) | Show email as copyable text, not just a link |
| Edge function cleanup | Hardcoded placeholder domain (Pitfall 5) | Fix or remove before deploying email changes |
| Hero avatar fix | Layout shift on image load (Pitfall 9) | Keep explicit width/height on img element |
| UI/UX animations | Animation overload (Pitfall 7) | Limit to 2-3 animation types; test full-page scroll |
| UI/UX animations | Dual animation system conflict (Pitfall 8) | Pick CSS OR Framer Motion, not both |
| UI/UX hover effects | Sticky hover on touch devices (Pitfall 14) | Use `@media (hover: hover)` for hover effects |

## Recommended Setup Order (Dependency Chain)

The email pitfalls reveal a strict dependency order:

```
1. Delete existing MX records on Cloudflare DNS
2. Enable Cloudflare Email Routing for rajivrago.com -> personal Gmail
3. TEST: Send external email to mail@rajivrago.com, confirm it arrives in Gmail
4. Add Resend DKIM CNAME records to Cloudflare DNS
5. Merge Resend SPF into existing Cloudflare SPF TXT record
6. Wait 10 minutes for DNS propagation
7. Verify domain in Resend dashboard
8. TEST: Send email via Resend API, confirm DKIM/SPF pass in Gmail "Show original"
9. Configure Gmail "Send mail as" with Resend SMTP credentials
10. TEST: Send email FROM Gmail as mail@rajivrago.com, confirm recipient sees correct From
11. Set mail@rajivrago.com as default sender in Gmail
```

Skipping or reordering steps 1-3 before step 9 causes Pitfall 3 (verification email never arrives).

## Sources

- Codebase analysis: `src/components/public/ContactForm.tsx`, `src/components/public/ContactSection.tsx`, `src/components/public/ContactLinks.tsx`, `src/components/public/HeroSection.tsx`, `src/hooks/useScrollReveal.ts`, `src/hooks/useContactForm.ts`, `supabase/functions/contact-notify/index.ts`, `src/index.css`
- `.planning/codebase/CONCERNS.md` (edge function placeholder domain flagged)
- `.planning/PROJECT.md` (project constraints and requirements)
- Cloudflare Email Routing DNS requirements: training data (HIGH confidence -- well-documented, stable feature)
- Resend SMTP configuration: training data (HIGH confidence -- standard SMTP setup)
- SPF record merging: training data (HIGH confidence -- DNS standard, RFC 7208)
- Animation performance: training data (HIGH confidence -- well-established web performance principles)
- Note: WebSearch and WebFetch were unavailable. All findings are from training data and direct codebase analysis. Cloudflare and Resend documentation should be consulted during implementation for the most current setup steps.

---

*Pitfalls audit: 2026-03-05*
