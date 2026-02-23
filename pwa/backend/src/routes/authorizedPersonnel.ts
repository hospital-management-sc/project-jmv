/**
 * Authorized Personnel Routes
 * 
 * Rutas para gestionar la whitelist de personal autorizado.
 * TODOS los endpoints requieren autenticación y rol SUPER_ADMIN.
 */

import { Router } from 'express';
import {
  getAll,
  getStats,
  getByCI,
  create,
  update,
  deactivate,
  bulkCreate,
} from '../controllers/authorizedPersonnel';
import { authMiddleware } from '../middleware/auth';
import { requireSuperAdmin, requireSuperAdminWithAudit } from '../middleware/superAdmin';

const router = Router();

// ============================================
// ENDPOINTS DE CONSULTA - Requieren SUPER_ADMIN
// ============================================

/**
 * GET /api/authorized-personnel
 * Lista todo el personal autorizado con filtros opcionales
 * Query params: estado, rol, registrado, departamento
 */
router.get('/', authMiddleware, requireSuperAdmin, getAll);

/**
 * GET /api/authorized-personnel/stats
 * Obtiene estadísticas de la whitelist
 */
router.get('/stats', authMiddleware, requireSuperAdmin, getStats);

/**
 * GET /api/authorized-personnel/:ci
 * Obtiene un registro específico por CI
 */
router.get('/:ci', authMiddleware, requireSuperAdmin, getByCI);

// ============================================
// ENDPOINTS DE MODIFICACIÓN - Requieren SUPER_ADMIN + AUDITORÍA
// ============================================

/**
 * POST /api/authorized-personnel
 * Agrega nuevo personal a la whitelist
 * Body: { ci, nombreCompleto, email?, rolAutorizado, departamento?, cargo?, fechaIngreso, fechaVencimiento? }
 */
router.post('/', authMiddleware, requireSuperAdminWithAudit, create);

/**
 * POST /api/authorized-personnel/bulk
 * Carga masiva de personal autorizado (máx 100 registros)
 * Body: { personnel: [{ ci, nombreCompleto, ... }] }
 */
router.post('/bulk', authMiddleware, requireSuperAdminWithAudit, bulkCreate);

/**
 * PUT /api/authorized-personnel/:ci
 * Actualiza un registro existente
 * Body: campos a actualizar
 */
router.put('/:ci', authMiddleware, requireSuperAdminWithAudit, update);

/**
 * DELETE /api/authorized-personnel/:ci
 * Da de baja a un personal (no elimina, cambia estado)
 * Body: { motivoBaja: string }
 */
router.delete('/:ci', authMiddleware, requireSuperAdminWithAudit, deactivate);

export default router;
