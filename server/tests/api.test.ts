import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../index';

describe('EcoSphere API Integration Tests', () => {
  it('should return security status flags on GET /api/security-status', async () => {
    const res = await request(app)
      .get('/api/security-status')
      .expect(200);

    expect(res.body).toHaveProperty('securityParameters');
    expect(res.body.securityParameters.helmetConfigured).toBe(true);
    expect(res.body.securityParameters.rateLimiterConfigured).toBe(true);
  });

  it('should reject calculation POST requests if custom anti-CSRF token is missing', async () => {
    const payload = {
      carMiles: 100,
      transitMiles: 50,
      flightHours: 10,
      electricityKwh: 300,
      gasTherms: 10,
      dietType: 'average',
      shoppingSpend: 200,
    };

    const res = await request(app)
      .post('/api/calculate')
      .send(payload)
      .expect(403); // CSRF mitigation blocks the request

    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('CSRF security token missing');
  });

  it('should compute carbon metrics on POST /api/calculate with valid payload and token', async () => {
    const payload = {
      carMiles: 100,
      transitMiles: 50,
      flightHours: 10,
      electricityKwh: 300,
      gasTherms: 10,
      dietType: 'average',
      shoppingSpend: 200,
    };

    const res = await request(app)
      .post('/api/calculate')
      .set('x-requested-with', 'EcoSphere-App') // Set anti-CSRF header
      .send(payload)
      .expect(200);

    expect(res.body).toHaveProperty('breakdown');
    expect(res.body).toHaveProperty('totalEmissions');
    expect(res.body.totalEmissions).toBeGreaterThan(0);
  });

  it('should return 400 Bad Request if fields do not comply with validation schemas', async () => {
    const invalidPayload = {
      carMiles: -100, // Should be min(0) in Zod validation
      transitMiles: 50,
      flightHours: 10,
      electricityKwh: 300,
      gasTherms: 10,
      dietType: 'invalid-diet-value',
      shoppingSpend: 200,
    };

    const res = await request(app)
      .post('/api/calculate')
      .set('x-requested-with', 'EcoSphere-App')
      .send(invalidPayload)
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Invalid input parameters');
  });
});
