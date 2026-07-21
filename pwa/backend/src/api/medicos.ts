import { Router } from 'express'
import { getPrismaClient } from '../database/connection'
import { regenerarHorariosMedico } from '../services/generarHorariosMedico'
import { authMiddleware } from '../middleware/auth'
import { requireSuperAdmin } from '../middleware/superAdmin'

const router = Router()
const prisma = getPrismaClient()

// Zona horaria de Venezuela (UTC-4)
const VENEZUELA_TIMEZONE = 'America/Caracas'

/**
 * Obtiene el día de la semana en zona horaria Caracas
 * Retorna: 0=Lunes, 1=Martes, ..., 4=Viernes, 5=Sábado, 6=Domingo
 */
function getDayOfWeekInVenezuela(date: Date): number {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: VENEZUELA_TIMEZONE,
    weekday: 'long',
  })

  const dayName = formatter.format(date)
  const days: { [key: string]: number } = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  }

  return days[dayName] || 0
}

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
 * Obtiene nombre del día en español
 */
function getDayNameInSpanish(dayNumber: number): string {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
  return days[dayNumber] || 'Desconocido'
}

/**
 * GET /api/medicos/especialidad/:especialidad
 * Obtiene lista de médicos que atienden una especialidad específica
 * con sus horarios disponibles
 */
