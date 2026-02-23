import { Router } from 'express';
import {
  crearOActualizarFormatoEmergencia,
  obtenerFormatoEmergencia,
} from '../controllers/formatoEmergencia';

const router = Router();

/**
 * @route   POST /api/formato-emergencia
 * @desc    Crear o actualizar formato de emergencia
 * @access  Private (Médico)
 */
router.post('/', crearOActualizarFormatoEmergencia);

/**
 * @route   GET /api/formato-emergencia/:admisionId
 * @desc    Obtener formato de emergencia por admisionId
 * @access  Private
 */
router.get('/:admisionId', obtenerFormatoEmergencia);

export default router;
