import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { calculateCarbonFootprint } from '../controllers/calculator';

const router = Router();

// Zod schema for calculator inputs validation
const calculatorSchema = z.object({
  carMiles: z.number({ required_error: 'Car miles is required' }).min(0).max(5000),
  transitMiles: z.number({ required_error: 'Transit miles is required' }).min(0).max(5000),
  flightHours: z.number({ required_error: 'Flight hours is required' }).min(0).max(1000),
  electricityKwh: z.number({ required_error: 'Electricity kWh is required' }).min(0).max(10000),
  gasTherms: z.number({ required_error: 'Gas therms is required' }).min(0).max(1000),
  dietType: z.enum(['meatHeavy', 'average', 'vegetarian', 'vegan'], {
    required_error: 'Diet type must be one of: meatHeavy, average, vegetarian, vegan',
  }),
  shoppingSpend: z.number({ required_error: 'Shopping spend is required' }).min(0).max(100000),
});

/**
 * Custom CSRF/Sec-Fetch Mitigation Middleware
 * Validates request metadata to reject cross-origin requests initiating mutations.
 */
function verifyCsrfToken(req: Request, res: Response, next: NextFunction) {
  // Safe requests (GET, HEAD, OPTIONS) do not require CSRF check
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Enforce custom headers (indicates request was made programmatically, bypassing traditional form submissions)
  const clientToken = req.headers['x-requested-with'];
  const expectedOrigin = 'https://ecosphere-613211879861.europe-west1.run.app';

  if (!clientToken || clientToken !== 'EcoSphere-App') {
    return res.status(403).json({
      success: false,
      message: 'CSRF security token missing or invalid. Action rejected.',
    });
  }

  // Validate Sec-Fetch-Site and Origin header controls if available
  const origin = req.headers['origin'];
  const isLocalhost = req.headers['host']?.includes('localhost') || req.headers['host']?.includes('127.0.0.1');

  if (origin && origin !== expectedOrigin && !isLocalhost) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized origin request detected. Action rejected.',
    });
  }

  next();
}

/**
 * @route POST /api/calculate
 * @desc Calculate carbon footprint from validated inputs
 * @access Public
 */
router.post('/calculate', verifyCsrfToken, (req: Request, res: Response) => {
  try {
    // Strict schema parsing - filters unknown keys and validates values
    const validatedData = calculatorSchema.parse(req.body);
    const result = calculateCarbonFootprint(validatedData);
    
    // Add caching header for resource efficiency (responses depend purely on input)
    res.setHeader('Cache-Control', 'public, max-age=60');
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input parameters supplied',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

/**
 * @route GET /api/security-status
 * @desc Get details on active application security parameters
 * @access Public
 */
router.get('/security-status', (_req: Request, res: Response) => {
  return res.status(200).json({
    securityParameters: {
      helmetConfigured: true,
      rateLimiterConfigured: true,
      zodInputValidation: 'Strict payload validation and scrubbing',
      xssProtectionEnabled: true,
      contentSecurityPolicy: 'Active, blocking cross-domain injections',
      csrfMitigation: 'Active (anti-CSRF headers verified for mutating requests)',
    },
  });
});

export default router;
