// Clinch detection: a team locks the #1 bracket spot once it is
// mathematically impossible for any rival to leapfrog it, given the
// points each rival can still gain from their remaining matches.

// standings: [{ id, points, maxRemainingGain }]
// Returns true if `teamId` has clinched sole first place.
export function hasClinched(teamId, standings) {
  const me = standings.find((s) => s.id === teamId);
  if (!me) return false;
  return standings.every(
    (s) => s.id === teamId || me.points > (s.points + (s.maxRemainingGain || 0))
  );
}

// Convenience: returns the set of clinched team ids in a bracket.
export function clinchedTeams(standings) {
  return new Set(
    standings.filter((s) => hasClinched(s.id, standings)).map((s) => s.id)
  );
}
