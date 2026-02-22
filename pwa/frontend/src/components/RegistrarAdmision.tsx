/**
 * Componente para Registrar Nueva Admisión de HOSPITALIZACIÓN
 * Solo para personal administrativo (AdminDashboard)
 * Permite buscar paciente y asignar cama/servicio
 */

import { useState } from 'react';
import styles from './RegistrarAdmision.module.css';
import type { CrearAdmisionDTO } from '../services/admisiones.service';
import admisionesService from '../services/admisiones.service';
import pacientesService from '../services/pacientes.service';
import RegistrarPaciente from './RegistrarPaciente';

interface RegistrarAdmisionProps {
  onBack: () => void;
}

const SERVICIOS_DISPONIBLES = [
  'EMERGENCIA',
  'MEDICINA_INTERNA',
  'CIRUGIA_GENERAL',
  'TRAUMATOLOGIA',
  'UCI',
  'PEDIATRIA',
  'GINECO_OBSTETRICIA',
  'CARDIOLOGIA',
  'NEUROLOGIA',
];

export default function RegistrarAdmision({ onBack }: RegistrarAdmisionProps) {
  const [paso, setPaso] = useState<'busqueda' | 'registro' | 'formulario'>('busqueda');
  
  // Búsqueda de paciente
  const [busquedaCITipo, setBusquedaCITipo] = useState('V');
  const [busquedaCINumeros, setBusquedaCINumeros] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<any>(null);
  const [buscando, setBuscando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');

  // Formulario de admisión (siempre HOSPITALIZACIÓN)
  const [formData, setFormData] = useState<Partial<CrearAdmisionDTO>>({
    tipo: 'HOSPITALIZACION',
    servicio: '',
    fechaAdmision: new Date().toISOString().split('T')[0],
    horaAdmision: new Date().toTimeString().slice(0, 5),
    formaIngreso: 'AMBULANTE',
    habitacion: '',
    cama: '',
    observaciones: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const buscarPaciente = async () => {
    if (!busquedaCINumeros.trim() || busquedaCINumeros.length < 7) {
      setErrorBusqueda('CI debe tener al menos 7 dígitos');
      return;
    }

    setBuscando(true);
    setErrorBusqueda('');
    setPacienteSeleccionado(null);

    try {
      const ciCompleta = `${busquedaCITipo}-${busquedaCINumeros}`;
      const result = await pacientesService.buscarPorCI(ciCompleta);
      
      if (result) {
        setPacienteSeleccionado(result);
        setFormData((prev) => ({
          ...prev,
          pacienteId: result.id.toString(),
        }));
        setPaso('formulario');
      } else {
        // Paciente no existe → Mostrar opción de registro
        setErrorBusqueda('No se encontró paciente con ese CI');
      }
    } catch (err) {
      setErrorBusqueda('Error al buscar paciente');
      console.error(err);
    } finally {
      setBuscando(false);
    }
  };

  const handlePacienteRegistrado = (paciente: any) => {
    setPacienteSeleccionado(paciente);
    setFormData((prev) => ({
      ...prev,
      pacienteId: paciente.id.toString(),
    }));
    setPaso('formulario');
  };

  const handleCancelarRegistro = () => {
    setPaso('busqueda');
    setBusquedaCINumeros('');
    setErrorBusqueda('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!pacienteSeleccionado) {
      setError('Debe buscar y seleccionar un paciente primero');
      return;
    }

    if (!formData.servicio || !formData.fechaAdmision) {
      setError('Complete los campos requeridos (Servicio, Fecha)');
      return;
    }

    setSubmitting(true);

    try {
      const dataToSend: CrearAdmisionDTO = {
        pacienteId: pacienteSeleccionado.id,
        tipo: 'HOSPITALIZACION',
        servicio: formData.servicio,
        fechaAdmision: formData.fechaAdmision!,
        horaAdmision: formData.horaAdmision || undefined,
        formaIngreso: formData.formaIngreso as any,
        habitacion: formData.habitacion || undefined,
        cama: formData.cama || undefined,
        observaciones: formData.observaciones || undefined,
      };

      const response = await admisionesService.crearAdmision(dataToSend);
      
      setSuccess(`Admisión de hospitalización creada exitosamente. ID: ${response.admision.id}`);
      
      // Limpiar formulario después de 3 segundos
      setTimeout(() => {
        setPacienteSeleccionado(null);
        setBusquedaCITipo('V');
        setBusquedaCINumeros('');
        setPaso('busqueda');
        setFormData({
          tipo: 'HOSPITALIZACION',
          servicio: '',
          fechaAdmision: new Date().toISOString().split('T')[0],
          horaAdmision: new Date().toTimeString().slice(0, 5),
          formaIngreso: 'AMBULANTE',
          habitacion: '',
          cama: '',
          observaciones: '',
        });
        setSuccess('');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Error al crear admisión');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCINumerosChange = (value: string) => {
    const soloNumeros = value.replace(/\D/g, '').slice(0, 8);
    setBusquedaCINumeros(soloNumeros);
    setErrorBusqueda('');
  };

  const calcularEdad = (fechaNac: string | undefined) => {
    if (!fechaNac) return 'N/A';
    const hoy = new Date();
    const nacimiento = new Date(fechaNac);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🏥 Nueva Admisión de Hospitalización</h1>
        <p className={styles.subtitle}>
          Busque al paciente y asigne cama/servicio para hospitalización
        </p>
      </div>

      {/* Paso 1: Búsqueda de Paciente */}
      {paso === 'busqueda' && (
        <>
          <div className={styles.section}>
            <h3>Paso 1: Buscar Paciente por CI</h3>
            <div className={styles.busquedaContainer}>
              <div className={styles.busquedaInput}>
                <select
                  value={busquedaCITipo}
                  onChange={(e) => setBusquedaCITipo(e.target.value)}
                  disabled={buscando}
                >
                  <option value="V">V</option>
                  <option value="E">E</option>
                  <option value="P">P</option>
                </select>
                <input
                  type="text"
                  placeholder="12345678"
                  value={busquedaCINumeros}
                  onChange={(e) => handleCINumerosChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && buscarPaciente()}
                  disabled={buscando}
                  maxLength={8}
                  inputMode="numeric"
                />
                <button onClick={buscarPaciente} disabled={buscando}>
                  {buscando ? '🔍 Buscando...' : '🔍 Buscar'}
                </button>
              </div>
              {errorBusqueda && (
                <>
                  <div className={styles.errorMsg}>⚠️ {errorBusqueda}</div>
                  <div className={styles.registroSuggestion}>
                    <p>¿El paciente no está registrado?</p>
                    <button
                      onClick={() => setPaso('registro')}
                      className={styles.registrarBtn}
                    >
                      Registrar nuevo paciente
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <button onClick={onBack} className={styles.cancelBtn}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Volver
            </button>
          </div>
        </>
      )}

      {/* Paso 2: Registrar Paciente Nuevo */}
      {paso === 'registro' && (
        <>
          <div className={styles.registroHeader}>
            <h2>Registrar Nuevo Paciente</h2>
            <p>
              CI buscado: <strong>{busquedaCITipo}-{busquedaCINumeros}</strong>
            </p>
          </div>

          <RegistrarPaciente
            ciPreFilled={`${busquedaCITipo}-${busquedaCINumeros}`}
            onSuccess={handlePacienteRegistrado}
            onCancel={handleCancelarRegistro}
          />
        </>
      )}

      {/* Paso 3: Formulario de Admisión */}
      {paso === 'formulario' && pacienteSeleccionado && (
        <>
          <div className={styles.section}>
            <h3>Paso 2: Paciente Seleccionado</h3>
            <div className={styles.pacienteInfo}>
              <h4>✓ Paciente Encontrado:</h4>
              <div className={styles.pacienteGrid}>
                <div>
                  <strong>Nombre:</strong> {pacienteSeleccionado.apellidosNombres}
                </div>
                <div>
                  <strong>CI:</strong> {pacienteSeleccionado.ci}
                </div>
                <div>
                  <strong>Historia:</strong> {pacienteSeleccionado.nroHistoria}
                </div>
                <div>
                  <strong>Edad:</strong> {calcularEdad(pacienteSeleccionado.fechaNacimiento)} años
                </div>
                <div>
                  <strong>Sexo:</strong> {pacienteSeleccionado.sexo === 'M' ? 'Masculino' : 'Femenino'}
                </div>
                <div>
                  <strong>Admisiones previas:</strong> {pacienteSeleccionado.admisiones?.length || 0}
                </div>
              </div>
              <button
                onClick={() => {
                  setPacienteSeleccionado(null);
                  setPaso('busqueda');
                }}
                className={styles.cambiarPacienteBtn}
              >
                Buscar otro paciente
              </button>
            </div>
          </div>

          {/* Paso 3: Datos de Admisión */}
          {pacienteSeleccionado && (
            <form onSubmit={handleSubmit}>
              <div className={styles.section}>
                <h3>Paso 3: Datos de la Admisión de Hospitalización</h3>
                
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Fecha de Admisión *</label>
                    <input
                      type="date"
                      name="fechaAdmision"
                      value={formData.fechaAdmision}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Hora de Admisión</label>
                    <input
                      type="time"
                      name="horaAdmision"
                      value={formData.horaAdmision}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Servicio Hospitalario *</label>
                    <select
                      name="servicio"
                      value={formData.servicio}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione servicio...</option>
                      {SERVICIOS_DISPONIBLES.filter(s => s !== 'EMERGENCIA').map((servicio) => (
                        <option key={servicio} value={servicio}>
                          {servicio.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Habitación/Piso</label>
                    <input
                      type="text"
                      name="habitacion"
                      value={formData.habitacion}
                      onChange={handleInputChange}
                      placeholder="Ej: Piso 2 - Hab 201"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Cama *</label>
                    <input
                      type="text"
                      name="cama"
                      value={formData.cama}
                      onChange={handleInputChange}
                      placeholder="Ej: Cama A"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Forma de Ingreso</label>
                    <select
                      name="formaIngreso"
                      value={formData.formaIngreso}
                      onChange={handleInputChange}
                    >
                      <option value="AMBULANTE">Ambulante</option>
                      <option value="AMBULANCIA">Ambulancia</option>
                      <option value="TRANSFERENCIA">Transferencia</option>
                    </select>
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                    <label>Observaciones</label>
                    <textarea
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Información adicional..."
                    />
                  </div>
                </div>
              </div>

              {error && <div className={styles.errorAlert}>{error}</div>}
              {success && <div className={styles.successAlert}>{success}</div>}

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => {
                    setPacienteSeleccionado(null);
                    setPaso('busqueda');
                  }}
                  className={styles.cancelBtn}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  Volver a búsqueda
                </button>
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Creando admisión...' : 'Crear Admisión de Hospitalización'}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
