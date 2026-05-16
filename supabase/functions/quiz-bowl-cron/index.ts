// Quiz Bowl scheduled tasks. Invoked every ~10 min by pg_cron (or the
// admin "Run scheduler now" button). Idempotent: safe to run repeatedly.
//
//   1. Expire slot holds past their 24h window → release shift + match.
//   2. Send 24h-warning emails for matches unscheduled near the deadline.
//   3. At group_stage_end: mark unplayed group matches as draws, compute
//      qualifiers, generate the single-elim playoff bracket once, flip phase.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function targetPlayoffSize(n: number) {
  if (n < 16) return 0;
  if (n <= 35) return 8;
  if (n <= 67) return 16;
  return 32;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const siteUrl = Deno.env.get('SITE_URL') || 'https://usaeo.org';
  const sb = createClient(supabaseUrl, serviceKey);
  const now = new Date();
  const log: Record<string, unknown> = {};

  const notify = (template: string, to: string | string[], data: Record<string, string>) =>
    fetch(`${supabaseUrl}/functions/v1/quiz-bowl-notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ template, to, data }),
    }).catch((e) => console.error('notify failed', e));

  try {
    // ── 1. Expire stale holds ───────────────────────────────────
    const { data: stale } = await sb
      .from('quiz_bowl_slot_holds')
      .select('*')
      .eq('status', 'holding')
      .lt('expires_at', now.toISOString());

    for (const h of stale || []) {
      await sb.from('quiz_bowl_slot_holds').update({ status: 'expired' }).eq('id', h.id);
      if (h.shift_id) {
        await sb
          .from('quiz_bowl_ref_shifts')
          .update({ status: 'open', match_id: null })
          .eq('id', h.shift_id);
      }
      if (h.match_id) {
        await sb
          .from('quiz_bowl_matches')
          .update({ status: 'unscheduled', ref_shift_id: null })
          .eq('id', h.match_id);
      }
    }
    log.holdsExpired = (stale || []).length;

    // ── 2. 24h deadline warnings ────────────────────────────────
    const in24h = new Date(now.getTime() + 24 * 3600 * 1000).toISOString();
    const { data: atRisk } = await sb
      .from('quiz_bowl_matches')
      .select('*')
      .in('status', ['unscheduled', 'negotiating'])
      .eq('warn_24h_sent', false)
      .not('deadline', 'is', null)
      .lt('deadline', in24h);

    for (const m of atRisk || []) {
      const { data: teams } = await sb
        .from('quiz_bowl_teams')
        .select('id, captain_email')
        .in('id', [m.team_a_id, m.team_b_id].filter(Boolean));
      const emails = (teams || []).map((t) => t.captain_email).filter(Boolean);
      if (emails.length) {
        await notify('warn_24h', emails, {
          deadline: m.deadline ? new Date(m.deadline).toUTCString() : '',
        });
      }
      await sb.from('quiz_bowl_matches').update({ warn_24h_sent: true }).eq('id', m.id);
    }
    log.warningsSent = (atRisk || []).length;

    // ── 3. Group-stage close → playoffs ─────────────────────────
    const { data: configs } = await sb.from('quiz_bowl_config').select('*').limit(1);
    const config = configs?.[0];

    if (
      config &&
      config.group_stage_end &&
      new Date(config.group_stage_end) <= now &&
      !config.playoff_generated
    ) {
      // Unplayed group matches → draw.
      const { data: openGroup } = await sb
        .from('quiz_bowl_matches')
        .select('*')
        .eq('stage', 'group')
        .in('status', ['unscheduled', 'negotiating', 'locked', 'live']);

      for (const m of openGroup || []) {
        await sb.from('quiz_bowl_matches').update({ status: 'draw' }).eq('id', m.id);
        for (const tid of [m.team_a_id, m.team_b_id].filter(Boolean)) {
          const { data: tr } = await sb
            .from('quiz_bowl_teams')
            .select('draws')
            .eq('id', tid)
            .single();
          await sb
            .from('quiz_bowl_teams')
            .update({ draws: (tr?.draws || 0) + 1 })
            .eq('id', tid);
        }
      }
      log.drawsMarked = (openGroup || []).length;

      // Qualifiers: top-1 per group bracket guaranteed, rest by score.
      const { data: groupBrackets } = await sb
        .from('quiz_bowl_brackets')
        .select('id')
        .eq('stage', 'group');
      const { data: allTeams } = await sb
        .from('quiz_bowl_teams')
        .select('id, bracket_id, cumulative_score');

      const totalTeams = (allTeams || []).length;
      const Q = targetPlayoffSize(totalTeams);

      if (Q >= 2 && groupBrackets?.length) {
        const winners: any[] = [];
        const others: any[] = [];
        for (const b of groupBrackets) {
          const inB = (allTeams || [])
            .filter((t) => t.bracket_id === b.id)
            .sort((x, y) => (y.cumulative_score || 0) - (x.cumulative_score || 0));
          if (inB[0]) winners.push(inB[0]);
          others.push(...inB.slice(1));
        }
        const guaranteed = winners
          .sort((a, b) => (b.cumulative_score || 0) - (a.cumulative_score || 0))
          .slice(0, Q);
        const wildcards = others
          .sort((a, b) => (b.cumulative_score || 0) - (a.cumulative_score || 0))
          .slice(0, Q - guaranteed.length);
        const seeds = [...guaranteed, ...wildcards].sort(
          (a, b) => (b.cumulative_score || 0) - (a.cumulative_score || 0)
        );

        const { data: pbracket } = await sb
          .from('quiz_bowl_brackets')
          .insert({ name: 'Playoffs', stage: 'playoff', region: 'Championship' })
          .select()
          .single();

        for (const t of seeds) {
          await sb.from('quiz_bowl_teams').update({ qualified: true }).eq('id', t.id);
        }

        const size = seeds.length;
        const deadline = config.playoff_start || null;
        for (let i = 0; i < Math.floor(size / 2); i++) {
          await sb.from('quiz_bowl_matches').insert({
            bracket_id: pbracket.id,
            stage: 'playoff',
            round: 1,
            playoff_slot: i + 1,
            team_a_id: seeds[i]?.id ?? null,
            team_b_id: seeds[size - 1 - i]?.id ?? null,
            status: 'unscheduled',
            deadline,
          });
        }
        log.playoffSeeded = size;
      }

      await sb
        .from('quiz_bowl_config')
        .update({ phase: 'playoff', playoff_generated: true, updated_at: now.toISOString() })
        .eq('id', config.id);
    }

    return new Response(JSON.stringify({ ok: true, ran_at: now.toISOString(), ...log }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
