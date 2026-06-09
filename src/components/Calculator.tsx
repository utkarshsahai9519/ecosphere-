import React, { useState } from 'react';

interface CalculatorProps {
  onCalculationComplete: (data: any) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ 
  onCalculationComplete, 
  isLoading, 
  setIsLoading 
}) => {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    carMiles: 120,
    transitMiles: 30,
    flightHours: 12,
    electricityKwh: 280,
    gasTherms: 15,
    dietType: 'average',
    shoppingSpend: 250,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'dietType' ? value : parseFloat(value) || 0
    }));
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-requested-with': 'EcoSphere-App'
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('API Calculation failed');
      }

      const result = await response.json();
      onCalculationComplete(result);
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend calculator services.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in" style={{ padding: '30px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>🌱</span> Footprint Calculator
      </h2>

      {/* Progress Bar */}
      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', height: '6px', marginBottom: '24px', overflow: 'hidden' }}>
        <div 
          style={{ 
            width: `${(step / 3) * 100}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, var(--primary), var(--secondary))', 
            transition: 'width 0.3s ease' 
          }} 
        />
      </div>

      <form onSubmit={handleSubmit} aria-label="Carbon calculation form">
        {step === 1 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>Step 1: Transportation 🚗</h3>
            
            <div>
              <label htmlFor="carMiles" style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Weekly Car Travel (miles): <strong style={{ color: 'var(--primary)' }}>{formData.carMiles} miles</strong>
              </label>
              <input
                type="range"
                id="carMiles"
                name="carMiles"
                min="0"
                max="800"
                step="10"
                value={formData.carMiles}
                onChange={handleChange}
                aria-valuemin={0}
                aria-valuemax={800}
                aria-valuenow={formData.carMiles}
              />
            </div>

            <div>
              <label htmlFor="transitMiles" style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Weekly Public Transit (miles): <strong style={{ color: 'var(--primary)' }}>{formData.transitMiles} miles</strong>
              </label>
              <input
                type="range"
                id="transitMiles"
                name="transitMiles"
                min="0"
                max="500"
                step="5"
                value={formData.transitMiles}
                onChange={handleChange}
                aria-valuemin={0}
                aria-valuemax={500}
                aria-valuenow={formData.transitMiles}
              />
            </div>

            <div>
              <label htmlFor="flightHours" style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Annual Flight Hours: <strong style={{ color: 'var(--primary)' }}>{formData.flightHours} hours</strong>
              </label>
              <input
                type="range"
                id="flightHours"
                name="flightHours"
                min="0"
                max="120"
                step="2"
                value={formData.flightHours}
                onChange={handleChange}
                aria-valuemin={0}
                aria-valuemax={120}
                aria-valuenow={formData.flightHours}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>Step 2: Home Energy Utility ⚡</h3>
            
            <div>
              <label htmlFor="electricityKwh" style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Monthly Electricity (kWh): <strong style={{ color: 'var(--primary)' }}>{formData.electricityKwh} kWh</strong>
              </label>
              <input
                type="range"
                id="electricityKwh"
                name="electricityKwh"
                min="0"
                max="2000"
                step="20"
                value={formData.electricityKwh}
                onChange={handleChange}
                aria-valuemin={0}
                aria-valuemax={2000}
                aria-valuenow={formData.electricityKwh}
              />
            </div>

            <div>
              <label htmlFor="gasTherms" style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Monthly Natural Gas (therms): <strong style={{ color: 'var(--primary)' }}>{formData.gasTherms} therms</strong>
              </label>
              <input
                type="range"
                id="gasTherms"
                name="gasTherms"
                min="0"
                max="200"
                step="2"
                value={formData.gasTherms}
                onChange={handleChange}
                aria-valuemin={0}
                aria-valuemax={200}
                aria-valuenow={formData.gasTherms}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>Step 3: Food & Shopping 🥩</h3>
            
            <div>
              <label htmlFor="dietType" style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Primary Dietary Profile
              </label>
              <select
                id="dietType"
                name="dietType"
                value={formData.dietType}
                onChange={handleChange}
              >
                <option value="meatHeavy">Meat-Heavy (Frequent red meat)</option>
                <option value="average">Average (Balanced meats, veggies)</option>
                <option value="vegetarian">Vegetarian (No meat, dairy ok)</option>
                <option value="vegan">Vegan (Strict plant-based)</option>
              </select>
            </div>

            <div>
              <label htmlFor="shoppingSpend" style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                Monthly Discretionary Shopping: <strong style={{ color: 'var(--primary)' }}>${formData.shoppingSpend}</strong>
              </label>
              <input
                type="range"
                id="shoppingSpend"
                name="shoppingSpend"
                min="0"
                max="2000"
                step="50"
                value={formData.shoppingSpend}
                onChange={handleChange}
                aria-valuemin={0}
                aria-valuemax={2000}
                aria-valuenow={formData.shoppingSpend}
              />
            </div>
          </div>
        )}

        {/* Form navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: 'var(--text-primary)',
                padding: '12px 24px',
                border: '1px solid var(--border-color)',
              }}
            >
              Previous
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              style={{
                background: 'var(--primary)',
                color: '#000',
                padding: '12px 28px',
                fontWeight: '600',
              }}
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                color: '#000',
                padding: '12px 32px',
                fontWeight: '700',
                boxShadow: '0 0 15px var(--primary-glow)',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Calculating...' : 'Generate EcoSphere!'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
