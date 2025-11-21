import { Router } from 'express'
import {
  crearCita,
  obtenerCitasPorPaciente,
  obtenerCitasPorMedico,
  obtenerCita,
  actualizarCita,
  cancelarCita,
  listarCitasProximas,
  obtenerEspecialidades,
} from '../controllers/citas'

const router = Router()

// Crear una nueva cita
router.post('/', crearCita)

// Obtener una cita específica
router.get('/:id', obtenerCita)

// Obtener citas de un paciente
router.get('/paciente/:pacienteId', obtenerCitasPorPaciente)

// Obtener citas de un médico
router.get('/medico/:medicoId', obtenerCitasPorMedico)

// Listar citas próximas (sin autenticación para testing)
router.get('/lista/proximas', listarCitasProximas)

// Obtener especialidades disponibles
router.get('/info/especialidades', obtenerEspecialidades)

// Actualizar una cita
router.put('/:id', actualizarCita)

// Cancelar una cita
router.patch('/:id/cancelar', cancelarCita)

export default router
