import * as calculatorService from '../services/calculatorService';

export type CalculatorInputs = calculatorService.CalculatorInputs;
export type CalculationResult = calculatorService.CalculationResult;
export const FACTORS = calculatorService.FACTORS;

/**
 * Controller wrapper delegating calculations to the domain calculatorService.
 * Keeps routes clean and maintains architectural layer boundaries.
 */
export function calculateCarbonFootprint(inputs: CalculatorInputs): CalculationResult {
  return calculatorService.calculateCarbonFootprint(inputs);
}
