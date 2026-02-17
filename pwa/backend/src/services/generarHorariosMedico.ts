/**
 * Servicio: Generar Horarios por Defecto para Médicos
 * 
 * Cuando se registra un médico nuevo, se generan automáticamente sus horarios
 * basándose en templates predefinidos por especialidad.
 */

import { getPrismaClient } from '../database/connection';
import logger from '../utils/logger';

const prisma = getPrismaClient();

/**
 * Templates de horarios por especialidad
 * Basados en datos reales del hospital (DOCTORES_ACTIVOS_REGISTRO.md)
 */
export const HORARIOS_TEMPLATE = [
  // Medicina Interna: Lunes, Martes, Viernes 8am-5pm (15 pacientes/día)
  { especialidad: 'Medicina Interna', dias: [0, 1, 4], horaInicio: '08:00', horaFin: '17:00', capacidad: 15 },
  
  // Medicina Paliativa: Miércoles, Jueves 8am-3pm (12 pacientes/día)
  { especialidad: 'Medicina Paliativa', dias: [2, 3], horaInicio: '08:00', horaFin: '15:00', capacidad: 12 },
  
  // Cirugía General: Martes, Miércoles, Jueves 8am-5pm (10 pacientes/día)
  { especialidad: 'Cirugía General', dias: [1, 2, 3], horaInicio: '08:00', horaFin: '17:00', capacidad: 10 },
  
  // Pediatría: Lunes, Miércoles, Jueves 7am-3pm (20 pacientes/día)
  { especialidad: 'Pediatría', dias: [0, 2, 3], horaInicio: '07:00', horaFin: '15:00', capacidad: 20 },
  
  // Neumología Pediátrica: Miércoles 1pm-5pm (8 pacientes/día)
  { especialidad: 'Neumología Pediátrica', dias: [2], horaInicio: '13:00', horaFin: '17:00', capacidad: 8 },
  
  // Traumatología: Miércoles, Jueves, Viernes 8am-4pm (12 pacientes/día)
  { especialidad: 'Traumatología', dias: [2, 3, 4], horaInicio: '08:00', horaFin: '16:00', capacidad: 12 },
  
  // Cirugía de Manos: Lunes, Miércoles 8am-2pm (6 cirugías/día)
  { especialidad: 'Cirugía de Manos', dias: [0, 2], horaInicio: '08:00', horaFin: '14:00', capacidad: 6 },
  
  // Cirugía Pediátrica: Martes 9am-5pm (8 pacientes/día)
  { especialidad: 'Cirugía Pediátrica', dias: [1], horaInicio: '09:00', horaFin: '17:00', capacidad: 8 },
  
  // Odontología: Lunes a Viernes 8am-5pm (25 pacientes/día - alta demanda)
  { especialidad: 'Odontología', dias: [0, 1, 2, 3, 4], horaInicio: '08:00', horaFin: '17:00', capacidad: 25 },
  
  // Otorrinolaringología (múltiples rangos)
  { especialidad: 'Otorrinolaringología', dias: [0], horaInicio: '13:00', horaFin: '17:00', capacidad: 10 },
  { especialidad: 'Otorrinolaringología', dias: [2, 3], horaInicio: '07:00', horaFin: '15:00', capacidad: 15 },
  
  // Dermatología: Lunes a Viernes 8am-5pm (20 pacientes/día - alta demanda)
  { especialidad: 'Dermatología', dias: [0, 1, 2, 3, 4], horaInicio: '08:00', horaFin: '17:00', capacidad: 20 },
  
  // Fisiatría: Jueves 7am-3pm (15 pacientes/día)
  { especialidad: 'Fisiatría', dias: [3], horaInicio: '07:00', horaFin: '15:00', capacidad: 15 },
  
  // Ginecología (múltiples rangos)
  { especialidad: 'Ginecología', dias: [0], horaInicio: '13:00', horaFin: '17:00', capacidad: 12 },
  { especialidad: 'Ginecología', dias: [1, 2, 3, 4], horaInicio: '07:00', horaFin: '16:00', capacidad: 18 },
  
  // Gastroenterología: Lunes, Miércoles, Viernes 8am-4pm (12 pacientes/día)
  { especialidad: 'Gastroenterología', dias: [0, 2, 4], horaInicio: '08:00', horaFin: '16:00', capacidad: 12 },
  
  // Hematología: Miércoles 8am-4pm (10 pacientes/día)
  { especialidad: 'Hematología', dias: [2], horaInicio: '08:00', horaFin: '16:00', capacidad: 10 },
  
  // Psicología (múltiples rangos)
  { especialidad: 'Psicología', dias: [1], horaInicio: '13:00', horaFin: '18:00', capacidad: 12 },
  { especialidad: 'Psicología', dias: [3], horaInicio: '09:00', horaFin: '17:00', capacidad: 12 },
];

