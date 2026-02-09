import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validarDisponibilidadMedico } from '../services/disponibilidad';
const prisma = new PrismaClient();
const router = Router();

// POST /api/citas
router.post('/', async (req: Request, res: Response) => {
  const { pacienteId, medicoId, especialidad, fechaCita, horaCita, motivo } = req.body;
  const fecha = new Date(fechaCita);
  const validacion = await validarDisponibilidadMedico(medicoId, especialidad, fecha, horaCita);

  if (!validacion.disponible) {
    return res.status(409).json({
      ok: false,
      motivo: validacion.motivo,
      alternativas: validacion.alternativas || [],
    });
  }

  const cita = await prisma.cita.create({
    data: {
      pacienteId,
      medicoId,
      especialidad,
      fechaCita: fecha,
      horaCita,
      motivo,
      estado: 'PROGRAMADA',
    },
  });
  return res.json({ ok: true, citaId: cita.id });
});

export default router;
