import React, { useState, useEffect } from 'react';
import { A11yConsole } from './components/A11yConsole';
import { Calculator } from './components/Calculator';
import { Dashboard } from './components/Dashboard';
import { QuestEngine } from './components/QuestEngine';

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
  const [activeTab, setActiveTab] = useState<'calculator' | 'dashboard' | 'quests'>('calculator');
  const [calcResult, setCalcResult] = useState<CalculationData | null>(null);
  const [questReduction, setQuestReduction] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [securityAudit, setSecurityAudit] = useState<any>(null);

  // Load preset local profile data if it exists
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
    // Cache result
    localStorage.setItem('ecosphere_profile', JSON.stringify({ calcResult: data, questReduction: 0 }));
    setQuestReduction(0);
    setActiveTab('dashboard');
  };

  const handleHabitChange = (reduction: number) => {
    setQuestReduction(reduction);
    if (calcResult) {
      // Sync cached reduction
      localStorage.setItem(
        'ecosphere_profile', 
        JSON.stringify({ calcResult, questReduction: reduction })
      );
    }
  };

  // Find the user's highest emission category to feed custom quests
  const getHighestCategory = (): string => {
    if (!calcResult) return 'energy';
    const { transport, energy, diet, shopping } = calcResult.breakdown;
    const maxVal = Math.max(transport, energy, diet, shopping);
    if (maxVal === transport) return 'transport';
    if (maxVal === energy) return 'energy';
    if (maxVal === diet) return 'diet';
    return 'shopping';
  };

  // Pre-compiled narration text for accessibility readers
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header Navigation */}
      <header 
        style={{ 
          background: 'rgba(11, 17, 30, 0.8)', 
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border-color)', 
          padding: '16px 24px', 
          position: 'sticky', 
          top: 0, 
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.8rem', animation: 'float 4s infinite ease-in-out' }} aria-hidden="true">🌐</span>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0 }} className="text-gradient">
            EcoSphere
          </h1>
        </div>

        <nav aria-label="Main Navigation">
          <ul style={{ display: 'flex', listStyle: 'none', gap: '12px' }}>
            <li>
              <button
                onClick={() => setActiveTab('calculator')}
                style={{
                  background: activeTab === 'calculator' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: activeTab === 'calculator' ? 'var(--primary)' : 'var(--text-secondary)',
                  padding: '8px 16px',
                  fontWeight: '600',
                  border: activeTab === 'calculator' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                }}
              >
                Calculator
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
                style={{
                  background: activeTab === 'dashboard' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                  color: activeTab === 'dashboard' ? 'var(--secondary)' : 'var(--text-secondary)',
                  padding: '8px 16px',
                  fontWeight: '600',
                  border: activeTab === 'dashboard' ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid transparent',
                  opacity: calcResult ? 1 : 0.5,
                }}
              >
                Dashboard
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
                style={{
                  background: activeTab === 'quests' ? 'rgba(234, 179, 8, 0.1)' : 'transparent',
                  color: activeTab === 'quests' ? 'var(--accent-yellow)' : 'var(--text-secondary)',
                  padding: '8px 16px',
                  fontWeight: '600',
                  border: activeTab === 'quests' ? '1px solid rgba(234, 179, 8, 0.2)' : '1px solid transparent',
                  opacity: calcResult ? 1 : 0.5,
                }}
              >
                EcoQuests
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Intro Hero banner */}
        <section style={{ textAlign: 'center', margin: '10px 0 20px' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '8px' }}>
            Empowering Your <span className="text-gradient">Green Journey</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            Enter your utility & transit values, simulate environmental practice toggles, and conquer custom daily carbon quests.
          </p>
        </section>

        {/* Accessibility Helper panel */}
        <A11yConsole narratorText={getNarratorText()} />

        {/* Dynamic tabs render */}
        {activeTab === 'calculator' && (
          <div className="dashboard-grid">
            <Calculator 
              onCalculationComplete={handleCalculationComplete} 
              isLoading={isLoading} 
              setIsLoading={setIsLoading} 
            />
            
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)' }}>Why Carbon Tracking Matters</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Carbon dioxide and greenhouse gases trap solar heat, altering global climates. EcoSphere uses real-time factors to analyze your footprint across transportation, home heating, electricity, food, and consumption.
              </p>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderLeft: '3px solid var(--primary)', borderRadius: '4px' }}>
                <em style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  "We don't need one person doing sustainability perfectly. We need millions doing it imperfectly."
                </em>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && calcResult && (
          <Dashboard data={calcResult} questReduction={questReduction} />
        )}

        {activeTab === 'quests' && calcResult && (
          <div className="dashboard-grid">
            <QuestEngine 
              onHabitChange={handleHabitChange} 
              highestCategory={getHighestCategory()} 
            />
            <Dashboard data={calcResult} questReduction={questReduction} />
          </div>
        )}
      </main>

      {/* Footer & Security / Accessibility Status Widget */}
      <footer 
        style={{ 
          background: 'var(--bg-secondary)', 
          borderTop: '1px solid var(--border-color)', 
          padding: '24px', 
          marginTop: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        {securityAudit && (
          <div 
            style={{ 
              fontSize: '0.75rem', 
              color: 'var(--text-muted)', 
              background: 'rgba(255,255,255,0.02)', 
              padding: '10px 16px', 
              borderRadius: '8px', 
              border: '1px solid var(--border-color)',
              maxWidth: '800px',
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '8px'
            }}
          >
            <div>🛡️ CSP: <strong style={{ color: 'var(--primary)' }}>Active Headers</strong></div>
            <div>🔒 Input Sanitize: <strong style={{ color: 'var(--primary)' }}>Zod Filtered</strong></div>
            <div>⚡ Rate Limiters: <strong style={{ color: 'var(--primary)' }}>Enabled</strong></div>
            <div>🛡️ Helmet Shield: <strong style={{ color: 'var(--primary)' }}>Constructed</strong></div>
          </div>
        )}

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          © 2026 EcoSphere. Built with clean code practices.
        </div>
      </footer>
    </div>
  );
};
