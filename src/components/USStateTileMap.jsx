import React from 'react';

// [col, row] positions in a 12×8 tile grid
const TILE_POSITIONS = {
  ME:[11,0],
  WA:[0,1],MT:[1,1],ND:[2,1],MN:[3,1],WI:[4,1],MI:[5,1],VT:[8,1],NH:[9,1],
  OR:[0,2],ID:[1,2],WY:[2,2],SD:[3,2],IA:[4,2],IL:[5,2],IN:[6,2],OH:[7,2],PA:[8,2],NY:[9,2],MA:[10,2],RI:[11,2],
  CA:[0,3],NV:[1,3],CO:[2,3],NE:[3,3],MO:[4,3],KY:[5,3],WV:[6,3],VA:[7,3],NJ:[8,3],CT:[9,3],
  UT:[1,4],NM:[2,4],KS:[3,4],AR:[4,4],TN:[5,4],NC:[6,4],SC:[7,4],MD:[8,4],DE:[9,4],
  AZ:[1,5],TX:[2,5],OK:[3,5],LA:[4,5],MS:[5,5],AL:[6,5],GA:[7,5],
  FL:[7,6],
  AK:[0,7],HI:[1,7],
};

export const STATE_NAME_TO_ABBREV = {
  'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
  'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
  'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA',
  'Kansas':'KS','Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD',
  'Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS','Missouri':'MO',
  'Montana':'MT','Nebraska':'NE','Nevada':'NV','New Hampshire':'NH','New Jersey':'NJ',
  'New Mexico':'NM','New York':'NY','North Carolina':'NC','North Dakota':'ND','Ohio':'OH',
  'Oklahoma':'OK','Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC',
  'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT',
  'Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY',
  'Outside United States':'OUS',
};

function interpolateColor(t, hue = 24) {
  // t in [0,1]: 0 = light gray, 1 = primary orange
  if (t <= 0) return '#f3f4f6';
  const l = Math.round(97 - t * 52); // 97 → 45
  const s = Math.round(20 + t * 75); // 20 → 95
  return `hsl(${hue}, ${s}%, ${l}%)`;
}

export default function USStateTileMap({
  stateCounts = {},      // { abbrev or full name: count }
  onStateClick,
  selectedState,         // abbrev
  size = 30,             // tile size in px
  gap = 2,               // gap between tiles
  showCounts = true,
}) {
  // Normalize keys: accept full names or abbrevs
  const normalizedCounts = {};
  Object.entries(stateCounts).forEach(([k, v]) => {
    const abbrev = STATE_NAME_TO_ABBREV[k] || k;
    normalizedCounts[abbrev] = (normalizedCounts[abbrev] || 0) + v;
  });

  const maxCount = Math.max(1, ...Object.values(normalizedCounts));
  const COLS = 12;
  const ROWS = 8;
  const W = COLS * (size + gap);
  const H = ROWS * (size + gap);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W}
      height={H}
      style={{ display: 'block', maxWidth: '100%' }}
    >
      {Object.entries(TILE_POSITIONS).map(([abbrev, [col, row]]) => {
        const count = normalizedCounts[abbrev] || 0;
        const t = count / maxCount;
        const fill = interpolateColor(t);
        const x = col * (size + gap);
        const y = row * (size + gap);
        const isSelected = selectedState === abbrev;
        const fontSize = size <= 28 ? 7 : size <= 34 ? 8 : 9;
        const countFontSize = size <= 28 ? 6 : 7;

        return (
          <g key={abbrev} onClick={() => onStateClick?.(abbrev)} style={{ cursor: onStateClick ? 'pointer' : 'default' }}>
            <rect
              x={x} y={y} width={size} height={size} rx={3}
              fill={fill}
              stroke={isSelected ? '#f97316' : count > 0 ? '#d1d5db' : '#e5e7eb'}
              strokeWidth={isSelected ? 2 : 1}
            />
            <text
              x={x + size / 2} y={y + size / 2 - (showCounts && count > 0 ? 3 : 0)}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={fontSize}
              fontWeight="600"
              fill={t > 0.55 ? '#fff' : '#374151'}
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {abbrev}
            </text>
            {showCounts && count > 0 && (
              <text
                x={x + size / 2} y={y + size / 2 + size * 0.28}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={countFontSize}
                fill={t > 0.55 ? 'rgba(255,255,255,0.85)' : '#6b7280'}
                fontFamily="ui-sans-serif, system-ui, sans-serif"
              >
                {count}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
