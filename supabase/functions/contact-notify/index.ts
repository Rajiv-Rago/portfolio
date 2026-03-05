// Supabase Edge Function — Contact notification email
// Triggered via database webhook on INSERT into contact_messages

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL') ?? ''
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const SENDER_EMAIL = Deno.env.get('SENDER_EMAIL') ?? 'noreply@rajivrago.com'

interface ContactPayload {
  type: 'INSERT'
  table: string
  record: {
    id: string
    sender_name: string
    sender_email: string
    subject: string
    body: string
    created_at: string
  }
}

serve(async (req) => {
  try {
    const payload: ContactPayload = await req.json()
    const { sender_name, sender_email, subject, body } = payload.record

    if (!OWNER_EMAIL || !RESEND_API_KEY) {
      console.error('Missing OWNER_EMAIL or RESEND_API_KEY environment variables')
      return new Response(JSON.stringify({ error: 'Not configured' }), { status: 500 })
    }

    const emailBody = `
New contact form submission:

From: ${sender_name} (${sender_email})
Subject: ${subject}

${body}

---
Reply: mailto:${sender_email}
    `.trim()

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Portfolio <${SENDER_EMAIL}>`,
        to: OWNER_EMAIL,
        subject: `Portfolio Contact: ${subject}`,
        text: emailBody,
        reply_to: sender_email,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      console.error('Email send failed:', error)
      return new Response(JSON.stringify({ error: 'Email send failed' }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 })
  }
})
