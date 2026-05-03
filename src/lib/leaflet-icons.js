import L from 'leaflet';

const PRIMARY = 'hsl(24, 95%, 53%)';

const buildSvg = (size, fill) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="white" stroke-width="1.5">
    <circle cx="12" cy="12" r="9" />
  </svg>
`;

let _chapter;
export function chapterIcon() {
  if (_chapter) return _chapter;
  _chapter = L.divIcon({
    className: 'usaeo-chapter-icon',
    html: buildSvg(20, PRIMARY),
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
  return _chapter;
}

let _muted;
export function mutedIcon() {
  if (_muted) return _muted;
  _muted = L.divIcon({
    className: 'usaeo-muted-icon',
    html: buildSvg(16, 'hsl(0, 0%, 65%)'),
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
  return _muted;
}
