import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { obtenerHorariosDisponibles } from '../services/disponibilidad';
const prisma = new PrismaClient();
const router = Router();

// GET /api/medicos/especialidad/:especialidad
router.get('/especialidad/:especialidad', async (req: Request, res: Response) => {
  const { especialidad } = req.params;
  const medicos = await prisma.usuario.findMany({
    where: {
      especialidad,
      role: 'MEDICO',
      horarioMedico: { some: { activo: true } },
    },
    include: {
      horarioMedico: true,
    },
  });
  const result = medicos.map(medico => ({
    id: medico.id,
    nombre: medico.nombre,
    especialidad: medico.especialidad,
    dias: medico.horarioMedico.map(h => h.diaSemana),
    horarios: medico.horarioMedico.map(h => ({
      diaSemana: h.diaSemana,
      horaInicio: h.horaInicio,
      horaFin: h.horaFin,
    })),
  }));
  res.json(result);
});

// GET /api/medicos/:medicoId/disponibilidad?fecha=YYYY-MM-DD
router.get('/:medicoId/disponibilidad', async (req: Request, res: Response) => {
  const medicoId = Number(req.params.medicoId);
  const fecha = new Date(req.query.fecha as string);
  const especialidad = req.query.especialidad as string;
  const disponibles = await obtenerHorariosDisponibles(medicoId, especialidad, fecha);
  res.json({ medicoId, fecha: fecha.toISOString().slice(0, 10), disponibles });
});

export default router;