router.get('/especialidad/:especialidad', async (req, res) => {
  try {
    const { especialidad } = req.params

    if (!especialidad) {
      return res.status(400).json({
        success: false,
        message: 'Especialidad requerida',
      })
    }

    const espDecoded = decodeURIComponent(especialidad).trim()

    // 1. Buscar médicos que coincidan por especialidad en Usuario, PersonalAutorizado o HorariosDisponibilidad
    let medicos = await prisma.usuario.findMany({
      where: {
        OR: [
          { role: 'MEDICO' },
          { role: 'DOCTOR' },
          { role: 'ADMIN' },
        ],
        AND: {
          OR: [
            { especialidad: { equals: espDecoded, mode: 'insensitive' } },
            { especialidad: { contains: espDecoded, mode: 'insensitive' } },
            {
              horariosDisponibilidad: {
                some: {
                  especialidad: { contains: espDecoded, mode: 'insensitive' },
                },
              },
            },
            {
              personalAutorizado: {
                especialidad: { contains: espDecoded, mode: 'insensitive' },
              },
            },
          ],
        },
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        especialidad: true,
        cargo: true,
        horariosDisponibilidad: {
          select: {
            id: true,
            especialidad: true,
            diaSemana: true,
            horaInicio: true,
            horaFin: true,
            capacidadPorDia: true,
            activo: true,
          },
        },
      },
      orderBy: {
        nombre: 'asc',
      },
    })

    if (medicos.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontraron médicos para la especialidad: ${especialidad}`,
        data: [],
      })
    }

    return res.status(200).json({
      success: true,
      message: `${medicos.length} médico(s) encontrado(s)`,
      data: medicos,
    })
  } catch (error: any) {
    console.error('Error al obtener médicos:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al obtener médicos disponibles',
      error: error.message,
    })
  }
})

/**
 * GET /api/medicos/:medicoId/disponibilidad
 * Obtiene disponibilidad de un médico en una fecha específica
 */
router.get('/:medicoId/disponibilidad', async (req, res) => {
  try {
    const { medicoId } = req.params
    const { fecha, especialidad } = req.query

    if (!fecha || !especialidad) {
      return res.status(400).json({
        success: false,
        message: 'Parámetros requeridos: fecha y especialidad',
      })
    }

    // Parsear fecha en formato YYYY-MM-DD
    // 🆕 CRITICAL FIX: The frontend sends "YYYY-MM-DD" which JavaScript interprets as UTC
    // But we need to interpret it as CARACAS local date, not UTC
    // Example: "2026-02-10" should mean 2026-02-10 00:00:00 in Caracas, 
    // which is 2026-02-10 04:00:00 UTC
    const [year, month, day] = (fecha as string).split('-').map(Number)
    const fechaCitaCorregida = new Date(Date.UTC(year, month - 1, day, 4, 0, 0))
    
    // Validar que sea una fecha válida
    if (isNaN(fechaCitaCorregida.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Formato de fecha inválido (YYYY-MM-DD)',
      })
    }

    // Obtener el día de la semana en zona horaria Venezuela
    const diaAjustado = getDayOfWeekInVenezuela(fechaCitaCorregida)
    
    // Si es sábado (5) o domingo (6), no hay atención
    if (diaAjustado > 4) {
      const horariosDisponibles = await prisma.horarioMedico.findMany({
        where: {
          usuarioId: Number(medicoId),
          especialidad: especialidad as string,
          activo: true,
        },
        select: {
          diaSemana: true,
          horaInicio: true,
          horaFin: true,
          capacidadPorDia: true,
        },
        orderBy: { diaSemana: 'asc' },
      })

      // Obtener días únicos (sin duplicados)
      const diasUnicos = Array.from(
        new Map(
          horariosDisponibles.map(h => [
            h.diaSemana,
            {
              dia: getDayNameInSpanish(h.diaSemana),
              diaSemana: h.diaSemana,
              horaInicio: h.horaInicio,
              horaFin: h.horaFin,
            },
          ])
        ).values()
      )

      return res.status(200).json({
        success: true,
        data: {
          medicoId: Number(medicoId),
          fecha: fecha as string,
          diaSemana: diaAjustado,
          atiendeSeDia: false,
          diasDisponibles: diasUnicos,
        },
      })
    }

    // Buscar horario del médico para ese día
    const horario = await prisma.horarioMedico.findFirst({
      where: {
        usuarioId: Number(medicoId),
        especialidad: especialidad as string,
        diaSemana: diaAjustado,
        activo: true,
      },
    })

    if (!horario) {
      // Buscar si el médico tiene algún otro horario personalizado registrado
      const horariosDisponibles = await prisma.horarioMedico.findMany({
        where: {
          usuarioId: Number(medicoId),
          activo: true,
        },
        select: {
          diaSemana: true,
          horaInicio: true,
          horaFin: true,
          capacidadPorDia: true,
        },
        orderBy: { diaSemana: 'asc' },
      })

      // Si el médico NO tiene ningún horario personalizado registrado en absoluto,
      // aplicar el HORARIO GENERAL POR DEFECTO DEL HOSPITAL (Lunes a Viernes 08:00 - 16:00)
      if (horariosDisponibles.length === 0) {
        const fechaStrDefault = getDateStringInVenezuela(fechaCitaCorregida)
        const citasExistentesDefault = await prisma.cita.count({
          where: {
            medicoId: Number(medicoId),
            fechaCita: new Date(fechaStrDefault),
            estado: { not: 'CANCELADA' },
          },
        })
        const capacidadDefault = 20

        return res.status(200).json({
          success: true,
          data: {
            medicoId: Number(medicoId),
            fecha: fecha as string,
            diaSemana: diaAjustado,
            atiendeSeDia: true,
            horaInicio: '08:00',
            horaFin: '16:00',
            capacidadTotal: capacidadDefault,
            citasYaProgramadas: citasExistentesDefault,
            espaciosDisponibles: Math.max(0, capacidadDefault - citasExistentesDefault),
          },
        })
      }

      // Si el médico SÍ tiene horarios personalizados en otros días, sugerir esas fechas
      const diasProximos = []
      const diasProcessados = new Set<number>()
      
      for (let i = 1; i <= 21; i++) {
        const proximaFecha = new Date(fechaCitaCorregida)
        proximaFecha.setDate(proximaFecha.getDate() + i)
        
        const proximoDia = getDayOfWeekInVenezuela(proximaFecha)

        if (proximoDia <= 4 && !diasProcessados.has(proximoDia)) {
          const horarioProximo = horariosDisponibles.find(h => h.diaSemana === proximoDia)
          
          if (horarioProximo) {
            const proximaFechaStr = getDateStringInVenezuela(proximaFecha)
            const citasCount = await prisma.cita.count({
              where: {
                medicoId: Number(medicoId),
                fechaCita: new Date(proximaFechaStr),
                estado: { not: 'CANCELADA' },
              },
            })

            const espacios = horarioProximo.capacidadPorDia - citasCount

            diasProximos.push({
              fecha: proximaFechaStr,
              dia: getDayNameInSpanish(proximoDia),
              espacios: Math.max(0, espacios),
            })
            
            diasProcessados.add(proximoDia)
          }
        }

        if (diasProximos.length >= 5) break
      }

      return res.status(200).json({
        success: true,
        data: {
          medicoId: Number(medicoId),
          fecha: fecha as string,
          diaSemana: diaAjustado,
          atiendeSeDia: false,
          diasDisponibles: diasProximos,
        },
      })
    }

    // Médico atiende ese día - Contar citas existentes
    const fechaStr = getDateStringInVenezuela(fechaCitaCorregida)
    const citasExistentes = await prisma.cita.count({
      where: {
        medicoId: Number(medicoId),
        fechaCita: new Date(fechaStr),
        estado: { not: 'CANCELADA' },
      },
    })

    const espaciosDisponibles = Math.max(0, horario.capacidadPorDia - citasExistentes)

    return res.status(200).json({
      success: true,
      data: {
        medicoId: Number(medicoId),
        fecha: fecha as string,
        diaSemana: diaAjustado,
        atiendeSeDia: true,
        horaInicio: horario.horaInicio,
        horaFin: horario.horaFin,
        capacidadTotal: horario.capacidadPorDia,
        citasYaProgramadas: citasExistentes,
        espaciosDisponibles,
      },
    })
  } catch (error: any) {
    console.error('❌ Error al verificar disponibilidad:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al verificar disponibilidad',
      error: error.message,
    })
  }
})

/**
 * POST /api/medicos/:medicoId/regenerar-horarios
 * Regenera/crea horarios por defecto para un médico
 * Útil para médicos registrados antes de esta funcionalidad
 */
router.post('/:medicoId/regenerar-horarios', async (req, res) => {
  try {
    const { medicoId } = req.params

    if (!medicoId) {
      return res.status(400).json({
        success: false,
        message: 'ID del médico requerido',
      })
    }

    const resultado = await regenerarHorariosMedico(Number(medicoId))

    if (!resultado.exitoso) {
      return res.status(400).json({
        success: false,
        message: resultado.mensaje,
        horariosCreados: resultado.horariosCreados,
      })
    }

    return res.status(200).json({
      success: true,
      message: resultado.mensaje,
      horariosCreados: resultado.horariosCreados,
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error al regenerar horarios',
      error: error.message,
    })
  }
})

/**
 * GET /api/medicos/:medicoId/horarios
 * Obtiene todos los horarios semanales de un médico
 */
router.get('/:medicoId/horarios', authMiddleware as any, requireSuperAdmin as any, async (req, res) => {
  try {
    const { medicoId } = req.params
    const medId = Number(medicoId)

    if (isNaN(medId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de médico inválido',
      })
    }

    const medico = await prisma.usuario.findUnique({
      where: { id: medId },
      select: { id: true, nombre: true, role: true, especialidad: true },
    })

    if (!medico) {
      return res.status(404).json({
        success: false,
        message: 'Médico no encontrado',
      })
    }

    if (medico.role !== 'MEDICO') {
      return res.status(400).json({
        success: false,
        message: 'El usuario no tiene el rol de médico',
      })
    }

    const horarios = await prisma.horarioMedico.findMany({
      where: { usuarioId: medId },
      orderBy: { diaSemana: 'asc' },
    })

    const serialized = horarios.map(h => ({
      ...h,
      id: Number(h.id),
      usuarioId: Number(h.usuarioId),
    }))

    return res.status(200).json({
      success: true,
      data: serialized,
      especialidad: medico.especialidad,
    })
  } catch (error: any) {
    console.error('❌ Error al obtener horarios del médico:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al obtener horarios',
      error: error.message,
    })
  }
})

/**
 * POST /api/medicos/:medicoId/horarios
 * Agrega un nuevo horario de atención para un médico
 */
router.post('/:medicoId/horarios', authMiddleware as any, requireSuperAdmin as any, async (req, res) => {
  try {
    const { medicoId } = req.params
    const medId = Number(medicoId)
    const { diaSemana, horaInicio, horaFin, capacidadPorDia, activo } = req.body

    if (isNaN(medId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de médico inválido',
      })
    }

    const medico = await prisma.usuario.findUnique({
      where: { id: medId },
      select: { id: true, nombre: true, role: true, especialidad: true },
    })

    if (!medico) {
      return res.status(404).json({
        success: false,
        message: 'Médico no encontrado',
      })
    }

    if (medico.role !== 'MEDICO') {
      return res.status(400).json({
        success: false,
        message: 'El usuario no es un médico registrado',
      })
    }

    if (!medico.especialidad) {
      return res.status(400).json({
        success: false,
        message: 'El médico no tiene una especialidad asignada en su cuenta',
      })
    }

    const day = Number(diaSemana)
    if (isNaN(day) || day < 0 || day > 6) {
      return res.status(400).json({
        success: false,
        message: 'El día de la semana debe ser un número entre 0 (Lunes) y 6 (Domingo)',
      })
    }

    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    if (!horaInicio || !timeRegex.test(horaInicio)) {
      return res.status(400).json({
        success: false,
        message: 'Hora de inicio inválida. Formato: HH:MM',
      })
    }

    if (!horaFin || !timeRegex.test(horaFin)) {
      return res.status(400).json({
        success: false,
        message: 'Hora de fin inválida. Formato: HH:MM',
      })
    }

    const [hInicio, mInicio] = horaInicio.split(':').map(Number)
    const [hFin, mFin] = horaFin.split(':').map(Number)
    const totalMinutosInicio = hInicio * 60 + mInicio
    const totalMinutosFin = hFin * 60 + mFin

    if (totalMinutosInicio >= totalMinutosFin) {
      return res.status(400).json({
        success: false,
        message: 'La hora de inicio debe ser estrictamente menor que la hora de fin',
      })
    }

    const cap = Number(capacidadPorDia)
    if (isNaN(cap) || cap <= 0) {
      return res.status(400).json({
        success: false,
        message: 'La capacidad por día debe ser un número entero mayor a cero',
      })
    }

    const existeHorario = await prisma.horarioMedico.findUnique({
      where: {
        usuarioId_especialidad_diaSemana: {
          usuarioId: medId,
          especialidad: medico.especialidad,
          diaSemana: day,
        },
      },
    })

    if (existeHorario) {
      return res.status(409).json({
        success: false,
        message: `Ya existe un horario configurado para este médico el día ${getDayNameInSpanish(day)}`,
      })
    }

    const nuevoHorario = await prisma.horarioMedico.create({
      data: {
        usuarioId: medId,
        especialidad: medico.especialidad,
        diaSemana: day,
        horaInicio,
        horaFin,
        capacidadPorDia: cap,
        activo: activo !== undefined ? Boolean(activo) : true,
      },
    })

    return res.status(201).json({
      success: true,
      message: 'Horario creado exitosamente',
      data: {
        ...nuevoHorario,
        id: Number(nuevoHorario.id),
        usuarioId: Number(nuevoHorario.usuarioId),
      },
    })
  } catch (error: any) {
    console.error('❌ Error al crear horario del médico:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al crear el horario',
      error: error.message,
    })
  }
})

/**
 * PUT /api/medicos/:medicoId/horarios/:horarioId
 * Modifica un horario de atención de un médico
 */
router.put('/:medicoId/horarios/:horarioId', authMiddleware as any, requireSuperAdmin as any, async (req, res) => {
  try {
    const { medicoId, horarioId } = req.params
    const medId = Number(medicoId)
    const horId = Number(horarioId)
    const { diaSemana, horaInicio, horaFin, capacidadPorDia, activo } = req.body

    if (isNaN(medId) || isNaN(horId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de médico o de horario inválido',
      })
    }

    const horarioExistente = await prisma.horarioMedico.findFirst({
      where: {
        id: horId,
        usuarioId: medId,
      },
    })

    if (!horarioExistente) {
      return res.status(404).json({
        success: false,
        message: 'Horario no encontrado para este médico',
      })
    }

    const dataUpdate: any = {}

    if (activo !== undefined) {
      dataUpdate.activo = Boolean(activo)
    }

    if (capacidadPorDia !== undefined) {
      const cap = Number(capacidadPorDia)
      if (isNaN(cap) || cap <= 0) {
        return res.status(400).json({
          success: false,
          message: 'La capacidad por día debe ser un número entero mayor a cero',
        })
      }
      dataUpdate.capacidadPorDia = cap
    }

    const nuevoDia = diaSemana !== undefined ? Number(diaSemana) : horarioExistente.diaSemana
    if (diaSemana !== undefined) {
      if (isNaN(nuevoDia) || nuevoDia < 0 || nuevoDia > 6) {
        return res.status(400).json({
          success: false,
          message: 'El día de la semana debe ser un número entre 0 y 6',
        })
      }
      dataUpdate.diaSemana = nuevoDia
    }

    const nuevaHoraInicio = horaInicio !== undefined ? horaInicio : horarioExistente.horaInicio
    const nuevaHoraFin = horaFin !== undefined ? horaFin : horarioExistente.horaFin
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/

    if (horaInicio !== undefined && !timeRegex.test(horaInicio)) {
      return res.status(400).json({
        success: false,
        message: 'Hora de inicio inválida. Formato esperado: HH:MM',
      })
    }

    if (horaFin !== undefined && !timeRegex.test(horaFin)) {
      return res.status(400).json({
        success: false,
        message: 'Hora de fin inválida. Formato esperado: HH:MM',
      })
    }

    if (horaInicio !== undefined || horaFin !== undefined) {
      const [hInicio, mInicio] = nuevaHoraInicio.split(':').map(Number)
      const [hFin, mFin] = nuevaHoraFin.split(':').map(Number)
      const totalMinutosInicio = hInicio * 60 + mInicio
      const totalMinutosFin = hFin * 60 + mFin

      if (totalMinutosInicio >= totalMinutosFin) {
        return res.status(400).json({
          success: false,
          message: 'La hora de inicio debe ser estrictamente menor que la hora de fin',
        })
      }
      dataUpdate.horaInicio = nuevaHoraInicio
      dataUpdate.horaFin = nuevaHoraFin
    }

    if (diaSemana !== undefined && nuevoDia !== horarioExistente.diaSemana) {
      const conflicto = await prisma.horarioMedico.findFirst({
        where: {
          usuarioId: medId,
          especialidad: horarioExistente.especialidad,
          diaSemana: nuevoDia,
          id: { not: horId },
        },
      })

      if (conflicto) {
        return res.status(409).json({
          success: false,
          message: `Ya existe un horario configurado para este médico el día ${getDayNameInSpanish(nuevoDia)}`,
        })
      }
    }

    const horarioActualizado = await prisma.horarioMedico.update({
      where: { id: horId },
      data: dataUpdate,
    })

    return res.status(200).json({
      success: true,
      message: 'Horario actualizado exitosamente',
      data: {
        ...horarioActualizado,
        id: Number(horarioActualizado.id),
        usuarioId: Number(horarioActualizado.usuarioId),
      },
    })
  } catch (error: any) {
    console.error('❌ Error al actualizar horario del médico:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al actualizar el horario',
      error: error.message,
    })
  }
})

/**
 * DELETE /api/medicos/:medicoId/horarios/:horarioId
 * Elimina un horario de atención de un médico
 */
router.delete('/:medicoId/horarios/:horarioId', authMiddleware as any, requireSuperAdmin as any, async (req, res) => {
  try {
    const { medicoId, horarioId } = req.params
    const medId = Number(medicoId)
    const horId = Number(horarioId)

    if (isNaN(medId) || isNaN(horId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de médico o de horario inválido',
      })
    }

    const horarioExistente = await prisma.horarioMedico.findFirst({
      where: {
        id: horId,
        usuarioId: medId,
      },
    })

    if (!horarioExistente) {
      return res.status(404).json({
        success: false,
        message: 'Horario no encontrado para este médico',
      })
    }

    await prisma.horarioMedico.delete({
      where: { id: horId },
    })

    return res.status(200).json({
      success: true,
      message: 'Horario eliminado exitosamente',
    })
  } catch (error: any) {
    console.error('❌ Error al eliminar horario del médico:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al eliminar el horario',
      error: error.message,
    })
  }
})

export default router
