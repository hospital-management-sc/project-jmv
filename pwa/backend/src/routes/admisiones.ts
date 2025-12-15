import { Router } from 'express';
import {
  crearAdmision,
  obtenerAdmision,
  listarAdmisionesPaciente,
  actualizarAdmision,
  registrarAlta,
  activarAdmision,
  listarAdmisionesActivas,
  listarAdmisionesPorServicio,
  listarEmergenciasActivas,
  listarEmergenciasPendientesHospitalizacion,
  hospitalizarDesdeEmergencia,
} from '../controllers/admisiones';

const router = Router();

/**
 * @route   POST /api/admisiones
 * @desc    Crear nueva admisión
 * @access  Private (Administrativo)
 */
router.post('/', crearAdmision);

/**
 * @route   GET /api/admisiones/activas
 * @desc    Listar pacientes hospitalizados actualmente
 * @access  Private
 * @query   ?servicio=MEDICINA_INTERNA&tipo=HOSPITALIZACION
 */
router.get('/activas', listarAdmisionesActivas);

/**
 * @route   GET /api/admisiones/emergencias-activas
 * @desc    Listar pacientes en emergencia actualmente
 * @access  Private
 */
router.get('/emergencias-activas', listarEmergenciasActivas);

/**
 * @route   GET /api/admisiones/emergencias-pendientes-hospitalizacion
 * @desc    Listar emergencias que requieren hospitalización pero aún no tienen cama asignada
 * @access  Private (Administrativo)
 */
router.get('/emergencias-pendientes-hospitalizacion', listarEmergenciasPendientesHospitalizacion);

/**
 * @route   POST /api/admisiones/hospitalizar-desde-emergencia
 * @desc    Crear admisión de hospitalización para un paciente en emergencia
 * @access  Private (Administrativo)
 */
router.post('/hospitalizar-desde-emergencia', hospitalizarDesdeEmergencia);

/**
 * @route   GET /api/admisiones/servicio/:servicio
 * @desc    Listar admisiones por servicio
 * @access  Private
 * @query   ?estado=ACTIVA
 */
router.get('/servicio/:servicio', listarAdmisionesPorServicio);

/**
 * @route   GET /api/admisiones/paciente/:pacienteId
 * @desc    Listar todas las admisiones de un paciente
 * @access  Private
 */
router.get('/paciente/:pacienteId', listarAdmisionesPaciente);

/**
 * @route   GET /api/admisiones/:id
 * @desc    Obtener admisión específica con todos sus datos
 * @access  Private
 */
router.get('/:id', obtenerAdmision);

/**
 * @route   PUT /api/admisiones/:id
 * @desc    Actualizar datos de admisión
 * @access  Private (Administrativo)
 */
router.put('/:id', actualizarAdmision);

/**
 * @route   PATCH /api/admisiones/:id/activar
 * @desc    Activar una admisión que está en espera
 * @access  Private (Administrativo)
 */
router.patch('/:id/activar', activarAdmision);

/**
 * @route   PATCH /api/admisiones/:id/alta
 * @desc    Registrar alta del paciente
 * @access  Private (Médico/Administrativo)
 */
router.patch('/:id/alta', registrarAlta);

export default router;
