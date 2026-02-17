/**
 * Formato Emergencia Controller
 * Maneja el formato de emergencia para admisiones de emergencia
 */

import { Request, Response } from 'express';
import { getPrismaClient } from '../database/connection';
import logger from '../utils/logger';

const prisma = getPrismaClient();

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
 * Crear o actualizar formato de emergencia
 * POST /api/formato-emergencia
 */
export const crearOActualizarFormatoEmergencia = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      admisionId,
      // ANAMNESIS
      motivoConsulta,
      enfermedadActual,
      antecedentesPersonales,
      antecedentesFamiliares,
      habitosPsicobiologicos,
      // EXAMEN FISICO
      fechaExamen,
      horaExamen,
      peso,
      talla,
      fc,
      fr,
      temperatura,
      taSistolica,
      taDiastolica,
      examenGeneral,
      // EXAMEN REGIONAL
      piel,
      cabeza,
      cuello,
      torax,
      pulmones,
      cardiovascular,
      abdomen,
      genital,
      anoRecto,
      neurologico,
      // IMPRESION DIAGNOSTICA
      impresionDx,
      requiereHospitalizacion,
      observaciones,
    } = req.body;

    // Validaciones básicas
    if (!admisionId) {
      res.status(400).json({
        success: false,
        error: 'admisionId es requerido',
      });
      return;
    }

    // Verificar que la admisión existe y es de tipo EMERGENCIA
    const admision = await prisma.admision.findUnique({
      where: { id: Number(admisionId) },
    });

    if (!admision) {
      res.status(404).json({
        success: false,
        error: 'Admisión no encontrada',
      });
      return;
    }

    if (admision.tipo !== 'EMERGENCIA') {
      res.status(400).json({
        success: false,
        error: 'Esta admisión no es de tipo EMERGENCIA',
      });
      return;
    }

    // Preparar datos para insertar/actualizar
    const dataFormato = {
      motivoConsulta: motivoConsulta || null,
      enfermedadActual: enfermedadActual || null,
      antecedentesPersonales: antecedentesPersonales || null,
      antecedentesFamiliares: antecedentesFamiliares || null,
      habitosPsicobiologicos: habitosPsicobiologicos || null,
      fechaExamen: fechaExamen ? new Date(fechaExamen) : null,
      horaExamen: horaExamen ? new Date(`1970-01-01T${horaExamen}`) : null,
      peso: peso ? parseFloat(peso) : null,
      talla: talla ? parseFloat(talla) : null,
      fc: fc ? parseInt(fc) : null,
      fr: fr ? parseInt(fr) : null,
      temperatura: temperatura ? parseFloat(temperatura) : null,
      taSistolica: taSistolica ? parseInt(taSistolica) : null,
      taDiastolica: taDiastolica ? parseInt(taDiastolica) : null,
      examenGeneral: examenGeneral || null,
      piel: piel || null,
      cabeza: cabeza || null,
      cuello: cuello || null,
      torax: torax || null,
      pulmones: pulmones || null,
      cardiovascular: cardiovascular || null,
      abdomen: abdomen || null,
      genital: genital || null,
      anoRecto: anoRecto || null,
      neurologico: neurologico || null,
      impresionDx: impresionDx || null,
      requiereHospitalizacion: requiereHospitalizacion === true,
      observaciones: observaciones || null,
    };

    // Verificar si ya existe un formato para esta admisión
    const formatoExistente = await prisma.formatoEmergencia.findUnique({
      where: { admisionId: Number(admisionId) },
    });

    let formato;

    if (formatoExistente) {
      // Actualizar formato existente
      formato = await prisma.formatoEmergencia.update({
        where: { admisionId: Number(admisionId) },
        data: dataFormato,
      });

      logger.info(`Formato de emergencia actualizado para admisión ${admisionId}`);
    } else {
      // Crear nuevo formato
      formato = await prisma.formatoEmergencia.create({
        data: {
          admisionId: Number(admisionId),
          ...dataFormato,
        },
      });

      logger.info(`Formato de emergencia creado para admisión ${admisionId}`);
    }

    res.status(200).json({
      success: true,
      message: formatoExistente
        ? 'Formato de emergencia actualizado exitosamente'
        : 'Formato de emergencia creado exitosamente',
      data: convertBigIntToString(formato),
    });
  } catch (error: any) {
    logger.error('Error al guardar formato de emergencia:', error);
    res.status(500).json({
      success: false,
      error: 'Error al guardar formato de emergencia',
      details: error.message,
    });
  }
};

/**
 * Obtener formato de emergencia por admisionId
 * GET /api/formato-emergencia/:admisionId
 */
export const obtenerFormatoEmergencia = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { admisionId } = req.params;

    const formato = await prisma.formatoEmergencia.findUnique({
      where: { admisionId: Number(admisionId) },
      include: {
        admision: {
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
          },
        },
      },
    });

    if (!formato) {
      res.status(404).json({
        success: false,
        error: 'Formato de emergencia no encontrado',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: convertBigIntToString(formato),
    });
  } catch (error: any) {
    logger.error('Error al obtener formato de emergencia:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener formato de emergencia',
      details: error.message,
    });
  }
};
