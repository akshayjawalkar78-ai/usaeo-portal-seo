import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  computeBracketCount,
  evenSplit,
  computeBracketPlan,
  regionForState,
} from '../brackets.js';
import { generateRoundRobin } from '../roundRobin.js';
import {
  targetPlayoffSize,
  qualifierBreakdown,
  selectQualifiers,
  buildSingleElim,
} from '../playoffs.js';
import { hasClinched } from '../clinch.js';
import { matchConflictLevel } from '../conflict.js';

const seededRng = (seed) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

function makeTeams(n, intl = 0) {
  const states = ['NY', 'CA', 'TX', 'IL', 'FL', 'WA', 'MA', 'GA'];
  return Array.from({ length: n }, (_, i) => ({
    id: `t${i}`,
    state: states[i % states.length],
    is_international: i < intl,
  }));
}

test('computeBracketCount follows B = min(floor(N/4), 32)', () => {
  assert.equal(computeBracketCount(16), 4);
  assert.equal(computeBracketCount(127), 31);
  assert.equal(computeBracketCount(128), 32);
  assert.equal(computeBracketCount(192), 32);
});

test('evenSplit distributes within 1 and sums to total', () => {
  const s = evenSplit(127, 31);
  assert.equal(s.reduce((a, b) => a + b, 0), 127);
  assert.ok(Math.max(...s) - Math.min(...s) <= 1);
});

test('bracket plan: no byes, every team placed exactly once', () => {
  for (const n of [16, 50, 127, 128, 192]) {
    const { brackets } = computeBracketPlan(makeTeams(n), seededRng(n));
    const all = brackets.flatMap((b) => b.teamIds);
    assert.equal(all.length, n, `n=${n} total placed`);
    assert.equal(new Set(all).size, n, `n=${n} no duplicates`);
    for (const b of brackets) {
      assert.ok(b.teamIds.length >= 3, `bracket too small n=${n}`);
      assert.ok(b.teamIds.length <= 6, `bracket too big n=${n}`);
    }
  }
});

test('international teams isolated into their own bracket', () => {
  const { brackets } = computeBracketPlan(makeTeams(60, 8), seededRng(7));
  const intl = brackets.filter((b) => b.is_international);
  assert.ok(intl.length >= 1);
  const intlIds = new Set(intl.flatMap((b) => b.teamIds));
  assert.equal(intlIds.size, 8);
  for (const b of brackets) {
    if (!b.is_international) {
      for (const id of b.teamIds) assert.ok(!intlIds.has(id));
    }
  }
});

test('regionForState maps correctly', () => {
  assert.equal(regionForState('NY'), 'Northeast');
  assert.equal(regionForState('ca'), 'West');
  assert.equal(regionForState('ZZ'), 'Other');
});

test('round robin: every pair once, correct count', () => {
  for (const n of [4, 5, 6]) {
    const ids = Array.from({ length: n }, (_, i) => `p${i}`);
    const m = generateRoundRobin(ids);
    assert.equal(m.length, (n * (n - 1)) / 2, `count n=${n}`);
    const seen = new Set();
    for (const x of m) {
      const key = [x.teamAId, x.teamBId].sort().join('|');
      assert.ok(!seen.has(key), `dup pair n=${n}`);
      seen.add(key);
    }
  }
});

test('targetPlayoffSize thresholds', () => {
  assert.equal(targetPlayoffSize(15), 0);
  assert.equal(targetPlayoffSize(16), 8);
  assert.equal(targetPlayoffSize(35), 8);
  assert.equal(targetPlayoffSize(36), 16);
  assert.equal(targetPlayoffSize(67), 16);
  assert.equal(targetPlayoffSize(68), 32);
  assert.equal(targetPlayoffSize(192), 32);
});

test('qualifierBreakdown: G + W = Q', () => {
  for (const n of [16, 24, 50, 100, 192]) {
    const { playoffSize, guaranteed, wildcards } = qualifierBreakdown(n);
    assert.equal(guaranteed + wildcards, playoffSize, `n=${n}`);
  }
});

test('selectQualifiers: winners guaranteed + score-ranked wildcards', () => {
  // 16 teams → B=4, Q=8: 4 winners + 4 wildcards
  const brackets = Array.from({ length: 4 }, (_, b) => ({
    id: `b${b}`,
    teams: Array.from({ length: 4 }, (_, i) => ({
      id: `b${b}t${i}`,
      cumulative_score: 1000 - b * 100 - i * 10,
    })),
  }));
  const q = selectQualifiers(brackets, 16);
  assert.equal(q.length, 8);
  // Each bracket's top scorer must be present.
  for (let b = 0; b < 4; b++) {
    assert.ok(q.some((t) => t.id === `b${b}t0`), `winner b${b}`);
  }
});

test('buildSingleElim seeds 1vN, 2vN-1', () => {
  const seeds = Array.from({ length: 8 }, (_, i) => ({ id: `s${i}` }));
  const r1 = buildSingleElim(seeds);
  assert.equal(r1.length, 4);
  assert.equal(r1[0].teamAId, 's0');
  assert.equal(r1[0].teamBId, 's7');
  assert.equal(r1[1].teamAId, 's1');
  assert.equal(r1[1].teamBId, 's6');
});

test('hasClinched: leader safe vs catchable', () => {
  const standings = [
    { id: 'A', points: 30, maxRemainingGain: 0 },
    { id: 'B', points: 20, maxRemainingGain: 9 },
    { id: 'C', points: 10, maxRemainingGain: 10 },
  ];
  assert.equal(hasClinched('A', standings), true);

  const tight = [
    { id: 'A', points: 30, maxRemainingGain: 0 },
    { id: 'B', points: 20, maxRemainingGain: 10 },
  ];
  assert.equal(hasClinched('A', tight), false); // B can tie
});

test('matchConflictLevel states', () => {
  const now = new Date('2026-05-18T12:00:00Z');
  assert.equal(matchConflictLevel({ status: 'locked' }, now), 'green');
  assert.equal(
    matchConflictLevel(
      { status: 'negotiating', hasActiveHold: true, refOverlapCount: 2, lastInteractionAt: now },
      now
    ),
    'yellow'
  );
  assert.equal(
    matchConflictLevel(
      { status: 'unscheduled', refOverlapCount: 0, lastInteractionAt: now },
      now
    ),
    'orange'
  );
  assert.equal(
    matchConflictLevel(
      {
        status: 'unscheduled',
        refOverlapCount: 2,
        lastInteractionAt: new Date('2026-05-16T00:00:00Z'),
      },
      now
    ),
    'red'
  );
});
