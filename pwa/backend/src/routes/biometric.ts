/**
 * Biometric Authentication Routes
 */

import { Router } from 'express';
import {
  getBiometricCredentialsHandler,
  initiateBiometricRegistration,
  verifyBiometricCredential,
  renameBiometricCredentialHandler,
  deleteBiometricCredentialHandler,
  initiateAuthentication,
  verifyAuthentication,
} from '../controllers/biometric';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Registration flow (requires authentication)
router.post('/register/initiate', authMiddleware, initiateBiometricRegistration);
router.post('/register/verify', authMiddleware, verifyBiometricCredential);

// Authentication flow (public initial, no auth required for initiate)
router.post('/authenticate/initiate', initiateAuthentication);
router.post('/authenticate/verify', verifyAuthentication);

// Credential management (requires authentication)
router.use(authMiddleware);

router.get('/credentials', getBiometricCredentialsHandler);
router.patch('/credentials/:credentialId', renameBiometricCredentialHandler);
router.delete('/credentials/:credentialId', deleteBiometricCredentialHandler);

export default router;
