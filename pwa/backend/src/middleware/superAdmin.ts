/**
 * Super Admin Authorization Middleware
 * 
 * Middleware para validar que solo SUPER_ADMIN puede acceder a endpoints sensibles.
 * Esta es una capa de seguridad crítica que se ejecuta ANTES de cualquier controlador.
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import logger from '../utils/logger';

/**
 * Middleware que verifica que el usuario sea SUPER_ADMIN
 * 
 * IMPORTANTE: Este middleware debe ser aplicado a TODOS los endpoints
 * que modifiquen la whitelist de personal autorizado.
 * 
 * Uso:
 * router.post('/authorized-personnel', requireSuperAdmin, controller)
 */
export const requireSuperAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // Verificar que el usuario esté autenticado
  if (!req.user) {
    logger.security('[SECURITY] Intento de acceso sin autenticación a endpoint SUPER_ADMIN');
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Se requiere autenticación para acceder a este recurso',
    });
    return;
  }

  // Verificar que el rol sea SUPER_ADMIN
  if (req.user.role !== 'SUPER_ADMIN') {
    logger.security(
      `[SECURITY] Intento de acceso no autorizado a SUPER_ADMIN endpoint\n` +
      `Usuario ID: ${req.user.id}\n` +
      `Email: ${req.user.email}\n` +
      `Rol: ${req.user.role}\n` +
      `IP: ${req.ip}\n` +
      `Ruta: ${req.method} ${req.path}`
    );

    res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Solo SUPER_ADMIN puede acceder a este recurso. Tu intento ha sido registrado.',
    });
    return;
  }

  // Log de acceso exitoso
  logger.info(`[SUPER_ADMIN] Usuario ${req.user.email} (ID: ${req.user.id}) accedió a ${req.method} ${req.path}`);

  next();
};

/**
 * Middleware que verifica que el usuario sea SUPER_ADMIN Y registra la acción
 * para auditoría (incluye IP origen)
 * 
 * IMPORTANTE: Este middleware debe ser usado para operaciones críticas
 * como CREATE, UPDATE, DELETE de personal autorizado.
 */
export const requireSuperAdminWithAudit = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // Primero ejecutar validación base
  if (!req.user) {
    logger.security('[SECURITY] Intento de acceso sin autenticación a endpoint SUPER_ADMIN');
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Se requiere autenticación para acceder a este recurso',
    });
    return;
  }

  if (req.user.role !== 'SUPER_ADMIN') {
    logger.security(
      `[SECURITY] Intento de acceso NO AUTORIZADO a endpoint crítico SUPER_ADMIN\n` +
      `ACCIÓN: ${req.method} ${req.path}\n` +
      `Usuario ID: ${req.user.id}\n` +
      `Email: ${req.user.email}\n` +
      `Rol: ${req.user.role}\n` +
      `IP: ${req.ip}\n` +
      `User Agent: ${req.get('user-agent')}`
    );

    res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Solo SUPER_ADMIN puede realizar esta acción. Este intento ha sido registrado.',
    });
    return;
  }

  // Adjuntar información de auditoría al request
  (req as any).auditInfo = {
    superAdminId: req.user.id,
    superAdminEmail: req.user.email,
    accion: `${req.method} ${req.path}`,
    timestamp: new Date(),
    ipOrigen: req.ip,
    userAgent: req.get('user-agent'),
  };

  logger.info(
    `[SUPER_ADMIN - CRÍTICO] Usuario ${req.user.email} iniciando operación\n` +
    `Acción: ${req.method} ${req.path}\n` +
    `IP: ${req.ip}`
  );

  next();
};
