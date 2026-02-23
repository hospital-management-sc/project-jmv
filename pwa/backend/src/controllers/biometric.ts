/**
 * Biometric Authentication Controllers
 * 
 * Handles HTTP requests for WebAuthn/FIDO2 biometric endpoints
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { 
  getBiometricCredentials, 
  renameBiometricCredential,
  deleteBiometricCredential,
  generateRegistrationChallenge,
  saveBiometricCredential,
  generateAuthenticationChallenge,
  verifyBiometricAuthentication,
} from '../services/biometric';
import { generateToken } from '../services/auth';
import { ValidationError, AppError } from '../types/responses';
import logger from '../utils/logger';
import {
  setRegistrationChallenge,
  popRegistrationChallenge,
  setAuthChallenge,
  popAuthChallenge,
} from '../utils/challengeStore';

/**
 * GET /api/biometric/credentials
 * Get all biometric credentials for the authenticated user
 */
export const getBiometricCredentialsHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new ValidationError('User not found in request');
    }

    const credentials = await getBiometricCredentials(req.user.id);

    res.status(200).json({
      success: true,
      data: credentials,
      message: 'Biometric credentials retrieved successfully',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else {
      logger.error('Get biometric credentials error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'An error occurred while retrieving biometric credentials',
      });
    }
  }
};

/**
 * POST /api/biometric/register/initiate
 * Initiate biometric credential registration (returns WebAuthn challenge)
 */
export const initiateBiometricRegistration = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new ValidationError('User not found in request');
    }

    const options = await generateRegistrationChallenge(req.user.id, req.user.email || '');

    // Store challenge in memory (cross-domain sessions don't work)
    setRegistrationChallenge(req.user.id, options.challenge);

    res.status(200).json({
      success: true,
      data: options,
      message: 'Biometric registration initiated',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else {
      logger.error('Initiate biometric registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'An error occurred while initiating biometric registration',
      });
    }
  }
};

/**
 * POST /api/biometric/register/verify
 * Verify and save biometric credential after registration
 */
export const verifyBiometricCredential = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new ValidationError('User not found in request');
    }

    const { credentialResponse, deviceName, deviceType, transports } = req.body;

    if (!credentialResponse || !deviceName) {
      throw new ValidationError('Credential response and device name are required');
    }

    // Get stored challenge from memory store
    const storedChallenge = popRegistrationChallenge(req.user.id);
    if (!storedChallenge) {
      throw new ValidationError('No registration challenge found. Please initiate registration again.');
    }

    // Verify and save the credential
    const credential = await saveBiometricCredential(
      req.user.id,
      credentialResponse,
      storedChallenge,
      deviceName,
      deviceType || 'platform',
      transports || []
    );

    res.status(201).json({
      success: true,
      data: credential,
      message: 'Biometric credential verified and saved successfully',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else {
      logger.error('Verify biometric credential error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'An error occurred while verifying biometric credential',
      });
    }
  }
};

/**
 * PATCH /api/biometric/credentials/:credentialId
 * Rename biometric credential
 */
export const renameBiometricCredentialHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new ValidationError('User not found in request');
    }

    const { credentialId } = req.params;
    const { deviceName } = req.body;

    if (!deviceName) {
      throw new ValidationError('Device name is required');
    }

    const updatedCredential = await renameBiometricCredential(
      credentialId,
      deviceName,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: updatedCredential,
      message: 'Biometric credential renamed successfully',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else {
      logger.error('Rename biometric credential error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'An error occurred while renaming biometric credential',
      });
    }
  }
};

/**
 * DELETE /api/biometric/credentials/:credentialId
 * Delete/revoke biometric credential
 */
export const deleteBiometricCredentialHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.id) {
      throw new ValidationError('User not found in request');
    }

    const { credentialId } = req.params;

    await deleteBiometricCredential(credentialId, req.user.id);

    res.status(200).json({
      success: true,
      data: null,
      message: 'Biometric credential deleted successfully',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else {
      logger.error('Delete biometric credential error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'An error occurred while deleting biometric credential',
      });
    }
  }
};

/**
 * POST /api/biometric/authenticate/initiate
 * Initiate biometric authentication
 */
export const initiateAuthentication = async (_req: any, res: Response): Promise<void> => {
  try {
    const options = await generateAuthenticationChallenge();

    // Store challenge in memory and return opaque token for the client
    const challengeToken = setAuthChallenge(options.challenge);

    res.status(200).json({
      success: true,
      data: { ...options, challengeToken },
      message: 'Authentication initiated',
    });
  } catch (error) {
    logger.error('Initiate authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An error occurred during authentication initiation',
    });
  }
};

/**
 * POST /api/biometric/authenticate/verify
 * Verify biometric authentication
 */
export const verifyAuthentication = async (req: any, res: Response): Promise<void> => {
  try {
    const { credentialId, assertionResponse, challengeToken } = req.body;

    if (!credentialId || !assertionResponse) {
      throw new ValidationError('Credential ID and assertion response are required');
    }

    // Retrieve and consume challenge from memory store
    const storedChallenge = challengeToken ? popAuthChallenge(challengeToken) : null;
    if (!storedChallenge) {
      throw new ValidationError('No authentication challenge found. Please initiate authentication again.');
    }

    // Get client IP
    const ipAddress =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
      req.ip ||
      req.connection.remoteAddress;

    // Get user agent
    const userAgent = req.headers['user-agent'];

    // Verify authentication
    const result = await verifyBiometricAuthentication(
      credentialId,
      assertionResponse,
      storedChallenge,
      ipAddress,
      userAgent || 'Unknown'
    );

    // Generate JWT token for the authenticated user
    const u = result.user as any;
    // Apply same fallbacks as the normal login flow (role || 'MEDICO', nombre must be non-empty)
    const userRole: string = u.role || 'MEDICO';
    const userNombre: string = u.nombre || '';
    const token = generateToken(
      u.id,
      userNombre,
      u.email,
      userRole,
      u.especialidad ?? null,
      u.departamento ?? null
    );

    res.status(200).json({
      success: true,
      data: {
        id: u.id,
        nombre: userNombre,
        email: u.email,
        role: userRole,
        especialidad: u.especialidad,
        token,
      },
      message: 'Biometric authentication successful',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.name,
        message: error.message,
      });
    } else {
      logger.error('Verify authentication error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'An error occurred during authentication verification',
      });
    }
  }
};
