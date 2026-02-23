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
import { getPrismaClient } from '../database/connection';

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
    if (!nombre || !email || !password || !ci) {
      throw new ValidationError('Name, email, C.I., and password are required');
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

    const prisma = getPrismaClient();
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nombre: true,
        email: true,
        role: true,
        ci: true,
        cargo: true,
        especialidad: true,
        createdAt: true,
        personalAutorizado: {
          select: {
            departamento: true,
            estado: true,
            cargo: true,
            especialidad: true,
            fechaIngreso: true,
          },
        },
      },
    });

    if (!usuario) {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User not found',
      });
      return;
    }

    // Merge Usuario fields with PersonalAutorizado overrides (whitelist is source of truth for departamento/estado)
    const pa = usuario.personalAutorizado;
    res.status(200).json({
      success: true,
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role,
        ci: usuario.ci,
        cargo: usuario.cargo || pa?.cargo || null,
        especialidad: usuario.especialidad || pa?.especialidad || null,
        departamento: pa?.departamento || null,
        estado: pa?.estado || 'ACTIVO',
        fechaIngreso: pa?.fechaIngreso || null,
      },
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

/**
 * POST /api/auth/forgot-password
 * Verify user identity (email + CI) and allow password reset
 */
export const forgotPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, ci, newPassword } = req.body;

    // Validation
    if (!email || !ci || !newPassword) {
      throw new ValidationError('Email, C.I., and new password are required');
    }

    if (newPassword.length < 6) {
      throw new ValidationError('Password must be at least 6 characters long');
    }

    // Call service
    const { resetPasswordUser } = await import('../services/auth');
    await resetPasswordUser({ email, ci, newPassword });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else {
      logger.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'An error occurred during password reset',
      });
    }
  }
};
