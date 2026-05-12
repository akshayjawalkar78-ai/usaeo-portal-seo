import React, { useState, useEffect } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Continental US bounds (AK/HI outside default view)
const US_BOUNDS = [[24.396308, -124.848974], [49.384358, -66.885444]];

let _cachedGeo = null;

function getColor(count, max) {
  if (!count) return '#f3f4f6';
  const t = Math.min(count / Math.max(1, max), 1);
  const l = Math.round(95 - t * 50);
  const s = Math.round(25 + t * 70);
  return `hsl(24, ${s}%, ${l}%)`;
}

export default function USMapChoropleth({
  stateCounts = {},
  selectedState = null,
  onStateClick,
  height = 300,
}) {
  const [geoData, setGeoData] = useState(_cachedGeo);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (_cachedGeo) { setGeoData(_cachedGeo); return; }
    fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json')
      .then(r => r.json())
      .then(data => { _cachedGeo = data; setGeoData(data); })
      .catch(() => setError(true));
  }, []);

  const maxCount = Math.max(1, ...Object.values(stateCounts).filter(Number.isFinite));

  const styleFeature = (feature) => {
    const name = feature.properties.name;
    const count = stateCounts[name] || 0;
    const isSelected = selectedState === name;
    return {
      fillColor: getColor(count, maxCount),
      fillOpacity: 0.9,
      color: isSelected ? '#f97316' : '#9ca3af',
      weight: isSelected ? 2.5 : 0.8,
    };
  };

  const onEachFeature = (feature, layer) => {
    const name = feature.properties.name;
    const count = stateCounts[name] || 0;
    layer.bindTooltip(
      `<strong>${name}</strong><br/>${count} registration${count !== 1 ? 's' : ''}`,
      { sticky: true, className: 'leaflet-tooltip-state' }
    );
    if (onStateClick) {
      layer.on('click', () => onStateClick(name));
    }
  };

  if (error) return (
    <div style={{ height }} className="flex items-center justify-center text-sm text-muted-foreground border border-border rounded-xl">
      Could not load map data.
    </div>
  );

  if (!geoData) return (
    <div style={{ height }} className="flex items-center justify-center text-sm text-muted-foreground animate-pulse">
      Loading map…
    </div>
  );

  return (
    <MapContainer
      bounds={US_BOUNDS}
      style={{ height, width: '100%', background: 'transparent', borderRadius: 12 }}
      zoomControl={false}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      keyboard={false}
      attributionControl={false}
      boundsOptions={{ padding: [10, 10] }}
    >
      <GeoJSON
        key={`${JSON.stringify(stateCounts)}|${selectedState}`}
        data={geoData}
        style={styleFeature}
        onEachFeature={onEachFeature}
      />
    </MapContainer>
  );
}
