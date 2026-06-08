import React, { useState, useEffect } from 'react';

interface A11yConsoleProps {
  narratorText: string;
}

export const A11yConsole: React.FC<A11yConsoleProps> = ({ narratorText }) => {
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);

  useEffect(() => {
    // Sync class list with body element
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (largeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  }, [largeText]);

  // Narrate current dashboard context using Web Speech Synthesis
  const handleNarrate = () => {
    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(narratorText);
      utterance.onend = () => setIsNarrating(false);
      utterance.onerror = () => setIsNarrating(false);
      
      setIsNarrating(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text-to-speech narration is not supported on this browser.');
    }
  };

  // Stop talking when unmounted
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <section 
      className="glass-card" 
      style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '4px solid var(--secondary)' }}
      aria-label="Accessibility controls"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span aria-hidden="true">⚙️</span> Accessibility Assistant
        </h2>
        <span 
          style={{ 
            fontSize: '0.75rem', 
            padding: '4px 8px', 
            background: 'rgba(6, 182, 212, 0.15)', 
            borderRadius: '12px',
            color: 'var(--secondary)',
            fontWeight: '600'
          }}
        >
          WCAG 2.1 Compliant
        </span>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Customize your visual and auditory environment. Toggle layout scales or hear an automated audio narrative overview.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setHighContrast(!highContrast)}
          style={{
            flex: 1,
            minWidth: '140px',
            padding: '10px 14px',
            background: highContrast ? 'var(--accent-yellow)' : 'rgba(255, 255, 255, 0.05)',
            color: highContrast ? '#000' : 'var(--text-primary)',
            border: `1px solid ${highContrast ? 'var(--accent-yellow)' : 'var(--border-color)'}`,
            fontWeight: '600'
          }}
          aria-pressed={highContrast}
          aria-label="Toggle high contrast accessibility theme"
        >
          🌓 {highContrast ? 'Normal Theme' : 'High Contrast'}
        </button>

        <button
          onClick={() => setLargeText(!largeText)}
          style={{
            flex: 1,
            minWidth: '140px',
            padding: '10px 14px',
            background: largeText ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
            color: largeText ? '#000' : 'var(--text-primary)',
            border: `1px solid ${largeText ? 'var(--primary)' : 'var(--border-color)'}`,
            fontWeight: '600'
          }}
          aria-pressed={largeText}
          aria-label="Toggle large text sizing"
        >
          🔍 {largeText ? 'Default Text' : 'Large Text (125%)'}
        </button>

        <button
          onClick={handleNarrate}
          style={{
            flex: 2,
            minWidth: '200px',
            padding: '10px 14px',
            background: isNarrating ? 'var(--accent-pink)' : 'var(--bg-primary)',
            color: '#fff',
            border: `1px solid ${isNarrating ? 'var(--accent-pink)' : 'var(--secondary)'}`,
            fontWeight: '600',
            animation: isNarrating ? 'pulseGlow 1.5s infinite' : 'none'
          }}
          aria-pressed={isNarrating}
          aria-label="Narrate page summary out loud"
        >
          🔊 {isNarrating ? 'Stop Narrator' : 'Speak Page Summary'}
        </button>
      </div>
    </section>
  );
};