/**
 * Genera horarios por defecto para un médico
 * 
 * @param usuarioId - ID del usuario (médico)
 * @param especialidad - Especialidad del médico
 * @param nombreMedico - Nombre del médico (para logging)
 * @returns { exitoso: boolean, horariosCreados: number, mensaje: string }
 */
export async function generarHorariosPorDefecto(
  usuarioId: number,
  especialidad: string | null,
  nombreMedico: string
): Promise<{ exitoso: boolean; horariosCreados: number; mensaje: string }> {
  try {
    // Validar que tenga especialidad
    if (!especialidad || especialidad.trim() === '') {
      logger.warn(
        `[HORARIOS] No hay especialidad para generar horarios del médico: ${nombreMedico} (ID: ${usuarioId})`
      );
      return {
        exitoso: false,
        horariosCreados: 0,
        mensaje: 'No hay especialidad definida para generar horarios',
      };
    }

    // Buscar templates para esta especialidad
    const templates = HORARIOS_TEMPLATE.filter(
      (h) => h.especialidad.toLowerCase() === especialidad.toLowerCase()
    );

    if (templates.length === 0) {
      logger.warn(
        `[HORARIOS] Sin template de horario para especialidad: ${especialidad} (Médico: ${nombreMedico})`
      );
      return {
        exitoso: false,
        horariosCreados: 0,
        mensaje: `Sin template de horario para: ${especialidad}`,
      };
    }

    let horariosCreados = 0;

    // Crear horarios para cada template y día
    for (const template of templates) {
      for (const dia of template.dias) {
        try {
          // Verificar si ya existe este horario (evitar duplicados)
          const existeHorario = await prisma.horarioMedico.findUnique({
            where: {
              usuarioId_especialidad_diaSemana: {
                usuarioId,
                especialidad: template.especialidad,
                diaSemana: dia,
              },
            },
          });

          if (!existeHorario) {
            await prisma.horarioMedico.create({
              data: {
                usuarioId,
                especialidad: template.especialidad,
                diaSemana: dia,
                horaInicio: template.horaInicio,
                horaFin: template.horaFin,
                capacidadPorDia: template.capacidad,
                activo: true,
              },
            });
            horariosCreados++;
          }
        } catch (error: any) {
          logger.error(
            `[HORARIOS] Error al crear horario para ${nombreMedico}: ${error.message}`
          );
        }
      }
    }

    logger.info(
      `[HORARIOS] ✅ Generados ${horariosCreados} horarios para ${nombreMedico} en especialidad: ${especialidad}`
    );

    return {
      exitoso: true,
      horariosCreados,
      mensaje: `${horariosCreados} horarios generados exitosamente`,
    };
  } catch (error: any) {
    logger.error(`[HORARIOS] Error al generar horarios: ${error.message}`);
    return {
      exitoso: false,
      horariosCreados: 0,
      mensaje: `Error: ${error.message}`,
    };
  }
}

/**
 * Regenerar horarios para un médico existente
 * Útil cuando se necesita crear horarios para médicos registrados antes de esta funcionalidad
 * 
 * @param usuarioId - ID del usuario (médico)
 * @returns { exitoso: boolean, horariosCreados: number, mensaje: string }
 */
export async function regenerarHorariosMedico(usuarioId: number): Promise<{
  exitoso: boolean;
  horariosCreados: number;
  mensaje: string;
}> {
  try {
    // Buscar el médico
    const medico = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, nombre: true, especialidad: true, role: true },
    });

    if (!medico) {
      return {
        exitoso: false,
        horariosCreados: 0,
        mensaje: 'Médico no encontrado',
      };
    }

    if (medico.role !== 'MEDICO') {
      return {
        exitoso: false,
        horariosCreados: 0,
        mensaje: 'El usuario no es médico',
      };
    }

    // Eliminar horarios existentes (opcional)
    // await prisma.horarioMedico.deleteMany({
    //   where: { usuarioId }
    // })

    // Generar nuevos horarios
    return await generarHorariosPorDefecto(
      medico.id,
      medico.especialidad,
      medico.nombre || 'Médico sin nombre'
    );
  } catch (error: any) {
    logger.error(`[HORARIOS] Error al regenerar horarios: ${error.message}`);
    return {
      exitoso: false,
      horariosCreados: 0,
      mensaje: `Error: ${error.message}`,
    };
  }
}
