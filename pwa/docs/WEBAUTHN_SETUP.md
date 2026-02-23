# WebAuthn Configuration Guide

## Overview
WebAuthn (Web Authentication) / FIDO2 is implemented for biometric device registration and authentication in the Hospital Management PWA.

## Backend Setup

### Environment Variables
Add these to your `.env` file in `pwa/backend/`:

```bash
# WebAuthn Configuration - Relying Party Identifier
WEBAUTHN_RP_ID=localhost  # Change to your domain in production (e.g., hospital.com)

# WebAuthn Origin - Full URL for verification
WEBAUTHN_ORIGIN=http://localhost:5173  # Change to https://yourdomain.com in production
```

**Important:**
- `WEBAUTHN_RP_ID` must match the domain users access the app from
- For production, use only the domain without `https://` or `www.`
- `WEBAUTHN_ORIGIN` must be the complete URL including protocol

### Backend Dependencies
```bash
npm install @simplewebauthn/server
```

### Database
The `BiometricCredential` table stores:
- `credentialId`: Unique WebAuthn credential identifier
- `publicKey`: User's public key (base64 encoded)
- `signCount`: Counter for cloning detection
- `deviceName`: User-friendly device name
- `lastAccessedAt`: Timestamp of last use
- Additional metadata for audit and support

## Frontend Setup

### Environment Variables
Add these to your `.env.local` file in `pwa/frontend/`:

```bash
# WebAuthn Configuration - Match backend settings
VITE_WEBAUTHN_RP_ID=localhost  # Change to your domain
VITE_WEBAUTHN_ORIGIN=http://localhost:5173  # Full origin URL
```

### Frontend Dependencies
```bash
npm install @simplewebauthn/browser
```

### Configuration
See `src/config/webauthn.config.ts` for detailed configuration options:
- Attestation preference
- User verification requirement
- Resident key settings
- Authenticator attachment type
- Supported algorithms

## Security Considerations

### 1. Sign Count Validation
- Backend validates sign count to detect credential cloning
- If sign count decreases, authentication is rejected

### 2. Challenge Storage
- Registration/authentication challenges are time-limited
- Stored in session or Redis (NOT in JWT)
- Cleared after successful verification

### 3. Public Key Storage
- Public keys are stored base64-encoded
- Never stored in plaintext
- Can be revoked independently

### 4. HTTPS Requirement
- WebAuthn **requires HTTPS** in production
- Localhost HTTP is allowed for development
- Set `WEBAUTHN_ORIGIN` to `https://` URL in production

## API Endpoints

### Registration Flow
```
POST /api/biometric/register/initiate
  - Returns WebAuthn registration options
  - Returns challenge for credential creation

POST /api/biometric/register/verify
  - Verifies credential response from browser
  - Stores public key and credential metadata
```

### Authentication Flow
```
POST /api/biometric/authenticate/initiate
  - Returns WebAuthn authentication options
  - Returns challenge for credential assertion

POST /api/biometric/authenticate/verify
  - Verifies assertion response from browser
  - Updates last access information
  - Returns user data for JWT generation
```

### Management
```
GET /api/biometric/credentials
  - Lists all registered devices

PATCH /api/biometric/credentials/:credentialId
  - Rename device

DELETE /api/biometric/credentials/:credentialId
  - Revoke device access
```

## Supported Authenticators

### Platform Authenticators (Built-in)
- ✅ Face ID (iPhone, iPad, Mac)
- ✅ Touch ID (iPhone, iPad, Mac)
- ✅ Windows Hello (Windows)
- ✅ Android Biometric (Android 9+)

### Cross-Platform Authenticators (External)
- ✅ FIDO2 USB Keys (YubiKey, etc.)
- ✅ Roaming Credentials (Passkeys from other devices)
- ✅ NFC Keys

## Testing

### Local Development
1. Use `localhost` as RP_ID and Origin
2. Test with your device's biometric authentication
3. Simulate authentication across tabs/browsers for multi-device testing

### Production Testing
1. Update `WEBAUTHN_RP_ID` to your domain
2. Ensure `WEBAUTHN_ORIGIN` uses `https://`
3. Test with real devices and biometric authenticators

## Troubleshooting

### Error: "WebAuthn not supported"
- Browser doesn't support WebAuthn API
- Solution: Use a modern browser (Chrome 60+, Safari 13+, Firefox 60+, Edge 18+)

### Error: "Platform authenticator not available"
- Device doesn't have biometric hardware
- Solution: Test on a device with biometric capability (Face ID, Touch ID, fingerprint, etc.)

### Error: "Origin mismatch"
- Frontend and backend RP_ID/Origin don't match
- Solution: Ensure both are configured correctly in `.env` files

### Error: "Sign count mismatch"
- Possible credential cloning detected
- Solution: Verify device hasn't been compromised; contact administrator

## References
- [WebAuthn MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebAuthn_API)
- [SimpleWebAuthn Library](https://simplewebauthn.dev/)
- [FIDO2 Specifications](https://fidoalliance.org/fido2/)
