/**
 * Authentication Service
 * 
 * Handles user authentication logic: login, register, token generation
 * 
 * SEGURIDAD CRÍTICA:
 * - El registro SOLO es posible para personal pre-autorizado en la whitelist
 * - Se valida CI, nombre y rol contra la tabla PersonalAutorizado
 * - Todas las operaciones se registran en auditoría
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getPrismaClient } from '../database/connection';
import { ValidationError, UnauthorizedError, InvalidCredentialsError } from '../types/responses';
import { verifyAuthorizedPersonnel, markAsRegistered, VALID_ROLES } from './authorizedPersonnel';
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
  role: string,
  especialidad?: string | null,
  departamento?: string | null
): string => {
  return jwt.sign(
    { id, email, role, especialidad: especialidad || undefined, departamento: departamento || undefined },
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
    throw new ValidationError('El correo electrónico y la contraseña son requeridos');
  }

  // Find user by email
  const user = await prisma.usuario.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    logger.warn(`Login attempt with non-existent email: ${email}`);
    throw new InvalidCredentialsError('Credenciales inválidas. Verifique su correo electrónico y contraseña.');
  }

  // Compare passwords
  const isPasswordValid = await comparePassword(password, user.password || '');

  if (!isPasswordValid) {
    logger.warn(`Failed login attempt for user: ${email}`);
    throw new InvalidCredentialsError('Credenciales inválidas. Verifique su correo electrónico y contraseña.');
  }

  // Generate token
  const token = generateToken(
    Number(user.id), 
    user.email || '', 
    user.role || '',
    user.especialidad,
    undefined // Departamento no está en Usuario, está en PersonalAutorizado
  );

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
 * 
 * SISTEMA DE SEGURIDAD (WHITELIST):
 * 1. Verifica que el CI exista en la tabla PersonalAutorizado
 * 2. Verifica que el personal esté ACTIVO y no haya vencido
 * 3. Verifica que el nombre coincida con los registros
 * 4. Verifica que el rol solicitado sea el autorizado
 * 5. Solo si todas las validaciones pasan, crea la cuenta
 */
