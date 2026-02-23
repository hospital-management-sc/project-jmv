/**
 * Biometric Authentication Services
 * 
 * Business logic for WebAuthn/FIDO2 biometric credential management
 */

import { PrismaClient } from '@prisma/client';
import { NotFoundError, UnauthorizedError } from '../types/responses';
import logger from '../utils/logger';
import {
  generateBiometricRegistrationOptions,
  verifyBiometricRegistrationResponse,
  extractPublicKeyFromRegistration,
  extractCredentialIdFromRegistration,
  generateBiometricAuthenticationOptions,
  verifyBiometricAuthenticationResponse,
} from '../utils/webauthn';

const prisma = new PrismaClient();

/**
 * Get all active biometric credentials for a user
 */
export const getBiometricCredentials = async (userId: number) => {
  try {
    const credentials = await prisma.biometricCredential.findMany({
      where: { userId, isActive: true },
      select: {
        id: true,
        credentialId: true,
        deviceName: true,
        deviceType: true,
        lastAccessedAt: true,
        lastAccessedIp: true,
        credentialBackedUp: true,
        isActive: true,
        transports: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return credentials;
  } catch (error) {
    logger.error('Error fetching biometric credentials:', error);
    throw error;
  }
};

/**
 * Generate registration options for WebAuthn
 */
export const generateRegistrationChallenge = async (userId: number, _userName: string) => {
  try {
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
      select: { nombre: true, email: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const options = await generateBiometricRegistrationOptions(
      userId,
      user.email,
      user.nombre
    );

    // Store challenge in session or temporary storage
    // In production, you'd store this in Redis or similar
    logger.info(`Generated registration challenge for user ${userId}`);

    return options;
  } catch (error) {
    logger.error('Error generating registration challenge:', error);
    throw error;
  }
};

/**
 * Verify and save biometric credential after registration
 */
export const saveBiometricCredential = async (
  userId: number,
  credentialResponse: any,
  expectedChallenge: string,
  deviceName: string,
  deviceType: string = 'platform',
  transports: string[] = []
) => {
  try {
    // Verify the credential response
    const verification = await verifyBiometricRegistrationResponse(
      credentialResponse,
      { challenge: expectedChallenge }
    );

    if (!verification.verified) {
      throw new Error('Credential verification failed');
    }

    // Extract public key and credential ID
    const publicKey = extractPublicKeyFromRegistration(verification);
    const credentialId = extractCredentialIdFromRegistration(verification);

    // Save to database
    const credential = await prisma.biometricCredential.create({
      data: {
        userId,
        credentialId,
        publicKey: publicKey.toString('base64'),
        deviceName,
        deviceType,
        transports,
        signCount: verification.registrationInfo?.credential.counter || 0,
        credentialBackedUp: verification.registrationInfo?.credentialBackedUp || false,
        attestationObject: credentialResponse.response?.attestationObject,
        clientDataJSON: credentialResponse.response?.clientDataJSON,
        isActive: true,
      },
      select: {
        id: true,
        credentialId: true,
        deviceName: true,
        deviceType: true,
        createdAt: true,
      },
    });

    logger.info(`Created biometric credential for user ${userId}: ${credentialId}`);

    return credential;
  } catch (error) {
    logger.error('Error saving biometric credential:', error);
    throw error;
  }
};

/**
 * Generate authentication challenge
 */
export const generateAuthenticationChallenge = async (credentialIds?: string[]) => {
  try {
    const options = await generateBiometricAuthenticationOptions(credentialIds);
    logger.info('Generated authentication challenge');
    return options;
  } catch (error) {
    logger.error('Error generating authentication challenge:', error);
    throw error;
  }
};

/**
 * Verify authentication and update last access info
 */
export const verifyBiometricAuthentication = async (
  credentialId: string,
  assertionResponse: any,
  expectedChallenge: string,
  ipAddress?: string,
  userAgent?: string
) => {
  try {
    // Find the credential
    const credential = await prisma.biometricCredential.findUnique({
      where: { credentialId },
      include: { usuario: true },
    });

    if (!credential) {
      throw new NotFoundError('Credential not found');
    }

    if (!credential.isActive) {
      throw new UnauthorizedError('This credential is no longer active');
    }

    // Verify the assertion
    const publicKey = Buffer.from(credential.publicKey, 'base64');
    const verification = await verifyBiometricAuthenticationResponse(
      assertionResponse,
      { challenge: expectedChallenge },
      publicKey,
      credential.signCount
    );

    if (!verification.verified) {
      await prisma.biometricCredential.update({
        where: { credentialId },
        data: { lastVerificationError: 'Authentication verification failed' },
      });
      throw new Error('Authentication verification failed');
    }

    // Sign count check: synced passkeys (iCloud Keychain, Google Password Manager, etc.)
    // legitimately use counter = 0. Only flag if BOTH old and new are > 0 and new ≤ old.
    const newCounter = verification.authenticationInfo?.newCounter ?? 0;
    if (newCounter > 0 && newCounter <= credential.signCount) {
      logger.warn(`Potential biometric cloning detected for credential ${credentialId}`);
      await prisma.biometricCredential.update({
        where: { credentialId },
        data: { lastVerificationError: 'Sign count mismatch - possible cloning attempt' },
      });
      throw new Error('Sign count validation failed - possible cloning attempt');
    }

    // Update last access information
    await prisma.biometricCredential.update({
      where: { credentialId },
      data: {
        lastAccessedAt: new Date(),
        lastAccessedIp: ipAddress,
        lastAccessedUserAgent: userAgent,
        signCount: verification.authenticationInfo?.newCounter || credential.signCount,
        lastVerificationError: null,
      },
    });

    logger.info(`User ${credential.userId} authenticated with biometric credential`);

    return {
      userId: credential.userId,
      user: credential.usuario,
      verified: true,
    };
  } catch (error) {
    logger.error('Error verifying biometric authentication:', error);
    throw error;
  }
};

/**
 * Rename a biometric credential
 */
export const renameBiometricCredential = async (
  credentialId: string,
  newDeviceName: string,
  userId: number
) => {
  try {
    // Verify credential belongs to user
    const credential = await prisma.biometricCredential.findUnique({
      where: { credentialId },
    });

    if (!credential) {
      throw new NotFoundError('Biometric credential not found');
    }

    if (credential.userId !== userId) {
      throw new UnauthorizedError('You do not have permission to modify this credential');
    }

    // Update device name
    const updated = await prisma.biometricCredential.update({
      where: { credentialId },
      data: { deviceName: newDeviceName },
      select: {
        id: true,
        deviceName: true,
        deviceType: true,
        lastAccessedAt: true,
        isActive: true,
        createdAt: true,
      },
    });

    return updated;
  } catch (error) {
    logger.error('Error renaming biometric credential:', error);
    throw error;
  }
};

/**
 * Delete/revoke a biometric credential
 */
export const deleteBiometricCredential = async (
  credentialId: string,
  userId: number
) => {
  try {
    // Verify credential belongs to user
    const credential = await prisma.biometricCredential.findUnique({
      where: { credentialId },
    });

    if (!credential) {
      throw new NotFoundError('Biometric credential not found');
    }

    if (credential.userId !== userId) {
      throw new UnauthorizedError('You do not have permission to delete this credential');
    }

    // Delete the credential
    await prisma.biometricCredential.delete({
      where: { credentialId },
    });

    logger.info(`Deleted biometric credential ${credentialId} for user ${userId}`);

    return true;
  } catch (error) {
    logger.error('Error deleting biometric credential:', error);
    throw error;
  }
};

/**
 * Update last access information for a credential (quick update)
 */
export const updateLastAccess = async (
  credentialId: string,
  ipAddress?: string,
  userAgent?: string
) => {
  try {
    await prisma.biometricCredential.update({
      where: { credentialId },
      data: {
        lastAccessedAt: new Date(),
        lastAccessedIp: ipAddress,
        lastAccessedUserAgent: userAgent,
      },
    });

    return true;
  } catch (error) {
    logger.error('Error updating last access:', error);
    throw error;
  }
};

/**
 * Check if user has already registered biometric credentials
 */
export const hasBiometricCredentials = async (userId: number) => {
  try {
    const count = await prisma.biometricCredential.count({
      where: {
        userId,
        isActive: true,
      },
    });

    return count > 0;
  } catch (error) {
    logger.error('Error checking biometric credentials:', error);
    throw error;
  }
};

/**
 * Get credential IDs for user (for authentication)
 */
export const getUserCredentialIds = async (userId: number) => {
  try {
    const credentials = await prisma.biometricCredential.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: {
        credentialId: true,
      },
    });

    return credentials.map((c) => c.credentialId);
  } catch (error) {
    logger.error('Error getting user credential IDs:', error);
    throw error;
  }
};
