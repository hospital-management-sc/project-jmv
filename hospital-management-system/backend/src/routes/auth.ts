/**
 * Authentication Routes
 */

import { Router } from 'express';
import { login, register, getCurrentUser } from '../controllers/auth';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public endpoints
router.post('/login', login);
router.post('/register', register);

// Protected endpoints
router.get('/me', authMiddleware, getCurrentUser);

export default router;
