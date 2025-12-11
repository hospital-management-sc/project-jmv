/**
 * Encuentros Controller
 * Maneja la gestión de encuentros médicos
 * - Lectura: Para administrativos y médicos
 * - Escritura: Solo para médicos
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Función helper para convertir BigInt a string
 */
function convertBigIntToString(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  if (obj instanceof Date) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertBigIntToString(item));
  }
  
  if (typeof obj === 'object') {
    const converted: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        converted[key] = convertBigIntToString(obj[key]);
      }
    }
    return converted;
  }
  
  return obj;
}

/**
 * Crear un nuevo encuentro médico
 * POST /api/encuentros
 */
export const crearEncuentro = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      pacienteId,
      admisionId,
      tipo,
      fecha,
      hora,
      motivoConsulta,
      enfermedadActual,
      procedencia,
      nroCama,
      createdById,
      // Signos vitales
      signosVitales,
      // Impresión diagnóstica
      impresionDiagnostica,
      tratamiento,
    } = req.body;

    // Validaciones básicas
    if (!pacienteId || !tipo || !createdById) {
      res.status(400).json({
        success: false,
        error: 'Campos requeridos: pacienteId, tipo, createdById',
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

    // Crear el encuentro con transacción
    const resultado = await prisma.$transaction(async (tx) => {
      // Crear encuentro
      const encuentro = await tx.encuentro.create({
        data: {
          pacienteId: Number(pacienteId),
          admisionId: admisionId ? Number(admisionId) : null,
          tipo,
          fecha: fecha ? new Date(fecha) : new Date(),
          hora: hora || null,
          motivoConsulta,
          enfermedadActual,
          procedencia,
          nroCama,
          createdById: Number(createdById),
        },
      });

      // Crear signos vitales si se proporcionaron
      if (signosVitales) {
        await tx.signosVitales.create({
          data: {
            encuentroId: encuentro.id,
            taSistolica: signosVitales.taSistolica ? parseInt(signosVitales.taSistolica) : null,
            taDiastolica: signosVitales.taDiastolica ? parseInt(signosVitales.taDiastolica) : null,
            pulso: signosVitales.pulso ? parseInt(signosVitales.pulso) : null,
            temperatura: signosVitales.temperatura ? parseFloat(signosVitales.temperatura) : null,
            fr: signosVitales.fr ? parseInt(signosVitales.fr) : null,
            observaciones: signosVitales.observaciones,
          },
        });
      }

      // Crear impresión diagnóstica si se proporcionó
      if (impresionDiagnostica) {
        await tx.impresionDiagnostica.create({
          data: {
            encuentroId: encuentro.id,
            codigoCie: impresionDiagnostica.codigoCie,
            descripcion: impresionDiagnostica.descripcion || tratamiento,
            clase: impresionDiagnostica.clase || 'PRESUNTIVO',
          },
        });
      }

      // Obtener encuentro con relaciones
      return await tx.encuentro.findUnique({
        where: { id: encuentro.id },
        include: {
          paciente: {
            select: {
              id: true,
              nroHistoria: true,
              apellidosNombres: true,
              ci: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              nombre: true,
              cargo: true,
            },
          },
          signosVitales: true,
          impresiones: true,
        },
      });
    });

    logger.info(`Encuentro creado: ${resultado?.id} para paciente ${pacienteId}`);

    res.status(201).json({
      success: true,
      data: convertBigIntToString(resultado),
      message: 'Encuentro registrado exitosamente',
    });
  } catch (error: any) {
    logger.error('Error al crear encuentro:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear encuentro',
      details: error.message,
    });
  }
};

/**
 * Crear encuentro desde atención de cita
 * POST /api/encuentros/desde-cita
 */
