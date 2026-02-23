/**
 * WebAuthn Browser Utilities
 * Client-side WebAuthn functions using @simplewebauthn/browser
 */

import {
  startRegistration,
  startAuthentication,
} from '@simplewebauthn/browser';

/**
 * Start WebAuthn registration (credential creation)
 */
export async function startWebAuthnRegistration(options: any): Promise<any> {
  try {
    const attestationResponse = await startRegistration({ optionsJSON: options });
    return attestationResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`WebAuthn registration failed: ${error.message}`);
    }
    throw new Error('WebAuthn registration failed');
  }
}

/**
 * Start WebAuthn authentication (credential assertion)
 */
export async function startWebAuthnAuthentication(options: any): Promise<any> {
  try {
    const assertionResponse = await startAuthentication({ optionsJSON: options });
    return assertionResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`WebAuthn authentication failed: ${error.message}`);
    }
    throw new Error('WebAuthn authentication failed');
  }
}

/**
 * Check if WebAuthn is supported in browser
 */
export function isWebAuthnSupported(): boolean {
  return (
    window.PublicKeyCredential !== undefined &&
    navigator.credentials !== undefined &&
    navigator.credentials.create !== undefined &&
    navigator.credentials.get !== undefined
  );
}

/**
 * Check if platform authenticator is available (Face ID, Touch ID, Windows Hello, etc)
 */
export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) {
    return false;
  }

  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch (error) {
    console.error('Error checking platform authenticator:', error);
    return false;
  }
}

/**
 * Get friendly error message for WebAuthn errors
 */
export function getWebAuthnErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred';

  if (error.name === 'InvalidStateError') {
    return 'This credential has already been registered';
  }

  if (error.name === 'NotAllowedError') {
    return 'The operation was cancelled or not permitted';
  }

  if (error.name === 'SecurityError') {
    return 'A security error occurred. Please check your browser settings';
  }

  if (error.name === 'AbortError') {
    return 'The operation was aborted';
  }

  if (error.name === 'UnknownError') {
    return 'An unexpected error occurred. Please try again';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

/**
 * Format device name based on user agent
 */
export function getDefaultDeviceName(): string {
  const userAgent = navigator.userAgent;

  if (/iPhone|iPad/.test(userAgent)) {
    if (/iPhone/.test(userAgent)) {
      return `iPhone - ${new Date().toLocaleDateString('es-ES')}`;
    }
    return `iPad - ${new Date().toLocaleDateString('es-ES')}`;
  }

  if (/Android/.test(userAgent)) {
    return `Android Device - ${new Date().toLocaleDateString('es-ES')}`;
  }

  if (/Windows/.test(userAgent)) {
    return `Windows Computer - ${new Date().toLocaleDateString('es-ES')}`;
  }

  if (/Mac/.test(userAgent)) {
    return `Mac Computer - ${new Date().toLocaleDateString('es-ES')}`;
  }

  if (/Linux/.test(userAgent)) {
    return `Linux Computer - ${new Date().toLocaleDateString('es-ES')}`;
  }

  return `Device - ${new Date().toLocaleDateString('es-ES')}`;
}

/**
 * Extract transports from credential
 */
export function getTransportsFromCredential(credential: any): string[] {
  const transports: string[] = [];

  if (credential.response?.getTransports) {
    transports.push(...credential.response.getTransports());
  }

  return transports.length > 0 ? transports : ['internal'];
}