export const registerUser = async (payload: RegisterPayload): Promise<TokenResponse> => {
  const { nombre, email, password, ci, role } = payload;

  // ============================================
  // VALIDACIONES BÁSICAS DE FORMATO
  // ============================================
  
  if (!nombre || !email || !password || !ci) {
    throw new ValidationError('Nombre, email, C.I. y contraseña son requeridos');
  }

  if (password.length < 6) {
    throw new ValidationError('La contraseña debe tener al menos 6 caracteres');
  }

  // Validate C.I. format (Venezuelan ID: Letter V/E/P + 7-9 digits)
  const ciRegex = /^[VEP]\d{7,9}$/;
  const ciNormalized = ci.toUpperCase();
  if (!ciRegex.test(ciNormalized)) {
    throw new ValidationError('Formato de C.I. inválido. Debe comenzar con V, E o P seguido de 7-9 dígitos (Ejemplo: V12345678)');
  }

  // Validate role format
  const roleToUse = role || 'MEDICO';
  if (!VALID_ROLES.includes(roleToUse as any)) {
    throw new ValidationError(`Rol inválido. Roles válidos: ${VALID_ROLES.join(', ')}`);
  }

  // ============================================
  // VERIFICACIÓN DE WHITELIST (CRÍTICO)
  // ============================================
  
  logger.info(`[AUTH] Iniciando verificación de whitelist para CI: ${ciNormalized}`);
  
  const verificationResult = await verifyAuthorizedPersonnel(
    ciNormalized,
    nombre,
    roleToUse
  );

  // Si no está autorizado, RECHAZAR el registro
  if (!verificationResult.isAuthorized) {
    logger.security(`[AUTH] Registro RECHAZADO para ${ciNormalized}: ${verificationResult.errorCode}`);
    throw new UnauthorizedError(
      verificationResult.errorMessage || 'No está autorizado para registrarse en el sistema'
    );
  }

  logger.info(`[AUTH] Verificación de whitelist EXITOSA para: ${ciNormalized}`);

  // ============================================
  // VALIDACIONES DE UNICIDAD EN BASE DE DATOS
  // ============================================

  // Check if email already exists
  const existingUser = await prisma.usuario.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new ValidationError('Este email ya está registrado en el sistema');
  }

  // Check if CI already exists
  const userWithCi = await prisma.usuario.findUnique({
    where: { ci: ciNormalized },
  });

  if (userWithCi) {
    throw new ValidationError('Esta cédula ya está registrada en el sistema');
  }

  // ============================================
  // CREACIÓN DE USUARIO
  // ============================================

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Get additional data from whitelist record
  const personnelRecord = verificationResult.personnelRecord;

  // Create user with data from whitelist
  const newUser = await prisma.usuario.create({
    data: {
      nombre: personnelRecord?.nombreCompleto || nombre, // Usar nombre oficial de la whitelist
      email: email.toLowerCase(),
      password: hashedPassword,
      ci: ciNormalized,
      role: personnelRecord?.rolAutorizado || roleToUse, // Usar rol de la whitelist
      especialidad: personnelRecord?.departamento || undefined, // Usar departamento como especialidad de la whitelist (si aplica)
      cargo: personnelRecord?.cargo || null,
    },
  });

  // ============================================
  // ACTUALIZAR WHITELIST Y AUDITORÍA
  // ============================================

  // Mark as registered in whitelist
  await markAsRegistered(ciNormalized, newUser.id);

  // Register in audit log
  await prisma.auditLog.create({
    data: {
      tabla: 'Usuario',
      registroId: newUser.id,
      usuarioId: newUser.id,
      accion: 'REGISTER',
      detalle: {
        ci: ciNormalized,
        email: email.toLowerCase(),
        role: newUser.role,
        whitelistVerified: true,
        personalAutorizadoId: personnelRecord?.id ? Number(personnelRecord.id) : null,
      },
    },
  });

  // Generate token
  const token = generateToken(
    Number(newUser.id), 
    newUser.email || '', 
    newUser.role || '',
    newUser.especialidad,
    personnelRecord?.departamento
  );

  logger.info(`[AUTH] Nuevo usuario registrado exitosamente: ${email} (CI: ${ciNormalized})`);

  return {
    id: Number(newUser.id),
    nombre: newUser.nombre,
    email: newUser.email || '',
    role: newUser.role || '',
    token,
  };
};

/**
 * Reset user password
 * Validates email + CI before allowing password change
 */
export const resetPasswordUser = async (payload: {
  email: string;
  ci: string;
  newPassword: string;
}): Promise<void> => {
  const { email, ci, newPassword } = payload;

  // Validation
  if (!email || !ci || !newPassword) {
    throw new ValidationError('Email, C.I., and new password are required');
  }

  // Normalize inputs
  const emailNormalized = email.toLowerCase().trim();
  const ciNormalized = ci.toUpperCase().trim();

  // Find user by email AND CI (dual verification)
  const user = await prisma.usuario.findFirst({
    where: {
      email: emailNormalized,
      ci: ciNormalized,
    },
  });

  if (!user) {
    logger.warn(`Password reset attempt with invalid credentials: ${emailNormalized} / ${ciNormalized}`);
    throw new UnauthorizedError(
      'No se encontró ningún usuario con ese correo y cédula. Verifique los datos ingresados.'
    );
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  await prisma.usuario.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  logger.info(`[AUTH] Password reset successful for user: ${user.email} (ID: ${user.id})`);

  // Log audit trail
  await prisma.auditLog.create({
    data: {
      usuarioId: user.id,
      tabla: 'Usuario',
      registroId: user.id,
      accion: 'PASSWORD_RESET',
      detalle: {
        message: 'Password reset via forgot-password flow',
        email: user.email,
        timestamp: new Date().toISOString(),
      },
    },
  });
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
