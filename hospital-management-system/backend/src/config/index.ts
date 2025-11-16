/**
 * Application Configuration
 * 
 * Centralizes environment variables and app configuration
 */

import dotenv from 'dotenv';

dotenv.config();

// Helper function to determine CORS origin
function getCorsOrigin(): string {
  // Auto-detect Codespace environment FIRST
  const codespaceHost = process.env.CODESPACE_NAME;
  if (codespaceHost) {
    // Format: {codespace-name}-5173.app.github.dev
    const corsUrl = `https://${codespaceHost}-5173.app.github.dev`;
    console.log(`[CONFIG] Codespace detected: ${corsUrl}`);
    return corsUrl;
  }

  // Then check environment variable (for explicit configuration)
  const envCors = process.env.CORS_ORIGIN;
  if (envCors) {
    console.log(`[CONFIG] Using CORS_ORIGIN from .env: ${envCors}`);
    return envCors;
  }

  // Auto-detect production environments
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv === 'production') {
    // For production on Render backend with Vercel frontend
    const corsUrl = 'https://project-jmv.vercel.app';
    console.log(`[CONFIG] Production detected: ${corsUrl}`);
    return corsUrl;
  }

  // Default to localhost for local development
  const defaultCors = 'http://localhost:5173';
  console.log(`[CONFIG] Using default localhost: ${defaultCors}`);
  return defaultCors;
}

// Helper function to determine backend URL
function getBackendUrl(): string {
  // Auto-detect Codespace environment FIRST
  const codespaceHost = process.env.CODESPACE_NAME;
  if (codespaceHost) {
    // Format: {codespace-name}-3001.app.github.dev
    const backendUrl = `https://${codespaceHost}-3001.app.github.dev`;
    console.log(`[CONFIG] Codespace backend URL: ${backendUrl}`);
    return backendUrl;
  }

  // Then check environment variable (for explicit configuration)
  const envBackend = process.env.BACKEND_URL;
  if (envBackend) {
    console.log(`[CONFIG] Using BACKEND_URL from .env: ${envBackend}`);
    return envBackend;
  }

  // Default to localhost for local development
  const defaultBackend = 'http://localhost:3001';
  console.log(`[CONFIG] Using default localhost: ${defaultBackend}`);
  return defaultBackend;
}

export const config = {
  // Environment
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isStaging: process.env.NODE_ENV === 'staging',

  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  backendUrl: getBackendUrl(),

  // Database
  databaseUrl: process.env.DATABASE_URL,

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiry: process.env.JWT_EXPIRY || '24h', // Can be '24h', '7d', etc or milliseconds as number

  // CORS
  corsOrigin: getCorsOrigin(),

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
