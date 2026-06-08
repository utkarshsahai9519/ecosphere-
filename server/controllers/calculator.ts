export interface CalculatorInputs {
  carMiles: number;          // weekly miles
  transitMiles: number;      // weekly miles
  flightHours: number;       // annual flight hours
  electricityKwh: number;    // monthly kWh
  gasTherms: number;         // monthly therms
  dietType: 'meatHeavy' | 'average' | 'vegetarian' | 'vegan';
  shoppingSpend: number;     // monthly shopping spend in USD
}

export interface CalculationResult {
  breakdown: {
    transport: number;
    energy: number;
    diet: number;
    shopping: number;
  };
  totalEmissions: number; // in metric tons of CO2e per year
  regionalComparison: {
    user: number;
    usAverage: number;
    euAverage: number;
    globalTarget: number;
  };
}

// Global realistic emission factors (in kg CO2e)
const FACTORS = {
  carPerMile: 0.404,        // kg CO2e per mile
  transitPerMile: 0.14,      // kg CO2e per mile
  flightPerHour: 250.0,      // kg CO2e per flight hour
  electricityPerKwh: 0.385,  // kg CO2e per kWh
  gasPerTherm: 5.3,          // kg CO2e per therm
  dietAnnualKg: {
    meatHeavy: 3300,
    average: 2500,
    vegetarian: 1700,
    vegan: 1500,
  },
  shoppingPerDollar: 0.12,   // kg CO2e per USD spent
};

/**
 * Calculates annual carbon footprint in metric tons of CO2e.
 */
export function calculateCarbonFootprint(inputs: CalculatorInputs): CalculationResult {
  // Validate and parse inputs to protect against negative numbers
  const carMiles = Math.max(0, inputs.carMiles);
  const transitMiles = Math.max(0, inputs.transitMiles);
  const flightHours = Math.max(0, inputs.flightHours);
  const electricityKwh = Math.max(0, inputs.electricityKwh);
  const gasTherms = Math.max(0, inputs.gasTherms);
  const shoppingSpend = Math.max(0, inputs.shoppingSpend);
  const dietType = inputs.dietType in FACTORS.dietAnnualKg ? inputs.dietType : 'average';

  // 1. Transport (Annualized from weekly)
  const annualCarEmissions = carMiles * 52 * FACTORS.carPerMile;
  const annualTransitEmissions = transitMiles * 52 * FACTORS.transitPerMile;
  const annualFlightEmissions = flightHours * FACTORS.flightPerHour;
  const transportTotalKg = annualCarEmissions + annualTransitEmissions + annualFlightEmissions;

  // 2. Energy (Annualized from monthly)
  const annualElectricityEmissions = electricityKwh * 12 * FACTORS.electricityPerKwh;
  const annualGasEmissions = gasTherms * 12 * FACTORS.gasPerTherm;
  const energyTotalKg = annualElectricityEmissions + annualGasEmissions;

  // 3. Diet
  const dietTotalKg = FACTORS.dietAnnualKg[dietType];

  // 4. Shopping (Annualized from monthly)
  const shoppingTotalKg = shoppingSpend * 12 * FACTORS.shoppingPerDollar;

  // Total in Metric Tons (1 Metric Ton = 1000 kg)
  const transportTons = parseFloat((transportTotalKg / 1000).toFixed(2));
  const energyTons = parseFloat((energyTotalKg / 1000).toFixed(2));
  const dietTons = parseFloat((dietTotalKg / 1000).toFixed(2));
  const shoppingTons = parseFloat((shoppingTotalKg / 1000).toFixed(2));

  const totalEmissions = parseFloat((transportTons + energyTons + dietTons + shoppingTons).toFixed(2));

  return {
    breakdown: {
      transport: transportTons,
      energy: energyTons,
      diet: dietTons,
      shopping: shoppingTons,
    },
    totalEmissions,
    regionalComparison: {
      user: totalEmissions,
      usAverage: 16.0,      // US national avg in tons/year
      euAverage: 6.4,       // EU avg
      globalTarget: 2.0,    // IPCC sustainable target
    },
  };
}
