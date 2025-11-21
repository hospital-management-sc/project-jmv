import { Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Obtener estadísticas del dashboard en tiempo real
 * GET /api/dashboard/stats
 */
export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Obtener fecha de hoy sin hora
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    // Ejecutar todas las queries en paralelo para mejor performance
    const [totalPacientes, citasProgramadasHoy, registrosAuditoria] = await Promise.all([
      // 1. Total de pacientes registrados
      prisma.paciente.count(),

      // 2. Citas programadas para hoy
      prisma.cita.count({
        where: {
          fechaCita: {
            gte: hoy,
            lt: new Date(hoy.getTime() + 24 * 60 * 60 * 1000), // Hasta mañana a las 00:00
          },
          estado: 'PROGRAMADA',
        },
      }),

      // 3. Registros de auditoría de hoy
      prisma.auditLog.count({
        where: {
          creadoEn: {
            gte: hoy,
            lt: new Date(hoy.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      }),
    ])

    res.status(200).json({
      success: true,
      data: {
        totalPacientes,
        citasProgramadasHoy,
        registrosAuditoria,
      },
    })
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error)
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas del dashboard',
      error: error.message,
    })
  }
}

interface Request {
  body?: any
}
