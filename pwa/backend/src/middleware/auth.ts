/**
 * Authentication Middleware
 * 
 * Handles JWT token validation and user authentication
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../types/responses';
import config from '../config';
import logger from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    nombre?: string;
  };
}

/**
 * Verify JWT token and attach user to request
 */
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid Authorization header');
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    
    const secret = config.jwtSecret;
    const decoded = jwt.verify(token, secret) as any;

    // Attach user data to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn(`Invalid token: ${error.message}`);
      res.status(401).json({
        error: 'Invalid Token',
        message: 'Token is invalid or expired',
      });
    } else if (error instanceof UnauthorizedError) {
      res.status(401).json({
        error: error.name,
        message: error.message,
      });
    } else {
      logger.error('Auth middleware error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Authentication failed',
      });
    }
  }
};

/**
 * Optional authentication - doesn't fail if token is missing but validates if present
 */
export const optionalAuthMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const secret = config.jwtSecret;
      const decoded = jwt.verify(token, secret) as any;

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
    }

    next();
  } catch (error) {
    logger.warn('Optional auth validation failed, continuing without user context');
    next();
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `User role '${req.user.role}' is not authorized for this action`,
      });
      return;
    }

    next();
  };
};
