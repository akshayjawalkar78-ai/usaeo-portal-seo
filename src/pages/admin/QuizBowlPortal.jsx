import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Lock, Unlock, Crown, Trash2, Search, List, MapPin, X, Trophy,
  Shuffle, CalendarClock, Map as MapIcon, Gavel, Settings as SettingsIcon,
  Check, AlertTriangle, Clock, Play, ShieldCheck, RefreshCw, Flag, Link2,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/api/base44Client';
import { supabase } from '@/supabaseClient';
import USMapChoropleth from '../../components/USMapChoropleth';
import { computeBracketPlan } from '../../lib/quizBowl/brackets';
import { generateRoundRobin } from '../../lib/quizBowl/roundRobin';
import { qualifierBreakdown } from '../../lib/quizBowl/playoffs';
import { matchConflictLevel } from '../../lib/quizBowl/conflict';

const ECON_TEAM_NAMES = [
  'Invisible Hand', 'Nash Equilibrium', 'Keynesian Crusaders', 'Supply Siders',
  'The Marginalists', 'Rational Actors', 'Pareto Optimizers', 'The Arbitrageurs',
  'Comparative Advantage', 'The Elastics', 'Marginal Revolution', 'Creative Destroyers',
];
const randomEconTeamName = () =>
  ECON_TEAM_NAMES[Math.floor(Math.random() * ECON_TEAM_NAMES.length)] +
  ' ' + Math.floor(Math.random() * 900 + 100);

const inputCls =
  'w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary';

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
        className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
}

const CONFLICT_STYLE = {
  green: 'bg-success/10 text-success border-green-200',
  yellow: 'bg-amber-50 text-amber-700 border-amber-200',
  orange: 'bg-orange-100 text-orange-800 border-orange-300',
  red: 'bg-destructive/10 text-destructive border-red-300',
};

const fmt = (d) => (d ? new Date(d).toLocaleString() : '—');

