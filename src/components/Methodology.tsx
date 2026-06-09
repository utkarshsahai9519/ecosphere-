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
    <section className="space-y-8 animate-fadeIn" aria-labelledby="methodology-title">
      <header className="border-b border-white/10 pb-4">
        <h1 id="methodology-title" className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
          How It Works (Methodology)
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          EcoSphere uses a fully deterministic model based on public, peer-reviewed databases. 
          No numbers are fabricated; every calculation is a traceable product of consumption and emission factors.
        </p>
      </header>

      {/* Math sandbox card */}
      <article className="border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-2xl p-6" aria-labelledby="sandbox-title">
        <h2 id="sandbox-title" className="text-xl font-semibold text-emerald-400 mb-4 flex items-center gap-2">
          <span>🧮</span> Interactive Math Sandbox
        </h2>
        <p className="text-sm text-slate-300 mb-6">
          Adjust the sliders below to see in real-time how raw consumption translates into Metric Tons of CO2 equivalent per year ($CO_2e/yr$).
        </p>

        <div className="space-y-6">
          {/* Car miles slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <label htmlFor="sandbox-car-input">Weekly Driving Distance: <span className="text-teal-300">{sandboxMiles} miles</span></label>
            </div>
            <input
              id="sandbox-car-input"
              type="range"
              min="0"
              max="300"
              value={sandboxMiles}
              onChange={(e) => setSandboxMiles(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 rounded-lg appearance-none h-2 cursor-pointer"
            />
            <div className="font-mono text-xs text-slate-400 bg-slate-950/50 p-3 rounded-lg border border-white/5 mt-1">
              <span className="text-emerald-400">Equation</span>: ({sandboxMiles} miles/week × 52 weeks) × {FACTORS.carPerMile} kg CO2e/mile ÷ 1000 = <span className="text-teal-300 font-bold">{carCalculation.toFixed(2)} Tons CO2e/yr</span>
            </div>
          </div>

          {/* Electricity slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-400">
              <label htmlFor="sandbox-energy-input">Monthly Grid Electricity: <span className="text-teal-300">{sandboxEnergy} kWh</span></label>
            </div>
            <input
              id="sandbox-energy-input"
              type="range"
              min="0"
              max="1000"
              value={sandboxEnergy}
              onChange={(e) => setSandboxEnergy(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 rounded-lg appearance-none h-2 cursor-pointer"
            />
            <div className="font-mono text-xs text-slate-400 bg-slate-950/50 p-3 rounded-lg border border-white/5 mt-1">
              <span className="text-emerald-400">Equation</span>: ({sandboxEnergy} kWh/month × 12 months) × {FACTORS.electricityPerKwh} kg CO2e/kWh ÷ 1000 = <span className="text-teal-300 font-bold">{energyCalculation.toFixed(2)} Tons CO2e/yr</span>
            </div>
          </div>
        </div>
      </article>

      {/* Documentation Table */}
      <article className="border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-2xl p-6" aria-labelledby="factors-title">
        <h2 id="factors-title" className="text-xl font-semibold text-emerald-400 mb-4">
          📊 Documented Emission Factors
        </h2>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-sm text-left">
            <thead className="bg-slate-950/50 text-slate-400 uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Source Metric</th>
                <th scope="col" className="px-6 py-3">CO2e Factor</th>
                <th scope="col" className="px-6 py-3">Database Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              <tr>
                <td className="px-6 py-4 font-semibold text-emerald-400">Transportation (Car)</td>
                <td className="px-6 py-4">Per Mile Driven</td>
                <td className="px-6 py-4 font-mono text-teal-300">{FACTORS.carPerMile} kg</td>
                <td className="px-6 py-4 text-xs text-slate-400">US Environmental Protection Agency (EPA) 2024</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-emerald-400">Transportation (Transit)</td>
                <td className="px-6 py-4">Per Mile Traveled</td>
                <td className="px-6 py-4 font-mono text-teal-300">{FACTORS.transitPerMile} kg</td>
                <td className="px-6 py-4 text-xs text-slate-400">UK DEFRA Greenhouse Gas Conversion Database (2024)</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-emerald-400">Flights</td>
                <td className="px-6 py-4">Per Air Travel Hour</td>
                <td className="px-6 py-4 font-mono text-teal-300">{FACTORS.flightPerHour} kg</td>
                <td className="px-6 py-4 text-xs text-slate-400">DEFRA National Air Travel Metrics</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-emerald-400">Home Electricity</td>
                <td className="px-6 py-4">Per Kilowatt-Hour</td>
                <td className="px-6 py-4 font-mono text-teal-300">{FACTORS.electricityPerKwh} kg</td>
                <td className="px-6 py-4 text-xs text-slate-400">EPA eGRID Subregion Averages</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-emerald-400">Home Gas</td>
                <td className="px-6 py-4">Per Therm Consumed</td>
                <td className="px-6 py-4 font-mono text-teal-300">{FACTORS.gasPerTherm} kg</td>
                <td className="px-6 py-4 text-xs text-slate-400">US Energy Information Administration (EIA) baseline</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-semibold text-emerald-400">Shopping baseline</td>
                <td className="px-6 py-4">Per USD Spent</td>
                <td className="px-6 py-4 font-mono text-teal-300">{FACTORS.shoppingPerDollar} kg</td>
                <td className="px-6 py-4 text-xs text-slate-400">Economic Input-Output LCA spend models</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
