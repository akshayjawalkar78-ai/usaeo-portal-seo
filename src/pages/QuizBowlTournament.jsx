import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy, ArrowLeft, Calendar, ChevronDown, Flag, Clock, MapPin,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { supabase } from '@/supabaseClient';

const fmt = (d) => (d ? new Date(d).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }) : 'TBD');

const localDateKey = (d) => {
  const dt = new Date(d);
  return [dt.getFullYear(), String(dt.getMonth() + 1).padStart(2, '0'), String(dt.getDate()).padStart(2, '0')].join('-');
};

const toLocalInput = (d) => {
  const dt = new Date(d);
  return localDateKey(dt) + 'T' +
    [String(dt.getHours()).padStart(2, '0'), String(dt.getMinutes()).padStart(2, '0')].join(':');
};

// Tournament window: May 17–24, 2026 (day-view agenda).
const TOURNAMENT_DAYS = Array.from({ length: 8 }, (_, i) => {
  const dt = new Date(2026, 4, 17 + i);
  return {
    key: localDateKey(dt),
    label: dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
  };
});

const RULES = [
  ['Format', 'Each match: 20 Kahoot regular questions + 5 Multibuzzer toss-ups. Highest score wins. Live on Google Meet under a referee.'],
  ['Structure', 'Days 1–4: round-robin group stage. Days 5–7: single-elimination playoffs. Top team per bracket auto-qualifies; remaining playoff slots are score-based wildcards.'],
  ['Scoring', '+1000 per correct toss-up/bonus. Incorrect toss-up = neg penalty (set by admins). Bonus questions carry no penalty. Negative cumulative scores possible.'],
  ['Scheduling', 'Claim an open referee slot to propose a time. The other team has 24h to Claim, Decline, or Request a Change. Unscheduled matches at the round deadline are recorded as draws.'],
  ['Lobby', 'Lobby opens 15 min before match time. Both captains (or one member each) + the referee must check in before the Google Meet link is revealed. A 5-min tech check follows before Kahoot/buzzer links are released.'],
  ['Edge cases', '5-min grace period; a no-show team can be forfeited at 10 min. Short-handed play allowed with at least 1 player. Captains may file a question-accuracy protest within 30 min post-match before the score locks.'],
  ['Integrity', 'No external resources, no outside assistance, no recording/sharing questions. Violations range from point deductions to disqualification per the official policy.'],
];

