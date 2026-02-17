import { Response } from 'express'
import { getPrismaClient } from '../database/connection'

const prisma = getPrismaClient()

// Zona horaria de Venezuela (UTC-4)
const VENEZUELA_TIMEZONE = 'America/Caracas'

/**
 * Obtiene la fecha en formato YYYY-MM-DD en zona horaria Caracas
 */
function getDateStringInVenezuela(date: Date): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: VENEZUELA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(date)
}

/**
 * Obtiene la fecha de hoy en zona horaria Caracas
 */
function getTodayInVenezuela(): { startOfDay: Date; endOfDay: Date } {
  const today = getDateStringInVenezuela(new Date())
  const [year, month, day] = today.split('-').map(Number)
  
  // Crear fecha en UTC para el inicio del día en Caracas
  const startOfDay = new Date(Date.UTC(year, month - 1, day, 4, 0, 0, 0)) // 00:00 Caracas = 04:00 UTC
  const endOfDay = new Date(Date.UTC(year, month - 1, day, 27, 59, 59, 999)) // 23:59 Caracas = 03:59 UTC del próximo día
  
  return { startOfDay, endOfDay }
}

/**
 * Obtener estadísticas del dashboard en tiempo real
 * GET /api/dashboard/stats
 */
export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Obtener fecha de hoy en zona horaria Caracas
    const { startOfDay, endOfDay } = getTodayInVenezuela()

    // Ejecutar todas las queries en paralelo para mejor performance
    const [
      totalPacientes,
      pacientesMilitares,
      pacientesAfiliados,
      pacientesPNA,
      citasProgramadasHoy,
      registrosAuditoria,
      pacientesHospitalizados,
      pacientesEnEmergencia,
      emergenciasPendientesHospitalizacion,
    ] = await Promise.all([
      // 1. Total de pacientes registrados
      prisma.paciente.count(),

      // 2. Pacientes militares
      prisma.paciente.count({
        where: { tipoPaciente: 'MILITAR' }
      }),

      // 3. Pacientes afiliados
      prisma.paciente.count({
        where: { tipoPaciente: 'AFILIADO' }
      }),

      // 4. Pacientes PNA (No Afiliados)
      prisma.paciente.count({
        where: { tipoPaciente: 'PNA' }
      }),

      // 5. Citas programadas para hoy
      prisma.cita.count({
        where: {
          fechaCita: {
            gte: startOfDay,
            lte: endOfDay,
          },
          estado: 'PROGRAMADA',
        },
      }),

      // 6. Registros de auditoría de hoy
      prisma.auditLog.count({
        where: {
          creadoEn: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),

      // 7. Pacientes hospitalizados actualmente
      prisma.admision.count({
        where: {
          estado: 'ACTIVA',
          tipo: {
            in: ['HOSPITALIZACION', 'UCI', 'CIRUGIA'],
          },
        },
      }),

      // 8. Pacientes en emergencia actualmente
      prisma.admision.count({
        where: {
          estado: 'ACTIVA',
          tipo: 'EMERGENCIA',
        },
      }),

      // 9. Emergencias pendientes de hospitalización
      prisma.admision.count({
        where: {
          estado: 'ACTIVA',
          tipo: 'EMERGENCIA',
          formatoEmergencia: {
            requiereHospitalizacion: true,
          },
        },
      }),
    ])

    res.status(200).json({
      success: true,
      data: {
        totalPacientes,
        pacientesMilitares,
        pacientesAfiliados,
        pacientesPNA,
        citasProgramadasHoy,
        registrosAuditoria,
        pacientesHospitalizados,
        pacientesEnEmergencia,
        emergenciasPendientesHospitalizacion,
      },
    })
  } catch (error: any) {
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
