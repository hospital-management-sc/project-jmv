/**
 * WebAuthn Configuration
 * Settings for WebAuthn/FIDO2 in frontend
 */

/**
 * Relying Party ID - must match your domain
 * For development: localhost
 * For production: yourdomain.com (without https:// and www.)
 */
export const WEBAUTHN_RP_ID = import.meta.env.VITE_WEBAUTHN_RP_ID || 'localhost';

/**
 * Origin - full URL for attestation/assertion verification
 * Must start with https:// (except for localhost development)
 */
export const WEBAUTHN_ORIGIN =
  import.meta.env.VITE_WEBAUTHN_ORIGIN ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');

/**
 * API Timeout for WebAuthn operations (milliseconds)
 */
export const WEBAUTHN_TIMEOUT = 60000;

/**
 * Attestation conveyance preference
 * - 'direct': Return attestation
 * - 'indirect': May return attestation
 * - 'none': Do not return attestation
 */
export const ATTESTATION_PREFERENCE = 'direct';

/**
 * User verification requirement
 * - 'required': Authenticator MUST verify user
 * - 'preferred': Authenticator SHOULD verify user if possible
 * - 'discouraged': Authenticator SHOULD NOT verify user
 */
export const USER_VERIFICATION = 'preferred';

/**
 * Resident key preference
 * - 'required': Authenticator MUST create resident key
 * - 'preferred': Authenticator SHOULD create resident key
 * - 'discouraged': Authenticator SHOULD NOT create resident key
 */
export const RESIDENT_KEY = 'preferred';

/**
 * Authenticator attachment
 * - 'platform': Built-in authenticator (Face ID, Touch ID, Windows Hello)
 * - 'cross-platform': External authenticator (USB key, roaming credential)
 */
export const AUTHENTICATOR_ATTACHMENT = 'platform';

/**
 * Supported algorithms for credential creation
 * -7: ES256 (Elliptic Curve, recommended)
 * -257: RS256 (RSA, for compatibility)
 */
export const SUPPORTED_ALGORITHMS = [-7, -257];
