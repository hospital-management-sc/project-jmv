import { Router } from 'express'
import { getDashboardStats } from '../controllers/dashboard'

const router = Router()

/**
 * GET /api/dashboard/stats
 * Obtener estadísticas en tiempo real del dashboard
 */
router.get('/stats', getDashboardStats)

export default router
