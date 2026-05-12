import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  format, subDays, subHours,
  isAfter,
  startOfDay, startOfHour, startOfWeek, startOfMonth,
  addDays, addHours, addWeeks, addMonths,
} from 'date-fns';
import { X, TrendingUp } from 'lucide-react';
import USStateTileMap, { STATE_NAME_TO_ABBREV } from '../components/USStateTileMap';

const ABBREV_TO_NAME = Object.fromEntries(Object.entries(STATE_NAME_TO_ABBREV).map(([k, v]) => [v, k]));

function timeButton(id, label, current, setFn) {
  return (
    <button key={id} onClick={() => setFn(id)}
      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${current === id ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
      {label}
    </button>
  );
}

export default function AdminAnalytics({ registrations, onClose }) {
  const [timeRange, setTimeRange] = useState('30d');
  const [granularity, setGranularity] = useState('day');
  const [selectedState, setSelectedState] = useState(null);

  const now = useMemo(() => new Date(), []);

  const rangeStart = useMemo(() => {
    if (timeRange === '24h') return subHours(now, 24);
    if (timeRange === '7d') return subDays(now, 7);
    if (timeRange === '30d') return subDays(now, 30);
    // 'all' — earliest registration
    const withDate = registrations.filter(r => r.registered_at);
    if (!withDate.length) return subDays(now, 30);
    return new Date(Math.min(...withDate.map(r => new Date(r.registered_at).getTime())));
  }, [timeRange, now, registrations]);

  // State + school distribution
  const stateStats = useMemo(() => {
    const counts = {};
    const schools = {};
    registrations.forEach(r => {
      const state = r.state?.trim();
      if (!state) return;
      counts[state] = (counts[state] || 0) + 1;
      if (!schools[state]) schools[state] = {};
      const school = r.school?.trim();
      if (school) schools[state][school] = (schools[state][school] || 0) + 1;
    });
    return {
      bars: Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([state, count]) => ({ state, count })),
      schools,
    };
  }, [registrations]);

  // Build time buckets
  const buildBuckets = (start, end, gran) => {
    const buckets = [];
    let cur;
    if (gran === 'hour') cur = startOfHour(start);
    else if (gran === 'day') cur = startOfDay(start);
    else if (gran === 'week') cur = startOfWeek(start);
    else cur = startOfMonth(start);

    while (!isAfter(cur, end)) {
      let label;
      if (gran === 'hour') label = format(cur, 'MMM d ha');
      else if (gran === 'day') label = format(cur, 'MMM d');
      else if (gran === 'week') label = format(cur, 'MMM d');
      else label = format(cur, 'MMM yyyy');
      buckets.push({ start: new Date(cur), label });
      if (gran === 'hour') cur = addHours(cur, 1);
      else if (gran === 'day') cur = addDays(cur, 1);
      else if (gran === 'week') cur = addWeeks(cur, 1);
      else cur = addMonths(cur, 1);
    }
    return buckets;
  };

  const chartData = useMemo(() => {
    const inRange = registrations.filter(r => r.registered_at && isAfter(new Date(r.registered_at), rangeStart));
    const buckets = buildBuckets(rangeStart, now, granularity);
    if (!buckets.length) return { perPeriod: [], cumulative: [] };

    const eventTypes = ['quiz-bowl', 'essay'];

    const perPeriod = buckets.map((bucket, i) => {
      const nextStart = buckets[i + 1]?.start || addHours(now, 24);
      const row = { label: bucket.label };
      eventTypes.forEach(et => {
        row[et] = inRange.filter(r =>
          r.event_type === et &&
          new Date(r.registered_at) >= bucket.start &&
          new Date(r.registered_at) < nextStart
        ).length;
      });
      row.total = eventTypes.reduce((s, et) => s + (row[et] || 0), 0);
      return row;
    });

    // Cumulative actual
    let cumSum = 0;
    const cumActual = perPeriod.map(d => {
      cumSum += d.total;
      return { label: d.label, cumTotal: cumSum, projTotal: null };
    });

    // Linear projection from avg of last 5 buckets
    const window5 = cumActual.slice(-5);
    const avgPerBucket = window5.length > 1
      ? (window5[window5.length - 1].cumTotal - window5[0].cumTotal) / (window5.length - 1)
      : 0;

    const lastCum = cumActual[cumActual.length - 1]?.cumTotal || 0;
    const lastBucketStart = buckets[buckets.length - 1]?.start || now;

    // Boundary point: both actual + projected meet here
    const boundary = { label: cumActual[cumActual.length - 1]?.label, cumTotal: lastCum, projTotal: lastCum };

    const projected = [];
    for (let i = 1; i <= 5; i++) {
      let projDate;
      if (granularity === 'hour') projDate = addHours(lastBucketStart, i);
      else if (granularity === 'day') projDate = addDays(lastBucketStart, i);
      else if (granularity === 'week') projDate = addWeeks(lastBucketStart, i);
      else projDate = addMonths(lastBucketStart, i);

      const label = granularity === 'month'
        ? format(projDate, 'MMM yyyy')
        : granularity === 'hour'
          ? format(projDate, 'MMM d ha')
          : format(projDate, 'MMM d');

      projected.push({ label, cumTotal: null, projTotal: Math.max(0, Math.round(lastCum + avgPerBucket * i)) });
    }

    const cumulative = [
      ...cumActual.slice(0, -1),
      boundary,
      ...projected,
    ];

    return { perPeriod, cumulative };
  }, [registrations, rangeStart, granularity, now]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen p-4 md:p-8 flex items-start justify-center">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white rounded-t-2xl z-10">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Registration Analytics</h2>
              <span className="text-sm text-muted-foreground">{registrations.length} registrations total</span>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-10">

            {/* Time controls */}
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Time range</p>
                <div className="flex bg-muted rounded-lg p-1 gap-0.5">
                  {[['24h', '24h'], ['7d', '7d'], ['30d', '30d'], ['all', 'All time']].map(([id, lbl]) =>
                    timeButton(id, lbl, timeRange, setTimeRange)
                  )}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Granularity</p>
                <div className="flex bg-muted rounded-lg p-1 gap-0.5">
                  {[['hour', 'Hour'], ['day', 'Day'], ['week', 'Week'], ['month', 'Month']].map(([id, lbl]) =>
                    timeButton(id, lbl, granularity, setGranularity)
                  )}
                </div>
              </div>
            </div>

            {/* State distribution */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Geographic Distribution</h3>

              {/* Tile map */}
              {stateStats.bars.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs text-muted-foreground mb-3">Click a state to see school breakdown</p>
                  <div className="overflow-x-auto">
                    <USStateTileMap
                      stateCounts={Object.fromEntries(stateStats.bars.map(b => [b.state, b.count]))}
                      selectedState={selectedState ? STATE_NAME_TO_ABBREV[selectedState] || null : null}
                      onStateClick={abbrev => {
                        const full = ABBREV_TO_NAME[abbrev] || abbrev;
                        setSelectedState(prev => prev === full ? null : full);
                      }}
                      size={30}
                    />
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6 items-start">
                {/* State bar chart */}
                <div>
                  {stateStats.bars.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No state data available.</p>
                  ) : (
                    <div style={{ overflowY: 'auto', maxHeight: 300 }}>
                      <div style={{ height: Math.max(stateStats.bars.length * 28, 160) }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stateStats.bars} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                            <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                            <YAxis type="category" dataKey="state" tick={{ fontSize: 11 }} width={115} />
                            <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                            <Bar dataKey="count" name="Registrations" fill="#f97316" radius={[0, 3, 3, 0]}
                              onClick={d => setSelectedState(prev => prev === d.state ? null : d.state)}
                              cursor="pointer" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>

                {/* School breakdown */}
                <div className="border border-border rounded-xl p-4 min-h-40">
                  {selectedState ? (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold text-sm text-foreground">{selectedState}</p>
                        <button onClick={() => setSelectedState(null)}
                          className="text-xs text-muted-foreground hover:text-foreground px-2 py-0.5 hover:bg-muted rounded transition-colors">
                          Clear
                        </button>
                      </div>
                      <div className="space-y-1.5 overflow-y-auto max-h-60">
                        {Object.entries(stateStats.schools[selectedState] || {})
                          .sort((a, b) => b[1] - a[1])
                          .map(([school, count]) => (
                            <div key={school} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                              <span className="text-sm text-foreground">{school}</span>
                              <span className="text-xs font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-full">{count}</span>
                            </div>
                          ))}
                        {Object.keys(stateStats.schools[selectedState] || {}).length === 0 && (
                          <p className="text-sm text-muted-foreground">No school data for this state.</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="h-full min-h-24 flex items-center justify-center text-sm text-muted-foreground text-center px-4">
                      Click a state on the map or bar to see school breakdown
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Registrations per period */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">
                Registrations per {granularity}
              </h3>
              {chartData.perPeriod.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data in this time range.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData.perPeriod} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quiz-bowl" name="Quiz Bowl" fill="#3b82f6" stackId="a" />
                    <Bar dataKey="essay" name="Essay" fill="#8b5cf6" stackId="a" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Cumulative + projection */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-foreground">Cumulative Growth & Projection</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  dashed = projected
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Projection based on average rate over last 5 {granularity}s
              </p>
              {chartData.cumulative.length === 0 ? (
                <p className="text-sm text-muted-foreground">No data.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData.cumulative} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone" dataKey="cumTotal" name="Actual"
                      stroke="#f97316" strokeWidth={2} dot={false} connectNulls={false}
                    />
                    <Line
                      type="monotone" dataKey="projTotal" name="Projected"
                      stroke="#f97316" strokeWidth={2} strokeDasharray="6 4" dot={false} connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
