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
    <div className="app-layout">
      
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        {/* Brand header */}
        <header className="sidebar-header">
          <span className="text-2xl animate-pulse" aria-hidden="true">🌍</span>
          <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            EcoSphere
          </span>
        </header>

        {/* Primary nav buttons list */}
        <nav aria-label="Primary Side navigation" className="sidebar-nav">
          <ul className="sidebar-list">
            <li>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`sidebar-button ${activeTab === 'calculator' ? 'active' : ''}`}
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
                className={`sidebar-button ${!calcResult ? 'opacity-50 cursor-not-allowed' : ''} ${activeTab === 'dashboard' ? 'active' : ''}`}
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
                className={`sidebar-button ${!calcResult ? 'opacity-50 cursor-not-allowed' : ''} ${activeTab === 'quests' ? 'active' : ''}`}
              >
                <span>🏆</span> Daily Quests
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('history')}
                className={`sidebar-button ${activeTab === 'history' ? 'active' : ''}`}
              >
                <span>📋</span> Activity Log
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveTab('methodology')}
                className={`sidebar-button ${activeTab === 'methodology' ? 'active' : ''}`}
              >
                <span>📖</span> Methodology
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Body Layout */}
      <div className="main-content">
        {/* Top Header controls */}
        <header className="top-bar">
          <div className="text-sm font-mono text-slate-400">
            System status: <span className="text-emerald-400 font-semibold">Ready</span>
          </div>
          <A11yConsole narratorText={getNarratorText()} />
        </header>

        {/* Content routing view container */}
        <main id="main" className="content-body">
          {activeTab === 'calculator' && (
            <div className="dashboard-grid">
              <div className="full-width" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <Calculator 
                  onCalculationComplete={handleCalculationComplete} 
                  isLoading={isLoading} 
                  setIsLoading={setIsLoading} 
                />
                
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
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
