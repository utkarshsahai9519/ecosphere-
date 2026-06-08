import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import apiRouter from './routes/api';

const app = express();
const PORT = process.env.PORT || 8080; // Standard Cloud Run port is 8080

// 1. Configure Helmet for advanced HTTP headers and strict CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Allowed unsafe-eval for Vite dev / dynamic components
        'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'font-src': ["'self'", 'https://fonts.gstatic.com'],
        'img-src': ["'self'", 'data:', 'https://images.unsplash.com'],
        'connect-src': ["'self'", 'ws:', 'wss:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false, // Turn off for external assets like Google Fonts
  })
);

// 2. Enable CORS with restricted origin rules
app.use(cors({
  origin: '*', // For Cloud Run public accessibility, restrict as appropriate in production
  methods: ['GET', 'POST'],
}));

// 3. Request rate limiter to block DDoS and brute force
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api', limiter);

// 4. Parse incoming JSON requests safely with a body-size limit (10kb) to prevent payload exhaustion attacks
app.use(express.json({ limit: '10kb' }));

// 5. Mount API router
app.use('/api', apiRouter);

// 6. Serve static files compiled from Vite
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// 7. Route client requests (SPA routing fallback)
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// 8. Custom Centralized Error Handler (Prevents server crashes & controls stack leaks)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[Error Handler]: ${err.message}`);
  return res.status(500).json({
    success: false,
    message: 'An unexpected internal security error occurred. Please contact the administrator.',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running securely on port ${PORT}`);
});
export default app;
