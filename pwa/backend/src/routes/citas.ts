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
  obtenerCitasHoyMedico,
  obtenerCitasProximosMedico,
  iniciarCita,
  completarCita,
} from '../controllers/citas'

const router = Router()

// Crear una nueva cita
router.post('/', crearCita)

// Listar citas próximas (sin autenticación para testing)
router.get('/lista/proximas', listarCitasProximas)

// Obtener especialidades disponibles
router.get('/info/especialidades', obtenerEspecialidades)

// Obtener citas de un paciente
router.get('/paciente/:pacienteId', obtenerCitasPorPaciente)

// Obtener citas de un médico
router.get('/medico/:medicoId', obtenerCitasPorMedico)

// Obtener citas de hoy para un médico
router.get('/medico/:medicoId/hoy', obtenerCitasHoyMedico)

// Obtener citas de los próximos días para un médico
router.get('/medico/:medicoId/proximos', obtenerCitasProximosMedico)

// Obtener una cita específica
router.get('/:id', obtenerCita)

// Actualizar una cita
router.put('/:id', actualizarCita)

// Iniciar una cita (médico comienza atención)
router.patch('/:id/iniciar', iniciarCita)

// Completar una cita
router.patch('/:id/completar', completarCita)

// Cancelar una cita
router.patch('/:id/cancelar', cancelarCita)

export default router
