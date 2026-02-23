/**
 * WebAuthn Utilities for Backend
 * Handles generation and verification of WebAuthn registration and authentication flows
 */

import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

export const RP_ID = process.env.WEBAUTHN_RP_ID || 'localhost';
export const RP_NAME = 'Hospital Management System';
// Support comma-separated list of origins for multi-environment deployments
export const ORIGIN: string | string[] = process.env.WEBAUTHN_ORIGIN
  ? process.env.WEBAUTHN_ORIGIN.includes(',')
    ? process.env.WEBAUTHN_ORIGIN.split(',').map((o) => o.trim())
    : process.env.WEBAUTHN_ORIGIN.trim()
  : 'http://localhost:5173';

/**
 * Generate registration options for a new biometric credential
 */
export async function generateBiometricRegistrationOptions(
  userId: number,
  userName: string,
  userDisplayName: string
) {
  const options = await generateRegistrationOptions({
    rpID: RP_ID,
    rpName: RP_NAME,
    userID: Buffer.from(userId.toString()),
    userName,
    userDisplayName,
    attestationType: 'direct',
    authenticatorSelection: {
      authenticatorAttachment: 'platform', // Allow only platform authenticators (Face ID, Touch ID, Windows Hello)
      residentKey: 'preferred', // Allow resident credentials (passkeys)
      userVerification: 'preferred',
    },
    timeout: 60000,
    supportedAlgorithmIDs: [-7, -257], // ES256 and RS256
  });

  return options;
}

/**
 * Verify registration response from client
 */
export async function verifyBiometricRegistrationResponse(
  credential: any,
  registrationOptions: any
) {
  try {
    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge: registrationOptions.challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
    });

    return verification;
  } catch (error) {
    throw new Error(`WebAuthn registration verification failed: ${error}`);
  }
}

/**
 * Generate authentication options for biometric login
 */
export async function generateBiometricAuthenticationOptions(
  allowedCredentialIDs?: string[]
) {
  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    timeout: 60000,
    userVerification: 'preferred',
    ...(allowedCredentialIDs && {
      allowCredentials: allowedCredentialIDs.map((id) => ({
        id: id,
        transports: ['internal', 'usb', 'ble', 'nfc'] as any,
      })),
    }),
  });

  return options;
}

/**
 * Verify authentication response from client
 */
export async function verifyBiometricAuthenticationResponse(
  assertion: any,
  authenticationOptions: any,
  storedPublicKey: Buffer,
  storedSignCount: number
) {
  try {
    const verification = await verifyAuthenticationResponse({
      response: assertion,
      expectedChallenge: authenticationOptions.challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      credential: {
        id: assertion.id,
        publicKey: new Uint8Array(storedPublicKey),
        counter: storedSignCount,
      },
    });

    return verification;
  } catch (error) {
    throw new Error(`WebAuthn authentication verification failed: ${error}`);
  }
}

/**
 * Extract public key from registration verification
 */
export function extractPublicKeyFromRegistration(verification: any): Buffer {
  const credentialPublicKey = verification.registrationInfo?.credential.publicKey;
  if (!credentialPublicKey) {
    throw new Error('Failed to extract public key from registration');
  }
  return Buffer.from(credentialPublicKey);
}

/**
 * Extract credential ID from registration
 */
export function extractCredentialIdFromRegistration(verification: any): string {
  const credentialID = verification.registrationInfo?.credential.id;
  if (!credentialID) {
    throw new Error('Failed to extract credential ID from registration');
  }
  return credentialID;
}
