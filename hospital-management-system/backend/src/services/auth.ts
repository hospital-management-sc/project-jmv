/**
 * Authentication Service
 * 
 * Handles user authentication logic: login, register, token generation
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getPrismaClient } from '../database/connection';
import { ValidationError, UnauthorizedError } from '../types/responses';
import config from '../config';
import logger from '../utils/logger';

const prisma = getPrismaClient();
const JWT_SECRET = config.jwtSecret;
const JWT_EXPIRY = config.jwtExpiry;

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  nombre: string;
  email: string;
  password: string;
  ci?: string;
  role?: string;
}

interface TokenResponse {
  id: number;
  nombre: string;
  email: string;
  role: string;
  token: string;
  refreshToken?: string;
}

/**
 * Generate JWT token
 */
export const generateToken = (
  id: number,
  email: string,
  role: string
): string => {
  return jwt.sign(
    { id, email, role },
    JWT_SECRET as string,
    { expiresIn: JWT_EXPIRY as any }
  );
};

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Login user
 */
export const loginUser = async (payload: LoginPayload): Promise<TokenResponse> => {
  const { email, password } = payload;

  // Validation
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  // Find user by email
  const user = await prisma.usuario.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    logger.warn(`Login attempt with non-existent email: ${email}`);
    throw new UnauthorizedError('Invalid email or password');
  }

  // Compare passwords
  const isPasswordValid = await comparePassword(password, user.password || '');

  if (!isPasswordValid) {
    logger.warn(`Failed login attempt for user: ${email}`);
    throw new UnauthorizedError('Invalid email or password');
  }

  // Generate token
  const token = generateToken(Number(user.id), user.email || '', user.role || '');

  logger.info(`User logged in successfully: ${email}`);

  return {
    id: Number(user.id),
    nombre: user.nombre,
    email: user.email || '',
    role: user.role || '',
    token,
  };
};

/**
 * Register new user
 */
export const registerUser = async (payload: RegisterPayload): Promise<TokenResponse> => {
  const { nombre, email, password, ci, role } = payload;

  // Validation
  if (!nombre || !email || !password) {
    throw new ValidationError('Name, email, and password are required');
  }

  if (password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters long');
  }

  // Check if email already exists
  const existingUser = await prisma.usuario.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new ValidationError('Email is already registered');
  }

  // Check if CI already exists (if provided)
  if (ci) {
    const userWithCi = await prisma.usuario.findUnique({
      where: { ci },
    });

    if (userWithCi) {
      throw new ValidationError('CI is already registered');
    }
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const newUser = await prisma.usuario.create({
    data: {
      nombre,
      email: email.toLowerCase(),
      password: hashedPassword,
      ci: ci || null,
      role: role || 'USUARIO', // Default role
    },
  });

  // Generate token
  const token = generateToken(Number(newUser.id), newUser.email || '', newUser.role || '');

  logger.info(`New user registered: ${email}`);

  return {
    id: Number(newUser.id),
    nombre: newUser.nombre,
    email: newUser.email || '',
    role: newUser.role || '',
    token,
  };
};

/**
 * Verify token validity
 */
export const verifyToken = (token: string): boolean => {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
};
