/**
 * Controlador de Interconsultas Médicas
 * Gestiona las solicitudes de interconsulta entre especialidades
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { convertBigIntToString } from '../utils/bigIntSerializer';
import logger from '../utils/logger';

const prisma = new PrismaClient();

// Especialidades disponibles para interconsultas
export const ESPECIALIDADES = [
  'MEDICINA_INTERNA',
  'CIRUGIA_GENERAL',
  'TRAUMATOLOGIA',
  'CARDIOLOGIA',
  'NEUROLOGIA',
  'GINECO_OBSTETRICIA',
  'PEDIATRIA',
  'DERMATOLOGIA',
  'OFTALMOLOGIA',
  'OTORRINOLARINGOLOGIA',
  'UROLOGIA',
  'NEFROLOGIA',
  'GASTROENTEROLOGIA',
  'NEUMOLOGIA',
  'ENDOCRINOLOGIA',
  'PSIQUIATRIA',
  'ONCOLOGIA',
  'HEMATOLOGIA',
  'REUMATOLOGIA',
  'MEDICINA_FISICA',
  'UCI',
];

/**
 * Crear nueva interconsulta
 * POST /api/interconsultas
 */
export const crearInterconsulta = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      pacienteId,
      admisionId,
      medicoSolicitanteId,
      especialidadOrigen,
      especialidadDestino,
      medicoDestinoId,
      motivoInterconsulta,
      resumenClinico,
      preguntaEspecifica,
      diagnosticoPresuntivo,
      prioridad,
    } = req.body;

    // Validaciones básicas
    if (!pacienteId || !medicoSolicitanteId || !especialidadDestino || !motivoInterconsulta) {
      res.status(400).json({
        success: false,
        error: 'Campos requeridos: pacienteId, medicoSolicitanteId, especialidadDestino, motivoInterconsulta',
      });
      return;
    }

    // Verificar que el paciente existe
    const paciente = await prisma.paciente.findUnique({
      where: { id: Number(pacienteId) },
    });

    if (!paciente) {
      res.status(404).json({
        success: false,
        error: 'Paciente no encontrado',
      });
      return;
    }

    // Verificar que el médico solicitante existe
    const medicoSolicitante = await prisma.usuario.findUnique({
      where: { id: Number(medicoSolicitanteId) },
    });

    if (!medicoSolicitante) {
      res.status(404).json({
        success: false,
        error: 'Médico solicitante no encontrado',
      });
      return;
    }

    // Crear la interconsulta
    const interconsulta = await prisma.interconsulta.create({
      data: {
        pacienteId: Number(pacienteId),
        admisionId: admisionId ? Number(admisionId) : null,
        medicoSolicitanteId: Number(medicoSolicitanteId),
        especialidadOrigen: especialidadOrigen || medicoSolicitante.especialidad || 'NO_ESPECIFICADA',
        especialidadDestino,
        medicoDestinoId: medicoDestinoId ? Number(medicoDestinoId) : null,
        motivoInterconsulta,
        resumenClinico,
        preguntaEspecifica,
        diagnosticoPresuntivo,
        prioridad: prioridad || 'NORMAL',
        estado: 'PENDIENTE',
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
        medicoSolicitante: {
          select: {
            id: true,
            nombre: true,
            especialidad: true,
          },
        },
        medicoDestino: {
          select: {
            id: true,
            nombre: true,
            especialidad: true,
          },
        },
      },
    });

    logger.info(`Interconsulta creada: ${interconsulta.id} - ${especialidadDestino}`);

    res.status(201).json({
      success: true,
      data: convertBigIntToString(interconsulta),
      message: 'Interconsulta creada exitosamente',
    });
  } catch (error: any) {
    logger.error('Error al crear interconsulta:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear interconsulta',
      details: error.message,
    });
  }
};

/**
 * Obtener interconsultas pendientes para una especialidad
 * GET /api/interconsultas/pendientes/:especialidad
 */
export const obtenerInterconsultasPendientes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { especialidad } = req.params;

    const interconsultas = await prisma.interconsulta.findMany({
      where: {
        especialidadDestino: especialidad,
        estado: {
          in: ['PENDIENTE', 'EN_PROCESO'],
        },
      },
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
            ci: true,
            fechaNacimiento: true,
            sexo: true,
          },
        },
        medicoSolicitante: {
          select: {
            id: true,
            nombre: true,
            especialidad: true,
          },
        },
        admision: {
          select: {
            id: true,
            tipo: true,
            servicio: true,
            habitacion: true,
            cama: true,
            estado: true,
          },
        },
      },
      orderBy: [
        { prioridad: 'asc' }, // URGENTE primero
        { fechaSolicitud: 'asc' }, // Más antiguas primero
      ],
    });

    res.status(200).json({
      success: true,
      data: convertBigIntToString(interconsultas),
      count: interconsultas.length,
    });
  } catch (error: any) {
    logger.error('Error al obtener interconsultas pendientes:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener interconsultas pendientes',
      details: error.message,
    });
  }
};

