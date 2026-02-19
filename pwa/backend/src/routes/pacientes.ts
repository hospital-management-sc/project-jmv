/**
 * Pacientes Routes
 * Maneja todas las rutas relacionadas con pacientes
 */

import { Router } from 'express';
import { 
  crearPaciente, 
  obtenerPaciente, 
  buscarPaciente, 
  obtenerUltimos,
  listarPacientes,
  verificarCIDuplicada
} from '../controllers/pacientes';

const router = Router();

// Rutas públicas (en desarrollo)
// TODO: Agregar authMiddleware en producción
router.post('/', crearPaciente);
router.get('/ultimos', obtenerUltimos);
router.get('/', listarPacientes);

// Verificar si una CI ya existe (para validación de duplicados) - DEBE IR ANTES DE /:id
router.get('/check-duplicate', verificarCIDuplicada);

router.get('/search', buscarPaciente);
router.get('/:id', obtenerPaciente);

export default router;
