/**
 * Pacientes Controller
 * Maneja la creación y gestión de pacientes
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Función helper para convertir BigInt a string en objetos
 */
function convertBigIntToString(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'bigint') {
    return obj.toString();
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
 * Crear un nuevo paciente con su información de admisión
 * POST /api/pacientes
 */
export const crearPaciente = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      // Datos de admisión
      nroHistoria,
      formaIngreso,
      fechaAdmision,
      horaAdmision,
      firmaFacultativo,
      habitacion,
      
      // Datos personales
      apellidosNombres,
      ci,
      fechaNacimiento,
      sexo,
      lugarNacimiento,
      nacionalidad,
      estado,
      direccion,
      telefono,
      
      // Datos militares (opcional)
      grado,
      componente,
      unidad,
      
      // Datos de estancia hospitalaria
      diagnosticoIngreso,
      diagnosticoEgreso,
      fechaAlta,
      diasHospitalizacion,
    } = req.body;

    // Validar campos requeridos
    if (!nroHistoria || !apellidosNombres || !ci || !fechaAdmision || !horaAdmision || !sexo || !fechaNacimiento) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Faltan campos requeridos',
        requiredFields: ['nroHistoria', 'apellidosNombres', 'ci', 'fechaAdmision', 'horaAdmision', 'sexo', 'fechaNacimiento'],
      });
      return;
    }

    // Validar formato de historia clínica
    const historiaPattern = /^\d{2}-\d{2}-\d{2}$/;
    if (!historiaPattern.test(nroHistoria)) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Formato de historia clínica inválido. Debe ser: 00-00-00',
      });
      return;
    }

    // Validar CI
    if (!ci || ci.length < 5) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Cédula de identidad inválida',
      });
      return;
    }

    // Usar transacción para crear paciente y admisión
    const resultado = await prisma.$transaction(async (tx) => {
      // Verificar si el paciente ya existe
      const pacienteExistente = await tx.paciente.findUnique({
        where: { ci },
      });

      if (pacienteExistente) {
        throw new Error('Paciente con esta cédula ya existe');
      }

      // Crear paciente
      const paciente = await tx.paciente.create({
        data: {
          nroHistoria,
          apellidosNombres,
          ci,
          fechaNacimiento: new Date(fechaNacimiento),
          sexo,
          lugarNacimiento: lugarNacimiento || null,
          nacionalidad: nacionalidad || null,
          estado: estado || null,
          direccion: direccion || null,
          telefono: telefono || null,
        },
      });

      // Crear registro de admisión
      const admision = await tx.admision.create({
        data: {
          pacienteId: paciente.id,
          formaIngreso: formaIngreso || 'AMBULANTE',
          fechaAdmision: new Date(fechaAdmision),
          horaAdmision: horaAdmision ? new Date(`2000-01-01T${horaAdmision}`) : null,
          habitacion: habitacion || null,
          firmaFacultativo: firmaFacultativo || null,
        },
      });

      // Crear datos de estancia hospitalaria si se proporcionan
      if (diagnosticoIngreso || diagnosticoEgreso || fechaAlta) {
        await tx.estanciaHospitalaria.create({
          data: {
            admisionId: admision.id,
            fechaAlta: fechaAlta ? new Date(fechaAlta) : null,
            diasHosp: diasHospitalizacion ? parseInt(diasHospitalizacion) : null,
            notas: `Diagnóstico ingreso: ${diagnosticoIngreso || 'N/A'}\nDiagnóstico egreso: ${diagnosticoEgreso || 'N/A'}`,
          },
        });
      }

      // Crear datos militares si se proporcionan
      if (grado || componente || unidad) {
        await tx.personalMilitar.create({
          data: {
            pacienteId: paciente.id,
            grado: grado || null,
            componente: componente || null,
            unidad: unidad || null,
          },
        });
      }

      return {
        paciente,
        admision,
      };
    });

    logger.info(`Paciente creado exitosamente: ${resultado.paciente.nroHistoria} - ${resultado.paciente.ci}`);

    res.status(201).json({
      success: true,
      message: 'Paciente registrado exitosamente',
      data: {
        pacienteId: resultado.paciente.id.toString(),
        nroHistoria: resultado.paciente.nroHistoria,
        ci: resultado.paciente.ci,
        apellidosNombres: resultado.paciente.apellidosNombres,
        admisionId: resultado.admision.id.toString(),
      },
    });
  } catch (error: any) {
    logger.error('Error al crear paciente:', error);

    // Manejar errores de unicidad
    if (error.code === 'P2002') {
      res.status(409).json({
        error: 'Conflict',
        message: 'Ya existe un paciente con esta historia clínica o cédula de identidad',
      });
      return;
    }

    // Manejar errores personalizados de transacción
    if (error.message === 'Paciente con esta cédula ya existe') {
      res.status(409).json({
        error: 'Conflict',
        message: error.message,
      });
      return;
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Error al crear el paciente',
    });
  }
};

/**
 * Obtener un paciente por ID
 * GET /api/pacientes/:id
 */
export const obtenerPaciente = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const paciente = await prisma.paciente.findUnique({
      where: { id: BigInt(id) },
      include: {
        personalMilitar: true,
        admisiones: true,
        encuentros: true,
      },
    });

    if (!paciente) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Paciente no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: paciente,
    });
  } catch (error: any) {
    logger.error('Error al obtener paciente:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
};

/**
 * Buscar paciente por CI o Nro. Historia
 * GET /api/pacientes/search?ci=V-12345678
 * GET /api/pacientes/search?historia=00-00-00
 */
export const buscarPaciente = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { ci, historia } = req.query;

    if (!ci && !historia) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Proporcione al menos un criterio de búsqueda (ci o historia)',
      });
      return;
    }

    let paciente = null;

    if (ci) {
      paciente = await prisma.paciente.findUnique({
        where: { ci: ci as string },
        include: {
          personalMilitar: true,
          admisiones: true,
          encuentros: true,
        },
      });
    } else if (historia) {
      paciente = await prisma.paciente.findUnique({
        where: { nroHistoria: historia as string },
        include: {
          personalMilitar: true,
          admisiones: true,
          encuentros: true,
        },
      });
    }

    if (!paciente) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Paciente no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: convertBigIntToString(paciente),
    });
  } catch (error: any) {
    logger.error('Error al buscar paciente:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
};

/**
 * Listar todos los pacientes
 * GET /api/pacientes
 */
export const listarPacientes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [pacientes, total] = await Promise.all([
      prisma.paciente.findMany({
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          personalMilitar: true,
        },
      }),
      prisma.paciente.count(),
    ]);

    res.status(200).json({
      success: true,
      data: convertBigIntToString(pacientes),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    logger.error('Error al listar pacientes:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
};

