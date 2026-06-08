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
    <div className="dashboard-grid animate-fade-in">
      
      {/* 1. Footprint Overview Gauge */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '8px' }}>Your Annual Footprint</h3>
        <div style={{ position: 'relative', width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            <span style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>
              {currentFootprint}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', tracking: '1px' }}>
              Tons CO2e
            </span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', marginTop: '20px', width: '100%' }}>
          {categories.map(cat => (
            <div key={cat.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color, display: 'inline-block' }} />
              <span style={{ color: 'var(--text-secondary)' }}>{cat.label}:</span>
              <strong style={{ color: 'var(--text-primary)', marginLeft: 'auto' }}>{cat.value} t</strong>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Comparative Benchmarks */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>📊</span> How You Compare
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Comparing your current simulated output against regional statistics and the IPCC net-zero targeted benchmark.
        </p>

        {/* Benchmark Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* User Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
              <span>You (Active Level)</span>
              <strong>{currentFootprint} Tons/yr</strong>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${Math.min(100, (currentFootprint / 20) * 100)}%`, 
                  height: '100%', 
                  background: 'var(--primary)',
                  boxShadow: '0 0 8px var(--primary-glow)' 
                }} 
              />
            </div>
          </div>

          {/* US Average */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
              <span>US Household Average</span>
              <span style={{ color: 'var(--text-secondary)' }}>16.0 Tons/yr</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
              <div style={{ width: '80%', height: '100%', background: 'var(--accent-pink)' }} />
            </div>
          </div>

          {/* EU Average */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
              <span>Europe Average</span>
              <span style={{ color: 'var(--text-secondary)' }}>6.4 Tons/yr</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
              <div style={{ width: '32%', height: '100%', background: 'var(--accent-yellow)' }} />
            </div>
          </div>

          {/* Global Target */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
              <span>IPCC Sustainable Target</span>
              <span style={{ color: 'var(--text-secondary)' }}>2.0 Tons/yr</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
              <div style={{ width: '10%', height: '100%', background: 'var(--secondary)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Trajectory Forecast Graph */}
      <div className="glass-card full-width" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>📉 Carbon Footprint Trajectory (2026 - 2030)</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Visualizing projections: Business As Usual (Red) vs. Continuous Active Habits (Emerald Green).
          </p>
        </div>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <svg width="100%" height={graphHeight} viewBox={`0 0 ${graphWidth} ${graphHeight}`} style={{ minWidth: '400px' }}>
            {/* Grid Lines */}
            <line x1={padding} y1={padding} x2={graphWidth - padding} y2={padding} stroke="rgba(255,255,255,0.05)" />
            <line x1={padding} y1={graphHeight - padding} x2={graphWidth - padding} y2={graphHeight - padding} stroke="rgba(255,255,255,0.1)" />

            {/* Paths */}
            <path d={bauPath} fill="none" stroke="var(--accent-pink)" strokeWidth="3" strokeDasharray="4 4" />
            <path d={reducedPath} fill="none" stroke="var(--primary)" strokeWidth="4" />

            {/* Path Nodes */}
            {bauPoints.map((p, i) => (
              <circle key={`bau-${i}`} cx={p.x} cy={p.y} r="4" fill="var(--accent-pink)" />
            ))}
            {reducedPoints.map((p, i) => (
              <circle key={`red-${i}`} cx={p.x} cy={p.y} r="5" fill="var(--primary)" />
            ))}

            {/* Year Labels */}
            {years.map((year, idx) => {
              const xPos = padding + (idx / (years.length - 1)) * (graphWidth - 2 * padding);
              return (
                <text
                  key={year}
                  x={xPos}
                  y={graphHeight - 10}
                  fill="var(--text-muted)"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {year}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
