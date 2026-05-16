// Round-robin schedule for a single bracket using the circle method.
// Every pair meets exactly once. With an odd team count one team sits
// out a round (a scheduling rest, NOT a structural tournament bye).

// teamIds: string[]  ->  [{ round, teamAId, teamBId }]
export function generateRoundRobin(teamIds) {
  const ids = teamIds.slice();
  if (ids.length < 2) return [];

  const odd = ids.length % 2 === 1;
  if (odd) ids.push(null); // null = sit-out slot

  const n = ids.length;
  const rounds = n - 1;
  const half = n / 2;
  const matches = [];
  let arr = ids.slice();

  for (let r = 0; r < rounds; r++) {
    for (let i = 0; i < half; i++) {
      const a = arr[i];
      const b = arr[n - 1 - i];
      if (a !== null && b !== null) {
        matches.push({ round: r + 1, teamAId: a, teamBId: b });
      }
    }
    // Rotate: keep first fixed, cycle the rest.
    arr = [arr[0], arr[n - 1], ...arr.slice(1, n - 1)];
  }
  return matches;
}
