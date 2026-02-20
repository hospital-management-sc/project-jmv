/**
 * Rutas de Interconsultas Médicas
 */

import { Router } from 'express';
import {
  crearInterconsulta,
  obtenerInterconsultasPendientes,
  obtenerInterconsultasRecibidas,
  obtenerInterconsultasEnviadas,
  obtenerInterconsultasPaciente,
  aceptarInterconsulta,
  completarInterconsulta,
  rechazarInterconsulta,
  obtenerDetalleInterconsulta,
  obtenerEspecialidades,
  obtenerMedicosPorEspecialidad,
} from '../controllers/interconsultas';

const router = Router();

// Rutas de consulta
router.get('/especialidades', obtenerEspecialidades);
router.get('/medicos/:especialidad', obtenerMedicosPorEspecialidad);
router.get('/pendientes/:especialidad', obtenerInterconsultasPendientes);
router.get('/recibidas/:medicoId', obtenerInterconsultasRecibidas);
router.get('/enviadas/:medicoId', obtenerInterconsultasEnviadas);
router.get('/paciente/:pacienteId', obtenerInterconsultasPaciente);
router.get('/:id/detalle', obtenerDetalleInterconsulta);

// Rutas de acción
router.post('/', crearInterconsulta);
router.patch('/:id/aceptar', aceptarInterconsulta);
router.patch('/:id/completar', completarInterconsulta);
router.patch('/:id/rechazar', rechazarInterconsulta);

export default router;
