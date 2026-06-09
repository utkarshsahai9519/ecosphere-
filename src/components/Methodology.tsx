import React, { useState } from 'react';
import { FACTORS } from '../../server/services/calculatorService';

/**
 * Interactive Methodology & Sandbox Guide Component
 * Explains deterministic emission calculations with live mathematical slider evaluations.
 */
export default function Methodology() {
  const [sandboxMiles, setSandboxMiles] = useState(50);
  const [sandboxEnergy, setSandboxEnergy] = useState(300);

  // Live calculations
  const carCalculation = (sandboxMiles * 52 * FACTORS.carPerMile) / 1000;
  const energyCalculation = (sandboxEnergy * 12 * FACTORS.electricityPerKwh) / 1000;

  return (
    <section className="animate-fadeIn" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }} aria-labelledby="methodology-title">
      <header style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <h1 id="methodology-title" className="text-gradient" style={{ fontSize: '1.8rem', fontWeight: '800' }}>
          How It Works (Methodology)
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
          EcoSphere uses a fully deterministic model based on public, peer-reviewed databases. 
          No numbers are fabricated; every calculation is a traceable product of consumption and emission factors.
        </p>
      </header>

      {/* Math sandbox card */}
      <article className="glass-card font-sans" aria-labelledby="sandbox-title">
        <h2 id="sandbox-title" style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🧮</span> Interactive Math Sandbox
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
          Adjust the sliders below to see in real-time how raw consumption translates into Metric Tons of CO2 equivalent per year ($CO_2e/yr$).
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Car miles slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              <label htmlFor="sandbox-car-input">Weekly Driving Distance: <span style={{ color: 'var(--secondary)' }}>{sandboxMiles} miles</span></label>
            </div>
            <input
              id="sandbox-car-input"
              type="range"
              min="0"
              max="300"
              value={sandboxMiles}
              onChange={(e) => setSandboxMiles(Number(e.target.value))}
            />
            <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
              <span style={{ color: 'var(--primary)' }}>Equation</span>: ({sandboxMiles} miles/week × 52 weeks) × {FACTORS.carPerMile} kg CO2e/mile ÷ 1000 = <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{carCalculation.toFixed(2)} Tons CO2e/yr</span>
            </div>
          </div>

          {/* Electricity slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              <label htmlFor="sandbox-energy-input">Monthly Grid Electricity: <span style={{ color: 'var(--secondary)' }}>{sandboxEnergy} kWh</span></label>
            </div>
            <input
              id="sandbox-energy-input"
              type="range"
              min="0"
              max="1000"
              value={sandboxEnergy}
              onChange={(e) => setSandboxEnergy(Number(e.target.value))}
            />
            <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginTop: '4px' }}>
              <span style={{ color: 'var(--primary)' }}>Equation</span>: ({sandboxEnergy} kWh/month × 12 months) × {FACTORS.electricityPerKwh} kg CO2e/kWh ÷ 1000 = <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>{energyCalculation.toFixed(2)} Tons CO2e/yr</span>
            </div>
          </div>
        </div>
      </article>

      {/* Documentation Table */}
      <article className="glass-card" aria-labelledby="factors-title">
        <h2 id="factors-title" style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '20px' }}>
          📊 Documented Emission Factors
        </h2>
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <table style={{ minWidth: '600px', width: '100%' }}>
            <thead style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">Source Metric</th>
                <th scope="col">CO2e Factor</th>
                <th scope="col">Database Reference</th>
              </tr>
            </thead>
            <tbody style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ fontWeight: '600', color: 'var(--primary)' }}>Transportation (Car)</td>
                <td>Per Mile Driven</td>
                <td style={{ fontFamily: 'monospace', color: 'var(--secondary)' }}>{FACTORS.carPerMile} kg</td>
                <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>US Environmental Protection Agency (EPA) 2024</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ fontWeight: '600', color: 'var(--primary)' }}>Transportation (Transit)</td>
                <td>Per Mile Traveled</td>
                <td style={{ fontFamily: 'monospace', color: 'var(--secondary)' }}>{FACTORS.transitPerMile} kg</td>
                <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>UK DEFRA Greenhouse Gas Conversion Database (2024)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ fontWeight: '600', color: 'var(--primary)' }}>Flights</td>
                <td>Per Air Travel Hour</td>
                <td style={{ fontFamily: 'monospace', color: 'var(--secondary)' }}>{FACTORS.flightPerHour} kg</td>
                <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DEFRA National Air Travel Metrics</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ fontWeight: '600', color: 'var(--primary)' }}>Home Electricity</td>
                <td>Per Kilowatt-Hour</td>
                <td style={{ fontFamily: 'monospace', color: 'var(--secondary)' }}>{FACTORS.electricityPerKwh} kg</td>
                <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>EPA eGRID Subregion Averages</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ fontWeight: '600', color: 'var(--primary)' }}>Home Gas</td>
                <td>Per Therm Consumed</td>
                <td style={{ fontFamily: 'monospace', color: 'var(--secondary)' }}>{FACTORS.gasPerTherm} kg</td>
                <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>US Energy Information Administration (EIA) baseline</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '600', color: 'var(--primary)' }}>Shopping baseline</td>
                <td>Per USD Spent</td>
                <td style={{ fontFamily: 'monospace', color: 'var(--secondary)' }}>{FACTORS.shoppingPerDollar} kg</td>
                <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Economic Input-Output LCA spend models</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
