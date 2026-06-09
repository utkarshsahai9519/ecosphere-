/**
 * Calculator Service Types and Constants
 */

export interface CalculatorInputs {
  /** Weekly distance traveled by car in miles */
  carMiles: number;
  /** Weekly distance traveled by public transit in miles */
  transitMiles: number;
  /** Annual time spent flying in hours */
  flightHours: number;
  /** Monthly grid electricity usage in kWh */
  electricityKwh: number;
  /** Monthly natural gas usage in therms */
  gasTherms: number;
  /** Primary dietary profile of the individual */
  dietType: 'meatHeavy' | 'average' | 'vegetarian' | 'vegan';
  /** Monthly retail spending on goods/electronics in USD */
  shoppingSpend: number;
}

export interface CalculationResult {
  /** Carbon footprint breakdown in metric tons of CO2e per year */
  breakdown: {
    transport: number;
    energy: number;
    diet: number;
    shopping: number;
  };
  /** Total annual emissions in metric tons of CO2e */
  totalEmissions: number;
  /** Regional and target global average comparisons in metric tons of CO2e/year */
  regionalComparison: {
    user: number;
    usAverage: number;
    euAverage: number;
    globalTarget: number;
  };
}

/**
 * Global realistic carbon emission factors (in kg CO2e)
 * Compiled from UK DEFRA (2024) and US EPA datasets.
 */
export const FACTORS = {
  /** kg CO2e per mile for average combustion engine car */
  carPerMile: 0.404,
  /** kg CO2e per passenger mile for general local bus/rail transit */
  transitPerMile: 0.14,
  /** kg CO2e per passenger flight hour */
  flightPerHour: 250.0,
  /** kg CO2e per kWh of average electricity grid mix */
  electricityPerKwh: 0.385,
  /** kg CO2e per therm of natural gas utility */
  gasPerTherm: 5.3,
  /** Annual dietary emissions in kg CO2e based on dietary profile */
  dietAnnualKg: {
    meatHeavy: 3300,
    average: 2500,
    vegetarian: 1700,
    vegan: 1500,
  },
  /** kg CO2e per USD spent on retail items/electronics (spend-based model) */
  shoppingPerDollar: 0.12,
};

/**
 * Calculates the annual carbon footprint of an individual in metric tons of CO2e.
 * Safe inputs are guaranteed through sanitization (Math.max to prevent negative emissions).
 * 
 * @param inputs - Raw numerical parameters representing consumption activities
 * @returns A structured calculation breakdown and comparison targets
 */
export function calculateCarbonFootprint(inputs: CalculatorInputs): CalculationResult {
  const carMiles = Math.max(0, inputs.carMiles);
  const transitMiles = Math.max(0, inputs.transitMiles);
  const flightHours = Math.max(0, inputs.flightHours);
  const electricityKwh = Math.max(0, inputs.electricityKwh);
  const gasTherms = Math.max(0, inputs.gasTherms);
  const shoppingSpend = Math.max(0, inputs.shoppingSpend);
  const dietType = inputs.dietType in FACTORS.dietAnnualKg ? inputs.dietType : 'average';

  // 1. Calculate Transport Emissions (Weekly input -> Annualized)
  const annualCarEmissions = carMiles * 52 * FACTORS.carPerMile;
  const annualTransitEmissions = transitMiles * 52 * FACTORS.transitPerMile;
  const annualFlightEmissions = flightHours * FACTORS.flightPerHour;
  const transportTotalKg = annualCarEmissions + annualTransitEmissions + annualFlightEmissions;

  // 2. Calculate Energy Emissions (Monthly input -> Annualized)
  const annualElectricityEmissions = electricityKwh * 12 * FACTORS.electricityPerKwh;
  const annualGasEmissions = gasTherms * 12 * FACTORS.gasPerTherm;
  const energyTotalKg = annualElectricityEmissions + annualGasEmissions;

  // 3. Calculate Diet Emissions (Annual value from baseline datasets)
  const dietTotalKg = FACTORS.dietAnnualKg[dietType];

  // 4. Calculate Shopping Emissions (Monthly input -> Annualized)
  const shoppingTotalKg = shoppingSpend * 12 * FACTORS.shoppingPerDollar;

  // Convert to Metric Tons of CO2e (1 metric ton = 1000 kilograms)
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
      usAverage: 16.0,
      euAverage: 6.4,
      globalTarget: 2.0,
    },
  };
}
