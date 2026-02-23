/**
 * In-memory WebAuthn challenge store
 *
 * Replaces express-session for storing WebAuthn challenges between
 * initiate and verify steps. Cross-domain deployments (e.g., Vercel → Render)
 * cannot rely on cookies/sessions — the challenge lives only seconds in memory.
 *
 * Keys:
 *   - Registration:     "reg:<userId>"  (user is already authenticated)
 *   - Authentication:   a random UUID returned to the client as `challengeToken`
 */

import { randomUUID } from 'crypto';

interface ChallengeEntry {
  challenge: string;
  timestamp: number;
}

const TTL_MS = 5 * 60 * 1000; // 5 minutes

const store = new Map<string, ChallengeEntry>();

// ── Registration (keyed by userId) ──────────────────────────────────────────

/**
 * Save a registration challenge for an authenticated user.
 */
export function setRegistrationChallenge(userId: number, challenge: string): void {
  store.set(`reg:${userId}`, { challenge, timestamp: Date.now() });
}

/**
 * Consume the registration challenge for a user.
 * Returns null if not found or expired.
 */
export function popRegistrationChallenge(userId: number): string | null {
  const key = `reg:${userId}`;
  const entry = store.get(key);
  store.delete(key);
  if (!entry || Date.now() - entry.timestamp > TTL_MS) return null;
  return entry.challenge;
}

// ── Authentication (keyed by random token returned to client) ─────────────

/**
 * Save an authentication challenge and return an opaque token for the client.
 */
export function setAuthChallenge(challenge: string): string {
  const token = randomUUID();
  store.set(token, { challenge, timestamp: Date.now() });
  return token;
}

/**
 * Consume the authentication challenge by its token.
 * Returns null if not found or expired.
 */
export function popAuthChallenge(token: string): string | null {
  const entry = store.get(token);
  store.delete(token);
  if (!entry || Date.now() - entry.timestamp > TTL_MS) return null;
  return entry.challenge;
}

// ── Cleanup ────────────────────────────────────────────────────────────────

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.timestamp > TTL_MS) store.delete(key);
  }
}, 60_000);
