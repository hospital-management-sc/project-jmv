/**
 * Pacientes Controller
 * Maneja la creación y gestión de pacientes
 */

import { Request, Response } from 'express';
import { getPrismaClient } from '../database/connection';
import logger from '../utils/logger';

const prisma = getPrismaClient();

/**
 * Función helper para convertir BigInt a string en objetos
 */
function convertBigIntToString(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  // Preservar objetos Date (se serializarán automáticamente a ISO string en JSON)
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
      tipoAdmision, // NUEVO: Tipo de admisión (EMERGENCIA, HOSPITALIZACION, etc.) o null
      servicioAdmision, // NUEVO: Servicio de la admisión
      
      // Auditoría - Quién registra el paciente
      createdById, // ID del usuario administrativo que registra el paciente
      
      // Datos personales
      apellidosNombres,
      ci,
      fechaNacimiento,
      sexo,
      lugarNacimiento,
      nacionalidad,
      estado,
      religion,
      direccion,
      telefono,
      telefonoEmergencia,
      
      // Tipo de paciente
      tipoPaciente,
      
      // Datos militares (opcional)
      grado,
      estadoMilitar,
      componente,
      unidad,
      
      // Datos de afiliado (opcional)
      afiliadoData,
      
      // Diagnóstico de ingreso (opcional)
      diagnosticoIngreso,
    } = req.body;

    // Validar campos requeridos
    if (!nroHistoria || !apellidosNombres || !ci || !fechaAdmision || !horaAdmision || !sexo || !fechaNacimiento || !estado || !religion) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Faltan campos requeridos',
        requiredFields: ['nroHistoria', 'apellidosNombres', 'ci', 'fechaAdmision', 'horaAdmision', 'sexo', 'fechaNacimiento', 'estado', 'religion'],
      });
      return;
    }

    // Validar tipoPaciente
    const tiposPacienteValidos = ['MILITAR', 'AFILIADO', 'PNA'];
    const tipoPacienteNormalizado = tipoPaciente || 'PNA';
    if (!tiposPacienteValidos.includes(tipoPacienteNormalizado)) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Tipo de paciente inválido. Debe ser: MILITAR, AFILIADO o PNA',
      });
      return;
    }

    // Validaciones específicas por tipo
    if (tipoPacienteNormalizado === 'MILITAR') {
      if (!grado || !componente || !estadoMilitar) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Grado, Componente y Estado Militar son requeridos para personal militar',
        });
        return;
      }
    }

    if (tipoPacienteNormalizado === 'AFILIADO') {
      if (!afiliadoData || !afiliadoData.nroCarnet || !afiliadoData.parentesco || !afiliadoData.titularNombre || !afiliadoData.titularCi) {
        res.status(400).json({
          error: 'Validation Error',
          message: 'Datos de afiliación incompletos. Se requiere: nroCarnet, parentesco, titularNombre y titularCi',
        });
        return;
      }
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
          religion: religion || null,
          direccion: direccion || null,
          telefono: telefono || null,
          telefonoEmergencia: telefonoEmergencia || null,
          tipoPaciente: tipoPacienteNormalizado,
        },
      });

      // Crear registro de admisión inicial
      // Si se proporciona tipoAdmision, la admisión tendrá ese tipo.
      // Si no, será una admisión de registro general (tipo null).
      const admision = await tx.admision.create({
        data: {
          pacienteId: paciente.id,
          formaIngreso: formaIngreso || 'AMBULANTE',
          fechaAdmision: new Date(fechaAdmision),
          horaAdmision: horaAdmision || null,
          habitacion: habitacion || null,
          firmaFacultativo: firmaFacultativo || null,
          diagnosticoIngreso: diagnosticoIngreso || null,
          tipo: tipoAdmision || null, // EMERGENCIA, HOSPITALIZACION, o null
          servicio: servicioAdmision || null,
          estado: 'ACTIVA',
          createdById: createdById ? Number(createdById) : null, // Quién registró esta admisión
        },
        include: {
          createdBy: {
            select: {
              id: true,
              nombre: true,
              cargo: true,
              especialidad: true,
              role: true,
            },
          },
        },
      });

      // Crear datos militares si se proporcionan
      if (grado || estadoMilitar || componente || unidad) {
        await tx.personalMilitar.create({
          data: {
            pacienteId: paciente.id,
            grado: grado || null,
            estadoMilitar: estadoMilitar || null,
            componente: componente || null,
            unidad: unidad || null,
          },
        });
      }

      // Crear datos de afiliado si es tipo AFILIADO
      if (tipoPacienteNormalizado === 'AFILIADO' && afiliadoData) {
        await tx.afiliado.create({
          data: {
            pacienteId: paciente.id,
            nroCarnet: afiliadoData.nroCarnet || null,
            parentesco: afiliadoData.parentesco || null,
            titularNombre: afiliadoData.titularNombre || null,
            titularCi: afiliadoData.titularCi || null,
            titularGrado: afiliadoData.titularGrado || null,
            titularComponente: afiliadoData.titularComponente || null,
            fechaAfiliacion: afiliadoData.fechaAfiliacion ? new Date(afiliadoData.fechaAfiliacion) : null,
            vigente: afiliadoData.vigente !== undefined ? afiliadoData.vigente : true,
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
        // Información de auditoría
        registradoPor: resultado.admision.createdBy
          ? {
              id: resultado.admision.createdBy.id?.toString() || null,
              nombre: resultado.admision.createdBy.nombre || null,
              cargo: resultado.admision.createdBy.cargo || 'Administrativo',
              especialidad: resultado.admision.createdBy.especialidad || null,
              role: resultado.admision.createdBy.role || 'ADMIN',
            }
          : null,
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
      where: { id: Number(id) },
      include: {
        personalMilitar: true,
        afiliado: true,
        admisiones: {
          include: {
            createdBy: {
              select: {
                id: true,
                nombre: true,
                cargo: true,
                especialidad: true,
                role: true,
              },
            },
            formatoEmergencia: true,
            formatoHospitalizacion: {
              include: {
                signosVitales: true,
                laboratorios: true,
                estudiosEspeciales: true,
                electrocardiogramas: true,
                antecedentesDetallados: true,
                examenFuncional: true,
                examenFisicoCompleto: true,
                resumenIngreso: true,
                ordenesMedicas: true,
                evolucionesMedicas: true,
              },
            },
          },
        },
        encuentros: {
          include: {
            createdBy: {
              select: {
                id: true,
                nombre: true,
                cargo: true,
                especialidad: true,
                role: true,
              },
            },
          },
        },
        citas: {
          orderBy: {
            fechaCita: 'desc',
          },
        },
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
      data: convertBigIntToString(paciente),
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
          afiliado: true,
          admisiones: true,
          encuentros: true,
          citas: {
            orderBy: {
              fechaCita: 'desc',
            },
          },
        },
      });
    } else if (historia) {
      paciente = await prisma.paciente.findUnique({
        where: { nroHistoria: historia as string },
        include: {
          personalMilitar: true,
          afiliado: true,
          admisiones: true,
          encuentros: true,
          citas: {
            orderBy: {
              fechaCita: 'desc',
            },
          },
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
 * Obtener los últimos pacientes registrados
 * GET /api/pacientes/ultimos?limit=1
 */
export const obtenerUltimos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { limit = 1 } = req.query;
    const limitNum = Math.min(parseInt(limit as string) || 1, 100);

    const pacientes = await prisma.paciente.findMany({
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: {
        personalMilitar: true,
      },
    });

    res.status(200).json({
      success: true,
      data: convertBigIntToString(pacientes),
    });
  } catch (error: any) {
    logger.error('Error al obtener últimos pacientes:', error);
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
          afiliado: true,
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

