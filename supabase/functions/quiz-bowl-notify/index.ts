// Transactional Quiz Bowl emails via Resend.
// Templates: round_open | hold_alert | match_confirmed | warn_24h
// Called from the client (scheduling actions) and from quiz-bowl-cron.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Payload {
  template: 'round_open' | 'hold_alert' | 'match_confirmed' | 'warn_24h';
  to: string | string[];
  data?: Record<string, string>;
}

function shell(siteUrl: string, title: string, bodyHtml: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f9f9f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f8;padding:40px 16px;"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">
<tr><td align="center" style="padding-bottom:24px;">
<img src="${siteUrl}/logos/USAEOlogo.png" alt="USAEO" width="48" height="48" style="display:block;"/>
<p style="margin:10px 0 0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;">USA Economics Organization</p>
</td></tr>
<tr><td style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:40px 36px;">
${bodyHtml}
<table cellpadding="0" cellspacing="0" style="margin:24px 0 0;"><tr>
<td style="border-radius:50px;background:#f97316;">
<a href="${siteUrl}/quiz-bowl" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:50px;">Open Quiz Bowl Portal →</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:24px 0 0;text-align:center;">
<p style="margin:0;font-size:12px;color:#9ca3af;">© 2026 USA Economics Organization · <a href="${siteUrl}" style="color:#9ca3af;">usaeo.org</a></p>
</td></tr></table></td></tr></table></body></html>`;
}

function render(template: string, d: Record<string, string>) {
  switch (template) {
    case 'round_open':
      return {
        subject: `Quiz Bowl Round ${d.round || ''} is open — schedule your match`,
        body: `<p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#f97316;">Round Open</p>
<h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Time to schedule, ${d.team_name || 'Captain'}!</h1>
<p style="margin:0 0 16px;font-size:15px;color:#6b7280;line-height:1.6;">Round ${d.round || ''} is now open. Head to the Quiz Bowl portal to claim a referee slot and coordinate with your opponent before the deadline${d.deadline ? ` (<strong>${d.deadline}</strong>)` : ''}.</p>`,
      };
    case 'hold_alert':
      return {
        subject: `${d.proposing_team || 'A team'} proposed a Quiz Bowl match time`,
        body: `<p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#f97316;">Action Needed — 24h</p>
<h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">${d.proposing_team || 'Your opponent'} proposed ${d.proposed_time || 'a time'}</h1>
<p style="margin:0 0 16px;font-size:15px;color:#6b7280;line-height:1.6;">You have <strong>24 hours</strong> to <strong>Claim</strong>, <strong>Decline</strong>, or <strong>Request a Change</strong>. If the timer runs out, the slot returns to the open pool.</p>`,
      };
    case 'match_confirmed':
      return {
        subject: `Quiz Bowl match confirmed — ${d.match_time || 'see details'}`,
        body: `<p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#16a34a;">Match Confirmed</p>
<h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">${d.team_a || 'Team A'} vs ${d.team_b || 'Team B'}</h1>
<p style="margin:0 0 16px;font-size:15px;color:#6b7280;line-height:1.6;">Scheduled for <strong>${d.match_time || 'TBD'}</strong>. The Google Meet link and Kahoot/Multibuzzer details unlock in the live lobby 15 minutes before start once both captains and the referee check in.</p>`,
      };
    case 'warn_24h':
      return {
        subject: `Reminder: Quiz Bowl match still unscheduled`,
        body: `<p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#dc2626;">24h Warning</p>
<h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Your match isn't scheduled yet</h1>
<p style="margin:0 0 16px;font-size:15px;color:#6b7280;line-height:1.6;">The round deadline is in under 24 hours${d.deadline ? ` (<strong>${d.deadline}</strong>)` : ''}. Unscheduled matches at the deadline are recorded as a <strong>draw</strong> for both teams.</p>`,
      };
    default:
      return { subject: 'USAEO Quiz Bowl', body: '<p>Quiz Bowl update.</p>' };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { template, to, data = {} }: Payload = await req.json();
    if (!template || !to) {
      return new Response(JSON.stringify({ error: 'Missing template or recipient' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const siteUrl = Deno.env.get('SITE_URL') || 'https://usaeo.org';
    const { subject, body } = render(template, data);
    const html = shell(siteUrl, subject, body);
    const recipients = Array.isArray(to) ? to : [to];

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'USAEO Quiz Bowl <noreply@usaeo.org>',
        to: recipients,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
