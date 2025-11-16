/**
 * Application Configuration
 * 
 * Centralizes environment variables and app configuration
 */

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isStaging: process.env.NODE_ENV === 'staging',

  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  backendUrl: process.env.BACKEND_URL || 'http://localhost:3001',

  // Database
  databaseUrl: process.env.DATABASE_URL,

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiry: process.env.JWT_EXPIRY || '24h', // Can be '24h', '7d', etc or milliseconds as number

  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug',
} as const;

// Validate required variables
if (!config.databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

if (!config.jwtSecret || config.jwtSecret === 'your-secret-key') {
  console.warn('⚠️  JWT_SECRET is using default value. Please set it in production.');
}

export default config;
