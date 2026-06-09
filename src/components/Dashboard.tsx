import React from 'react';

interface DashboardProps {
  data: {
    breakdown: {
      transport: number;
      energy: number;
      diet: number;
      shopping: number;
    };
    totalEmissions: number;
    regionalComparison: {
      user: number;
      usAverage: number;
      euAverage: number;
      globalTarget: number;
    };
  };
  questReduction: number; // in tons/year saved by active habits
}

export const Dashboard: React.FC<DashboardProps> = ({ data, questReduction }) => {
  const { breakdown, totalEmissions, regionalComparison } = data;
  const currentFootprint = Math.max(0.1, parseFloat((totalEmissions - questReduction).toFixed(2)));

  // 1. Calculations for custom SVG Donut Chart
  const categories = [
    { label: 'Transport', value: breakdown.transport, color: '#06b6d4' },
    { label: 'Energy', value: breakdown.energy, color: '#10b981' },
    { label: 'Diet', value: breakdown.diet, color: '#f43f5e' },
    { label: 'Shopping', value: breakdown.shopping, color: '#eab308' },
  ];

  const filteredCategories = categories.filter(c => c.value > 0);
  const chartTotal = filteredCategories.reduce((sum, c) => sum + c.value, 0);

  // Compute SVG segment paths
  let cumulativePercent = 0;
  const donutRadius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * donutRadius;

  const donutSegments = filteredCategories.map((cat, idx) => {
    const percent = chartTotal > 0 ? cat.value / chartTotal : 0.25;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = `${-cumulativePercent * circumference}`;
    cumulativePercent += percent;

    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
      idx
    };
  });

  // 2. Trajectory points for the 2026-2030 forecast (Linear/Curved line projection)
  const years = [2026, 2027, 2028, 2029, 2030];
  const bauTons = years.map((_, i) => totalEmissions * (1 + i * 0.02)); // BAU rises slightly
  const reducedTons = years.map((_, i) => Math.max(regionalComparison.globalTarget, totalEmissions - (questReduction * (i + 1) * 0.5)));

  // SVG dimensions for chart
  const graphWidth = 400;
  const graphHeight = 160;
  const padding = 30;

  const getCoordinates = (xIdx: number, yValue: number) => {
    const x = padding + (xIdx / (years.length - 1)) * (graphWidth - 2 * padding);
    // Max scale up to 20 or highest value
    const maxVal = Math.max(20, totalEmissions * 1.3);
    const y = graphHeight - padding - (yValue / maxVal) * (graphHeight - 2 * padding);
    return { x, y };
  };

  const bauPoints = bauTons.map((val, idx) => getCoordinates(idx, val));
  const reducedPoints = reducedTons.map((val, idx) => getCoordinates(idx, val));

  const bauPath = `M ${bauPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const reducedPath = `M ${reducedPoints.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div className="grid gap-6 md:grid-cols-2 animate-fadeIn">
      
      {/* 1. Footprint Overview Gauge */}
      <article className="border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center text-center" aria-labelledby="donut-header">
        <h2 id="donut-header" className="text-slate-400 text-sm font-semibold mb-4 uppercase tracking-wider">Your Annual Footprint</h2>
        <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justify: 'center' }}>
          <svg width="100%" height="100%" viewBox="0 0 140 140" aria-label="Visual breakdown ring chart">
            <circle cx="70" cy="70" r={donutRadius} fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth={strokeWidth} />
            {donutSegments.map((seg) => (
              <circle
                key={seg.label}
                cx="70"
                cy="70"
                r={donutRadius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                transform="rotate(-90 70 70)"
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            ))}
          </svg>
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: '800', color: '#f8fafc', lineHeight: 1 }}>
              {currentFootprint}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Tons CO2e
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-6 w-full text-xs">
          {categories.map(cat => (
            <div key={cat.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color, display: 'inline-block' }} />
              <span className="text-slate-400">{cat.label}:</span>
              <strong className="text-slate-200 ml-auto">{cat.value} t</strong>
            </div>
          ))}
        </div>
      </article>

      {/* 2. Comparative Benchmarks */}
      <article className="border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 flex flex-col gap-4" aria-labelledby="compare-header">
        <h2 id="compare-header" className="text-lg font-bold text-emerald-400 flex items-center gap-2">
          <span>📊</span> How You Compare
        </h2>
        <p className="text-xs text-slate-400">
          Comparing your current simulated output against regional statistics and the IPCC net-zero targeted benchmark.
        </p>

        {/* Benchmark Bars */}
        <div className="flex flex-col gap-4 text-xs">
          {/* User Bar */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300">You (Active Level)</span>
              <strong className="text-slate-200">{currentFootprint} Tons/yr</strong>
            </div>
            <div className="bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div 
                style={{ 
                  width: `${Math.min(100, (currentFootprint / 20) * 100)}%`, 
                  height: '100%', 
                  background: '#10b981',
                  boxShadow: '0 0 8px rgba(16,185,129,0.5)' 
                }} 
              />
            </div>
          </div>

          {/* US Average */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300">US Household Average</span>
              <span className="text-slate-400">16.0 Tons/yr</span>
            </div>
            <div className="bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div style={{ width: '80%', height: '100%', background: '#f43f5e' }} />
            </div>
          </div>

          {/* EU Average */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300">Europe Average</span>
              <span className="text-slate-400">6.4 Tons/yr</span>
            </div>
            <div className="bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div style={{ width: '32%', height: '100%', background: '#eab308' }} />
            </div>
          </div>

          {/* Global Target */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-300">IPCC Sustainable Target</span>
              <span className="text-slate-400">2.0 Tons/yr</span>
            </div>
            <div className="bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div style={{ width: '10%', height: '100%', background: '#06b6d4' }} />
            </div>
          </div>
        </div>
      </article>

      {/* 3. Trajectory Forecast Graph */}
      <article className="border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 md:col-span-2 flex flex-col gap-4" aria-labelledby="forecast-header">
        <div>
          <h2 id="forecast-header" className="text-lg font-bold text-emerald-400">📉 Carbon Footprint Trajectory (2026 - 2030)</h2>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing projections: Business As Usual (Red) vs. Continuous Active Habits (Emerald Green).
          </p>
        </div>

        {/* Dynamic Screen Reader updates for chart values */}
        <div className="sr-only" aria-live="polite">
          Year 2026: Business as usual {bauTons[0].toFixed(1)} tons, habit reduction {reducedTons[0].toFixed(1)} tons.
          Year 2030: Business as usual {bauTons[4].toFixed(1)} tons, habit reduction {reducedTons[4].toFixed(1)} tons.
        </div>

        <div className="w-full overflow-x-auto">
          <svg width="100%" height={graphHeight} viewBox={`0 0 ${graphWidth} ${graphHeight}`} style={{ minWidth: '400px' }} className="overflow-visible">
            {/* Grid Lines */}
            <line x1={padding} y1={padding} x2={graphWidth - padding} y2={padding} stroke="rgba(255,255,255,0.05)" />
            <line x1={padding} y1={graphHeight - padding} x2={graphWidth - padding} y2={graphHeight - padding} stroke="rgba(255,255,255,0.1)" />

            {/* Paths */}
            <path d={bauPath} fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="4 4" />
            <path d={reducedPath} fill="none" stroke="#10b981" strokeWidth="4" />

            {/* Path Nodes */}
            {bauPoints.map((p, i) => (
              <circle key={`bau-${i}`} cx={p.x} cy={p.y} r="4" fill="#f43f5e" />
            ))}
            {reducedPoints.map((p, i) => (
              <circle key={`red-${i}`} cx={p.x} cy={p.y} r="5" fill="#10b981" />
            ))}

            {/* Year Labels */}
            {years.map((year, idx) => {
              const xPos = padding + (idx / (years.length - 1)) * (graphWidth - 2 * padding);
              return (
                <text
                  key={year}
                  x={xPos}
                  y={graphHeight - 10}
                  fill="rgba(255,255,255,0.4)"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {year}
                </text>
              );
            })}
          </svg>
        </div>
      </article>
    </div>
  );
};
