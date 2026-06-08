import React, { useState } from 'react';

interface Habit {
  id: string;
  name: string;
  category: string;
  reductionValue: number; // annual tons saved
  description: string;
}

interface QuestEngineProps {
  onHabitChange: (totalReduction: number) => void;
  highestCategory: string;
}

export const QuestEngine: React.FC<QuestEngineProps> = ({ onHabitChange, highestCategory }) => {
  const [activeHabits, setActiveHabits] = useState<string[]>([]);
  const [questSuccess, setQuestSuccess] = useState<boolean>(false);

  const habits: Habit[] = [
    { id: 'h1', name: 'Switch to LEDs', category: 'energy', reductionValue: 0.15, description: 'Replace incandescent lighting with smart energy LEDs' },
    { id: 'h2', name: 'Car-free Day (1x/wk)', category: 'transport', reductionValue: 0.45, description: 'Commute via bike or walk once a week instead of driving' },
    { id: 'h3', name: 'Meatless Mondays', category: 'diet', reductionValue: 0.40, description: 'Cut out red meat once a week to lower agricultural demand' },
    { id: 'h4', name: 'Unplug Idle Electronics', category: 'energy', reductionValue: 0.08, description: 'Turn off standby mode on home entertainment and adapters' },
    { id: 'h5', name: 'Cold Water Wash', category: 'energy', reductionValue: 0.12, description: 'Wash laundry loads using cold water cycles' },
    { id: 'h6', name: 'Local Sourcing', category: 'shopping', reductionValue: 0.20, description: 'Buy fresh food items from farms within a 100-mile radius' },
  ];

  const handleToggle = (id: string) => {
    let nextHabits: string[];
    if (activeHabits.includes(id)) {
      nextHabits = activeHabits.filter(h => h !== id);
    } else {
      nextHabits = [...activeHabits, id];
    }
    setActiveHabits(nextHabits);

    // Sum reduction values
    const totalReduction = nextHabits.reduce((sum, hId) => {
      const found = habits.find(h => h.id === hId);
      return sum + (found ? found.reductionValue : 0);
    }, 0);

    onHabitChange(parseFloat(totalReduction.toFixed(2)));
  };

  const handleQuestClaim = () => {
    setQuestSuccess(true);
    setTimeout(() => setQuestSuccess(false), 3000);
  };

  // Select a "Quest of the Day" dynamically based on the user's highest footprint category
  const recommendation = habits.find(h => h.category === highestCategory) || habits[0];

  return (
    <div className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Dynamic Recommendation Panel */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(16, 185, 129, 0.15))',
          padding: '20px', 
          borderRadius: '12px',
          border: '1px solid rgba(6, 182, 212, 0.3)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--secondary)' }}>
            🔥 Recommended Daily Quest
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-yellow)' }}>🏆 +100 EcoPoints</span>
        </div>
        <h3 style={{ fontSize: '1.2rem', marginTop: '6px' }}>Quest: {recommendation.name}</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {recommendation.description}. Implementing this will reduce your footprint by{' '}
          <strong style={{ color: 'var(--primary)' }}>{recommendation.reductionValue} tons CO2e</strong> per year.
        </p>

        <button
          onClick={handleQuestClaim}
          disabled={questSuccess}
          style={{
            marginTop: '12px',
            background: questSuccess ? 'var(--primary)' : 'var(--secondary)',
            color: '#000',
            fontWeight: '600',
            padding: '8px 16px',
            fontSize: '0.85rem',
            width: '100%',
            textAlign: 'center'
          }}
        >
          {questSuccess ? '🎉 Quest Complete! EcoPoints Added' : 'Claim Daily Challenge'}
        </button>
      </div>

      {/* Habit Toggles */}
      <div>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Active Habit Simulator</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Toggle green practices below to simulate how adopting them changes your emissions in real-time.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {habits.map((habit) => {
            const isChecked = activeHabits.includes(habit.id);
            return (
              <div 
                key={habit.id}
                onClick={() => handleToggle(habit.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  background: isChecked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border-color)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); handleToggle(habit.id); } }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <strong style={{ fontSize: '0.95rem', color: isChecked ? 'var(--primary)' : 'var(--text-primary)' }}>
                    {habit.name}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {habit.description}
                  </span>
                </div>

                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 'bold' }}>
                    -{habit.reductionValue} t/yr
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