/**
 * Obtener interconsultas recibidas por un médico
 * GET /api/interconsultas/recibidas/:medicoId
 */
export const obtenerInterconsultasRecibidas = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { medicoId } = req.params;
    const { estado } = req.query;

    // Obtener el médico para saber su especialidad
    const medico = await prisma.usuario.findUnique({
      where: { id: Number(medicoId) },
    });

    // Si el médico no existe, devolver array vacío (no es un error crítico)
    if (!medico) {
      res.status(200).json({
        success: true,
        data: [],
        count: 0,
        message: 'Médico no encontrado en el sistema',
      });
      return;
    }

    // Buscar interconsultas dirigidas a este médico O a su especialidad
    const whereClause: any = {
      OR: [
        { medicoDestinoId: Number(medicoId) },
        {
          AND: [
            { especialidadDestino: medico.especialidad },
            { medicoDestinoId: null },
          ],
        },
      ],
    };

    if (estado) {
      whereClause.estado = estado;
    }

    const interconsultas = await prisma.interconsulta.findMany({
      where: whereClause,
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
            ci: true,
            fechaNacimiento: true,
            sexo: true,
          },
        },
        medicoSolicitante: {
          select: {
            id: true,
            nombre: true,
            especialidad: true,
          },
        },
        admision: {
          select: {
            id: true,
            tipo: true,
            servicio: true,
            habitacion: true,
            cama: true,
            estado: true,
          },
        },
      },
      orderBy: [
        { prioridad: 'asc' },
        { fechaSolicitud: 'asc' },
      ],
    });

    res.status(200).json({
      success: true,
      data: convertBigIntToString(interconsultas),
      count: interconsultas.length,
    });
  } catch (error: any) {
    logger.error('Error al obtener interconsultas recibidas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener interconsultas recibidas',
      details: error.message,
    });
  }
};

/**
 * Obtener interconsultas enviadas por un médico
 * GET /api/interconsultas/enviadas/:medicoId
 */
export const obtenerInterconsultasEnviadas = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { medicoId } = req.params;

    const interconsultas = await prisma.interconsulta.findMany({
      where: {
        medicoSolicitanteId: Number(medicoId),
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
        medicoDestino: {
          select: {
            id: true,
            nombre: true,
            especialidad: true,
          },
        },
      },
      orderBy: {
        fechaSolicitud: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: convertBigIntToString(interconsultas),
      count: interconsultas.length,
    });
  } catch (error: any) {
    logger.error('Error al obtener interconsultas enviadas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener interconsultas enviadas',
      details: error.message,
    });
  }
};

/**
 * Obtener interconsultas de un paciente
 * GET /api/interconsultas/paciente/:pacienteId
 */
export const obtenerInterconsultasPaciente = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { pacienteId } = req.params;

    const interconsultas = await prisma.interconsulta.findMany({
      where: {
        pacienteId: Number(pacienteId),
      },
      include: {
        medicoSolicitante: {
          select: {
            id: true,
            nombre: true,
            especialidad: true,
          },
        },
        medicoDestino: {
          select: {
            id: true,
            nombre: true,
            especialidad: true,
          },
        },
        admision: {
          select: {
            id: true,
            tipo: true,
            servicio: true,
          },
        },
      },
      orderBy: {
        fechaSolicitud: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      data: convertBigIntToString(interconsultas),
      count: interconsultas.length,
    });
  } catch (error: any) {
    logger.error('Error al obtener interconsultas del paciente:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener interconsultas del paciente',
      details: error.message,
    });
  }
};

/**
 * Aceptar una interconsulta (médico destino)
 * PATCH /api/interconsultas/:id/aceptar
 */
export const aceptarInterconsulta = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { medicoDestinoId } = req.body;

    const interconsulta = await prisma.interconsulta.findUnique({
      where: { id: Number(id) },
    });

    if (!interconsulta) {
      res.status(404).json({
        success: false,
        error: 'Interconsulta no encontrada',
      });
      return;
    }

    if (interconsulta.estado !== 'PENDIENTE') {
      res.status(400).json({
        success: false,
        error: 'Solo se pueden aceptar interconsultas pendientes',
      });
      return;
    }

    const interconsultaActualizada = await prisma.interconsulta.update({
      where: { id: Number(id) },
      data: {
        estado: 'EN_PROCESO',
        medicoDestinoId: Number(medicoDestinoId),
        fechaAceptacion: new Date(),
      },
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
          },
        },
      },
    });

    logger.info(`Interconsulta ${id} aceptada por médico ${medicoDestinoId}`);

    res.status(200).json({
      success: true,
      data: convertBigIntToString(interconsultaActualizada),
      message: 'Interconsulta aceptada',
    });
  } catch (error: any) {
    logger.error('Error al aceptar interconsulta:', error);
    res.status(500).json({
      success: false,
      error: 'Error al aceptar interconsulta',
      details: error.message,
    });
  }
};

/**
 * Completar una interconsulta con respuesta
 * PATCH /api/interconsultas/:id/completar
 */
