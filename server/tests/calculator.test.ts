import { describe, it, expect } from 'vitest';
import { calculateCarbonFootprint, CalculatorInputs } from '../controllers/calculator';

describe('Carbon Footprint Calculator Engine', () => {
  it('should calculate correct values for a typical household footprint', () => {
    const inputs: CalculatorInputs = {
      carMiles: 100,         // weekly car miles
      transitMiles: 50,      // weekly transit miles
      flightHours: 10,       // annual flight hours
      electricityKwh: 300,   // monthly energy
      gasTherms: 10,         // monthly gas
      dietType: 'average',
      shoppingSpend: 200,    // monthly spend
    };

    const result = calculateCarbonFootprint(inputs);

    // Assert breakdown structures exist
    expect(result).toHaveProperty('breakdown');
    expect(result).toHaveProperty('totalEmissions');
    expect(result).toHaveProperty('regionalComparison');

    // Expected breakdowns (approximate checks)
    // transport: (100 * 52 * 0.404) + (50 * 52 * 0.14) + (10 * 250) = 2100.8 + 364 + 2500 = 4964.8 kg = 4.96 tons
    expect(result.breakdown.transport).toBeCloseTo(4.96, 1);
    
    // energy: (300 * 12 * 0.385) + (10 * 12 * 5.3) = 1386 + 636 = 2022 kg = 2.02 tons
    expect(result.breakdown.energy).toBeCloseTo(2.02, 1);
    
    // diet: average is 2500 kg = 2.5 tons
    expect(result.breakdown.diet).toBe(2.5);

    // shopping: 200 * 12 * 0.12 = 288 kg = 0.29 tons
    expect(result.breakdown.shopping).toBeCloseTo(0.29, 1);

    // Total = 4.96 + 2.02 + 2.50 + 0.29 = 9.77 tons
    expect(result.totalEmissions).toBeCloseTo(9.77, 1);
  });

  it('should gracefully handle zero/negative parameters by locking inputs to positive domains', () => {
    const inputs: CalculatorInputs = {
      carMiles: -100,
      transitMiles: -50,
      flightHours: -10,
      electricityKwh: -300,
      gasTherms: -10,
      dietType: 'vegan', // vegan is 1500 kg = 1.5 tons
      shoppingSpend: -200,
    };

    const result = calculateCarbonFootprint(inputs);

    // With zero values: all categories should be 0 except diet (which defaults to vegan's 1.5 tons)
    expect(result.breakdown.transport).toBe(0);
    expect(result.breakdown.energy).toBe(0);
    expect(result.breakdown.shopping).toBe(0);
    expect(result.breakdown.diet).toBe(1.5);
    expect(result.totalEmissions).toBe(1.5);
  });

  it('should fallback to average diet if an invalid diet category is passed', () => {
    const inputs: CalculatorInputs = {
      carMiles: 0,
      transitMiles: 0,
      flightHours: 0,
      electricityKwh: 0,
      gasTherms: 0,
      dietType: 'invalid-diet' as any, // testing runtime fallback
      shoppingSpend: 0,
    };

    const result = calculateCarbonFootprint(inputs);
    expect(result.breakdown.diet).toBe(2.5); // Average diet = 2.5 tons
  });
});
