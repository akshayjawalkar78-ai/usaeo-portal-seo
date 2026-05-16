// Admin "Conflict Map" status for a match.
//   green  – scheduled & confirmed (locked/live/completed/draw/forfeit)
//   yellow – in negotiation / an active hold exists
//   orange – 0 overlapping ref options OR no team interaction in 24h
//   red    – same, but 48h → manual admin override required

const HOUR = 3600 * 1000;

// info: {
//   status,                // match status string
//   hasActiveHold,         // boolean
//   refOverlapCount,       // # of ref shifts overlapping both teams' windows
//   lastInteractionAt,     // ISO string | Date | null
// }
export function matchConflictLevel(info, now = new Date()) {
  const settled = ['locked', 'live', 'completed', 'draw', 'forfeit'];
  if (settled.includes(info.status)) return 'green';

  const nowMs = now instanceof Date ? now.getTime() : new Date(now).getTime();
  const last = info.lastInteractionAt
    ? new Date(info.lastInteractionAt).getTime()
    : null;
  const sinceInteraction = last == null ? Infinity : nowMs - last;
  const noRefOverlap = (info.refOverlapCount || 0) === 0;

  // 48h with no interaction (optionally compounded by no ref overlap)
  // is the action-required state.
  if (sinceInteraction >= 48 * HOUR) return 'red';
  // No ref overlap at all, or 24h of silence, is a warning state.
  if (noRefOverlap || sinceInteraction >= 24 * HOUR) return 'orange';
  // Active negotiation/hold, or simply unscheduled but still healthy.
  return 'yellow';
}
