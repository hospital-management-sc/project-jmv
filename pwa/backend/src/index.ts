/**
 * Hospital Management System - Backend Server
 * 
 * Main application entry point
 * Initializes Express server, middleware, and database connection
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import { initializeDatabase, disconnectDatabase } from './database/connection';
import logger from './utils/logger';
import config from './config';
import authRoutes from './routes/auth';
import biometricRoutes from './routes/biometric';
import pacientesRoutes from './routes/pacientes';
import citasRoutes from './routes/citas';
import dashboardRoutes from './routes/dashboard';
import admisionesRoutes from './routes/admisiones';
import encuentrosRoutes from './routes/encuentros';
import authorizedPersonnelRoutes from './routes/authorizedPersonnel';
import interconsultasRoutes from './routes/interconsultas';
import formatoHospitalizacionRoutes from './routes/formatoHospitalizacion';
import formatoEmergenciaRoutes from './routes/formatoEmergencia';
import medicoRoutes from './api/medicos';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();

// Port configuration
const PORT = config.port;
const NODE_ENV = config.nodeEnv;

// ============================================
// SECURITY MIDDLEWARE
// ============================================

// Helmet for security headers
app.use(helmet());

// CORS configuration
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests from the configured origin (with or without trailing slash)
    const allowedOrigin = config.corsOrigin.replace(/\/$/, ''); // Remove trailing slash
    
    // For development, allow all origins
    if (config.isDevelopment) {
      callback(null, true);
      return;
    }
    
    // For production, check exact match (without trailing slash comparison)
    if (!origin || origin.replace(/\/$/, '') === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ============================================
// RATE LIMITING - OPTIMIZADO
// ============================================
// General rate limiter para API (más permisivo)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 500, // 500 requests por IP por 15 minutos (era 100, muy restrictivo)
  message: 'Demasiadas solicitudes desde esta IP, intente más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // No limitar GET requests (son read-only, no afectan DB)
    return req.method === 'GET';
  },
});

// Rate limiter más restrictivo para auth (prevenir ataques de fuerza bruta)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 intentos por IP en 15 minutos
  message: 'Demasiados intentos de login/registro. Intente más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar los intentos exitosos
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);

// ============================================
// SESSION MANAGEMENT (Required for WebAuthn)
// ============================================
app.use(session({
  secret: process.env.SESSION_SECRET || 'hospital-key-military-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 10 * 60 * 1000, // 10 minutos para el challenge
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  }
}));
app.use('/api/auth/register', authLimiter);

// ============================================
// BODY PARSING MIDDLEWARE
// ============================================

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ============================================
// REQUEST LOGGING MIDDLEWARE
// ============================================

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.http(`${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Biometric routes
app.use('/api/biometric', biometricRoutes);

// Pacientes routes
app.use('/api/pacientes', pacientesRoutes);

// Citas routes
app.use('/api/citas', citasRoutes);

// Dashboard routes
app.use('/api/dashboard', dashboardRoutes);

// Admisiones routes
app.use('/api/admisiones', admisionesRoutes);

// Encuentros routes
app.use('/api/encuentros', encuentrosRoutes);

// Interconsultas routes
app.use('/api/interconsultas', interconsultasRoutes);

// Authorized Personnel routes (Whitelist - Solo SUPER_ADMIN)
app.use('/api/authorized-personnel', authorizedPersonnelRoutes);

// Formato de Hospitalización routes
app.use('/api/formato-hospitalizacion', formatoHospitalizacionRoutes);

// Formato de Emergencia routes
app.use('/api/formato-emergencia', formatoEmergenciaRoutes);

// Medicos routes
app.use('/api/medicos', medicoRoutes);

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.path} not found`,
    path: req.path,
  });
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(`Error: ${err.message}`, err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    error: err.name || 'Error',
    message,
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============================================
// SERVER STARTUP
// ============================================

const startServer = async () => {
  try {
    // Connect to database
    await initializeDatabase();
    
    // Start Express server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📝 Environment: ${NODE_ENV}`);
      logger.info(`🌐 CORS enabled for: ${corsOptions.origin}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

const shutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully...`);
  
  try {
    await disconnectDatabase();
    logger.info('✅ Graceful shutdown completed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Start the server
startServer();

export default app;