export const completarInterconsulta = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { respuestaInterconsulta, recomendaciones } = req.body;

    if (!respuestaInterconsulta) {
      res.status(400).json({
        success: false,
        error: 'Se requiere una respuesta para completar la interconsulta',
      });
      return;
    }

    const interconsulta = await prisma.interconsulta.findUnique({
      where: { id: Number(id) },
    });

    if (!interconsulta) {
      res.status(404).json({
        success: false,
        error: 'Interconsulta no encontrada',
      });
      return;
    }

    if (interconsulta.estado === 'COMPLETADA') {
      res.status(400).json({
        success: false,
        error: 'La interconsulta ya está completada',
      });
      return;
    }

    const interconsultaActualizada = await prisma.interconsulta.update({
      where: { id: Number(id) },
      data: {
        estado: 'COMPLETADA',
        respuestaInterconsulta,
        recomendaciones,
        fechaRespuesta: new Date(),
      },
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
          },
        },
        medicoSolicitante: {
          select: {
            id: true,
            nombre: true,
          },
        },
        medicoDestino: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    logger.info(`Interconsulta ${id} completada`);

    res.status(200).json({
      success: true,
      data: convertBigIntToString(interconsultaActualizada),
      message: 'Interconsulta completada exitosamente',
    });
  } catch (error: any) {
    logger.error('Error al completar interconsulta:', error);
    res.status(500).json({
      success: false,
      error: 'Error al completar interconsulta',
      details: error.message,
    });
  }
};

/**
 * Rechazar una interconsulta
 * PATCH /api/interconsultas/:id/rechazar
 */
export const rechazarInterconsulta = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { motivoRechazo } = req.body;

    const interconsulta = await prisma.interconsulta.findUnique({
      where: { id: Number(id) },
    });

    if (!interconsulta) {
      res.status(404).json({
        success: false,
        error: 'Interconsulta no encontrada',
      });
      return;
    }

    if (interconsulta.estado !== 'PENDIENTE') {
      res.status(400).json({
        success: false,
        error: 'Solo se pueden rechazar interconsultas pendientes',
      });
      return;
    }

    const interconsultaActualizada = await prisma.interconsulta.update({
      where: { id: Number(id) },
      data: {
        estado: 'RECHAZADA',
        respuestaInterconsulta: motivoRechazo || 'Rechazada sin motivo especificado',
        fechaRespuesta: new Date(),
      },
    });

    logger.info(`Interconsulta ${id} rechazada`);

    res.status(200).json({
      success: true,
      data: convertBigIntToString(interconsultaActualizada),
      message: 'Interconsulta rechazada',
    });
  } catch (error: any) {
    logger.error('Error al rechazar interconsulta:', error);
    res.status(500).json({
      success: false,
      error: 'Error al rechazar interconsulta',
      details: error.message,
    });
  }
};

/**
 * Obtener detalle de una interconsulta con historial del paciente
 * GET /api/interconsultas/:id/detalle
 */
export const obtenerDetalleInterconsulta = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const interconsulta = await prisma.interconsulta.findUnique({
      where: { id: Number(id) },
      include: {
        paciente: {
          include: {
            personalMilitar: true,
            admisiones: {
              orderBy: { fechaAdmision: 'desc' },
              take: 5,
            },
            encuentros: {
              orderBy: { fecha: 'desc' },
              take: 10,
              include: {
                examenRegional: true,
                impresiones: true,
              },
            },
            antecedentes: true,
          },
        },
        medicoSolicitante: {
          select: {
            id: true,
            nombre: true,
            especialidad: true,
            cargo: true,
          },
        },
        medicoDestino: {
          select: {
            id: true,
            nombre: true,
            especialidad: true,
            cargo: true,
          },
        },
        admision: {
          include: {
            formatoEmergencia: true,
          },
        },
      },
    });

    if (!interconsulta) {
      res.status(404).json({
        success: false,
        error: 'Interconsulta no encontrada',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: convertBigIntToString(interconsulta),
    });
  } catch (error: any) {
    logger.error('Error al obtener detalle de interconsulta:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener detalle de interconsulta',
      details: error.message,
    });
  }
};

/**
 * Obtener lista de especialidades disponibles
 * GET /api/interconsultas/especialidades
 */
export const obtenerEspecialidades = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      data: ESPECIALIDADES,
    });
  } catch (error: any) {
    logger.error('Error al obtener especialidades:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener especialidades',
      details: error.message,
    });
  }
};

/**
 * Obtener médicos por especialidad
 * GET /api/interconsultas/medicos/:especialidad
 */
export const obtenerMedicosPorEspecialidad = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { especialidad } = req.params;

    const medicos = await prisma.usuario.findMany({
      where: {
        especialidad,
        role: 'MEDICO',
      },
      select: {
        id: true,
        nombre: true,
        especialidad: true,
        cargo: true,
      },
    });

    res.status(200).json({
      success: true,
      data: convertBigIntToString(medicos),
      count: medicos.length,
    });
  } catch (error: any) {
    logger.error('Error al obtener médicos por especialidad:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener médicos',
      details: error.message,
    });
  }
};
