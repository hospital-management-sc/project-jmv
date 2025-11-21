import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Función auxiliar para convertir BigInt a string
function convertBigIntToString(obj: any): any {
  if (obj === null || obj === undefined) return obj
  if (typeof obj === 'bigint') return obj.toString()
  if (Array.isArray(obj)) return obj.map(item => convertBigIntToString(item))
  if (typeof obj === 'object') {
    const converted: any = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        converted[key] = convertBigIntToString(obj[key])
      }
    }
    return converted
  }
  return obj
}

/**
 * Crear una nueva cita médica
 * POST /api/citas
 */
export const crearCita = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pacienteId, medicoId, fechaCita, horaCita, especialidad, motivo, notas } = req.body

    // Validar campos requeridos
    if (!pacienteId || !fechaCita || !especialidad) {
      res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: pacienteId, fechaCita, especialidad',
      })
      return
    }

    // Validar que el paciente exista
    const pacienteExiste = await prisma.paciente.findUnique({
      where: { id: BigInt(pacienteId) },
    })

    if (!pacienteExiste) {
      res.status(404).json({
        success: false,
        message: 'El paciente no existe',
      })
      return
    }

    // Validar que el médico exista si se proporciona
    if (medicoId) {
      const medicoExiste = await prisma.usuario.findUnique({
        where: { id: BigInt(medicoId) },
      })

      if (!medicoExiste) {
        res.status(404).json({
          success: false,
          message: 'El médico no existe',
        })
        return
      }
    }

    // Crear la cita
    const cita = await prisma.cita.create({
      data: {
        pacienteId: BigInt(pacienteId),
        medicoId: medicoId ? BigInt(medicoId) : null,
        fechaCita: new Date(fechaCita),
        horaCita: horaCita ? new Date(`1970-01-01T${horaCita}:00`) : null,
        especialidad,
        motivo: motivo || null,
        notas: notas || null,
        estado: 'PROGRAMADA',
      },
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
            ci: true,
          },
        },
        medico: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    })

    res.status(201).json({
      success: true,
      message: 'Cita creada exitosamente',
      data: convertBigIntToString(cita),
    })
  } catch (error: any) {
    console.error('Error al crear cita:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear la cita',
    })
  }
}

/**
 * Obtener citas de un paciente
 * GET /api/citas/paciente/:pacienteId
 */
export const obtenerCitasPorPaciente = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pacienteId } = req.params
    const { estado } = req.query

    // Validar que el paciente exista
    const pacienteExiste = await prisma.paciente.findUnique({
      where: { id: BigInt(pacienteId) },
    })

    if (!pacienteExiste) {
      res.status(404).json({
        success: false,
        message: 'El paciente no existe',
      })
      return
    }

    // Construir filtro
    const where: any = { pacienteId: BigInt(pacienteId) }
    if (estado) {
      where.estado = estado as string
    }

    const citas = await prisma.cita.findMany({
      where,
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
            ci: true,
          },
        },
        medico: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
      orderBy: { fechaCita: 'desc' },
    })

    res.json({
      success: true,
      data: convertBigIntToString(citas),
    })
  } catch (error: any) {
    console.error('Error al obtener citas:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener citas',
    })
  }
}

/**
 * Obtener citas por médico
 * GET /api/citas/medico/:medicoId
 */
export const obtenerCitasPorMedico = async (req: Request, res: Response): Promise<void> => {
  try {
    const { medicoId } = req.params
    const { estado, fecha } = req.query

    // Validar que el médico exista
    const medicoExiste = await prisma.usuario.findUnique({
      where: { id: BigInt(medicoId) },
    })

    if (!medicoExiste) {
      res.status(404).json({
        success: false,
        message: 'El médico no existe',
      })
      return
    }

    // Construir filtro
    const where: any = { medicoId: BigInt(medicoId) }
    if (estado) {
      where.estado = estado as string
    }
    if (fecha) {
      const fechaDate = new Date(fecha as string)
      where.fechaCita = {
        gte: new Date(fechaDate.getFullYear(), fechaDate.getMonth(), fechaDate.getDate()),
        lt: new Date(fechaDate.getFullYear(), fechaDate.getMonth(), fechaDate.getDate() + 1),
      }
    }

    const citas = await prisma.cita.findMany({
      where,
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
            ci: true,
          },
        },
        medico: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
      orderBy: { fechaCita: 'asc' },
    })

    res.json({
      success: true,
      data: convertBigIntToString(citas),
    })
  } catch (error: any) {
    console.error('Error al obtener citas por médico:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener citas',
    })
  }
}