export default function QuizBowlTournament() {
  const { profile } = useAuth();
  const email = profile?.email || '';
  const [teams, setTeams] = useState([]);
  const [brackets, setBrackets] = useState([]);
  const [matches, setMatches] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [holds, setHolds] = useState([]);
  const [members, setMembers] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openRule, setOpenRule] = useState(null);
  const [protesting, setProtesting] = useState(null);
  const [protestText, setProtestText] = useState('');
  const [claimSlot, setClaimSlot] = useState(null); // shift being claimed
  const [calDay, setCalDay] = useState(null); // selected calendar day filter
  const [busy, setBusy] = useState(false);
  const [changeFor, setChangeFor] = useState(null); // hold awaiting counter-propose input
  const [changeReason, setChangeReason] = useState('');
  const [counterTime, setCounterTime] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const [t, b, m, sh, hd, mem, cfg] = await Promise.all([
      base44.entities.QuizBowlTeam.list().catch(() => []),
      base44.entities.QuizBowlBracket.list().catch(() => []),
      base44.entities.QuizBowlMatch.list('-created_at').catch(() => []),
      base44.entities.QuizBowlRefShift.filter({ status: 'open' }).catch(() => []),
      base44.entities.QuizBowlSlotHold.list('-created_at').catch(() => []),
      base44.entities.QuizBowlTeamMember.filter({ user_email: email }).catch(() => []),
      base44.entities.QuizBowlConfig.list().catch(() => []),
    ]);
    setTeams(t); setBrackets(b); setMatches(m); setShifts(sh);
    setHolds(hd); setMembers(mem); setConfig(cfg[0] || null);
    setLoading(false);
  }, [email]);
  useEffect(() => { load(); }, [load]);

  const myTeam = useMemo(() => {
    const ids = new Set(members.map((x) => x.team_id));
    return teams.find((t) => ids.has(t.id)) || null;
  }, [members, teams]);
  const isCaptain = members.some((x) => x.role === 'captain');
  const teamById = (id) => teams.find((t) => t.id === id);
  const bracketById = (id) => brackets.find((b) => b.id === id);

  const myBracket = myTeam?.bracket_id ? bracketById(myTeam.bracket_id) : null;
  const myMatches = myTeam
    ? matches.filter((m) => m.team_a_id === myTeam.id || m.team_b_id === myTeam.id)
    : [];

  const standings = (bracketId) =>
    teams.filter((t) => t.bracket_id === bracketId)
      .sort((a, b) => (b.cumulative_score || 0) - (a.cumulative_score || 0));

  const fileProtest = async (match) => {
    await base44.entities.QuizBowlProtest.create({
      match_id: match.id, team_id: myTeam.id, captain_email: email,
      reason: protestText, status: 'open',
      window_expires_at: new Date(Date.now() + 30 * 60000).toISOString(),
    });
    setProtesting(null); setProtestText(''); load();
  };

  // Captain claims an open ref slot for one of their unscheduled matches.
  // Exclude matches where the opponent already has an active hold — captain must respond to that instead.
  const schedulableMatches = myTeam
    ? myMatches.filter((m) => {
        if (!['unscheduled', 'negotiating'].includes(m.status)) return false;
        const oppHold = holds.find((h) =>
          h.match_id === m.id &&
          ['holding', 'change_requested'].includes(h.status) &&
          h.proposing_team_id !== myTeam.id
        );
        return !oppHold;
      })
    : [];

  const proposeHold = async (shift, match, proposedISO) => {
    setBusy(true);
    try {
      // Guard: block if opponent already has an active hold for this match
      const conflict = holds.find((h) =>
        h.match_id === match.id &&
        ['holding', 'change_requested'].includes(h.status) &&
        h.proposing_team_id !== myTeam.id
      );
      if (conflict) {
        setClaimSlot(null);
        return; // "Pending proposals" card already surfaced this
      }
      const expires = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
      await base44.entities.QuizBowlSlotHold.create({
        shift_id: shift.id, match_id: match.id, proposing_team_id: myTeam.id,
        proposed_time: proposedISO, status: 'holding', expires_at: expires,
      });
      await base44.entities.QuizBowlRefShift.update(shift.id, { status: 'held', match_id: match.id });
      await base44.entities.QuizBowlMatch.update(match.id, {
        status: 'negotiating', ref_shift_id: shift.id, ref_email: shift.ref_email,
        scheduled_at: proposedISO, last_interaction_at: new Date().toISOString(),
      });
      const oppId = match.team_a_id === myTeam.id ? match.team_b_id : match.team_a_id;
      const opp = teams.find((t) => t.id === oppId);
      if (opp?.captain_email) {
        supabase.functions.invoke('quiz-bowl-notify', {
          body: {
            template: 'hold_alert', to: opp.captain_email,
            data: { proposing_team: myTeam.team_name, proposed_time: new Date(proposedISO).toUTCString() },
          },
        }).catch(() => {});
      }
      setClaimSlot(null);
      await load();
    } finally { setBusy(false); }
  };

  const respondToHold = async (hold, action, reason) => {
    setBusy(true);
    try {
      if (action === 'claim') {
        await base44.entities.QuizBowlSlotHold.update(hold.id, { status: 'claimed' });
        await base44.entities.QuizBowlRefShift.update(hold.shift_id, { status: 'claimed' });
        await base44.entities.QuizBowlMatch.update(hold.match_id, {
          status: 'locked', last_interaction_at: new Date().toISOString(),
        });
      } else if (action === 'decline') {
        await base44.entities.QuizBowlSlotHold.update(hold.id, { status: 'declined' });
        await base44.entities.QuizBowlRefShift.update(hold.shift_id, { status: 'open', match_id: null });
        await base44.entities.QuizBowlMatch.update(hold.match_id, {
          status: 'unscheduled', ref_shift_id: null, scheduled_at: null,
          last_interaction_at: new Date().toISOString(),
        });
      } else if (action === 'change') {
        await base44.entities.QuizBowlSlotHold.update(hold.id, {
          status: 'change_requested', change_reason: reason || '',
          ...(counterTime ? { counter_proposed_time: new Date(counterTime).toISOString() } : {}),
        });
        setChangeFor(null); setChangeReason(''); setCounterTime('');
      }
      await load();
    } finally { setBusy(false); }
  };

  const dayKey = localDateKey;
  const slotDays = new Set(shifts.map((s) => dayKey(s.start_at)));
  const rounds = Array.isArray(config?.round_deadlines) ? config.round_deadlines : [];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          {config?.phase && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-orange-200 uppercase">{config.phase} phase</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Quiz Bowl 2026</h1>
        </div>

        {!myTeam && (
          <div className="bg-white rounded-2xl border border-border p-6 text-sm text-muted-foreground">
            You're not on a Quiz Bowl team yet. <Link to="/register/quiz-bowl" className="text-primary font-semibold">Register here</Link>.
          </div>
        )}

        {/* Pinned: my bracket */}
        {myTeam && (
          <div className="bg-white rounded-2xl border-2 border-primary/30 p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Your bracket</p>
                <h2 className="text-lg font-bold text-foreground">{myBracket?.name || 'Not assigned yet'}
                  {myBracket && <span className="text-sm font-normal text-muted-foreground"> · {myBracket.region}</span>}</h2>
              </div>
              <div className="text-sm text-muted-foreground">
                {myTeam.team_name}: <strong className="text-foreground">{myTeam.wins || 0}W {myTeam.losses || 0}L {myTeam.draws || 0}D</strong> · {myTeam.cumulative_score || 0} pts
                {myTeam.qualified && <span className="ml-2 text-xs font-semibold text-success bg-success/10 border border-green-200 px-2 py-0.5 rounded-full">Qualified</span>}
              </div>
            </div>
            {myBracket && (
              <div className="space-y-1">
                {standings(myBracket.id).map((t, i) => (
                  <div key={t.id} className={`flex items-center gap-3 text-sm py-1.5 border-b border-border/40 last:border-0 ${t.id === myTeam.id ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                    <span className="w-5">{i + 1}</span>
                    <span className="flex-1">{t.team_name}</span>
                    <span className="text-xs">{t.wins || 0}W {t.losses || 0}L {t.draws || 0}D · {t.cumulative_score || 0} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My matches + deadlines */}
        {myTeam && (
          <div className="bg-white rounded-2xl border border-border p-6 space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Clock className="w-4 h-4" /> Your matches</h3>
            {myMatches.length === 0 && <p className="text-sm text-muted-foreground">No matches scheduled yet.</p>}
            {myMatches.map((m) => {
              const opp = teamById(m.team_a_id === myTeam.id ? m.team_b_id : m.team_a_id);
              const canProtest = m.status === 'completed' && isCaptain && m.score_locked_at &&
                (Date.now() - new Date(m.score_locked_at).getTime()) < 30 * 60000;
              return (
                <div key={m.id} className="flex items-center justify-between gap-3 text-sm border-b border-border/40 last:border-0 py-2">
                  <div>
                    <p className="text-foreground">vs {opp?.team_name || 'TBD'} <span className="text-xs text-muted-foreground">· {m.stage} R{m.round}</span></p>
                    <p className="text-xs text-muted-foreground">
                      {m.status}{m.scheduled_at ? ` · ${fmt(m.scheduled_at)}` : ''}
                      {m.deadline ? ` · due ${fmt(m.deadline)}` : ''}
                      {['completed', 'forfeit', 'draw'].includes(m.status) ? ` · ${m.team_a_score ?? '–'}:${m.team_b_score ?? '–'}` : ''}
                    </p>
                  </div>
                  {canProtest && (
                    <button onClick={() => setProtesting(m)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive border border-red-200 flex items-center gap-1.5">
                      <Flag className="w-3.5 h-3.5" /> Protest
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pending holds — opponent proposed, captain must respond */}
        {isCaptain && myTeam && (() => {
          const pending = holds.filter((h) =>
            ['holding', 'change_requested'].includes(h.status) &&
            myMatches.some((m) => m.id === h.match_id) &&
            h.proposing_team_id !== myTeam.id
          );
          if (pending.length === 0) return null;
          return (
            <div className="bg-white rounded-2xl border-2 border-amber-300 p-6 space-y-3">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" /> Action required — opponent proposals ({pending.length})
              </h3>
              {pending.map((h) => {
                const match = myMatches.find((m) => m.id === h.match_id);
                const opp = teamById(match?.team_a_id === myTeam.id ? match?.team_b_id : match?.team_a_id);
                return (
                  <div key={h.id} className="border border-amber-200 rounded-xl p-4 bg-amber-50 space-y-2">
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">{opp?.team_name || 'Opponent'}</p>
                        <p className="font-medium text-foreground">{fmt(h.proposed_time)}</p>
                      </div>
                      {h.counter_proposed_time && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">Your counter</p>
                          <p className="font-medium text-foreground">{fmt(h.counter_proposed_time)}</p>
                        </div>
                      )}
                    </div>
                    {h.change_reason && (
                      <p className="text-xs text-amber-700">Note: "{h.change_reason}"</p>
                    )}
                    <p className="text-xs text-muted-foreground">Expires {fmt(h.expires_at)}</p>
                    <div className="flex flex-wrap gap-2">
                      <button disabled={busy} onClick={() => respondToHold(h, 'claim')}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-success/10 text-success border border-green-200 hover:bg-success/20 disabled:opacity-50">
                        Accept their time
                      </button>
                      <button disabled={busy} onClick={() => { setChangeFor(h); setCounterTime(''); setChangeReason(''); }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200 disabled:opacity-50">
                        Counter-propose
                      </button>
                      <button disabled={busy} onClick={() => respondToHold(h, 'decline')}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive border border-red-200 hover:bg-destructive/20 disabled:opacity-50">
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

        {/* Round deadlines */}
        {myTeam && rounds.length > 0 && (
          <div className="bg-white rounded-2xl border border-border p-6 space-y-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Clock className="w-4 h-4" /> Round deadlines</h3>
            <p className="text-xs text-muted-foreground">Schedule & finish your match before its round deadline — unplayed matches become draws.</p>
            {rounds.map((r, i) => (
              <div key={i} className="flex justify-between text-sm border-b border-border/40 last:border-0 py-1.5">
                <span className="text-foreground">{r.name || `Round ${i + 1}`}</span>
                <span className="text-muted-foreground">{r.deadline ? fmt(r.deadline) : 'TBD'}</span>
              </div>
            ))}
          </div>
        )}

        {/* Open referee slots — 7-day agenda (May 17–24) */}
        {myTeam && (
          <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Calendar className="w-4 h-4" /> Open referee slots</h3>
            {!isCaptain && (
              <p className="text-xs text-muted-foreground">Only the team captain can claim a slot and propose a time to the opponent.</p>
            )}
            <div className="flex flex-wrap gap-2">
              {TOURNAMENT_DAYS.map((d) => {
                const has = slotDays.has(d.key);
                return (
                  <button key={d.key} onClick={() => setCalDay(d.key)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${calDay === d.key ? 'bg-primary text-white border-primary' : has ? 'border-primary/40 text-primary hover:bg-primary/5' : 'border-border text-muted-foreground'}`}>
                    {d.label}
                    {has && <span className={`ml-1.5 inline-block w-1.5 h-1.5 rounded-full align-middle ${calDay === d.key ? 'bg-white' : 'bg-primary'}`} />}
                  </button>
                );
              })}
            </div>
            {/* Day view: slots with times */}
            <div className="space-y-2">
              {(() => {
                const day = calDay || TOURNAMENT_DAYS[0].key;
                const daySlots = shifts.filter((s) => dayKey(s.start_at) === day)
                  .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));
                if (daySlots.length === 0) {
                  return <p className="text-sm text-muted-foreground">No open referee slots on {day}.</p>;
                }
                return daySlots.map((s) => (
                  <div key={s.id} className="border border-border rounded-lg p-3 text-sm flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-foreground tabular-nums">
                        {new Date(s.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        –{new Date(s.end_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-xs text-muted-foreground">{s.ref_name || 'Referee'}</span>
                    </div>
                    {isCaptain && (
                      <button onClick={() => setClaimSlot(s)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 flex-shrink-0">
                        Claim & propose
                      </button>
                    )}
                  </div>
                ));
              })()}
            </div>
            {holds.filter((h) => h.status === 'change_requested' &&
              myMatches.some((m) => m.id === h.match_id) &&
              h.proposing_team_id === myTeam?.id).map((h) => (
              <div key={h.id} className="text-xs bg-amber-50 border border-amber-200 rounded-lg p-3 text-amber-800">
                Opponent requested a change to your proposal: {h.change_reason || '(no detail)'}
              </div>
            ))}
            <p className="text-xs text-muted-foreground">Claiming places a strict 24h hold on the slot and pings the opponent captain to Claim, Decline, or Request a Change.</p>
          </div>
        )}

        {/* Playoff tree */}
        {brackets.some((b) => b.stage === 'playoff') && (
          <div className="bg-white rounded-2xl border border-border p-6 space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Trophy className="w-4 h-4" /> Playoffs</h3>
            {matches.filter((m) => m.stage === 'playoff').sort((a, b) => (a.round - b.round) || ((a.playoff_slot || 0) - (b.playoff_slot || 0))).map((m) => {
              const a = teamById(m.team_a_id), b = teamById(m.team_b_id);
              return (
                <div key={m.id} className="flex justify-between text-sm border-b border-border/40 last:border-0 py-1.5">
                  <span className="text-foreground">R{m.round} · {a?.team_name || 'TBD'} vs {b?.team_name || 'TBD'}</span>
                  <span className="text-muted-foreground">{['completed', 'forfeit'].includes(m.status) ? `${m.team_a_score ?? '–'}:${m.team_b_score ?? '–'}` : m.status}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* All brackets */}
        <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2"><MapPin className="w-4 h-4" /> All brackets</h3>
          {brackets.filter((b) => b.stage === 'group').length === 0 && <p className="text-sm text-muted-foreground">Brackets not generated yet.</p>}
          <div className="grid sm:grid-cols-2 gap-4">
            {brackets.filter((b) => b.stage === 'group').map((b) => (
              <div key={b.id} className="border border-border rounded-xl p-4">
                <p className="font-medium text-foreground text-sm mb-2">{b.name} <span className="text-xs text-muted-foreground">· {b.region}</span></p>
                {standings(b.id).map((t, i) => (
                  <div key={t.id} className="flex justify-between text-xs py-1 text-muted-foreground">
                    <span>{i + 1}. {t.team_name}</span>
                    <span>{t.cumulative_score || 0} pts</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Rules */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-3">Rules</h3>
          <div className="divide-y divide-border">
            {RULES.map(([title, body], i) => (
              <div key={title}>
                <button onClick={() => setOpenRule(openRule === i ? null : i)}
                  className="w-full flex items-center justify-between py-3 text-sm font-medium text-foreground">
                  {title}
                  <ChevronDown className={`w-4 h-4 transition-transform ${openRule === i ? 'rotate-180' : ''}`} />
                </button>
                {openRule === i && <p className="text-sm text-muted-foreground pb-3">{body}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {protesting && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <h3 className="font-semibold text-foreground">File a question-accuracy protest</h3>
            <p className="text-xs text-muted-foreground">Must be filed within 30 minutes of score lock. The referee reviews before the score finalizes.</p>
            <textarea className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={4}
              value={protestText} onChange={(e) => setProtestText(e.target.value)} placeholder="Describe the disputed question(s)…" />
            <div className="flex gap-3">
              <button onClick={() => setProtesting(null)} className="flex-1 border border-border rounded-lg py-2 text-sm font-medium text-muted-foreground hover:bg-muted">Cancel</button>
              <button disabled={!protestText.trim()} onClick={() => fileProtest(protesting)}
                className="flex-1 bg-destructive text-white rounded-lg py-2 text-sm font-medium hover:bg-destructive/90 disabled:opacity-50">Submit protest</button>
            </div>
          </div>
        </div>
      )}

      {claimSlot && (
        <ClaimModal shift={claimSlot} matches={schedulableMatches} teams={teams}
          myTeam={myTeam} busy={busy} onClose={() => setClaimSlot(null)}
          onSubmit={proposeHold} />
      )}

      {changeFor && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Counter-propose a time</h3>
            <div className="bg-muted/40 rounded-lg p-3 text-xs text-muted-foreground">
              Opponent proposed: <strong className="text-foreground">{fmt(changeFor.proposed_time)}</strong>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Your proposed time <span className="text-muted-foreground font-normal">(required — within the referee's availability window)</span></label>
              <input type="datetime-local" className="w-full border border-border rounded-lg px-3 py-2 text-sm"
                value={counterTime} onChange={(e) => setCounterTime(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Note <span className="text-muted-foreground font-normal">(optional)</span></label>
              <textarea className="w-full border border-border rounded-lg px-3 py-2 text-sm" rows={2}
                value={changeReason} onChange={(e) => setChangeReason(e.target.value)}
                placeholder="e.g. We have a conflict at that time" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setChangeFor(null); setChangeReason(''); setCounterTime(''); }}
                className="flex-1 border border-border rounded-lg py-2 text-sm font-medium text-muted-foreground hover:bg-muted">Cancel</button>
              <button disabled={busy || !counterTime} onClick={() => respondToHold(changeFor, 'change', changeReason)}
                className="flex-1 bg-amber-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-amber-600 disabled:opacity-50">
                {busy ? 'Sending…' : 'Send counter-proposal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ClaimModal({ shift, matches, teams, myTeam, busy, onClose, onSubmit }) {
  const [matchId, setMatchId] = useState(matches[0]?.id || '');
  const [time, setTime] = useState('');
  const match = matches.find((m) => m.id === matchId);
  const oppOf = (m) => {
    const id = m.team_a_id === myTeam.id ? m.team_b_id : m.team_a_id;
    return teams.find((t) => t.id === id)?.team_name || 'TBD';
  };
  const min = toLocalInput(shift.start_at);
  const max = toLocalInput(shift.end_at);
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Claim slot & propose time</h3>
        <p className="text-xs text-muted-foreground">
          Referee {shift.ref_name || shift.ref_email} · window {fmt(shift.start_at)} → {fmt(shift.end_at)}
        </p>
        {matches.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
            No match available to schedule yet. You need an assigned opponent — your bracket must have at least 2 teams and matches generated. Ask an admin to add an opponent / generate brackets.
          </div>
        ) : (
        <div>
          <label className="block text-sm font-medium mb-1.5">Which match</label>
          <select className="w-full border border-border rounded-lg px-3 py-2 text-sm" value={matchId}
            onChange={(e) => setMatchId(e.target.value)}>
            {matches.map((m) => (
              <option key={m.id} value={m.id}>vs {oppOf(m)} · {m.stage} R{m.round}</option>
            ))}
          </select>
        </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1.5">Proposed time (within ref window)</label>
          <input type="datetime-local" className="w-full border border-border rounded-lg px-3 py-2 text-sm"
            min={min} max={max} value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-border rounded-lg py-2 text-sm font-medium text-muted-foreground hover:bg-muted">Cancel</button>
          <button disabled={busy || !match || !time}
            onClick={() => onSubmit(shift, match, new Date(time).toISOString())}
            className="flex-1 bg-primary text-white rounded-lg py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
            {busy ? 'Placing hold…' : 'Place 24h hold'}
          </button>
        </div>
      </div>
    </div>
  );
}
