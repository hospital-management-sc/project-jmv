/**
 * Logger Configuration
 * 
 * Centralized logging using Winston for all application logging
 * Provides different log levels and formats for development/production
 * Includes security-specific logging for audit trails
 */

import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  security: 2, // Nuevo nivel para eventos de seguridad
  info: 3,
  http: 4,
  debug: 5,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  security: 'cyan bold', // Color distintivo para seguridad
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const transports = [
  // Console transport
  new winston.transports.Console(),

  // Error log file
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),

  // Security log file (eventos de seguridad y auditoría)
  new winston.transports.File({
    filename: 'logs/security.log',
    level: 'security',
  }),

  // Combined log file
  new winston.transports.File({
    filename: 'logs/all.log',
  }),
];

const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  levels,
  format,
  transports,
});

// Extender el logger con método security
interface ExtendedLogger extends winston.Logger {
  security: (message: string, ...meta: any[]) => winston.Logger;
}

const logger = winstonLogger as ExtendedLogger;

// Agregar método security si no existe
if (!logger.security) {
  logger.security = (message: string, ...meta: any[]) => {
    return logger.log('security', message, ...meta);
  };
}

export default logger;
