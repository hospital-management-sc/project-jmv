/**
 * Database Connection Configuration
 * 
 * This module handles the Prisma client initialization and connection management
 * for PostgreSQL database connections.
 */

import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

let prisma: PrismaClient;

/**
 * Get or create Prisma Client instance
 * Follows singleton pattern to avoid multiple instances in development
 */
export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' 
        ? ['query', 'error', 'warn'] 
        : ['error'],
    });
  }
  return prisma;
};

/**
 * Initialize database connection
 * Call this in your main application startup
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    const client = getPrismaClient();
    await client.$connect();
    logger.info('Base de datos conectada exitosamente');
  } catch (error) {
    logger.error('Error al conectar con la base de datos:', error);
    process.exit(1);
  }
};

/**
 * Disconnect from database
 * Call this during graceful shutdown
 */
export const disconnectDatabase = async (): Promise<void> => {
  if (prisma) {
    await prisma.$disconnect();
    logger.info('Base de datos desconectada');
  }
};

export default getPrismaClient;