export const crearEncuentroDesdeCita = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      citaId,
      medicoId,
      motivoConsulta,
      enfermedadActual,
      signosVitales,
      impresionDiagnostica,
      tratamiento,
      observaciones,
    } = req.body;

    if (!citaId || !medicoId) {
      res.status(400).json({
        success: false,
        error: 'Campos requeridos: citaId, medicoId',
      });
      return;
    }

    // Verificar que la cita existe y está programada
    const cita = await prisma.cita.findUnique({
      where: { id: Number(citaId) },
      include: {
        paciente: true,
      },
    });

    if (!cita) {
      res.status(404).json({
        success: false,
        error: 'Cita no encontrada',
      });
      return;
    }

    if (cita.estado === 'COMPLETADA') {
      res.status(400).json({
        success: false,
        error: 'Esta cita ya fue atendida',
      });
      return;
    }

    // Crear encuentro y actualizar cita en transacción
    const resultado = await prisma.$transaction(async (tx) => {
      // Crear el encuentro
      const encuentro = await tx.encuentro.create({
        data: {
          pacienteId: cita.pacienteId,
          tipo: 'CONSULTA',
          fecha: new Date(),
          hora: new Date().toTimeString().slice(0, 5), // HH:MM
          motivoConsulta: motivoConsulta || cita.motivo,
          enfermedadActual,
          procedencia: 'CITA_PROGRAMADA',
          createdById: Number(medicoId),
        },
      });

      // Crear signos vitales
      if (signosVitales) {
        await tx.signosVitales.create({
          data: {
            encuentroId: encuentro.id,
            taSistolica: signosVitales.taSistolica ? parseInt(signosVitales.taSistolica) : null,
            taDiastolica: signosVitales.taDiastolica ? parseInt(signosVitales.taDiastolica) : null,
            pulso: signosVitales.pulso ? parseInt(signosVitales.pulso) : null,
            temperatura: signosVitales.temperatura ? parseFloat(signosVitales.temperatura) : null,
            fr: signosVitales.fr ? parseInt(signosVitales.fr) : null,
            observaciones: observaciones,
          },
        });
      }

      // Crear impresión diagnóstica
      if (impresionDiagnostica || tratamiento) {
        await tx.impresionDiagnostica.create({
          data: {
            encuentroId: encuentro.id,
            codigoCie: impresionDiagnostica?.codigoCie,
            descripcion: impresionDiagnostica?.descripcion || tratamiento,
            clase: impresionDiagnostica?.clase || 'PRESUNTIVO',
          },
        });
      }

      // Actualizar estado de la cita
      await tx.cita.update({
        where: { id: Number(citaId) },
        data: {
          estado: 'COMPLETADA',
          notas: observaciones,
        },
      });

      // Retornar encuentro completo
      return await tx.encuentro.findUnique({
        where: { id: encuentro.id },
        include: {
          paciente: {
            select: {
              id: true,
              nroHistoria: true,
              apellidosNombres: true,
              ci: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              nombre: true,
            },
          },
          signosVitales: true,
          impresiones: true,
        },
      });
    });

    logger.info(`Encuentro creado desde cita ${citaId}: ${resultado?.id}`);

    res.status(201).json({
      success: true,
      data: convertBigIntToString(resultado),
      message: 'Cita atendida y encuentro registrado exitosamente',
    });
  } catch (error: any) {
    logger.error('Error al crear encuentro desde cita:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear encuentro',
      details: error.message,
    });
  }
};

/**
 * Obtener todos los encuentros de un paciente
 * GET /api/encuentros/paciente/:pacienteId
 */
export const obtenerEncuentrosPorPaciente = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { pacienteId } = req.params;

    // Validar que pacienteId sea un número válido
    if (!pacienteId || isNaN(Number(pacienteId))) {
      res.status(400).json({
        error: 'ID de paciente inválido',
      });
      return;
    }

    logger.info(`Obteniendo encuentros del paciente ${pacienteId}`);

    // Verificar que el paciente existe
    const paciente = await prisma.paciente.findUnique({
      where: { id: Number(pacienteId) },
    });

    if (!paciente) {
      res.status(404).json({
        error: 'Paciente no encontrado',
      });
      return;
    }

    // Obtener encuentros con información relacionada
    const encuentros = await prisma.encuentro.findMany({
      where: {
        pacienteId: Number(pacienteId),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            nombre: true,
            cargo: true,
            role: true,
          },
        },
        signosVitales: true,
        impresiones: true,
        admision: {
          select: {
            id: true,
            tipo: true,
            servicio: true,
          },
        },
      },
      orderBy: [
        { fecha: 'desc' },
        { hora: 'desc' },
      ],
    });

    // Convertir BigInt a string
    const encuentrosConvertidos = convertBigIntToString(encuentros);

    logger.info(`Se encontraron ${encuentros.length} encuentros para el paciente ${pacienteId}`);

    res.status(200).json({
      success: true,
      data: encuentrosConvertidos,
      count: encuentros.length,
    });
  } catch (error: any) {
    logger.error('Error al obtener encuentros:', error);
    res.status(500).json({
      error: 'Error al obtener encuentros',
      details: error.message,
    });
  }
};

