// Location-based bracket generation for the Quiz Bowl group stage.
// Pure / no I/O so it is unit-testable. PDF rule:
//   B = min(floor(N / 4), 32); bracket sizes 4–6, no structural byes.

export const US_REGIONS = {
  Northeast: ['CT', 'ME', 'MA', 'NH', 'RI', 'VT', 'NJ', 'NY', 'PA'],
  Midwest: ['IL', 'IN', 'MI', 'OH', 'WI', 'IA', 'KS', 'MN', 'MO', 'NE', 'ND', 'SD'],
  South: ['DE', 'FL', 'GA', 'MD', 'NC', 'SC', 'VA', 'DC', 'WV', 'AL', 'KY', 'MS', 'TN', 'AR', 'LA', 'OK', 'TX'],
  West: ['AZ', 'CO', 'ID', 'MT', 'NV', 'NM', 'UT', 'WY', 'AK', 'CA', 'HI', 'OR', 'WA'],
};

export function regionForState(state) {
  if (!state) return 'Other';
  const up = String(state).trim().toUpperCase();
  for (const [region, states] of Object.entries(US_REGIONS)) {
    if (states.includes(up)) return region;
  }
  return 'Other';
}

// Total brackets per the PDF formula.
export function computeBracketCount(n) {
  if (n < 4) return n > 0 ? 1 : 0;
  return Math.min(Math.floor(n / 4), 32);
}

// Split `total` teams across `count` brackets as evenly as possible.
// Returns an array of bracket sizes (each differing by at most 1).
export function evenSplit(total, count) {
  if (count <= 0) return [];
  const base = Math.floor(total / count);
  const remainder = total % count;
  return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0));
}

function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// teams: [{ id, state, is_international }]
// Returns { brackets: [{ name, region, is_international, teamIds: [] }] }.
// International teams are funnelled into their own isolated bracket(s);
// US teams are clustered by region, shuffled within region, then chunked.
export function computeBracketPlan(teams, rng = Math.random) {
  const intl = teams.filter((t) => t.is_international);
  const domestic = teams.filter((t) => !t.is_international);
  const n = teams.length;

  const totalBrackets = computeBracketCount(n);
  // Proportional share of brackets for the international pool (>=1 if any).
  let intlBrackets = intl.length
    ? Math.max(1, Math.min(Math.floor(intl.length / 4) || 1, totalBrackets - 1 || 1))
    : 0;
  if (intl.length && intl.length < 4) intlBrackets = 1;
  const domesticBrackets = Math.max(
    domestic.length ? 1 : 0,
    totalBrackets - intlBrackets
  );

  const brackets = [];

  // International — isolated, timezone-bundled.
  if (intl.length) {
    const sizes = evenSplit(intl.length, intlBrackets);
    const pool = shuffle(intl, rng);
    let idx = 0;
    sizes.forEach((size, i) => {
      brackets.push({
        name: `International ${String.fromCharCode(65 + i)}`,
        region: 'International',
        is_international: true,
        teamIds: pool.slice(idx, idx + size).map((t) => t.id),
      });
      idx += size;
    });
  }

  // Domestic — group by region, shuffle within, flatten, chunk.
  if (domestic.length) {
    const byRegion = {};
    for (const t of domestic) {
      const r = regionForState(t.state);
      (byRegion[r] ||= []).push(t);
    }
    const ordered = [];
    for (const region of Object.keys(byRegion).sort()) {
      ordered.push(...shuffle(byRegion[region], rng));
    }
    const sizes = evenSplit(domestic.length, domesticBrackets);
    let idx = 0;
    sizes.forEach((size, i) => {
      const slice = ordered.slice(idx, idx + size);
      // Dominant region label for the (mostly-regional) bracket.
      const counts = {};
      slice.forEach((t) => {
        const r = regionForState(t.state);
        counts[r] = (counts[r] || 0) + 1;
      });
      const region =
        Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Mixed';
      brackets.push({
        name: `Group ${i + 1}`,
        region,
        is_international: false,
        teamIds: slice.map((t) => t.id),
      });
      idx += size;
    });
  }

  return { brackets };
}
