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
 * Crear nueva admisión para un paciente existente o nuevo
 * POST /api/admisiones
 */
export const crearAdmision = async (req: Request, res: Response) => {
  try {
    const {
      pacienteId,
      tipo, // EMERGENCIA | HOSPITALIZACION | CONSULTA_EXTERNA | UCI | CIRUGIA
      servicio,
      fechaAdmision,
      horaAdmision,
      formaIngreso,
      habitacion,
      cama,
      observaciones,
      createdById,
    } = req.body;

    // Validaciones básicas
    if (!pacienteId || !tipo || !fechaAdmision) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: pacienteId, tipo, fechaAdmision',
      });
    }

    // Verificar que el paciente existe
    const paciente = await prisma.paciente.findUnique({
      where: { id: Number(pacienteId) },
    });

    if (!paciente) {
      return res.status(404).json({
        error: 'Paciente no encontrado',
      });
    }

    // Determinar estado inicial según tipo de admisión
    // CONSULTA_EXTERNA no requiere hospitalización, los demás sí
    const estadoInicial = tipo === 'CONSULTA_EXTERNA' ? 'EN_ESPERA' : 'ACTIVA';

    // Crear la admisión
    const admision = await prisma.admision.create({
      data: {
        pacienteId: Number(pacienteId),
        tipo,
        servicio: servicio || null,
        fechaAdmision: new Date(fechaAdmision),
        horaAdmision: horaAdmision || null,
        formaIngreso: formaIngreso || null,
        habitacion: habitacion || null,
        cama: cama || null,
        estado: estadoInicial,
        observaciones: observaciones || null,
        createdById: createdById ? Number(createdById) : null,
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
        createdBy: {
          select: {
            id: true,
            nombre: true,
            cargo: true,
          },
        },
      },
    });

    // Serializar BigInt a string
    const admisionSerializada = JSON.parse(
      JSON.stringify(admision, (_key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return res.status(201).json({
      message: 'Admisión creada exitosamente',
      admision: admisionSerializada,
    });
  } catch (error) {
    console.error('Error al crear admisión:', error);
    return res.status(500).json({
      error: 'Error al crear admisión',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

/**
 * Obtener admisión por ID
 * GET /api/admisiones/:id
 */
export const obtenerAdmision = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const admision = await prisma.admision.findUnique({
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
            telefono: true,
            direccion: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            nombre: true,
            cargo: true,
          },
        },
        estanciaHospitalaria: true,
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
    });

    if (!admision) {
      return res.status(404).json({
        error: 'Admisión no encontrada',
      });
    }

    // Serializar BigInt a string
    const admisionSerializada = JSON.parse(
      JSON.stringify(admision, (_key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return res.status(200).json(admisionSerializada);
  } catch (error) {
    console.error('Error al obtener admisión:', error);
    return res.status(500).json({
      error: 'Error al obtener admisión',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

/**
 * Listar admisiones de un paciente
 * GET /api/admisiones/paciente/:pacienteId
 */
export const listarAdmisionesPaciente = async (req: Request, res: Response) => {
  try {
    const { pacienteId } = req.params;

    const admisiones = await prisma.admision.findMany({
      where: { pacienteId: Number(pacienteId) },
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
        estanciaHospitalaria: {
          select: {
            fechaAlta: true,
            diasHosp: true,
            diagnosticoIngreso: {
              select: {
                descripcion: true,
                codigoCie: true,
              },
            },
            diagnosticoEgreso: {
              select: {
                descripcion: true,
                codigoCie: true,
              },
            },
          },
        },
      },
      orderBy: {
        fechaAdmision: 'desc',
      },
    });

    // Serializar BigInt a string
    const admisionesSerializadas = JSON.parse(
      JSON.stringify(admisiones, (_key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return res.status(200).json({
      total: admisiones.length,
      admisiones: admisionesSerializadas,
    });
  } catch (error) {
    console.error('Error al listar admisiones del paciente:', error);
    return res.status(500).json({
      error: 'Error al listar admisiones del paciente',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

/**
 * Actualizar admisión
 * PUT /api/admisiones/:id
 */
export const actualizarAdmision = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      servicio,
      habitacion,
      cama,
      formaIngreso,
      observaciones,
    } = req.body;

    // Verificar que la admisión existe
    const admisionExistente = await prisma.admision.findUnique({
      where: { id: Number(id) },
    });

    if (!admisionExistente) {
      return res.status(404).json({
        error: 'Admisión no encontrada',
      });
    }

    // Actualizar admisión
    const admisionActualizada = await prisma.admision.update({
      where: { id: Number(id) },
      data: {
        servicio: servicio || undefined,
        habitacion: habitacion || undefined,
        cama: cama || undefined,
        formaIngreso: formaIngreso || undefined,
        observaciones: observaciones || undefined,
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
    });

    // Serializar BigInt a string
    const admisionSerializada = JSON.parse(
      JSON.stringify(admisionActualizada, (_key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return res.status(200).json({
      message: 'Admisión actualizada exitosamente',
      admision: admisionSerializada,
    });
  } catch (error) {
    console.error('Error al actualizar admisión:', error);
    return res.status(500).json({
      error: 'Error al actualizar admisión',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

/**
 * Registrar alta del paciente
 * PATCH /api/admisiones/:id/alta
 */
export const registrarAlta = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      fechaAlta,
      horaAlta,
      tipoAlta, // MEJORIA | VOLUNTARIA | TRANSFERENCIA | FALLECIMIENTO | FUGA | ADMINISTRATIVA
    } = req.body;

    if (!fechaAlta || !tipoAlta) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: fechaAlta, tipoAlta',
      });
    }

    // Verificar que la admisión existe y está activa
    const admisionExistente = await prisma.admision.findUnique({
      where: { id: Number(id) },
    });

    if (!admisionExistente) {
      return res.status(404).json({
        error: 'Admisión no encontrada',
      });
    }

    if (admisionExistente.estado !== 'ACTIVA') {
      return res.status(400).json({
        error: 'La admisión no está activa',
      });
    }

    // Calcular días de hospitalización
    const fechaAdmision = new Date(admisionExistente.fechaAdmision);
    const fechaAltaDate = new Date(fechaAlta);
    const diasHosp = Math.ceil(
      (fechaAltaDate.getTime() - fechaAdmision.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Actualizar admisión con alta
    const admisionActualizada = await prisma.admision.update({
      where: { id: Number(id) },
      data: {
        estado: 'ALTA',
        fechaAlta: new Date(fechaAlta),
        horaAlta: horaAlta || null,
        tipoAlta,
        estanciaHospitalaria: {
          upsert: {
            create: {
              fechaAlta: new Date(fechaAlta),
              diasHosp,
            },
            update: {
              fechaAlta: new Date(fechaAlta),
              diasHosp,
            },
          },
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
        estanciaHospitalaria: true,
      },
    });

    // Serializar BigInt a string
    const admisionSerializada = JSON.parse(
      JSON.stringify(admisionActualizada, (_key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return res.status(200).json({
      message: 'Alta registrada exitosamente',
      admision: admisionSerializada,
      diasHospitalizacion: diasHosp,
    });
  } catch (error) {
    console.error('Error al registrar alta:', error);
    return res.status(500).json({
      error: 'Error al registrar alta',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

/**
 * Activar una admisión que está en estado EN_ESPERA
 * PATCH /api/admisiones/:id/activar
 */
export const activarAdmision = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar que la admisión existe
    const admisionExistente = await prisma.admision.findUnique({
      where: { id: Number(id) },
    });

    if (!admisionExistente) {
      return res.status(404).json({
        error: 'Admisión no encontrada',
      });
    }

    if (admisionExistente.estado === 'ACTIVA') {
      return res.status(400).json({
        error: 'La admisión ya está activa',
      });
    }

    if (admisionExistente.estado === 'ALTA') {
      return res.status(400).json({
        error: 'La admisión ya tiene alta registrada',
      });
    }

    // Activar la admisión
    const admisionActualizada = await prisma.admision.update({
      where: { id: Number(id) },
      data: {
        estado: 'ACTIVA',
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
        createdBy: {
          select: {
            id: true,
            nombre: true,
            cargo: true,
          },
        },
      },
    });

    // Serializar BigInt a string
    const admisionSerializada = JSON.parse(
      JSON.stringify(admisionActualizada, (_key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return res.status(200).json({
      message: 'Admisión activada exitosamente',
      admision: admisionSerializada,
    });
  } catch (error) {
    console.error('Error al activar admisión:', error);
    return res.status(500).json({
      error: 'Error al activar admisión',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

/**
 * Listar pacientes hospitalizados actualmente (admisiones activas)
 * GET /api/admisiones/activas
 * 
 * Filtra:
 * - Estado: ACTIVA
 * - Tipo: EMERGENCIA, HOSPITALIZACION, UCI, CIRUGIA
 * - Para EMERGENCIA: Solo si requiereHospitalizacion = true
 * - Para otros tipos: Todos se consideran hospitalizados
 */
export const listarAdmisionesActivas = async (req: Request, res: Response) => {
  try {
    const { servicio, tipo } = req.query;

    const filtros: any = {
      estado: 'ACTIVA',
      // Solo admisiones que requieren hospitalización física
      tipo: {
        in: ['EMERGENCIA', 'HOSPITALIZACION', 'UCI', 'CIRUGIA'],
      },
    };

    if (servicio) {
      filtros.servicio = servicio as string;
    }

    // Si se especifica un tipo, sobrescribir el filtro
    if (tipo) {
      filtros.tipo = tipo as string;
    }

    const admisiones = await prisma.admision.findMany({
      where: filtros,
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
          },
        },
        // Incluir formato de emergencia para verificar requiereHospitalizacion
        formatoEmergencia: {
          select: {
            requiereHospitalizacion: true,
          },
        },
      },
      orderBy: {
        fechaAdmision: 'desc',
      },
    });

    // Filtrar admisiones: excluir emergencias que NO requieran hospitalización
    const admisionesFiltradas = admisiones.filter((admision) => {
      // Si es emergencia, solo incluir si requiereHospitalizacion = true
      if (admision.tipo === 'EMERGENCIA') {
        return admision.formatoEmergencia?.requiereHospitalizacion === true;
      }
      // Otros tipos (HOSPITALIZACION, UCI, CIRUGIA) siempre se incluyen
      return true;
    });

    // Calcular días de hospitalización para cada admisión activa
    const admisionesConDias = admisionesFiltradas.map((admision) => {
      const fechaAdmision = new Date(admision.fechaAdmision);
      const hoy = new Date();
      const diasHospitalizacion = Math.ceil(
        (hoy.getTime() - fechaAdmision.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Remover formatoEmergencia del objeto antes de serializar
      const { formatoEmergencia, ...admisionSinFormato } = admision;

      return {
        ...admisionSinFormato,
        diasHospitalizacion,
      };
    });

    // Serializar BigInt a string
    const admisionesSerializadas = JSON.parse(
      JSON.stringify(admisionesConDias, (_key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return res.status(200).json({
      total: admisionesFiltradas.length,
      admisiones: admisionesSerializadas,
    });
  } catch (error) {
    console.error('Error al listar admisiones activas:', error);
    return res.status(500).json({
      error: 'Error al listar admisiones activas',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

/**
 * Listar pacientes en emergencia actualmente
 * GET /api/admisiones/emergencias-activas
 * 
 * Retorna todas las admisiones de tipo EMERGENCIA con estado ACTIVA
 */
export const listarEmergenciasActivas = async (_req: Request, res: Response) => {
  try {
    const admisiones = await prisma.admision.findMany({
      where: {
        tipo: 'EMERGENCIA',
        estado: 'ACTIVA',
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
        createdBy: {
          select: {
            id: true,
            nombre: true,
            cargo: true,
          },
        },
        formatoEmergencia: {
          select: {
            requiereHospitalizacion: true,
            impresionDx: true,
            observaciones: true,
          },
        },
      },
      orderBy: {
        fechaAdmision: 'desc',
      },
    });

    // Calcular tiempo en emergencia para cada admisión
    const admisionesConTiempo = admisiones.map((admision) => {
      const fechaAdmision = new Date(admision.fechaAdmision);
      const hoy = new Date();
      const horasEnEmergencia = Math.ceil(
        (hoy.getTime() - fechaAdmision.getTime()) / (1000 * 60 * 60)
      );

      return {
        ...admision,
        horasEnEmergencia,
      };
    });

    // Serializar BigInt a string
    const admisionesSerializadas = JSON.parse(
      JSON.stringify(admisionesConTiempo, (_key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return res.status(200).json({
      total: admisiones.length,
      admisiones: admisionesSerializadas,
    });
  } catch (error) {
    console.error('Error al listar emergencias activas:', error);
    return res.status(500).json({
      error: 'Error al listar emergencias activas',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

/**
 * Listar emergencias pendientes de hospitalización
 * GET /api/admisiones/emergencias-pendientes-hospitalizacion
 * 
 * Retorna admisiones EMERGENCIA donde:
 * - Estado: ACTIVA
 * - formatoEmergencia.requiereHospitalizacion = true
 * - NO tienen admisión de HOSPITALIZACION asociada
 */
export const listarEmergenciasPendientesHospitalizacion = async (_req: Request, res: Response) => {
  try {
    // Obtener todas las admisiones de emergencia activas con requiereHospitalizacion=true
    const emergencias = await prisma.admision.findMany({
      where: {
        tipo: 'EMERGENCIA',
        estado: 'ACTIVA',
        formatoEmergencia: {
          requiereHospitalizacion: true,
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
        createdBy: {
          select: {
            id: true,
            nombre: true,
            cargo: true,
          },
        },
        formatoEmergencia: {
          select: {
            impresionDx: true,
            observaciones: true,
            requiereHospitalizacion: true,
          },
        },
      },
      orderBy: {
        fechaAdmision: 'asc', // Más antiguos primero (más urgentes)
      },
    });

    // Filtrar solo los que NO tienen admisión de hospitalización
    const pendientes = [];
    for (const emergencia of emergencias) {
      // Verificar si ya existe una admisión de hospitalización para este paciente
      const hospitalizacionExistente = await prisma.admision.findFirst({
        where: {
          pacienteId: emergencia.pacienteId,
          tipo: {
            in: ['HOSPITALIZACION', 'UCI', 'CIRUGIA'],
          },
          estado: 'ACTIVA',
        },
      });

      if (!hospitalizacionExistente) {
        // Calcular tiempo en emergencia
        const fechaAdmision = new Date(emergencia.fechaAdmision);
        const hoy = new Date();
        const horasEnEmergencia = Math.ceil(
          (hoy.getTime() - fechaAdmision.getTime()) / (1000 * 60 * 60)
        );

        pendientes.push({
          ...emergencia,
          horasEnEmergencia,
        });
      }
    }

    // Serializar BigInt a string
    const pendientesSerializados = JSON.parse(
      JSON.stringify(pendientes, (_key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return res.status(200).json({
      total: pendientes.length,
      admisiones: pendientesSerializados,
    });
  } catch (error) {
    console.error('Error al listar emergencias pendientes:', error);
    return res.status(500).json({
      error: 'Error al listar emergencias pendientes de hospitalización',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

/**
 * Crear admisión de hospitalización desde emergencia
 * POST /api/admisiones/hospitalizar-desde-emergencia
 * 
 * Crea una nueva admisión de HOSPITALIZACION para un paciente
 * que está en EMERGENCIA y requiere hospitalización
 */
export const hospitalizarDesdeEmergencia = async (req: Request, res: Response) => {
  try {
    const {
      admisionEmergenciaId,
      servicio,
      habitacion,
      cama,
      observaciones,
      createdById,
    } = req.body;

    // Validaciones
    if (!admisionEmergenciaId || !servicio || !cama) {
      return res.status(400).json({
        error: 'Campos requeridos: admisionEmergenciaId, servicio, cama',
      });
    }

    // Verificar que la admisión de emergencia existe y requiere hospitalización
    const admisionEmergencia = await prisma.admision.findUnique({
      where: { id: Number(admisionEmergenciaId) },
      include: {
        formatoEmergencia: true,
        paciente: true,
      },
    });

    if (!admisionEmergencia) {
      return res.status(404).json({
        error: 'Admisión de emergencia no encontrada',
      });
    }

    if (admisionEmergencia.tipo !== 'EMERGENCIA') {
      return res.status(400).json({
        error: 'La admisión proporcionada no es de tipo EMERGENCIA',
      });
    }

    if (!admisionEmergencia.formatoEmergencia?.requiereHospitalizacion) {
      return res.status(400).json({
        error: 'Esta emergencia no requiere hospitalización según el formato',
      });
    }

    // Verificar que no exista ya una hospitalización activa
    const hospitalizacionExistente = await prisma.admision.findFirst({
      where: {
        pacienteId: admisionEmergencia.pacienteId,
        tipo: {
          in: ['HOSPITALIZACION', 'UCI', 'CIRUGIA'],
        },
        estado: 'ACTIVA',
      },
    });

    if (hospitalizacionExistente) {
      return res.status(400).json({
        error: 'El paciente ya tiene una admisión de hospitalización activa',
      });
    }

    // Crear la nueva admisión de hospitalización
    const admisionHospitalizacion = await prisma.admision.create({
      data: {
        pacienteId: admisionEmergencia.pacienteId,
        tipo: 'HOSPITALIZACION',
        servicio,
        fechaAdmision: new Date(),
        horaAdmision: new Date().toTimeString().slice(0, 5),
        habitacion: habitacion || null,
        cama,
        estado: 'ACTIVA',
        observaciones: observaciones || null,
        createdById: createdById ? Number(createdById) : null,
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
        createdBy: {
          select: {
            id: true,
            nombre: true,
            cargo: true,
          },
        },
      },
    });

    // Serializar BigInt a string
    const admisionSerializada = JSON.parse(
      JSON.stringify(admisionHospitalizacion, (_key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return res.status(201).json({
      message: 'Paciente hospitalizado exitosamente',
      admision: admisionSerializada,
    });
  } catch (error) {
    console.error('Error al hospitalizar desde emergencia:', error);
    return res.status(500).json({
      error: 'Error al crear admisión de hospitalización',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

/**
 * Listar admisiones por servicio
 * GET /api/admisiones/servicio/:servicio
 */
export const listarAdmisionesPorServicio = async (req: Request, res: Response) => {
  try {
    const { servicio } = req.params;
    const { estado } = req.query;

    const filtros: any = {
      servicio: servicio as string,
    };

    if (estado) {
      filtros.estado = estado as string;
    }

    const admisiones = await prisma.admision.findMany({
      where: filtros,
      include: {
        paciente: {
          select: {
            id: true,
            nroHistoria: true,
            apellidosNombres: true,
            ci: true,
            fechaNacimiento: true,
          },
        },
      },
      orderBy: {
        fechaAdmision: 'desc',
      },
    });

    // Serializar BigInt a string
    const admisionesSerializadas = JSON.parse(
      JSON.stringify(admisiones, (_key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return res.status(200).json({
      total: admisiones.length,
      servicio,
      admisiones: admisionesSerializadas,
    });
  } catch (error) {
    console.error('Error al listar admisiones por servicio:', error);
    return res.status(500).json({
      error: 'Error al listar admisiones por servicio',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};

/**
 * Obtener admisiones activas de un médico específico
 * GET /api/admisiones/medico/:medicoId/activas
 */
export const obtenerAdmisionesActivasMedico = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { medicoId } = req.params;

    // Validar que medicoId sea un número válido
    if (!medicoId || isNaN(Number(medicoId))) {
      res.status(400).json({
        error: 'ID de médico inválido',
      });
      return;
    }

    logger.info(`Obteniendo admisiones activas del médico ${medicoId}`);

    // Verificar que el médico existe
    const medico = await prisma.usuario.findUnique({
      where: { id: Number(medicoId) },
    });

    if (!medico) {
      res.status(404).json({
        error: 'Médico no encontrado',
      });
      return;
    }

    // Obtener admisiones activas creadas por este médico
    const admisiones = await prisma.admision.findMany({
      where: {
        estado: 'ACTIVA',
        createdById: Number(medicoId),
        tipo: {
          in: ['EMERGENCIA', 'HOSPITALIZACION', 'UCI', 'CIRUGIA'],
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
        createdBy: {
          select: {
            id: true,
            nombre: true,
            cargo: true,
            especialidad: true,
          },
        },
        formatoEmergencia: {
          select: {
            requiereHospitalizacion: true,
          },
        },
      },
      orderBy: {
        fechaAdmision: 'desc',
      },
    });

    // Filtrar admisiones: excluir emergencias que NO requieran hospitalización
    const admisionesFiltradas = admisiones.filter((admision) => {
      if (admision.tipo === 'EMERGENCIA') {
        return admision.formatoEmergencia?.requiereHospitalizacion === true;
      }
      return true;
    });

    // Calcular días de hospitalización para cada admisión
    const admisionesConDias = admisionesFiltradas.map((admision) => {
      const fechaAdmision = new Date(admision.fechaAdmision);
      const hoy = new Date();
      const diasHospitalizacion = Math.ceil(
        (hoy.getTime() - fechaAdmision.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        ...admision,
        diasHospitalizacion: diasHospitalizacion > 0 ? diasHospitalizacion : 0,
      };
    });

    // Serializar BigInt
    const admisionesSerializadas = convertBigIntToString(admisionesConDias);

    logger.info(`Se encontraron ${admisionesFiltradas.length} admisiones activas para el médico ${medicoId}`);

    res.status(200).json({
      success: true,
      data: admisionesSerializadas,
      total: admisionesFiltradas.length,
      medicoId: Number(medicoId),
    });
  } catch (error) {
    logger.error('Error al obtener admisiones activas del médico:', error);
    res.status(500).json({
      error: 'Error al obtener admisiones',
      details: error instanceof Error ? error.message : 'Error desconocido',
    });
  }
};