/**
 * Obtener una cita específica
 * GET /api/citas/:id
 */
export const obtenerCita = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params

    const cita = await prisma.cita.findUnique({
      where: { id: BigInt(id) },
      include: {
        paciente: true,
        medico: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    })

    if (!cita) {
      res.status(404).json({
        success: false,
        message: 'Cita no encontrada',
      })
      return
    }

    res.json({
      success: true,
      data: convertBigIntToString(cita),
    })
  } catch (error: any) {
    console.error('Error al obtener cita:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener cita',
    })
  }
}

/**
 * Actualizar una cita
 * PUT /api/citas/:id
 */
export const actualizarCita = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { fechaCita, horaCita, especialidad, motivo, estado, notas } = req.body

    const citaExiste = await prisma.cita.findUnique({
      where: { id: BigInt(id) },
    })

    if (!citaExiste) {
      res.status(404).json({
        success: false,
        message: 'Cita no encontrada',
      })
      return
    }

    const cita = await prisma.cita.update({
      where: { id: BigInt(id) },
      data: {
        ...(fechaCita && { fechaCita: new Date(fechaCita) }),
        ...(horaCita && { horaCita: new Date(`1970-01-01T${horaCita}:00`) }),
        ...(especialidad && { especialidad }),
        ...(motivo !== undefined && { motivo }),
        ...(estado && { estado }),
        ...(notas !== undefined && { notas }),
      },
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
            ci: true,
          },
        },
        medico: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    })

    res.json({
      success: true,
      message: 'Cita actualizada exitosamente',
      data: convertBigIntToString(cita),
    })
  } catch (error: any) {
    console.error('Error al actualizar cita:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar cita',
    })
  }
}

/**
 * Cancelar una cita
 * PATCH /api/citas/:id/cancelar
 */
export const cancelarCita = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { motivo } = req.body

    const citaExiste = await prisma.cita.findUnique({
      where: { id: BigInt(id) },
    })

    if (!citaExiste) {
      res.status(404).json({
        success: false,
        message: 'Cita no encontrada',
      })
      return
    }

    if (citaExiste.estado === 'CANCELADA') {
      res.status(400).json({
        success: false,
        message: 'La cita ya está cancelada',
      })
      return
    }

    const cita = await prisma.cita.update({
      where: { id: BigInt(id) },
      data: {
        estado: 'CANCELADA',
        notas: motivo ? `Cancelada: ${motivo}` : 'Cancelada por usuario',
      },
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
            ci: true,
          },
        },
      },
    })

    res.json({
      success: true,
      message: 'Cita cancelada exitosamente',
      data: convertBigIntToString(cita),
    })
  } catch (error: any) {
    console.error('Error al cancelar cita:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al cancelar cita',
    })
  }
}

/**
 * Listar citas próximas (no realizadas)
 * GET /api/citas/lista/proximas
 */
export const listarCitasProximas = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dias = 30, especialidad } = req.query
    const diasNumero = parseInt(dias as string) || 30

    // Construir rango de fechas
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const fechaFinal = new Date(hoy)
    fechaFinal.setDate(fechaFinal.getDate() + diasNumero)

    // Construir filtro
    const where: any = {
      fechaCita: {
        gte: hoy,
        lte: fechaFinal,
      },
      estado: {
        in: ['PROGRAMADA'],
      },
    }

    if (especialidad) {
      where.especialidad = especialidad as string
    }

    const citas = await prisma.cita.findMany({
      where,
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
            ci: true,
            telefono: true,
          },
        },
        medico: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
      orderBy: { fechaCita: 'asc' },
    })

    res.json({
      success: true,
      data: convertBigIntToString(citas),
    })
  } catch (error: any) {
    console.error('Error al listar citas próximas:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al listar citas',
    })
  }
}

/**
 * Obtener especialidades disponibles
 * GET /api/citas/especialidades
 */
export const obtenerEspecialidades = async (_req: Request, res: Response): Promise<void> => {
  try {
    const especialidades = await prisma.cita.findMany({
      distinct: ['especialidad'],
      select: {
        especialidad: true,
      },
    })

    const listaEspecialidades = especialidades.map((e: any) => e.especialidad).sort()

    res.json({
      success: true,
      data: listaEspecialidades,
    })
  } catch (error: any) {
    console.error('Error al obtener especialidades:', error)
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener especialidades',
    })
  }
}