export default function QuizBowlPortal() {
  const { isSuperAdmin, profile } = useAuth();
  // Referee = a (custom) admin who reaches this page but is not super admin.
  const isReferee = !isSuperAdmin;
  const myEmail = profile?.email || '';

  const SUBTABS = useMemo(() => {
    const all = [
      { id: 'teams', label: 'Teams', icon: Users, super: false },
      { id: 'brackets', label: 'Brackets', icon: Trophy, super: true },
      { id: 'schedule', label: 'Schedule', icon: CalendarClock, super: false },
      { id: 'conflict', label: 'Conflict Map', icon: MapIcon, super: false },
      { id: 'ref', label: 'Ref Tools', icon: Gavel, super: false },
      { id: 'settings', label: 'Settings', icon: SettingsIcon, super: true },
    ];
    return isSuperAdmin ? all : all.filter((t) => !t.super);
  }, [isSuperAdmin]);

  const [sub, setSub] = useState(SUBTABS[0].id);

  // Data
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState({}); // teamId -> []
  const [brackets, setBrackets] = useState([]);
  const [matches, setMatches] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [holds, setHolds] = useState([]);
  const [protests, setProtests] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const teamById = useCallback((id) => teams.find((t) => t.id === id), [teams]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [t, m, b, mt, sh, hd, pr, cfg] = await Promise.all([
        base44.entities.QuizBowlTeam.list('-created_at').catch(() => []),
        base44.entities.QuizBowlTeamMember.list().catch(() => []),
        base44.entities.QuizBowlBracket.list().catch(() => []),
        base44.entities.QuizBowlMatch.list('-created_at').catch(() => []),
        base44.entities.QuizBowlRefShift.list('start_at').catch(() => []),
        base44.entities.QuizBowlSlotHold.list('-created_at').catch(() => []),
        base44.entities.QuizBowlProtest.list('-created_at').catch(() => []),
        base44.entities.QuizBowlConfig.list().catch(() => []),
      ]);
      const map = {};
      m.forEach((x) => { (map[x.team_id] ||= []).push(x); });
      setTeams(t); setMembers(map); setBrackets(b); setMatches(mt);
      setShifts(sh); setHolds(hd); setProtests(pr); setConfig(cfg[0] || null);
    } catch (e) {
      setError(e.message || 'Load failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // Auto-backfill unassigned quiz-bowl registrants into solo teams (ported).
  useEffect(() => {
    if (loading || !isSuperAdmin) return;
    (async () => {
      try {
        const regs = await base44.entities.EventRegistration.filter({ event_type: 'quiz-bowl' }).catch(() => []);
        const haveEmail = new Set(Object.values(members).flat().map((x) => x.user_email));
        const missing = regs.filter((r) => !haveEmail.has(r.user_email));
        if (!missing.length) return;
        for (const reg of missing) {
          const team = await base44.entities.QuizBowlTeam.create({
            team_name: randomEconTeamName(), captain_email: reg.user_email,
            school: reg.school, state: reg.state, locked: false,
          });
          await base44.entities.QuizBowlTeamMember.create({
            team_id: team.id, user_email: reg.user_email,
            user_name: reg.user_name, role: 'captain', status: 'active',
          });
        }
        loadAll();
      } catch { /* ignore */ }
    })();
  }, [loading, isSuperAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  const notify = (template, to, data = {}) =>
    supabase.functions.invoke('quiz-bowl-notify', { body: { template, to, data } }).catch(() => {});

  // ── Bracket generation ────────────────────────────────────────
  const generateBrackets = async () => {
    if (!confirm('Generate brackets & round-robin matches? This replaces any existing group brackets.')) return;
    setBusy(true); setError(null);
    try {
      // Clear prior group brackets + their matches.
      const groupB = brackets.filter((b) => b.stage === 'group');
      for (const b of groupB) {
        for (const mt of matches.filter((m) => m.bracket_id === b.id)) {
          await base44.entities.QuizBowlMatch.delete(mt.id);
        }
        await base44.entities.QuizBowlBracket.delete(b.id);
      }
      const plan = computeBracketPlan(
        teams.map((t) => ({ id: t.id, state: t.state, is_international: t.is_international }))
      );
      const rounds = Array.isArray(config?.round_deadlines) ? config.round_deadlines : [];
      for (const b of plan.brackets) {
        const rr = generateRoundRobin(b.teamIds);
        const created = await base44.entities.QuizBowlBracket.create({
          name: b.name, stage: 'group', region: b.region,
          is_international: b.is_international,
          round_count: rr.reduce((mx, x) => Math.max(mx, x.round), 0),
        });
        for (const tid of b.teamIds) {
          await base44.entities.QuizBowlTeam.update(tid, { bracket_id: created.id });
        }
        for (const pair of rr) {
          await base44.entities.QuizBowlMatch.create({
            bracket_id: created.id, stage: 'group', round: pair.round,
            team_a_id: pair.teamAId, team_b_id: pair.teamBId,
            status: 'unscheduled',
            deadline: rounds[pair.round - 1]?.deadline || null,
          });
        }
      }
      await loadAll();
    } catch (e) {
      setError(e.message || 'Generation failed');
    } finally {
      setBusy(false);
    }
  };

  // ── Hold & Verify ─────────────────────────────────────────────
  const proposeHold = async (match, shift, proposingTeamId, proposedTime) => {
    setBusy(true);
    try {
      const expires = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
      await base44.entities.QuizBowlSlotHold.create({
        shift_id: shift.id, match_id: match.id,
        proposing_team_id: proposingTeamId,
        proposed_time: proposedTime, status: 'holding', expires_at: expires,
      });
      await base44.entities.QuizBowlRefShift.update(shift.id, { status: 'held', match_id: match.id });
      await base44.entities.QuizBowlMatch.update(match.id, {
        status: 'negotiating', ref_shift_id: shift.id, ref_email: shift.ref_email,
        scheduled_at: proposedTime, last_interaction_at: new Date().toISOString(),
      });
      const other = match.team_a_id === proposingTeamId ? match.team_b_id : match.team_a_id;
      const ot = teamById(other);
      const pt = teamById(proposingTeamId);
      if (ot?.captain_email) {
        notify('hold_alert', ot.captain_email, {
          proposing_team: pt?.team_name || 'A team',
          proposed_time: new Date(proposedTime).toUTCString(),
        });
      }
      await loadAll();
    } finally { setBusy(false); }
  };

  const resolveHold = async (hold, action, reason) => {
    setBusy(true);
    try {
      const match = matches.find((m) => m.id === hold.match_id);
      if (action === 'claim') {
        await base44.entities.QuizBowlSlotHold.update(hold.id, { status: 'claimed' });
        await base44.entities.QuizBowlRefShift.update(hold.shift_id, { status: 'claimed' });
        await base44.entities.QuizBowlMatch.update(hold.match_id, {
          status: 'locked', last_interaction_at: new Date().toISOString(),
        });
        const a = teamById(match?.team_a_id), b = teamById(match?.team_b_id);
        const to = [a?.captain_email, b?.captain_email, match?.ref_email].filter(Boolean);
        if (to.length) notify('match_confirmed', to, {
          team_a: a?.team_name || 'Team A', team_b: b?.team_name || 'Team B',
          match_time: fmt(hold.proposed_time),
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
        });
        await base44.entities.QuizBowlMatch.update(hold.match_id, {
          last_interaction_at: new Date().toISOString(),
        });
      }
      await loadAll();
    } finally { setBusy(false); }
  };

  const runScheduler = async () => {
    setBusy(true); setError(null);
    try {
      const { error: e } = await supabase.functions.invoke('quiz-bowl-cron', { body: { source: 'admin' } });
      if (e) throw e;
      await loadAll();
    } catch (e) {
      setError('Scheduler: ' + (e.message || e));
    } finally { setBusy(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-semibold text-foreground text-xl flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" /> Quiz Bowl Portal
          </h2>
          <p className="text-sm text-muted-foreground">
            {isReferee ? 'Referee view — schedule & run your matches.' : 'Tournament scheduling & matchmaking engine.'}
          </p>
        </div>
        {config?.phase && (
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-orange-200 uppercase tracking-wide">
            {config.phase} phase
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {SUBTABS.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setSub(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${sub === t.id ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              <Icon className="w-4 h-4" />{t.label}
            </button>
          );
        })}
      </div>

      {sub === 'teams' && (
        <TeamsTab teams={teams} members={members} setMembers={setMembers}
          brackets={brackets} reload={loadAll} canEdit={isSuperAdmin} />
      )}
      {sub === 'brackets' && isSuperAdmin && (
        <BracketsTab teams={teams} brackets={brackets} matches={matches}
          busy={busy} onGenerate={generateBrackets} reload={loadAll}
          config={config} setError={setError} />
      )}
      {sub === 'schedule' && (
        <ScheduleTab teams={teams} matches={matches} shifts={shifts} holds={holds}
          config={config} isSuperAdmin={isSuperAdmin} myEmail={myEmail}
          busy={busy} reload={loadAll} proposeHold={proposeHold}
          resolveHold={resolveHold} teamById={teamById} setError={setError} />
      )}
      {sub === 'conflict' && (
        <ConflictTab matches={matches} holds={holds} shifts={shifts}
          teamById={teamById} isSuperAdmin={isSuperAdmin} reload={loadAll} />
      )}
      {sub === 'ref' && (
        <RefToolsTab matches={matches} teams={teams} teamById={teamById}
          protests={protests} config={config} myEmail={myEmail} shifts={shifts}
          isSuperAdmin={isSuperAdmin} reload={loadAll} setError={setError} />
      )}
      {sub === 'settings' && isSuperAdmin && (
        <SettingsTab config={config} teams={teams} busy={busy}
          onRunScheduler={runScheduler} reload={loadAll} setError={setError} />
      )}
    </div>
  );
}

/* ─────────────────────────  TEAMS  ───────────────────────── */
function TeamsTab({ teams, members, setMembers, brackets, reload, canEdit }) {
  const [search, setSearch] = useState('');
  const [memberFilter, setMemberFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [view, setView] = useState('list');
  const [expanded, setExpanded] = useState(null);
  const [delTarget, setDelTarget] = useState(null);

  const allStates = [...new Set(teams.map((t) => t.state).filter(Boolean))].sort();
  const bracketName = (id) => brackets.find((b) => b.id === id)?.name;

  const filtered = teams.filter((team) => {
    const mem = members[team.id] || [];
    const active = mem.filter((m) => m.status === 'active').length;
    if (search && !team.team_name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (stateFilter !== 'all' && team.state !== stateFilter) return false;
    if (memberFilter === 'solo' && active !== 1) return false;
    if (memberFilter === 'small' && active !== 2) return false;
    if (memberFilter === 'ready' && active < 3) return false;
    return true;
  });
  const stateCounts = {};
  teams.forEach((t) => { if (t.state) stateCounts[t.state] = (stateCounts[t.state] || 0) + 1; });

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-border p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-40">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search team name…" className="w-full pl-8 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <select value={memberFilter} onChange={(e) => setMemberFilter(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-white">
            <option value="all">All sizes</option>
            <option value="solo">Solo (1)</option>
            <option value="small">2 members</option>
            <option value="ready">Ready (3–5)</option>
          </select>
          <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-white">
            <option value="all">All states</option>
            {allStates.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button onClick={() => setView('list')}
              className={`px-3 py-2 text-xs font-medium flex items-center gap-1.5 ${view === 'list' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button onClick={() => setView('map')}
              className={`px-3 py-2 text-xs font-medium flex items-center gap-1.5 border-l border-border ${view === 'map' ? 'bg-foreground text-white' : 'text-muted-foreground hover:bg-muted'}`}>
              <MapPin className="w-3.5 h-3.5" /> Map
            </button>
          </div>
          <span className="text-sm text-muted-foreground">{filtered.length}/{teams.length}</span>
        </div>
      </div>

      {view === 'map' && (
        <div className="bg-white rounded-2xl border border-border p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Teams by State</p>
          <USMapChoropleth stateCounts={stateCounts}
            selectedState={stateFilter !== 'all' ? stateFilter : null}
            onStateClick={(name) => setStateFilter((p) => (p === name ? 'all' : name))}
            height={280} />
        </div>
      )}

      {view === 'list' && (
        <>
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-border p-6">
              <p className="text-sm text-muted-foreground">No teams match current filters.</p>
            </div>
          )}
          {filtered.map((team) => {
            const mem = members[team.id] || [];
            const active = mem.filter((m) => m.status === 'active').length;
            const isExp = expanded === team.id;
            return (
              <div key={team.id} className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="flex items-center gap-4 p-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-foreground">{team.team_name}</p>
                      {team.locked
                        ? <span className="text-xs font-semibold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-full flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>
                        : <span className="text-xs font-semibold text-success bg-success/10 border border-green-200 px-2 py-0.5 rounded-full">Open</span>}
                      {active >= 3 && <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">Ready</span>}
                      {active === 1 && <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Solo</span>}
                      {team.is_international && <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">Intl</span>}
                      {team.bracket_id && <span className="text-xs font-semibold text-foreground bg-muted border border-border px-2 py-0.5 rounded-full">{bracketName(team.bracket_id)}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {team.captain_email} · {active} member{active !== 1 ? 's' : ''}
                      {team.state ? ` · ${team.state}` : ''}{team.school ? ` · ${team.school}` : ''}
                      {` · ${team.wins || 0}W ${team.losses || 0}L ${team.draws || 0}D · ${team.cumulative_score || 0} pts`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {canEdit && (
                      <button onClick={async () => { await base44.entities.QuizBowlTeam.update(team.id, { locked: !team.locked }); reload(); }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${team.locked ? 'border-green-200 bg-success/10 text-success' : 'border-border bg-muted text-foreground'}`}>
                        {team.locked ? <><Unlock className="w-3 h-3" /> Unlock</> : <><Lock className="w-3 h-3" /> Lock</>}
                      </button>
                    )}
                    <button onClick={() => setExpanded(isExp ? null : team.id)}
                      className="px-3 py-1.5 border border-border rounded-lg text-xs text-foreground hover:bg-muted flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> {isExp ? 'Hide' : 'Members'}
                    </button>
                    {canEdit && (
                      <button onClick={() => setDelTarget(team)}
                        className="p-1.5 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                {isExp && (
                  <div className="border-t border-border p-5 bg-muted/10">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Members ({mem.length})</p>
                    {mem.length === 0 && <p className="text-sm text-muted-foreground">No members.</p>}
                    <div className="space-y-2">
                      {mem.map((m) => (
                        <div key={m.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-primary">
                              {(m.user_name || m.user_email)?.[0]?.toUpperCase() ?? '?'}
                            </div>
                            <div>
                              <p className="text-sm text-foreground">{m.user_name || m.user_email}</p>
                              <p className="text-xs text-muted-foreground">{m.user_email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {m.role === 'captain' && <span className="text-xs font-semibold text-primary flex items-center gap-1"><Crown className="w-3 h-3" /> Captain</span>}
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.status === 'active' ? 'bg-success/10 text-success border border-green-200' : m.status === 'pending' ? 'bg-primary/5 text-orange-700 border border-orange-200' : 'bg-muted text-muted-foreground border border-border'}`}>{m.status}</span>
                            {canEdit && !team.locked && (
                              <button onClick={async () => {
                                await base44.entities.QuizBowlTeamMember.delete(m.id);
                                const left = (members[team.id] || []).filter((x) => x.id !== m.id);
                                setMembers((p) => ({ ...p, [team.id]: left }));
                              }} className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      <AnimatePresence>
        {delTarget && (
          <Modal title="Delete Team" onClose={() => setDelTarget(null)}>
            <p className="text-sm text-muted-foreground mb-4">Delete <strong>{delTarget.team_name}</strong> and all its members? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelTarget(null)} className="flex-1 border border-border rounded-lg py-2 text-sm font-medium text-muted-foreground hover:bg-muted">Cancel</button>
              <button onClick={async () => { await base44.entities.QuizBowlTeam.delete(delTarget.id); setDelTarget(null); reload(); }}
                className="flex-1 bg-destructive text-white rounded-lg py-2 text-sm font-medium hover:bg-destructive/90">Delete</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────  BRACKETS  ───────────────────────── */
function BracketsTab({ teams, brackets, matches, busy, onGenerate, reload, config, setError }) {
  const n = teams.length;
  const bd = qualifierBreakdown(n);
  const [edit, setEdit] = useState(null); // null | {} (new) | bracket (edit)
  const [delTarget, setDelTarget] = useState(null);
  const [addTo, setAddTo] = useState(null); // bracket to add a team into
  const [openTeam, setOpenTeam] = useState(null); // team id whose results expanded

  // Recompute every team's W/L/D + cumulative score from finished matches.
  const recompute = async () => {
    const tally = {};
    teams.forEach((t) => { tally[t.id] = { wins: 0, losses: 0, draws: 0, cumulative_score: 0 }; });
    for (const m of matches) {
      if (!['completed', 'forfeit', 'draw'].includes(m.status)) continue;
      const a = tally[m.team_a_id], b = tally[m.team_b_id];
      const sa = Number(m.team_a_score) || 0, sb = Number(m.team_b_score) || 0;
      if (a) a.cumulative_score += sa;
      if (b) b.cumulative_score += sb;
      if (m.status === 'draw') { if (a) a.draws++; if (b) b.draws++; }
      else {
        const aw = m.winner_team_id === m.team_a_id;
        if (a) { a.wins += aw ? 1 : 0; a.losses += aw ? 0 : 1; }
        if (b) { b.wins += aw ? 0 : 1; b.losses += aw ? 1 : 0; }
      }
    }
    for (const t of teams) {
      const v = tally[t.id];
      if (!v) continue;
      if (v.wins !== (t.wins || 0) || v.losses !== (t.losses || 0) ||
          v.draws !== (t.draws || 0) || v.cumulative_score !== (t.cumulative_score || 0)) {
        await base44.entities.QuizBowlTeam.update(t.id, v);
      }
    }
  };

  const setResult = async (match, outcome, sa, sb) => {
    let patch = {
      team_a_score: sa === '' || sa == null ? null : Number(sa),
      team_b_score: sb === '' || sb == null ? null : Number(sb),
      score_locked_at: new Date().toISOString(),
    };
    if (outcome === 'draw') patch = { ...patch, status: 'draw', winner_team_id: null };
    else if (outcome === 'a') patch = { ...patch, status: 'completed', winner_team_id: match.team_a_id };
    else if (outcome === 'b') patch = { ...patch, status: 'completed', winner_team_id: match.team_b_id };
    else patch = { ...patch, status: 'unscheduled', winner_team_id: null, score_locked_at: null };
    await base44.entities.QuizBowlMatch.update(match.id, patch);
    await recompute();
    reload();
  };

  const moveTeam = async (teamId, bracketId) => {
    await base44.entities.QuizBowlTeam.update(teamId, { bracket_id: bracketId || null });
    reload();
  };
  // Round-robin for one bracket's current teams; skips pairs already present.
  const genBracketMatches = async (b) => {
    const ids = teams.filter((t) => t.bracket_id === b.id).map((t) => t.id);
    if (ids.length < 2) { setError('Need at least 2 teams in this bracket.'); return; }
    const rounds = Array.isArray(config?.round_deadlines) ? config.round_deadlines : [];
    const existing = new Set(
      matches.filter((m) => m.bracket_id === b.id)
        .map((m) => [m.team_a_id, m.team_b_id].sort().join('|'))
    );
    const rr = generateRoundRobin(ids);
    let made = 0;
    for (const pair of rr) {
      const key = [pair.teamAId, pair.teamBId].sort().join('|');
      if (existing.has(key)) continue;
      await base44.entities.QuizBowlMatch.create({
        bracket_id: b.id, stage: b.stage || 'group', round: pair.round,
        team_a_id: pair.teamAId, team_b_id: pair.teamBId,
        status: 'unscheduled', deadline: rounds[pair.round - 1]?.deadline || null,
      });
      made++;
    }
    await base44.entities.QuizBowlBracket.update(b.id, {
      round_count: rr.reduce((mx, x) => Math.max(mx, x.round), 0),
    });
    if (made === 0) setError('No new matches — all pairings already exist.');
    reload();
  };
  const toggleFlag = async (team, field) => {
    await base44.entities.QuizBowlTeam.update(team.id, { [field]: !team[field] });
    reload();
  };
  const saveBracket = async (form) => {
    if (form.id) {
      await base44.entities.QuizBowlBracket.update(form.id, {
        name: form.name, region: form.region, stage: form.stage,
        is_international: form.is_international,
      });
    } else {
      await base44.entities.QuizBowlBracket.create({
        name: form.name, region: form.region || 'Custom',
        stage: form.stage || 'group', is_international: !!form.is_international,
      });
    }
    setEdit(null); reload();
  };
  const deleteBracket = async (b) => {
    for (const t of teams.filter((x) => x.bracket_id === b.id)) {
      await base44.entities.QuizBowlTeam.update(t.id, { bracket_id: null });
    }
    for (const m of matches.filter((x) => x.bracket_id === b.id)) {
      await base44.entities.QuizBowlMatch.delete(m.id);
    }
    await base44.entities.QuizBowlBracket.delete(b.id);
    setDelTarget(null); reload();
  };

  const groups = brackets.filter((b) => b.stage === 'group');
  const playoff = brackets.filter((b) => b.stage === 'playoff');
  const unassigned = teams.filter((t) => !t.bracket_id);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-border p-5 flex items-center justify-between flex-wrap gap-3">
        <div className="text-sm text-muted-foreground">
          <strong className="text-foreground">{n}</strong> teams · target{' '}
          <strong className="text-foreground">{bd.brackets}</strong> brackets ·{' '}
          playoff <strong className="text-foreground">{bd.playoffSize}</strong>{' '}
          ({bd.guaranteed} auto + {bd.wildcards} wildcard)
        </div>
        <div className="flex gap-2">
          <button onClick={() => setEdit({ stage: 'group' })}
            className="flex items-center gap-2 border border-border text-sm font-medium px-4 py-2 rounded-lg hover:bg-muted">
            <Trophy className="w-4 h-4" /> New bracket
          </button>
          <button disabled={busy} onClick={onGenerate}
            className="flex items-center gap-2 bg-foreground text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-foreground/90 disabled:opacity-50">
            <Shuffle className="w-4 h-4" /> {busy ? 'Generating…' : 'Auto-generate'}
          </button>
        </div>
      </div>

      {unassigned.length > 0 && (
        <div className="bg-white rounded-2xl border border-amber-200 p-5">
          <p className="font-semibold text-foreground mb-2 text-sm">Unassigned teams ({unassigned.length})</p>
          <div className="flex flex-wrap gap-2">
            {unassigned.map((t) => (
              <span key={t.id} className="inline-flex items-center gap-2 text-xs border border-border rounded-full px-3 py-1">
                {t.team_name}
                <select value="" onChange={(e) => e.target.value && moveTeam(t.id, e.target.value)}
                  className="bg-transparent text-muted-foreground">
                  <option value="">→ bracket…</option>
                  {brackets.map((bb) => <option key={bb.id} value={bb.id}>{bb.name}</option>)}
                </select>
              </span>
            ))}
          </div>
        </div>
      )}

      {brackets.length === 0 && (
        <div className="text-center py-16 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
          No brackets yet. Create one manually or auto-generate the group stage.
        </div>
      )}

      {[...groups, ...playoff].map((b) => {
        const bt = teams.filter((t) => t.bracket_id === b.id)
          .sort((x, y) => (y.cumulative_score || 0) - (x.cumulative_score || 0));
        const bm = matches.filter((m) => m.bracket_id === b.id);
        return (
          <div key={b.id} className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-3 gap-2">
              <p className="font-semibold text-foreground flex items-center gap-2 flex-wrap">
                {b.name}
                <span className="text-xs font-normal text-muted-foreground">{b.region} · {b.stage} · {bt.length} teams · {bm.length} matches</span>
                {b.is_international && <span className="text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">Intl</span>}
              </p>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setAddTo(b)} className="text-xs border border-border rounded px-2 py-1 hover:bg-muted">+ team</button>
                <button onClick={() => genBracketMatches(b)} className="text-xs border border-border rounded px-2 py-1 hover:bg-muted font-semibold text-primary">Generate matches</button>
                <button onClick={() => setEdit(b)} className="text-xs border border-border rounded px-2 py-1 hover:bg-muted">Edit</button>
                <button onClick={() => setDelTarget(b)} className="text-xs border border-red-200 text-destructive rounded px-2 py-1 hover:bg-destructive/10">Delete</button>
              </div>
            </div>
            <div className="space-y-1.5">
              {bt.length === 0 && <p className="text-xs text-muted-foreground">No teams in this bracket.</p>}
              {bt.map((t, i) => {
                const tMatches = matches.filter((m) => m.team_a_id === t.id || m.team_b_id === t.id);
                const isOpen = openTeam === t.id;
                return (
                <div key={t.id} className="border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3 text-sm py-1.5">
                    <span className="w-5 text-muted-foreground">{i + 1}</span>
                    <button onClick={() => setOpenTeam(isOpen ? null : t.id)}
                      className="flex-1 text-left text-foreground hover:text-primary flex items-center gap-1">
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      {t.team_name}
                    </button>
                    <span className="text-xs text-muted-foreground">{t.wins || 0}W {t.losses || 0}L {t.draws || 0}D · {t.cumulative_score || 0} pts</span>
                    {t.qualified && <span className="text-xs font-semibold text-success bg-success/10 border border-green-200 px-2 py-0.5 rounded-full">Qualified</span>}
                    {t.eliminated && <span className="text-xs font-semibold text-destructive bg-destructive/10 border border-red-200 px-2 py-0.5 rounded-full">Out</span>}
                    <button onClick={() => toggleFlag(t, 'qualified')} className="text-xs text-muted-foreground hover:text-foreground border border-border rounded px-2 py-0.5">Q</button>
                    <button onClick={() => toggleFlag(t, 'eliminated')} className="text-xs text-muted-foreground hover:text-foreground border border-border rounded px-2 py-0.5">E</button>
                    <select value={t.bracket_id || ''} onChange={(e) => moveTeam(t.id, e.target.value)}
                      className="text-xs border border-border rounded px-1.5 py-0.5 bg-white">
                      {brackets.map((bb) => <option key={bb.id} value={bb.id}>{bb.name}</option>)}
                      <option value="">— Unassign —</option>
                    </select>
                  </div>
                  {isOpen && (
                    <div className="bg-muted/20 rounded-lg p-3 mb-2 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Matches & results</p>
                      {tMatches.length === 0 && <p className="text-xs text-muted-foreground">No matches. Needs ≥2 teams in the bracket — generate or add an opponent.</p>}
                      {tMatches.map((m) => (
                        <MatchResultRow key={m.id} match={m} team={t}
                          opp={teams.find((x) => x.id === (m.team_a_id === t.id ? m.team_b_id : m.team_a_id))}
                          onSet={setResult} />
                      ))}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <AnimatePresence>
        {edit && (
          <Modal title={edit.id ? `Edit ${edit.name}` : 'New bracket'} onClose={() => setEdit(null)}>
            <BracketForm bracket={edit} onSave={saveBracket} />
          </Modal>
        )}
        {addTo && (
          <Modal title={`Add team to ${addTo.name}`} onClose={() => setAddTo(null)}>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {teams.filter((t) => t.bracket_id !== addTo.id).map((t) => (
                <button key={t.id} onClick={async () => { await moveTeam(t.id, addTo.id); setAddTo(null); }}
                  className="w-full text-left text-sm border border-border rounded-lg px-3 py-2 hover:bg-muted">
                  {t.team_name} <span className="text-xs text-muted-foreground">{t.bracket_id ? '· (moves from another bracket)' : '· unassigned'}</span>
                </button>
              ))}
            </div>
          </Modal>
        )}
        {delTarget && (
          <Modal title="Delete bracket" onClose={() => setDelTarget(null)}>
            <p className="text-sm text-muted-foreground mb-4">
              Delete <strong>{delTarget.name}</strong>? Its {matches.filter((m) => m.bracket_id === delTarget.id).length} matches are removed and its teams become unassigned. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDelTarget(null)} className="flex-1 border border-border rounded-lg py-2 text-sm font-medium text-muted-foreground hover:bg-muted">Cancel</button>
              <button onClick={() => deleteBracket(delTarget)} className="flex-1 bg-destructive text-white rounded-lg py-2 text-sm font-medium hover:bg-destructive/90">Delete</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function BracketForm({ bracket, onSave }) {
  const [f, setF] = useState({
    id: bracket.id, name: bracket.name || '', region: bracket.region || '',
    stage: bracket.stage || 'group', is_international: !!bracket.is_international,
  });
  return (
    <div className="space-y-4">
      <div><label className="block text-sm font-medium mb-1.5">Name</label>
        <input className={inputCls} value={f.name} onChange={(e) => setF((p) => ({ ...p, name: e.target.value }))} placeholder="Group 1" /></div>
      <div><label className="block text-sm font-medium mb-1.5">Region</label>
        <input className={inputCls} value={f.region} onChange={(e) => setF((p) => ({ ...p, region: e.target.value }))} placeholder="Northeast / International / …" /></div>
      <div><label className="block text-sm font-medium mb-1.5">Stage</label>
        <select className={inputCls} value={f.stage} onChange={(e) => setF((p) => ({ ...p, stage: e.target.value }))}>
          <option value="group">Group</option><option value="playoff">Playoff</option>
        </select></div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={f.is_international} onChange={(e) => setF((p) => ({ ...p, is_international: e.target.checked }))} />
        International (isolated timezone bucket)
      </label>
      <button disabled={!f.name.trim()} onClick={() => onSave(f)}
        className="w-full bg-foreground text-white rounded-lg py-2 text-sm font-medium hover:bg-foreground/90 disabled:opacity-50">
        {f.id ? 'Save changes' : 'Create bracket'}
      </button>
    </div>
  );
}

function MatchResultRow({ match, team, opp, onSet }) {
  const teamIsA = match.team_a_id === team.id;
  const [sa, setSa] = useState(match.team_a_score ?? '');
  const [sb, setSb] = useState(match.team_b_score ?? '');
  const myScore = teamIsA ? sa : sb;
  const setMyScore = (v) => (teamIsA ? setSa(v) : setSb(v));
  const oppScore = teamIsA ? sb : sa;
  const setOppScore = (v) => (teamIsA ? setSb(v) : setSa(v));

  let badge = 'Not played';
  if (match.status === 'draw') badge = 'Drew';
  else if (['completed', 'forfeit'].includes(match.status)) {
    badge = match.winner_team_id === team.id ? 'Won' : 'Lost';
  }
  const badgeCls = badge === 'Won' ? 'bg-success/10 text-success border-green-200'
    : badge === 'Lost' ? 'bg-destructive/10 text-destructive border-red-200'
    : badge === 'Drew' ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-muted text-muted-foreground border-border';

  return (
    <div className="flex items-center gap-2 text-xs flex-wrap bg-white border border-border rounded-lg p-2">
      <span className={`font-semibold px-2 py-0.5 rounded-full border ${badgeCls}`}>{badge}</span>
      <span className="text-foreground">vs {opp?.team_name || 'TBD'}</span>
      <span className="text-muted-foreground">R{match.round} {match.stage}</span>
      <span className="ml-auto flex items-center gap-1">
        <input type="number" value={myScore} onChange={(e) => setMyScore(e.target.value)}
          className="w-14 border border-border rounded px-1 py-0.5" placeholder="us" />
        <span className="text-muted-foreground">:</span>
        <input type="number" value={oppScore} onChange={(e) => setOppScore(e.target.value)}
          className="w-14 border border-border rounded px-1 py-0.5" placeholder="them" />
      </span>
      <button onClick={() => onSet(match, teamIsA ? 'a' : 'b', sa, sb)}
        className="px-2 py-0.5 rounded border border-green-200 bg-success/10 text-success font-semibold">Win</button>
      <button onClick={() => onSet(match, 'draw', sa, sb)}
        className="px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700 font-semibold">Draw</button>
      <button onClick={() => onSet(match, teamIsA ? 'b' : 'a', sa, sb)}
        className="px-2 py-0.5 rounded border border-red-200 bg-destructive/10 text-destructive font-semibold">Loss</button>
      <button onClick={() => onSet(match, 'reset', '', '')}
        className="px-2 py-0.5 rounded border border-border text-muted-foreground">Reset</button>
    </div>
  );
}

/* ─────────────────────────  SCHEDULE  ───────────────────────── */
function ScheduleTab({ teams, matches, shifts, holds, config, isSuperAdmin, myEmail, busy, reload, proposeHold, resolveHold, teamById, setError }) {
  const [shiftForm, setShiftForm] = useState({ start_at: '', end_at: '', ref_name: '' });
  const [proposeFor, setProposeFor] = useState(null); // match
  const [chgFor, setChgFor] = useState(null); // hold

  const createShift = async () => {
    if (!shiftForm.start_at || !shiftForm.end_at) return;
    try {
      await base44.entities.QuizBowlRefShift.create({
        ref_email: myEmail, ref_name: shiftForm.ref_name || myEmail,
        start_at: new Date(shiftForm.start_at).toISOString(),
        end_at: new Date(shiftForm.end_at).toISOString(), status: 'open',
      });
      setShiftForm({ start_at: '', end_at: '', ref_name: '' });
      reload();
    } catch (e) { setError(e.message); }
  };

  const openShifts = shifts.filter((s) => s.status === 'open');
  const activeHolds = holds.filter((h) => ['holding', 'change_requested'].includes(h.status));

  const rounds = Array.isArray(config?.round_deadlines) ? config.round_deadlines : [];
  const saveRounds = async (next) => {
    if (config) await base44.entities.QuizBowlConfig.update(config.id, { round_deadlines: next });
    else await base44.entities.QuizBowlConfig.create({ round_deadlines: next, phase: 'pre' });
    reload();
  };
  const addRound = () => saveRounds([...rounds, { name: `Round ${rounds.length + 1}`, deadline: '' }]);
  const updateRound = (i, patch) => saveRounds(rounds.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const deleteRound = (i) => saveRounds(rounds.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      {/* Ref shift submission */}
      <div className="bg-white rounded-2xl border border-border p-5">
        <p className="font-semibold text-foreground mb-3 flex items-center gap-2"><Clock className="w-4 h-4" /> Post a referee shift</p>
        <div className="flex flex-wrap gap-3 items-end">
          <div><label className="block text-xs text-muted-foreground mb-1">Start</label>
            <input type="datetime-local" className={inputCls} value={shiftForm.start_at}
              onChange={(e) => setShiftForm((p) => ({ ...p, start_at: e.target.value }))} /></div>
          <div><label className="block text-xs text-muted-foreground mb-1">End</label>
            <input type="datetime-local" className={inputCls} value={shiftForm.end_at}
              onChange={(e) => setShiftForm((p) => ({ ...p, end_at: e.target.value }))} /></div>
          <div><label className="block text-xs text-muted-foreground mb-1">Ref name</label>
            <input className={inputCls} placeholder="optional" value={shiftForm.ref_name}
              onChange={(e) => setShiftForm((p) => ({ ...p, ref_name: e.target.value }))} /></div>
          <button onClick={createShift} className="bg-foreground text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-foreground/90">Add shift</button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">{openShifts.length} open shift(s) in the pool.</p>
      </div>

      {isSuperAdmin && (
        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-foreground">Round deadlines</p>
            <button onClick={addRound} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-muted">+ Add round</button>
          </div>
          {rounds.length === 0 && <p className="text-sm text-muted-foreground">No rounds yet. Add rounds — names and deadlines show on student dashboards.</p>}
          <div className="space-y-2">
            {rounds.map((r, i) => (
              <div key={i} className="flex flex-wrap gap-2 items-center">
                <input className={inputCls + ' flex-1 min-w-32'} value={r.name || ''}
                  placeholder="Round name" onChange={(e) => updateRound(i, { name: e.target.value })} />
                <input type="datetime-local" className={inputCls}
                  defaultValue={r.deadline ? new Date(r.deadline).toISOString().slice(0, 16) : ''}
                  onBlur={(e) => updateRound(i, { deadline: e.target.value ? new Date(e.target.value).toISOString() : '' })} />
                <button onClick={() => deleteRound(i)} className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Unplayed matches at the deadline are auto-marked as draws by the scheduler. Editing names/count here updates the student dashboard.</p>
        </div>
      )}

      {/* Active holds */}
      {activeHolds.length > 0 && (
        <div className="bg-white rounded-2xl border border-border p-5">
          <p className="font-semibold text-foreground mb-3">Negotiating ({activeHolds.length})</p>
          <div className="space-y-2">
            {activeHolds.map((h) => {
              const m = matches.find((x) => x.id === h.match_id);
              const a = teamById(m?.team_a_id), b = teamById(m?.team_b_id);
              const exp = new Date(h.expires_at);
              return (
                <div key={h.id} className="flex items-center justify-between gap-3 text-sm border border-border rounded-lg p-3">
                  <div>
                    <p className="text-foreground">{a?.team_name} vs {b?.team_name}</p>
                    <p className="text-xs text-muted-foreground">
                      Proposed {fmt(h.proposed_time)} · expires {fmt(exp)} · {h.status}
                      {h.change_reason ? ` · "${h.change_reason}"` : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button disabled={busy} onClick={() => resolveHold(h, 'claim')} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-success/10 text-success border border-green-200">Claim</button>
                    <button disabled={busy} onClick={() => setChgFor(h)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">Request change</button>
                    <button disabled={busy} onClick={() => resolveHold(h, 'decline')} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive border border-red-200">Decline</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Matches needing scheduling */}
      <div className="bg-white rounded-2xl border border-border p-5">
        <p className="font-semibold text-foreground mb-3">Matches</p>
        <div className="space-y-2">
          {matches.length === 0 && <p className="text-sm text-muted-foreground">No matches yet — generate brackets first.</p>}
          {matches.map((m) => {
            const a = teamById(m.team_a_id), b = teamById(m.team_b_id);
            return (
              <div key={m.id} className="flex items-center justify-between gap-3 text-sm border-b border-border/50 last:border-0 py-2">
                <div>
                  <p className="text-foreground">{a?.team_name || '—'} vs {b?.team_name || '—'}
                    <span className="text-xs text-muted-foreground"> · {m.stage} R{m.round}</span></p>
                  <p className="text-xs text-muted-foreground">
                    {m.status}{m.scheduled_at ? ` · ${fmt(m.scheduled_at)}` : ''}{m.deadline ? ` · due ${fmt(m.deadline)}` : ''}
                  </p>
                </div>
                {['unscheduled', 'negotiating'].includes(m.status) && openShifts.length > 0 && (
                  <button onClick={() => setProposeFor(m)} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-muted">
                    Propose slot
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {proposeFor && (
          <Modal title="Propose a slot (Hold & Verify)" onClose={() => setProposeFor(null)}>
            <ProposeForm match={proposeFor} teams={teams} openShifts={openShifts}
              teamById={teamById}
              onSubmit={async (shift, teamId, time) => { await proposeHold(proposeFor, shift, teamId, time); setProposeFor(null); }} />
          </Modal>
        )}
        {chgFor && (
          <Modal title="Request a different time" onClose={() => setChgFor(null)}>
            <ChangeForm onSubmit={async (reason) => { await resolveHold(chgFor, 'change', reason); setChgFor(null); }} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProposeForm({ match, openShifts, teamById, onSubmit }) {
  const [shiftId, setShiftId] = useState(openShifts[0]?.id || '');
  const [teamId, setTeamId] = useState(match.team_a_id || '');
  const [time, setTime] = useState('');
  const shift = openShifts.find((s) => s.id === shiftId);
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">Proposing team</label>
        <select className={inputCls} value={teamId} onChange={(e) => setTeamId(e.target.value)}>
          <option value={match.team_a_id}>{teamById(match.team_a_id)?.team_name}</option>
          <option value={match.team_b_id}>{teamById(match.team_b_id)?.team_name}</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Referee shift</label>
        <select className={inputCls} value={shiftId} onChange={(e) => setShiftId(e.target.value)}>
          {openShifts.map((s) => (
            <option key={s.id} value={s.id}>{s.ref_name || s.ref_email} · {fmt(s.start_at)}–{fmt(s.end_at)}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Proposed time</label>
        <input type="datetime-local" className={inputCls} value={time} onChange={(e) => setTime(e.target.value)} />
      </div>
      <p className="text-xs text-muted-foreground">Places a strict 24h hold on this ref slot and pings the other team.</p>
      <button disabled={!shift || !time} onClick={() => onSubmit(shift, teamId, new Date(time).toISOString())}
        className="w-full bg-foreground text-white rounded-lg py-2 text-sm font-medium hover:bg-foreground/90 disabled:opacity-50">
        Place 24h hold
      </button>
    </div>
  );
}

function ChangeForm({ onSubmit }) {
  const [reason, setReason] = useState('');
  const [time, setTime] = useState('');
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">Suggested new time</label>
        <input type="datetime-local" className={inputCls} value={time} onChange={(e) => setTime(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Reason</label>
        <textarea className={inputCls} rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
      </div>
      <button onClick={() => onSubmit(`${time ? new Date(time).toLocaleString() + ' — ' : ''}${reason}`)}
        className="w-full bg-foreground text-white rounded-lg py-2 text-sm font-medium hover:bg-foreground/90">
        Send request
      </button>
    </div>
  );
}

/* ─────────────────────────  CONFLICT MAP  ───────────────────────── */
function ConflictTab({ matches, holds, shifts, teamById, isSuperAdmin, reload }) {
  const [override, setOverride] = useState(null);
  const openShifts = shifts.filter((s) => s.status === 'open');
  const now = new Date();
  const rows = matches.map((m) => {
    const hasActiveHold = holds.some((h) => h.match_id === m.id && h.status === 'holding');
    const level = matchConflictLevel({
      status: m.status, hasActiveHold,
      refOverlapCount: openShifts.length,
      lastInteractionAt: m.last_interaction_at,
    }, now);
    return { m, level };
  });
  const counts = rows.reduce((acc, r) => ({ ...acc, [r.level]: (acc[r.level] || 0) + 1 }), {});

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-border p-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Legend</p>
        {[
          ['green', 'Scheduled & confirmed — match locked/played'],
          ['yellow', 'In negotiation or an active hold (healthy)'],
          ['orange', 'Warning — 0 overlapping ref slots, or no team activity in 24h'],
          ['red', 'Action required — no activity in 48h; needs manual override'],
        ].map(([c, desc]) => (
          <div key={c} className="flex items-center gap-2 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${c === 'green' ? 'bg-success' : c === 'yellow' ? 'bg-amber-400' : c === 'orange' ? 'bg-orange-500' : 'bg-destructive'}`} />
            <span className={`font-semibold px-2 py-0.5 rounded-full border ${CONFLICT_STYLE[c]}`}>{c}: {counts[c] || 0}</span>
            <span className="text-muted-foreground">{desc}</span>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-border divide-y divide-border">
        {rows.length === 0 && <p className="text-sm text-muted-foreground p-5">No matches.</p>}
        {rows.sort((a, b) => ['red', 'orange', 'yellow', 'green'].indexOf(a.level) - ['red', 'orange', 'yellow', 'green'].indexOf(b.level)).map(({ m, level }) => {
          const a = teamById(m.team_a_id), b = teamById(m.team_b_id);
          return (
            <div key={m.id} className="flex items-center justify-between gap-3 p-4 text-sm">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${level === 'green' ? 'bg-success' : level === 'yellow' ? 'bg-amber-400' : level === 'orange' ? 'bg-orange-500' : 'bg-destructive'}`} />
                <div>
                  <p className="text-foreground">{a?.team_name || '—'} vs {b?.team_name || '—'}</p>
                  <p className="text-xs text-muted-foreground">{m.stage} R{m.round} · {m.status} · last activity {fmt(m.last_interaction_at)}</p>
                </div>
              </div>
              {level === 'red' && isSuperAdmin && (
                <button onClick={() => setOverride(m)} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive border border-red-200">
                  Manual override
                </button>
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {override && (
          <Modal title="Manual override" onClose={() => setOverride(null)}>
            <OverrideForm match={override} shifts={shifts}
              onSubmit={async (time, refEmail) => {
                await base44.entities.QuizBowlMatch.update(override.id, {
                  status: 'locked', scheduled_at: time, ref_email: refEmail,
                  last_interaction_at: new Date().toISOString(),
                });
                setOverride(null); reload();
              }} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function OverrideForm({ shifts, onSubmit }) {
  const [time, setTime] = useState('');
  const [refEmail, setRefEmail] = useState('');
  const refs = [...new Set(shifts.map((s) => s.ref_email))];
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Force-schedule this stalled match. Both teams + ref should be notified out-of-band.</p>
      <div><label className="block text-sm font-medium mb-1.5">Time</label>
        <input type="datetime-local" className={inputCls} value={time} onChange={(e) => setTime(e.target.value)} /></div>
      <div><label className="block text-sm font-medium mb-1.5">Referee</label>
        <select className={inputCls} value={refEmail} onChange={(e) => setRefEmail(e.target.value)}>
          <option value="">— select —</option>
          {refs.map((r) => <option key={r} value={r}>{r}</option>)}
        </select></div>
      <button disabled={!time} onClick={() => onSubmit(new Date(time).toISOString(), refEmail)}
        className="w-full bg-destructive text-white rounded-lg py-2 text-sm font-medium hover:bg-destructive/90 disabled:opacity-50">
        Force schedule
      </button>
    </div>
  );
}

/* ─────────────────────────  REF TOOLS  ───────────────────────── */
function RefToolsTab({ matches, teamById, protests, config, myEmail, shifts = [], isSuperAdmin, reload, setError }) {
  const mine = isSuperAdmin ? matches : matches.filter((m) => m.ref_email === myEmail);
  const live = mine.filter((m) => ['locked', 'live'].includes(m.status));
  const done = mine.filter((m) => ['completed', 'draw', 'forfeit'].includes(m.status));
  const myShifts = isSuperAdmin ? shifts : shifts.filter((s) => s.ref_email === myEmail);
  const [sf, setSf] = useState({ start_at: '', end_at: '', ref_name: '' });

  const createShift = async () => {
    if (!sf.start_at || !sf.end_at) return;
    try {
      await base44.entities.QuizBowlRefShift.create({
        ref_email: myEmail, ref_name: sf.ref_name || myEmail,
        start_at: new Date(sf.start_at).toISOString(),
        end_at: new Date(sf.end_at).toISOString(), status: 'open',
      });
      setSf({ start_at: '', end_at: '', ref_name: '' });
      reload();
    } catch (e) { setError(e.message); }
  };
  const delShift = async (id) => { await base44.entities.QuizBowlRefShift.delete(id); reload(); };

  return (
    <div className="space-y-4">
      {/* Always-visible shift pool */}
      <div className="bg-white rounded-2xl border border-border p-5">
        <p className="font-semibold text-foreground mb-3 flex items-center gap-2"><Clock className="w-4 h-4" /> My referee shifts ({myShifts.length})</p>
        <div className="flex flex-wrap gap-3 items-end mb-3">
          <div><label className="block text-xs text-muted-foreground mb-1">Start</label>
            <input type="datetime-local" className={inputCls} value={sf.start_at}
              onChange={(e) => setSf((p) => ({ ...p, start_at: e.target.value }))} /></div>
          <div><label className="block text-xs text-muted-foreground mb-1">End</label>
            <input type="datetime-local" className={inputCls} value={sf.end_at}
              onChange={(e) => setSf((p) => ({ ...p, end_at: e.target.value }))} /></div>
          <div><label className="block text-xs text-muted-foreground mb-1">Ref name</label>
            <input className={inputCls} placeholder="optional" value={sf.ref_name}
              onChange={(e) => setSf((p) => ({ ...p, ref_name: e.target.value }))} /></div>
          <button onClick={createShift} className="bg-foreground text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-foreground/90">Add shift</button>
        </div>
        {myShifts.length === 0 && <p className="text-sm text-muted-foreground">No shifts yet. Add one above — it appears in the open pool immediately.</p>}
        <div className="space-y-1.5">
          {myShifts.map((s) => (
            <div key={s.id} className="flex items-center justify-between text-sm border-b border-border/50 last:border-0 py-2">
              <span className="text-foreground">{fmt(s.start_at)} → {fmt(s.end_at)}{isSuperAdmin ? ` · ${s.ref_email}` : ''}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.status === 'open' ? 'bg-success/10 text-success border border-green-200' : s.status === 'held' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-muted text-muted-foreground border border-border'}`}>{s.status}</span>
                {s.status === 'open' && (
                  <button onClick={() => delShift(s.id)} className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {mine.length === 0 && (
        <div className="text-center py-10 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
          No matches assigned to you yet.
        </div>
      )}
      {live.map((m) => (
        <MatchExecCard key={m.id} match={m} teamById={teamById}
          protests={protests.filter((p) => p.match_id === m.id)}
          negPenalty={config?.neg_penalty_value || 500}
          reload={reload} setError={setError} />
      ))}
      {done.length > 0 && (
        <div className="bg-white rounded-2xl border border-border p-5">
          <p className="font-semibold text-foreground mb-3">Completed</p>
          {done.map((m) => {
            const a = teamById(m.team_a_id), b = teamById(m.team_b_id);
            return (
              <div key={m.id} className="flex justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
                <span>{a?.team_name} vs {b?.team_name}</span>
                <span className="text-muted-foreground">{m.status} · {m.team_a_score ?? '–'}:{m.team_b_score ?? '–'}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MatchExecCard({ match, teamById, protests, negPenalty, reload, setError }) {
  const a = teamById(match.team_a_id), b = teamById(match.team_b_id);
  const [lobby, setLobby] = useState(null);
  const [links, setLinks] = useState({
    meet_link: match.meet_link || '', kahoot_link: match.kahoot_link || '',
    kahoot_pin: match.kahoot_pin || '', buzzer_link: match.buzzer_link || '',
  });
  const [scoreA, setScoreA] = useState(match.team_a_score ?? '');
  const [scoreB, setScoreB] = useState(match.team_b_score ?? '');
  const [elapsedMin, setElapsedMin] = useState(0);

  const loadLobby = useCallback(async () => {
    const { data } = await supabase.from('quiz_bowl_lobby').select('*').eq('match_id', match.id).maybeSingle();
    setLobby(data || null);
  }, [match.id]);
  useEffect(() => { loadLobby(); }, [loadLobby]);

  useEffect(() => {
    if (!match.scheduled_at) return;
    const tick = () => setElapsedMin(Math.floor((Date.now() - new Date(match.scheduled_at).getTime()) / 60000));
    tick();
    const iv = setInterval(tick, 15000);
    return () => clearInterval(iv);
  }, [match.scheduled_at]);

  const upsertLobby = async (patch) => {
    const next = { match_id: match.id, ...(lobby || {}), ...patch, updated_at: new Date().toISOString() };
    await supabase.from('quiz_bowl_lobby').upsert(next, { onConflict: 'match_id' });
    loadLobby();
  };

  const saveLinks = async () => {
    try { await base44.entities.QuizBowlMatch.update(match.id, links); reload(); }
    catch (e) { setError(e.message); }
  };

  const bothReady = lobby?.team_a_ready_at && lobby?.team_b_ready_at && lobby?.ref_joined_at;

  const submitScore = async (forfeitWinnerId) => {
    try {
      let sa = Number(scoreA) || 0, sb = Number(scoreB) || 0, status = 'completed', winner = null;
      if (forfeitWinnerId) {
        status = 'forfeit'; winner = forfeitWinnerId;
        sa = forfeitWinnerId === match.team_a_id ? 1 : 0;
        sb = forfeitWinnerId === match.team_b_id ? 1 : 0;
      } else {
        winner = sa === sb ? null : sa > sb ? match.team_a_id : match.team_b_id;
        if (!winner) status = 'draw';
      }
      await base44.entities.QuizBowlMatch.update(match.id, {
        team_a_score: sa, team_b_score: sb, winner_team_id: winner,
        status, score_locked_at: new Date().toISOString(),
        last_interaction_at: new Date().toISOString(),
      });
      // Update standings.
      const apply = async (team, won, lost, drew, pts) => {
        if (!team) return;
        await base44.entities.QuizBowlTeam.update(team.id, {
          wins: (team.wins || 0) + won, losses: (team.losses || 0) + lost,
          draws: (team.draws || 0) + drew,
          cumulative_score: (team.cumulative_score || 0) + pts,
        });
      };
      if (status === 'draw') {
        await apply(a, 0, 0, 1, sa); await apply(b, 0, 0, 1, sb);
      } else {
        const aWon = winner === match.team_a_id;
        await apply(a, aWon ? 1 : 0, aWon ? 0 : 1, 0, sa);
        await apply(b, aWon ? 0 : 1, aWon ? 1 : 0, 0, sb);
      }
      reload();
    } catch (e) { setError(e.message); }
  };

  const openProtest = protests.find((p) => p.status === 'open' && new Date(p.window_expires_at) > new Date());

  return (
    <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="font-semibold text-foreground">{a?.team_name} vs {b?.team_name}
          <span className="text-xs font-normal text-muted-foreground"> · {match.stage} R{match.round} · {fmt(match.scheduled_at)}</span></p>
        <span className="text-xs text-muted-foreground">{elapsedMin >= 0 ? `${elapsedMin} min in` : `starts in ${-elapsedMin} min`}</span>
      </div>

      {/* Links */}
      <div className="grid grid-cols-2 gap-3">
        {['meet_link', 'kahoot_link', 'kahoot_pin', 'buzzer_link'].map((k) => (
          <div key={k}>
            <label className="block text-xs text-muted-foreground mb-1">{k.replace('_', ' ')}</label>
            <input className={inputCls} value={links[k]}
              onChange={(e) => setLinks((p) => ({ ...p, [k]: e.target.value }))} />
          </div>
        ))}
      </div>
      <button onClick={saveLinks} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-border hover:bg-muted flex items-center gap-1.5">
        <Link2 className="w-3.5 h-3.5" /> Save links
      </button>

      {/* Lobby */}
      <div className="border border-border rounded-xl p-4 bg-muted/10 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Live lobby</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <button onClick={() => upsertLobby({ team_a_ready_at: new Date().toISOString() })}
            className={`px-3 py-1.5 rounded-lg border ${lobby?.team_a_ready_at ? 'bg-success/10 text-success border-green-200' : 'border-border'}`}>{a?.team_name} ready</button>
          <button onClick={() => upsertLobby({ team_b_ready_at: new Date().toISOString() })}
            className={`px-3 py-1.5 rounded-lg border ${lobby?.team_b_ready_at ? 'bg-success/10 text-success border-green-200' : 'border-border'}`}>{b?.team_name} ready</button>
          <button onClick={() => upsertLobby({ ref_joined_at: new Date().toISOString() })}
            className={`px-3 py-1.5 rounded-lg border ${lobby?.ref_joined_at ? 'bg-success/10 text-success border-green-200' : 'border-border'}`}>Ref joined</button>
        </div>
        {bothReady ? (
          <div className="text-xs text-foreground space-y-1">
            <p className="text-success font-semibold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Meet revealed: {match.meet_link || '(set link above)'}</p>
            <div className="flex gap-2">
              <button onClick={() => upsertLobby({ tech_check_started_at: new Date().toISOString(), tech_check_ends_at: new Date(Date.now() + 5 * 60000).toISOString() })}
                className="px-3 py-1.5 rounded-lg border border-border">Start 5-min tech check</button>
              <button onClick={() => upsertLobby({ tech_check_ends_at: new Date().toISOString() })}
                className="px-3 py-1.5 rounded-lg border border-border">End early</button>
              <button onClick={() => upsertLobby({ tech_check_ends_at: new Date(Date.now() + 5 * 60000).toISOString() })}
                className="px-3 py-1.5 rounded-lg border border-border">Extend 5 min</button>
              <button onClick={() => upsertLobby({ links_released: true })}
                className={`px-3 py-1.5 rounded-lg border ${lobby?.links_released ? 'bg-success/10 text-success border-green-200' : 'border-border'}`}>Approve · release Kahoot/buzzer</button>
            </div>
            {lobby?.links_released && (
              <p className="text-muted-foreground">Kahoot {match.kahoot_link} (PIN {match.kahoot_pin}) · Buzzer {match.buzzer_link}</p>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Meet link hidden until both teams ready + ref joined.</p>
        )}
      </div>

      {/* Score entry + edge cases */}
      <div className="border border-border rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Score entry</p>
        <div className="flex items-center gap-3">
          <input type="number" className={inputCls} placeholder={a?.team_name} value={scoreA} onChange={(e) => setScoreA(e.target.value)} />
          <span className="text-muted-foreground">:</span>
          <input type="number" className={inputCls} placeholder={b?.team_name} value={scoreB} onChange={(e) => setScoreB(e.target.value)} />
        </div>
        <p className="text-xs text-muted-foreground">Neg penalty value: {negPenalty} pts. Short-handed allowed (min 1 player present).</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => submitScore(null)} disabled={!!openProtest}
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-foreground text-white hover:bg-foreground/90 disabled:opacity-50 flex items-center gap-1.5">
            <Check className="w-4 h-4" /> Submit & lock
          </button>
          {elapsedMin >= 10 && (
            <>
              <button onClick={() => submitScore(match.team_b_id)} className="text-sm font-semibold px-4 py-2 rounded-lg border border-border hover:bg-muted flex items-center gap-1.5">
                <Flag className="w-4 h-4" /> Forfeit — {a?.team_name} no-show
              </button>
              <button onClick={() => submitScore(match.team_a_id)} className="text-sm font-semibold px-4 py-2 rounded-lg border border-border hover:bg-muted flex items-center gap-1.5">
                <Flag className="w-4 h-4" /> Forfeit — {b?.team_name} no-show
              </button>
            </>
          )}
          {elapsedMin < 10 && match.scheduled_at && (
            <span className="text-xs text-muted-foreground self-center">Forfeit unlocks at 10 min ({Math.max(0, 10 - elapsedMin)} min left).</span>
          )}
        </div>
        {openProtest && (
          <p className="text-xs text-destructive">Protest open until {fmt(openProtest.window_expires_at)} — score lock blocked.</p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────  SETTINGS  ───────────────────────── */
function SettingsTab({ config, busy, onRunScheduler, reload, setError }) {
  const [closingReg, setClosingReg] = useState(false);
  const [closeSuccess, setCloseSuccess] = useState('');

  const closeRegistration = async () => {
    if (!window.confirm('Close registration? This will:\n• Set registration_closed = true\n• Lock ALL teams\n• Cancel ALL pending/invited memberships\n\nThis cannot be undone easily.')) return;
    setClosingReg(true);
    setCloseSuccess('');
    try {
      if (config) await base44.entities.QuizBowlConfig.update(config.id, { registration_closed: true, updated_at: new Date().toISOString() });
      else await base44.entities.QuizBowlConfig.create({ registration_closed: true, phase: 'pre', updated_at: new Date().toISOString() });

      const allTeams = await base44.entities.QuizBowlTeam.list();
      await Promise.all(allTeams.map(t => base44.entities.QuizBowlTeam.update(t.id, { locked: true })));

      const allMembers = await base44.entities.QuizBowlTeamMember.list();
      const toCancel = allMembers.filter(m => m.status === 'invited' || m.status === 'pending');
      await Promise.all(toCancel.map(m => base44.entities.QuizBowlTeamMember.delete(m.id)));

      setCloseSuccess(`Done. ${allTeams.length} teams locked, ${toCancel.length} invitations cancelled.`);
      reload();
    } catch (e) { setError(e.message); }
    finally { setClosingReg(false); }
  };

  const [form, setForm] = useState({
    start_date: config?.start_date?.slice(0, 16) || '',
    group_stage_end: config?.group_stage_end?.slice(0, 16) || '',
    playoff_start: config?.playoff_start?.slice(0, 16) || '',
    neg_penalty_value: config?.neg_penalty_value ?? 500,
    registration_closed: config?.registration_closed ?? false,
  });
  const save = async () => {
    try {
      const payload = {
        start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
        group_stage_end: form.group_stage_end ? new Date(form.group_stage_end).toISOString() : null,
        playoff_start: form.playoff_start ? new Date(form.playoff_start).toISOString() : null,
        neg_penalty_value: Number(form.neg_penalty_value) || 0,
        registration_closed: form.registration_closed,
        updated_at: new Date().toISOString(),
      };
      if (config) await base44.entities.QuizBowlConfig.update(config.id, payload);
      else await base44.entities.QuizBowlConfig.create({ ...payload, phase: 'pre' });
      reload();
    } catch (e) { setError(e.message); }
  };
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-border p-5 space-y-4 max-w-xl">
        <p className="font-semibold text-foreground">Tournament settings</p>
        {[['start_date', 'Start date'], ['group_stage_end', 'Group stage end (Day 4 night)'], ['playoff_start', 'Playoff start (Day 5)']].map(([k, label]) => (
          <div key={k}><label className="block text-sm font-medium mb-1.5">{label}</label>
            <input type="datetime-local" className={inputCls} value={form[k]}
              onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))} /></div>
        ))}
        <div><label className="block text-sm font-medium mb-1.5">Neg penalty value (X)</label>
          <input type="number" className={inputCls} value={form.neg_penalty_value}
            onChange={(e) => setForm((p) => ({ ...p, neg_penalty_value: e.target.value }))} /></div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.registration_closed}
            onChange={(e) => setForm((p) => ({ ...p, registration_closed: e.target.checked }))} />
          Registration closed (Quiz Bowl started — invites cancelled, no new teams)
        </label>
        <button onClick={save} className="bg-foreground text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-foreground/90">Save settings</button>
      </div>

      <div className="bg-white rounded-2xl border border-red-200 p-5 max-w-xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-foreground">Close Registration</p>
            <p className="text-xs text-muted-foreground">Locks all teams, cancels all invitations, blocks new sign-ups.</p>
          </div>
          <button disabled={closingReg || config?.registration_closed} onClick={closeRegistration}
            className="flex items-center gap-2 bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50">
            {closingReg ? 'Closing…' : config?.registration_closed ? 'Already closed' : 'Close Registration'}
          </button>
        </div>
        {closeSuccess && <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{closeSuccess}</p>}
      </div>

      <div className="bg-white rounded-2xl border border-border p-5 flex items-center justify-between max-w-xl">
        <div>
          <p className="font-semibold text-foreground">Scheduler</p>
          <p className="text-xs text-muted-foreground">Runs every 10 min via pg_cron. Use this if pg_cron is unavailable.</p>
        </div>
        <button disabled={busy} onClick={onRunScheduler}
          className="flex items-center gap-2 border border-border text-sm font-medium px-4 py-2 rounded-lg hover:bg-muted disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${busy ? 'animate-spin' : ''}`} /> Run scheduler now
        </button>
      </div>
    </div>
  );
}
