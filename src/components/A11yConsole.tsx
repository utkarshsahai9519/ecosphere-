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

  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Stop talking when unmounted
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: isOpen ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
          color: isOpen ? 'var(--primary)' : 'var(--text-primary)',
          border: `1px solid ${isOpen ? 'var(--primary)' : 'var(--border-color)'}`,
          padding: '8px 16px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderRadius: '8px',
          transition: 'all 0.2s ease'
        }}
        aria-expanded={isOpen}
        aria-label="Toggle accessibility options menu"
      >
        <span aria-hidden="true">⚙️</span> Accessibility Assistant
      </button>

      {isOpen && (
        <section 
          className="glass-card animate-fadeIn" 
          style={{ 
            position: 'absolute',
            right: 0,
            top: '48px',
            width: '340px',
            zIndex: 1000,
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px', 
            borderLeft: '4px solid var(--secondary)',
            background: 'var(--bg-secondary)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
          }}
          aria-label="Accessibility controls"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span aria-hidden="true">♿</span> Visual & Audio
            </h2>
            <span 
              style={{ 
                fontSize: '0.7rem', 
                padding: '2px 6px', 
                background: 'rgba(6, 182, 212, 0.15)', 
                borderRadius: '12px',
                color: 'var(--secondary)',
                fontWeight: '600'
              }}
            >
              WCAG 2.1
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
            Customize your visual and auditory environment. Toggle layout scales or hear an automated audio narrative overview.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => setHighContrast(!highContrast)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: highContrast ? 'var(--accent-yellow)' : 'rgba(255, 255, 255, 0.05)',
                color: highContrast ? '#000' : 'var(--text-primary)',
                border: `1px solid ${highContrast ? 'var(--accent-yellow)' : 'var(--border-color)'}`,
                fontWeight: '600',
                borderRadius: '8px'
              }}
              aria-pressed={highContrast}
              aria-label="Toggle high contrast accessibility theme"
            >
              🌓 {highContrast ? 'Normal Theme' : 'High Contrast'}
            </button>

            <button
              onClick={() => setLargeText(!largeText)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: largeText ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                color: largeText ? '#000' : 'var(--text-primary)',
                border: `1px solid ${largeText ? 'var(--primary)' : 'var(--border-color)'}`,
                fontWeight: '600',
                borderRadius: '8px'
              }}
              aria-pressed={largeText}
              aria-label="Toggle large text sizing"
            >
              🔍 {largeText ? 'Default Text' : 'Large Text (125%)'}
            </button>

            <button
              onClick={handleNarrate}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: isNarrating ? 'var(--accent-pink)' : 'var(--bg-primary)',
                color: '#fff',
                border: `1px solid ${isNarrating ? 'var(--accent-pink)' : 'var(--secondary)'}`,
                fontWeight: '600',
                borderRadius: '8px',
                animation: isNarrating ? 'pulseGlow 1.5s infinite' : 'none'
              }}
              aria-pressed={isNarrating}
              aria-label="Narrate page summary out loud"
            >
              🔊 {isNarrating ? 'Stop Narrator' : 'Speak Page Summary'}
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
