import React, { useState, useEffect } from 'react';

export interface HistoryLogEntry {
  id: string;
  date: string;
  category: 'transport' | 'energy' | 'diet' | 'shopping';
  label: string;
  value: number; // emissions in tons
}

/**
 * Persisted Log and History Tracker Component.
 * Employs local storage, manual log insertions, and dynamic SVG line graph trends.
 */
export default function HistoryTracker() {
  const [logs, setLogs] = useState<HistoryLogEntry[]>([]);
  const [category, setCategory] = useState<'transport' | 'energy' | 'diet' | 'shopping'>('transport');
  const [label, setLabel] = useState('');
  const [value, setValue] = useState(0.2);

  // Initialize and load logs from localStorage
  useEffect(() => {
    const savedLogs = localStorage.getItem('ecosphere_logs');
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error('Failed to parse logs:', e);
      }
    } else {
      // Seed default logs for rich dashboard preview
      const initialLogs: HistoryLogEntry[] = [
        { id: '1', date: '2026-06-01', category: 'transport', label: 'Commute distance', value: 0.15 },
        { id: '2', date: '2026-06-03', category: 'diet', label: 'Beef burger lunch', value: 0.08 },
        { id: '3', date: '2026-06-05', category: 'energy', label: 'AC grid runtime', value: 0.25 },
        { id: '4', date: '2026-06-07', category: 'shopping', label: 'Summer wardrobe', value: 0.35 },
      ];
      setLogs(initialLogs);
      localStorage.setItem('ecosphere_logs', JSON.stringify(initialLogs));
    }
  }, []);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const newEntry: HistoryLogEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      category,
      label,
      value: Math.max(0.01, value),
    };

    const updated = [newEntry, ...logs];
    setLogs(updated);
    localStorage.setItem('ecosphere_logs', JSON.stringify(updated));
    setLabel('');
  };

  const handleDeleteLog = (id: string) => {
    const updated = logs.filter(log => log.id !== id);
    setLogs(updated);
    localStorage.setItem('ecosphere_logs', JSON.stringify(updated));
  };

  // Group emissions by date to construct the historical line graph
  const groupedData = logs.reduce((acc: Record<string, number>, log) => {
    acc[log.date] = (acc[log.date] || 0) + log.value;
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedData).sort();
  const graphPoints = sortedDates.map(date => ({ date, total: groupedData[date] }));

  // Dynamic SVG sizing and line coordinates calculation
  const padding = 40;
  const width = 600;
  const height = 250;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxTotal = graphPoints.length ? Math.max(...graphPoints.map(p => p.total), 0.5) : 0.5;

  const pointsString = graphPoints.map((p, index) => {
    const x = padding + (index / Math.max(graphPoints.length - 1, 1)) * chartWidth;
    const y = padding + chartHeight - (p.total / maxTotal) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <section className="space-y-8 animate-fadeIn" aria-labelledby="history-title">
      <header className="border-b border-white/10 pb-4">
        <h1 id="history-title" className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
          Activity Logs & Emissions History
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Save, monitor, and audit your historical green actions. Data is kept 100% locally on your browser.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Input form panel */}
        <article className="border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 md:col-span-1" aria-labelledby="log-form-title">
          <h2 id="log-form-title" className="text-lg font-semibold text-emerald-400 mb-4">✍️ Log Daily Activity</h2>
          <form onSubmit={handleAddLog} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="log-category" className="text-xs font-semibold text-slate-400">Activity Category</label>
              <select
                id="log-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-800 border border-white/10 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="transport">Transportation</option>
                <option value="energy">Home Energy</option>
                <option value="diet">Dietary Serving</option>
                <option value="shopping">Shopping Spend</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="log-label" className="text-xs font-semibold text-slate-400">Activity Description</label>
              <input
                id="log-label"
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Took transit to office"
                className="w-full bg-slate-800 border border-white/10 rounded-lg p-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="log-val" className="text-xs font-semibold text-slate-400">Emissions (Metric Tons CO2e)</label>
              <input
                id="log-val"
                type="number"
                step="0.01"
                min="0.01"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full bg-slate-800 border border-white/10 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold py-2.5 rounded-lg text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
            >
              Add Entry
            </button>
          </form>
        </article>

        {/* History Line Chart */}
        <article className="border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 md:col-span-2 space-y-4" aria-labelledby="chart-title">
          <h2 id="chart-title" className="text-lg font-semibold text-emerald-400">📈 Carbon Emission Trend Line</h2>
          
          <div className="bg-slate-950/40 p-4 rounded-xl border border-white/5 flex justify-center items-center" aria-live="polite">
            {graphPoints.length < 2 ? (
              <p className="text-slate-500 text-sm py-12">Log at least two different dates to render the historical trend line.</p>
            ) : (
              <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible" aria-label="Line graph tracking total emissions over logged calendar dates">
                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const y = padding + chartHeight * (1 - ratio);
                  return (
                    <g key={i}>
                      <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                      <text x={padding - 10} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.4)" className="text-[10px] font-mono">{(maxTotal * ratio).toFixed(2)}t</text>
                    </g>
                  );
                })}
                
                {/* Trend line */}
                <polyline fill="none" stroke="url(#line-grad)" strokeWidth="3" points={pointsString} className="drop-shadow-[0_4px_12px_rgba(16,185,129,0.3)]" />
                
                {/* Point circles */}
                {graphPoints.map((p, index) => {
                  const x = padding + (index / Math.max(graphPoints.length - 1, 1)) * chartWidth;
                  const y = padding + chartHeight - (p.total / maxTotal) * chartHeight;
                  return (
                    <circle key={index} cx={x} cy={y} r="5" fill="#10B981" stroke="#0f172a" strokeWidth="2" className="cursor-pointer transition-transform hover:scale-150" />
                  );
                })}

                {/* X Axis Labels */}
                {graphPoints.map((p, index) => {
                  const x = padding + (index / Math.max(graphPoints.length - 1, 1)) * chartWidth;
                  return (
                    <text key={index} x={x} y={height - 15} textAnchor="middle" fill="rgba(255,255,255,0.4)" className="text-[9px] font-mono">{p.date.slice(5)}</text>
                  );
                })}

                {/* Gradients */}
                <defs>
                  <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#34D399" />
                    <stop offset="100%" stopColor="#2DD4BF" />
                  </linearGradient>
                </defs>
              </svg>
            )}
          </div>
        </article>
      </div>

      {/* Activity Logs Table */}
      <article className="border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-2xl p-6" aria-labelledby="logs-table-title">
        <h2 id="logs-table-title" className="text-lg font-semibold text-emerald-400 mb-4">📋 Logged Entries</h2>
        
        {logs.length === 0 ? (
          <p className="text-slate-500 text-sm py-8 text-center">No logs found. Start adding actions using the logging form above.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-sm text-left">
              <thead className="bg-slate-950/50 text-slate-400 uppercase text-xs font-semibold">
                <tr>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Category</th>
                  <th scope="col" className="px-6 py-3">Description</th>
                  <th scope="col" className="px-6 py-3">Emissions</th>
                  <th scope="col" className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {logs.map(log => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 font-mono text-slate-400">{log.date}</td>
                    <td className="px-6 py-4 capitalize font-medium text-teal-300">{log.category}</td>
                    <td className="px-6 py-4">{log.label}</td>
                    <td className="px-6 py-4 font-mono text-emerald-400">{log.value.toFixed(2)} Metric Tons</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        className="text-red-400 hover:text-red-300 transition-colors text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}
