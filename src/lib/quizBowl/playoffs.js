// Playoff sizing, qualifier selection, and single-elimination seeding.
// Mirrors the PDF "Comprehensive Bracket Structure Variations" table.

import { computeBracketCount } from './brackets.js';

// Target single-elimination size Q from total team count N.
export function targetPlayoffSize(n) {
  if (n < 16) return 0;       // below minimum tournament size
  if (n <= 35) return 8;
  if (n <= 67) return 16;
  return 32;                  // 68–192
}

// Guaranteed qualifiers G = number of brackets B; wildcards W = Q - G.
export function qualifierBreakdown(n) {
  const B = computeBracketCount(n);
  const Q = targetPlayoffSize(n);
  const G = Math.min(B, Q);
  return { brackets: B, playoffSize: Q, guaranteed: G, wildcards: Math.max(0, Q - G) };
}

// brackets: [{ id, teams: [{ id, cumulative_score }] }] (teams pre-sorted
// by standing, best first). N = total teams across the tournament.
// Returns ordered qualifier list: bracket winners first, then wildcards.
export function selectQualifiers(brackets, n) {
  const { playoffSize, guaranteed } = qualifierBreakdown(n);
  if (!playoffSize) return [];

  const winners = [];
  const rest = [];
  for (const b of brackets) {
    const sorted = b.teams
      .slice()
      .sort((x, y) => (y.cumulative_score || 0) - (x.cumulative_score || 0));
    sorted.forEach((t, i) => {
      if (i === 0) winners.push({ ...t, bracketId: b.id, source: 'bracket' });
      else rest.push({ ...t, bracketId: b.id, source: 'wildcard' });
    });
  }

  const guaranteedSlots = winners
    .sort((a, b) => (b.cumulative_score || 0) - (a.cumulative_score || 0))
    .slice(0, guaranteed);

  const wildcardSlots = rest
    .sort((a, b) => (b.cumulative_score || 0) - (a.cumulative_score || 0))
    .slice(0, playoffSize - guaranteedSlots.length);

  // Overall seed order by cumulative score.
  return [...guaranteedSlots, ...wildcardSlots].sort(
    (a, b) => (b.cumulative_score || 0) - (a.cumulative_score || 0)
  );
}

// Standard seed pairing: 1 vs Q, 2 vs Q-1, ... Returns round-1 matchups.
// seeds: array (index 0 = top seed). Pads with null (logical bye) only if
// the qualifier count is short — should not happen with correct sizing.
export function buildSingleElim(seeds) {
  const size = seeds.length;
  if (size < 2) return [];
  const matchups = [];
  for (let i = 0; i < Math.floor(size / 2); i++) {
    matchups.push({
      slot: i + 1,
      round: 1,
      teamAId: seeds[i]?.id ?? seeds[i] ?? null,
      teamBId: seeds[size - 1 - i]?.id ?? seeds[size - 1 - i] ?? null,
    });
  }
  return matchups;
}
