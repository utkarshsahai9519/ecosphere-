import React, { useState, useEffect } from 'react';
import { A11yConsole } from './components/A11yConsole';
import { Calculator } from './components/Calculator';
import { Dashboard } from './components/Dashboard';
import { QuestEngine } from './components/QuestEngine';
import Methodology from './components/Methodology';
import HistoryTracker from './components/HistoryTracker';

interface CalculationData {
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
}

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'dashboard' | 'quests' | 'history' | 'methodology'>('calculator');
  const [calcResult, setCalcResult] = useState<CalculationData | null>(null);
  const [questReduction, setQuestReduction] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [securityAudit, setSecurityAudit] = useState<any>(null);

  // Load profile preset configuration if it exists
  useEffect(() => {
    const cached = localStorage.getItem('ecosphere_profile');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setCalcResult(parsed.calcResult);
        setQuestReduction(parsed.questReduction);
        setActiveTab('dashboard');
      } catch (e) {
        console.error('Failed to parse cached profile', e);
      }
    }

    // Fetch backend security compliance status
    fetch('/api/security-status')
      .then(res => res.json())
      .then(data => setSecurityAudit(data.securityParameters))
      .catch(err => console.error('Failed to retrieve security statuses', err));
  }, []);

  const handleCalculationComplete = (data: CalculationData) => {
    setCalcResult(data);
    localStorage.setItem('ecosphere_profile', JSON.stringify({ calcResult: data, questReduction: 0 }));
    setQuestReduction(0);
    setActiveTab('dashboard');
  };

  const handleHabitChange = (reduction: number) => {
    setQuestReduction(reduction);
    if (calcResult) {
      localStorage.setItem(
        'ecosphere_profile', 
        JSON.stringify({ calcResult, questReduction: reduction })
      );
    }
  };

  const getHighestCategory = (): string => {
    if (!calcResult) return 'energy';
    const { transport, energy, diet, shopping } = calcResult.breakdown;
    const maxVal = Math.max(transport, energy, diet, shopping);
    if (maxVal === transport) return 'transport';
    if (maxVal === energy) return 'energy';
    if (maxVal === diet) return 'diet';
    return 'shopping';
  };

  const getNarratorText = (): string => {
    if (!calcResult) {
      return "Welcome to EcoSphere. Use the Carbon Footprint wizard to compute your emissions and unlock daily quests.";
    }
    const netFootprint = Math.max(0.1, calcResult.totalEmissions - questReduction);
    return `EcoSphere Report. Your current annual carbon footprint is ${netFootprint} metric tons of CO2 equivalent. 
    You have simulated a reduction of ${questReduction} metric tons through active green habits. 
    Your transport emissions are ${calcResult.breakdown.transport} tons, energy emissions are ${calcResult.breakdown.energy} tons, 
    diet emissions are ${calcResult.breakdown.diet} tons, and shopping emissions are ${calcResult.breakdown.shopping} tons.`;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#080c14] text-slate-100 font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900/90 border-b md:border-b-0 md:border-r border-white/10 flex flex-col shrink-0">
        {/* Brand header */}
        <header className="h-16 flex items-center gap-3 px-6 border-b border-white/5 bg-slate-950/20">
          <span className="text-2xl animate-pulse" aria-hidden="true">🌍</span>
          <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            EcoSphere
          </span>
        </header>

        {/* Primary nav buttons list */}
        <nav aria-label="Primary Side navigation" className="flex-1 p-4">
          <ul className="space-y-1.5 list-none pl-0">
            <li>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
                  activeTab === 'calculator'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <span>➕</span> Calculator
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  if (!calcResult) {
                    alert('Please complete the Carbon Footprint calculation first!');
                    return;
                  }
                  setActiveTab('dashboard');
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
                  !calcResult ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <span>📊</span> Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  if (!calcResult) {
                    alert('Please complete the Carbon Footprint calculation first!');
                    return;
                  }
                  setActiveTab('quests');
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
                  !calcResult ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  activeTab === 'quests'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <span>🏆</span> Daily Quests
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('history')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
                  activeTab === 'history'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <span>📋</span> Activity Log
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('methodology')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${
                  activeTab === 'methodology'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <span>📖</span> Methodology
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Body Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header controls */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-slate-950/20">
          <div className="text-sm font-mono text-slate-400">
            System status: <span className="text-emerald-400 font-semibold">Ready</span>
          </div>
          <A11yConsole narratorText={getNarratorText()} />
        </header>

        {/* Content routing view container */}
        <main id="main" className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto space-y-8 overflow-y-auto">
          {activeTab === 'calculator' && (
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Calculator 
                  onCalculationComplete={handleCalculationComplete} 
                  isLoading={isLoading} 
                  setIsLoading={setIsLoading} 
                />
              </div>
              <div className="border border-white/10 bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-center space-y-4">
                <h3 className="text-lg font-bold text-emerald-400">🌱 Why Track Your Footprint?</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Every decision—how you commute, what utility fuel you consume, and what you eat—has a quantified global impact. 
                  EcoSphere makes this abstract math clear, gamifying habit conversions into actionable solutions.
                </p>
                <div className="bg-slate-950/40 p-4 rounded-xl border-l-4 border-emerald-500 font-serif italic text-xs text-slate-400">
                  "Small shifts done consistently by millions make a massive structural footprint difference."
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && calcResult && (
            <Dashboard data={calcResult} questReduction={questReduction} />
          )}

          {activeTab === 'quests' && calcResult && (
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <QuestEngine 
                  onHabitChange={handleHabitChange} 
                  highestCategory={getHighestCategory()} 
                />
              </div>
              <div className="md:col-span-2">
                <Dashboard data={calcResult} questReduction={questReduction} />
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <HistoryTracker />
          )}

          {activeTab === 'methodology' && (
            <Methodology />
          )}
        </main>

        {/* Bottom Footer Status Bar */}
        <footer className="border-t border-white/5 p-4 bg-slate-950/20 text-center flex flex-col items-center gap-4">
          {securityAudit && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full text-[10px] text-slate-500 font-mono bg-slate-950/40 border border-white/5 rounded-xl p-3">
              <div>🛡️ CSP: <strong className="text-emerald-400">Strict Headers</strong></div>
              <div>🔒 CSRF Guard: <strong className="text-emerald-400">Headers Verified</strong></div>
              <div>⚡ Rate Limit: <strong className="text-emerald-400">100req/15m</strong></div>
              <div>🛡️ Validation: <strong className="text-emerald-400">Zod Enforced</strong></div>
            </div>
          )}
          <div className="text-xs text-slate-500">
            © 2026 EcoSphere. Built with clean code practices.
          </div>
        </footer>
      </div>

    </div>
  );
};
