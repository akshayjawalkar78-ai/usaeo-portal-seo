import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { name, email, event_type, event_name } = await req.json();

    if (!email || !event_type) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const isQuizBowl = event_type === 'quiz-bowl';
    const siteUrl = Deno.env.get('SITE_URL') || 'https://usaeo.org';
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const subject = isQuizBowl
      ? `You're registered for USAEO Quiz Bowl 2026!`
      : `You're registered for the USAEO Essay Competition 2026!`;

    const eventSpecificHtml = isQuizBowl
      ? `
        <p style="margin:0 0 16px;">Once you've signed in, head to your <strong>Dashboard → Competition</strong> tab to view your registration and next steps.</p>
        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:16px 20px;margin:0 0 24px;">
          <p style="margin:0;font-size:14px;color:#9a3412;font-weight:600;">Important: Create Your Team</p>
          <p style="margin:6px 0 0;font-size:14px;color:#7c2d12;">After logging in, go to your Dashboard and create your Quiz Bowl team. You'll need a team to compete.</p>
        </div>`
      : `
        <p style="margin:0 0 24px;">Once you've signed in, head to your <strong>Dashboard → Competition</strong> tab to view your registration and submission details.</p>`;

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f9f9f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f8;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <img src="${siteUrl}/logos/USAEOlogo.png" alt="USAEO" width="48" height="48" style="display:block;" />
              <p style="margin:10px 0 0;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#9ca3af;">USA Economics Organization</p>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:40px 36px;">
              <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#f97316;">Registration Confirmed</p>
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;line-height:1.3;">You're in, ${name || 'Student'}!</h1>
              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">Your registration for <strong style="color:#111827;">${event_name}</strong> has been confirmed.</p>

              ${eventSpecificHtml}

              <p style="margin:0 0 16px;font-size:14px;color:#374151;">Sign in to your USAEO account to access your dashboard:</p>
              <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="border-radius:50px;background:#f97316;">
                    <a href="${siteUrl}/login" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:50px;">Sign In to Dashboard →</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:13px;color:#9ca3af;">Don't have an account yet? <a href="${siteUrl}/register-account" style="color:#f97316;font-weight:600;text-decoration:none;">Create one here</a> — it's free.</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 0 0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">© 2026 USA Economics Organization · <a href="${siteUrl}" style="color:#9ca3af;">usaeo.org</a></p>
              <p style="margin:6px 0 0;font-size:12px;color:#9ca3af;">You received this because you registered for a USAEO competition.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'USAEO <noreply@usaeo.org>',
        to: [email],
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