/**
 * Obtener detalle de un encuentro específico
 * GET /api/encuentros/:id
 */
export const obtenerEncuentroPorId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validar que id sea un número válido
    if (!id || isNaN(Number(id))) {
      res.status(400).json({
        error: 'ID de encuentro inválido',
      });
      return;
    }

    logger.info(`Obteniendo detalle del encuentro ${id}`);

    // Obtener encuentro con toda la información relacionada
    const encuentro = await prisma.encuentro.findUnique({
      where: { id: Number(id) },
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
        createdBy: {
          select: {
            id: true,
            nombre: true,
            cargo: true,
            role: true,
            email: true,
          },
        },
        signosVitales: {
          orderBy: {
            registradoEn: 'desc',
          },
        },
        examenRegional: true,
        impresiones: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        admision: {
          select: {
            id: true,
            tipo: true,
            servicio: true,
            fechaAdmision: true,
            formaIngreso: true,
          },
        },
      },
    });

    if (!encuentro) {
      res.status(404).json({
        error: 'Encuentro no encontrado',
      });
      return;
    }

    // Convertir BigInt a string
    const encuentroConvertido = convertBigIntToString(encuentro);

    logger.info(`Encuentro ${id} encontrado`);

    res.status(200).json({
      success: true,
      data: encuentroConvertido,
    });
  } catch (error: any) {
    logger.error('Error al obtener encuentro:', error);
    res.status(500).json({
      error: 'Error al obtener encuentro',
      details: error.message,
    });
  }
};

/**
 * Obtener encuentros del día actual
 * GET /api/encuentros/hoy
 */
export const obtenerEncuentrosHoy = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info('Obteniendo encuentros del día actual');

    // Obtener fecha actual (solo fecha, sin hora)
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);

    const encuentros = await prisma.encuentro.findMany({
      where: {
        fecha: {
          gte: hoy,
          lt: mañana,
        },
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
        createdBy: {
          select: {
            id: true,
            nombre: true,
            cargo: true,
          },
        },
        signosVitales: true,
      },
      orderBy: [
        { hora: 'desc' },
      ],
    });

    const encuentrosConvertidos = convertBigIntToString(encuentros);

    logger.info(`Se encontraron ${encuentros.length} encuentros hoy`);

    res.status(200).json({
      success: true,
      data: encuentrosConvertidos,
      count: encuentros.length,
      fecha: hoy.toISOString().split('T')[0],
    });
  } catch (error: any) {
    logger.error('Error al obtener encuentros de hoy:', error);
    res.status(500).json({
      error: 'Error al obtener encuentros',
      details: error.message,
    });
  }
};

/**
 * Obtener encuentros por tipo
 * GET /api/encuentros/tipo/:tipo
 */
export const obtenerEncuentrosPorTipo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { tipo } = req.params;

    // Validar tipos permitidos
    const tiposPermitidos = ['EMERGENCIA', 'HOSPITALIZACION', 'CONSULTA', 'OTRO'];
    if (!tiposPermitidos.includes(tipo.toUpperCase())) {
      res.status(400).json({
        error: 'Tipo de encuentro inválido',
        tiposPermitidos,
      });
      return;
    }

    logger.info(`Obteniendo encuentros de tipo ${tipo}`);

    const encuentros = await prisma.encuentro.findMany({
      where: {
        tipo: tipo.toUpperCase(),
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
        createdBy: {
          select: {
            id: true,
            nombre: true,
            cargo: true,
          },
        },
      },
      orderBy: [
        { fecha: 'desc' },
        { hora: 'desc' },
      ],
      take: 100, // Limitar a 100 resultados
    });

    const encuentrosConvertidos = convertBigIntToString(encuentros);

    logger.info(`Se encontraron ${encuentros.length} encuentros de tipo ${tipo}`);

    res.status(200).json({
      success: true,
      data: encuentrosConvertidos,
      count: encuentros.length,
      tipo: tipo.toUpperCase(),
    });
  } catch (error: any) {
    logger.error('Error al obtener encuentros por tipo:', error);
    res.status(500).json({
      error: 'Error al obtener encuentros',
      details: error.message,
    });
  }
};
