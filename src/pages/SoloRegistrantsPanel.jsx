import React from 'react';
import { Copy, Mail } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const ECON_TEAM_NAMES = [
  'Invisible Hand','Nash Equilibrium','Keynesian Crusaders','Supply Siders','The Marginalists',
  'Rational Actors','Pareto Optimizers','The Arbitrageurs','Comparative Advantage','The Elastics',
  'Marginal Revolution','Creative Destroyers','The Multipliers','Market Makers','The Equilibrium',
  'Fiscal Hawks','The Monetarists','Opportunity Costs','The Ricardians','Coase Theorem',
  'The Externalities','Game Theorists','Austrian School','Chicago School','The Laissez-Faire',
  'Price Discoverers','The Oligopolists','Moral Hazard','Deadweight Avoiders','The Incentivists',
];

function randomEconTeamName() {
  const base = ECON_TEAM_NAMES[Math.floor(Math.random() * ECON_TEAM_NAMES.length)];
  return `${base} ${Math.floor(Math.random() * 90 + 10)}`;
}

export default function SoloRegistrantsPanel({
  soloEmails, copiedEmails, setCopiedEmails,
  backfillStatus, setBackfillStatus, backfillLog, setBackfillLog,
  registrations, loadAll,
}) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Solo Registrants</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {soloEmails.length} solo participant{soloEmails.length !== 1 ? 's' : ''} &mdash; teams with 1 active member
          </p>
        </div>
        <div className="flex items-center gap-2">
          {soloEmails.length > 0 && (
            <button onClick={() => {
              navigator.clipboard.writeText(soloEmails.join('\n'));
              setCopiedEmails(true);
              setTimeout(() => setCopiedEmails(false), 2000);
            }} className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-colors">
              <Copy className="w-3.5 h-3.5" /> {copiedEmails ? 'Copied!' : 'Copy emails'}
            </button>
          )}
          <button
            onClick={async () => {
              if (backfillStatus === 'running') return;
              setBackfillStatus('running');
              setBackfillLog([]);
              try {
                const allMembers = await base44.entities.QuizBowlTeamMember.list().catch(() => []);
                const emailsWithTeam = new Set(allMembers.map(m => m.user_email));
                const qbOnly = registrations.filter(r => r.event_type === 'quiz-bowl' && !emailsWithTeam.has(r.user_email));
                const log = [];
                for (const reg of qbOnly) {
                  const tname = randomEconTeamName();
                  try {
                    const team = await base44.entities.QuizBowlTeam.create({
                      team_name: tname, captain_email: reg.user_email,
                      school: reg.school, state: reg.state, locked: false,
                    });
                    await base44.entities.QuizBowlTeamMember.create({
                      team_id: team.id, user_email: reg.user_email,
                      user_name: reg.user_name, role: 'captain', status: 'active',
                    });
                    log.push('+ ' + (reg.user_name || reg.user_email) + ' -> ' + tname);
                  } catch (err) {
                    log.push('! ' + reg.user_email + ': ' + err.message);
                  }
                }
                if (log.length === 0) log.push('All QB registrants already have a team.');
                setBackfillLog(log);
                setBackfillStatus('done');
                loadAll();
              } catch {
                setBackfillStatus('idle');
              }
            }}
            disabled={backfillStatus === 'running'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-60">
            {backfillStatus === 'running' ? 'Running...' : 'Assign teams to unassigned'}
          </button>
        </div>
      </div>

      {backfillLog.length > 0 && (
        <div className="bg-muted/40 rounded-xl p-3 text-xs font-mono space-y-1 max-h-40 overflow-y-auto">
          {backfillLog.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      )}

      {soloEmails.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" /> Solo participant emails
          </p>
          <div className="bg-muted/40 rounded-xl p-3 text-xs font-mono space-y-1 max-h-40 overflow-y-auto">
            {soloEmails.map(e => <div key={e}>{e}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
