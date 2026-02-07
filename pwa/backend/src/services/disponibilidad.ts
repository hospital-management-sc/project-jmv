import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Valida la disponibilidad de un médico para una cita.
 * @param medicoId - ID del médico
 * @param especialidad - Especialidad requerida
 * @param fecha - Fecha de la cita (Date)
 * @param hora - Hora de la cita (string, formato HH:MM)
 * @returns { disponible: boolean, motivo?: string, alternativas?: Array<{fecha, hora}> }
 */
export async function validarDisponibilidadMedico(medicoId: number, especialidad: string, fecha: Date, hora: string) {
  // 1. Validar que el médico existe
  const medico = await prisma.usuario.findUnique({ where: { id: medicoId } });
  if (!medico) {
    return { disponible: false, motivo: 'El médico no existe.' };
  }

  // 2. Validar que atiende la especialidad
  if (medico.especialidad !== especialidad) {
    return { disponible: false, motivo: 'El médico no atiende la especialidad solicitada.' };
  }

  // 3. Validar que atiende ese día
  const diaSemana = fecha.getDay(); // 0=Domingo, 1=Lunes...
  const horario = await prisma.horarioMedico.findFirst({
    where: {
      usuarioId: medicoId,
      especialidad,
      diaSemana,
      activo: true,
    },
  });
  if (!horario) {
    return { disponible: false, motivo: 'El médico no atiende ese día.' };
  }

  // 4. Validar que la hora está en el rango
  if (hora < horario.horaInicio || hora > horario.horaFin) {
    return { disponible: false, motivo: 'La hora está fuera del rango de atención.' };
  }

  // 5. Validar que no excede la capacidad
  const citas = await prisma.cita.count({
    where: {
      medicoId,
      fechaCita: fecha,
      horaCita: hora,
      especialidad,
      estado: { in: ['PROGRAMADA', 'REALIZADA'] },
    },
  });
  if (citas >= horario.capacidadPorDia) {
    const alternativas = await sugerirFechasAlternativas(medicoId, especialidad, fecha);
    return { disponible: false, motivo: 'Capacidad máxima alcanzada.', alternativas };
  }

  return { disponible: true };
}

/**
 * Obtiene los horarios disponibles de un médico por especialidad, fecha y hora opcional.
 * @param medicoId - ID del médico
 * @param especialidad - Especialidad
 * @param fecha - Fecha (Date)
 * @param hora - Hora (string, formato HH:MM)
 * @returns Array de rangos horarios disponibles
 */
export async function obtenerHorariosDisponibles(medicoId: number, especialidad: string, fecha: Date, hora?: string) {
  const diaSemana = fecha.getDay();
  const horario = await prisma.horarioMedico.findFirst({
    where: {
      usuarioId: medicoId,
      especialidad,
      diaSemana,
      activo: true,
    },
  });
  if (!horario) return [];

  if (hora && hora.trim() !== '') {
    if (hora < horario.horaInicio || hora > horario.horaFin) {
      return [];
    }
  }

  // Buscar horas ocupadas
  const citas = await prisma.cita.findMany({
    where: {
      medicoId,
      fechaCita: fecha,
      especialidad,
      estado: { in: ['PROGRAMADA', 'REALIZADA'] },
    },
    select: { horaCita: true },
  });
  const horasOcupadas = citas.map((c: { horaCita: string | null }) => c.horaCita);

  if (hora && hora.trim() !== '') {
    return horasOcupadas.includes(hora) ? [] : [hora];
  }

  // Generar rango de horas disponibles
  const disponibles: string[] = [];
  let horaActual = horario.horaInicio;
  while (horaActual <= horario.horaFin) {
    if (!horasOcupadas.includes(horaActual)) {
      disponibles.push(horaActual);
    }
    // Avanzar 1 hora (puedes ajustar a intervalos de 30 min si lo prefieres)
    const [h, m] = horaActual.split(':').map(Number);
    const next = h + 1;
    horaActual = (next < 10 ? '0' : '') + next + ':' + (m < 10 ? '0' : '') + m;
  }
  return disponibles;
}

/**
 * Sugerir fechas alternativas si no hay disponibilidad.
 * @param medicoId - ID del médico
 * @param especialidad - Especialidad
 * @param fecha - Fecha solicitada
 * @returns Array de fechas y horas sugeridas
 */
export async function sugerirFechasAlternativas(medicoId: number, especialidad: string, fecha: Date) {
  const alternativas: Array<{ fecha: Date, hora: string }> = [];
  for (let i = 1; i <= 7; i++) {
    const nuevaFecha = new Date(fecha);
    nuevaFecha.setDate(fecha.getDate() + i);
    const disponibles = await obtenerHorariosDisponibles(medicoId, especialidad, nuevaFecha);
    if (disponibles.length > 0) {
      alternativas.push({ fecha: nuevaFecha, hora: disponibles[0] });
      if (alternativas.length >= 3) break;
    }
  }
  return alternativas;
}
