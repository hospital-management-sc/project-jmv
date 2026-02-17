import { Router } from 'express'
import { getPrismaClient } from '../database/connection'
import { regenerarHorariosMedico } from '../services/generarHorariosMedico'

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

    // Buscar médicos con horarios activos en esa especialidad
    const medicos = await prisma.usuario.findMany({
      where: {
        role: 'MEDICO',
        horariosDisponibilidad: {
          some: {
            especialidad: especialidad,
            activo: true,
          },
        },
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        horariosDisponibilidad: {
          where: {
            especialidad: especialidad,
            activo: true,
          },
          select: {
            id: true,
            diaSemana: true,
            horaInicio: true,
            horaFin: true,
            capacidadPorDia: true,
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
    console.error('❌ Error al obtener médicos:', error)
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
    
    console.log(`🔍 DEBUG: Fecha seleccionada: ${fecha}, Día calculado: ${diaAjustado} (${getDayNameInSpanish(diaAjustado)}), Especialidad: ${especialidad}, Doctor: ${medicoId}`)
    
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

    console.log(`🔍 Horarios disponibles para doctor ${medicoId} en especialidad ${especialidad}:`)
    const todosHorarios = await prisma.horarioMedico.findMany({
      where: {
        usuarioId: Number(medicoId),
        especialidad: especialidad as string,
        activo: true,
      },
    })
    console.log(todosHorarios.map(h => `  - Día ${h.diaSemana} (${getDayNameInSpanish(h.diaSemana)}): ${h.horaInicio}-${h.horaFin}`))

    if (!horario) {
      console.log(`❌ No se encontró horario para día ${diaAjustado} (${getDayNameInSpanish(diaAjustado)})`)
    } else {
      console.log(`✅ Se encontró horario para día ${diaAjustado}`)
    }

    if (!horario) {
      // Obtener próximas fechas disponibles (próximos 21 días)
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

      const diasProximos = []
      const diasProcessados = new Set<number>() // 🆕 TRACK which weekdays we've already added
      
      // Generar próximas 21 fechas (3 semanas para mayor cobertura)
      for (let i = 1; i <= 21; i++) {
        const proximaFecha = new Date(fechaCitaCorregida)
        proximaFecha.setDate(proximaFecha.getDate() + i)
        
        const proximoDia = getDayOfWeekInVenezuela(proximaFecha)

        // Si no es fin de semana Y no hemos agregado este día de semana todavía
        if (proximoDia <= 4 && !diasProcessados.has(proximoDia)) {
          const horarioProximo = horariosDisponibles.find(h => h.diaSemana === proximoDia)
          
          if (horarioProximo) {
            // Contar citas ya programadas (usar fecha en zona horaria Caracas)
            const proximaFechaStr = getDateStringInVenezuela(proximaFecha)
            const citasCount = await prisma.cita.count({
              where: {
                medicoId: Number(medicoId),
                fechaCita: new Date(proximaFechaStr),
                estado: { not: 'CANCELADA' },
              },
            })

            const espacios = horarioProximo.capacidadPorDia - citasCount

            // Usar fecha en zona horaria Caracas para mostrar
            diasProximos.push({
              fecha: proximaFechaStr,
              dia: getDayNameInSpanish(proximoDia),
              espacios: Math.max(0, espacios),
            })
            
            // 🆕 Mark this weekday as processed (add only ONE instance per weekday)
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
    console.error('❌ Error al regenerar horarios:', error)
    return res.status(500).json({
      success: false,
      message: 'Error al regenerar horarios',
      error: error.message,
    })
  }
})

export default router
