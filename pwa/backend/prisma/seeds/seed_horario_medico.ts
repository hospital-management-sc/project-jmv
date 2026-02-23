/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const horarios = [
    {
      usuarioId: 1,
      especialidad: 'Medicina Interna',
      diaSemana: 1,
      horaInicio: '08:00',
      horaFin: '12:00',
      capacidadPorDia: 10,
      activo: true,
    },
    {
      usuarioId: 1,
      especialidad: 'Medicina Interna',
      diaSemana: 3,
      horaInicio: '08:00',
      horaFin: '12:00',
      capacidadPorDia: 10,
      activo: true,
    },
    {
      usuarioId: 1,
      especialidad: 'Medicina Interna',
      diaSemana: 5,
      horaInicio: '08:00',
      horaFin: '12:00',
      capacidadPorDia: 10,
      activo: true,
    },
    {
      usuarioId: 2,
      especialidad: 'Pediatría',
      diaSemana: 2,
      horaInicio: '09:00',
      horaFin: '13:00',
      capacidadPorDia: 8,
      activo: true,
    },
    {
      usuarioId: 2,
      especialidad: 'Pediatría',
      diaSemana: 4,
      horaInicio: '09:00',
      horaFin: '13:00',
      capacidadPorDia: 8,
      activo: true,
    },
    {
      usuarioId: 2,
      especialidad: 'Pediatría',
      diaSemana: 5,
      horaInicio: '09:00',
      horaFin: '13:00',
      capacidadPorDia: 8,
      activo: true,
    },
  ];

  for (const horario of horarios) {
    await prisma.horarioMedico.create({ data: horario });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
