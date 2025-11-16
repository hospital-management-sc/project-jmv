/**
 * Authentication Controllers
 * 
 * Handles HTTP requests for authentication endpoints
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { loginUser, registerUser } from '../services/auth';
import { ValidationError, AppError } from '../types/responses';
import logger from '../utils/logger';

/**
 * POST /api/auth/login
 * Login user with email and password
 */
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Call service
    const result = await loginUser({ email, password });

    res.status(200).json({
      success: true,
      data: result,
      message: 'Login successful',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'An error occurred during login',
      });
    }
  }
};

/**
 * POST /api/auth/register
 * Register a new user
 */
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { nombre, email, password, ci, role } = req.body;

    // Validation
    if (!nombre || !email || !password) {
      throw new ValidationError('Name, email, and password are required');
    }

    // Call service
    const result = await registerUser({
      nombre,
      email,
      password,
      ci,
      role,
    });

    res.status(201).json({
      success: true,
      data: result,
      message: 'User registered successfully',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else {
      logger.error('Register error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'An error occurred during registration',
      });
    }
  }
};

/**
 * GET /api/auth/me
 * Get current user info (requires authentication)
 */
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    logger.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get current user',
    });
  }
};
