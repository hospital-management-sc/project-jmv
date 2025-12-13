/**
 * Componente Reutilizable para Registrar Nuevo Paciente
 * Usado por:
 * - AdminDashboard: Registro manual de pacientes
 * - RegistrarEmergencia: Cuando paciente no existe en emergencias
 * - RegistrarAdmision: Cuando paciente no existe en hospitalización
 * 
 * FORMULARIO COMPLETO con todos los campos del formato oficial de "Control de Admisión"
 */

import { useState } from 'react';
import styles from './RegistrarPaciente.module.css';
import { PatientTypeSelector } from './PatientTypeSelector/PatientTypeSelector';
import { SearchableSelect } from './SearchableSelect/SearchableSelect';
import { AfiliadoDataSection, type AfiliadoData } from './AfiliadoDataSection/AfiliadoDataSection';
import { ESTADOS_VENEZUELA, NACIONALIDADES, RELIGIONES, GRADOS_MILITARES, COMPONENTES_MILITARES } from '../constants/venezuela';

interface RegistrarPacienteProps {
  onSuccess: (paciente: any) => void;
  onCancel: () => void;
  ciPreFilled?: string; // CI pre-rellenada si ya se buscó
  showCancel?: boolean; // Mostrar botón cancelar (default: true)
}

export default function RegistrarPaciente({
  onSuccess,
  onCancel,
  ciPreFilled,
  showCancel = true,
}: RegistrarPacienteProps) {
  // Estado para tipo de paciente seleccionado
  const [selectedPatientType, setSelectedPatientType] = useState<'MILITAR' | 'AFILIADO' | 'PNA' | null>(null);

  // Parsear CI pre-rellenada
  const parsedCI = ciPreFilled ? ciPreFilled.split('-') : ['V', ''];
  const [ciTipo, setCiTipo] = useState(parsedCI[0] || 'V');
  const [ciNumeros, setCiNumeros] = useState(parsedCI[1] || '');
  
  // Estado para datos de afiliado
  const [afiliadoData, setAfiliadoData] = useState<AfiliadoData>({
    nroCarnet: '',
    parentesco: '',
    titularNombre: '',
    titularCi: '',
    titularCiTipo: 'V',
    titularCiNumeros: '',
    titularGrado: '',
    titularComponente: '',
    fechaAfiliacion: '',
    vigente: true,
  });

  const [formData, setFormData] = useState({
    // DATOS PERSONALES
    apellidosNombres: '',
    sexo: '',
    fechaNacimiento: '',
    lugarNacimiento: '',
    nacionalidad: '',
    estado: '',
    religion: '',
    direccion: '',
    telefonoOperador: '0412',
    telefonoNumeros: '',
    telefonoEmergenciaOperador: '0412',
    telefonoEmergenciaNumeros: '',
    
    // DATOS MILITARES
    grado: '',
    estadoMilitar: '', // 'activo' | 'disponible' | 'resActiva'
    componente: '',
    unidad: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [registrando, setRegistrando] = useState(false);
  const [error, setError] = useState('');

  // Calcular edad desde fecha de nacimiento
  const calcularEdad = (fechaNac: string): number => {
    if (!fechaNac) return 0;
    const hoy = new Date();
    const nac = new Date(fechaNac);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const diferenciaMeses = hoy.getMonth() - nac.getMonth();
    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < nac.getDate())) {
      edad--;
    }
    return edad;
  };

  // Validar números de cédula (7-9 dígitos)
  const validateCINumeros = (value: string): boolean => {
    const pattern = /^\d{0,9}$/;
    return pattern.test(value);
  };

  // Validar números de teléfono (hasta 7 dígitos)
  const validateTelefonoNumeros = (value: string): boolean => {
    const pattern = /^\d{0,7}$/;
    return pattern.test(value);
  };

  const handleCINumerosChange = (value: string) => {
    if (validateCINumeros(value)) {
      setCiNumeros(value);
      setErrors({...errors, ciNumeros: ''});
    }
  };

  const handleTelefonoNumerosChange = (value: string) => {
    if (validateTelefonoNumeros(value)) {
      setFormData({...formData, telefonoNumeros: value});
      setErrors({...errors, telefonoNumeros: ''});
    }
  };

  const handleTelefonoEmergenciaNumerosChange = (value: string) => {
    if (validateTelefonoNumeros(value)) {
      setFormData({...formData, telefonoEmergenciaNumeros: value});
      setErrors({...errors, telefonoEmergenciaNumeros: ''});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos requeridos
    const newErrors: {[key: string]: string} = {};
    if (!formData.apellidosNombres) newErrors.apellidosNombres = 'Requerido';
    if (!ciNumeros) newErrors.ciNumeros = 'Requerido';
    if (ciNumeros && ciNumeros.length < 7) newErrors.ciNumeros = 'Debe tener entre 7 y 9 dígitos';
    if (!formData.sexo) newErrors.sexo = 'Requerido';
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'Requerido';
    if (!formData.lugarNacimiento) newErrors.lugarNacimiento = 'Requerido';
    if (!formData.nacionalidad) newErrors.nacionalidad = 'Requerido';
    if (!formData.estado) newErrors.estado = 'Requerido';
    if (!formData.religion) newErrors.religion = 'Requerido';
    if (!formData.direccion) newErrors.direccion = 'Requerido';
    if (!formData.telefonoNumeros) newErrors.telefonoNumeros = 'Requerido';
    if (formData.telefonoNumeros && formData.telefonoNumeros.length !== 7) newErrors.telefonoNumeros = 'Debe tener exactamente 7 dígitos';
    if (formData.telefonoEmergenciaNumeros && formData.telefonoEmergenciaNumeros.length !== 7) newErrors.telefonoEmergenciaNumeros = 'Debe tener exactamente 7 dígitos';

    // Validaciones específicas por tipo de paciente
    if (selectedPatientType === 'MILITAR') {
      if (!formData.grado) newErrors.grado = 'Requerido para personal militar';
      if (!formData.componente) newErrors.componente = 'Requerido para personal militar';
      if (!formData.estadoMilitar) newErrors.estadoMilitar = 'Requerido para personal militar';
    }

    if (selectedPatientType === 'AFILIADO') {
      if (!afiliadoData.nroCarnet) newErrors.nroCarnet = 'Requerido';
      if (!afiliadoData.parentesco) newErrors.parentesco = 'Requerido';
      if (!afiliadoData.titularNombre) newErrors.titularNombre = 'Requerido';
      if (!afiliadoData.titularCiNumeros) newErrors.titularCi = 'Requerido';
      if (afiliadoData.titularCiNumeros && afiliadoData.titularCiNumeros.length < 7) newErrors.titularCi = 'Debe tener entre 7 y 9 dígitos';
      if (!afiliadoData.titularGrado) newErrors.titularGrado = 'Requerido';
      if (!afiliadoData.titularComponente) newErrors.titularComponente = 'Requerido';
      if (!afiliadoData.fechaAfiliacion) newErrors.fechaAfiliacion = 'Requerido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setRegistrando(true);
    setError('');

    try {
      const ciCompleta = `${ciTipo}-${ciNumeros}`;
      const telefonoCompleto = formData.telefonoNumeros ? `${formData.telefonoOperador}-${formData.telefonoNumeros}` : '';
      const telefonoEmergenciaCompleto = formData.telefonoEmergenciaNumeros ? `${formData.telefonoEmergenciaOperador}-${formData.telefonoEmergenciaNumeros}` : '';
      
      // Preparar datos para enviar al backend
      const datosRegistro: any = {
        apellidosNombres: formData.apellidosNombres,
        ci: ciCompleta,
        ciTipo: ciTipo,
        fechaNacimiento: formData.fechaNacimiento,
        sexo: formData.sexo,
        lugarNacimiento: formData.lugarNacimiento,
        nacionalidad: formData.nacionalidad,
        estado: formData.estado,
        religion: formData.religion,
        direccion: formData.direccion,
        telefono: telefonoCompleto,
        telefonoEmergencia: telefonoEmergenciaCompleto,
        tipoPaciente: selectedPatientType || 'PNA',
      };

      // Agregar datos específicos según tipo de paciente
      if (selectedPatientType === 'MILITAR') {
        datosRegistro.gradoMilitar = formData.grado;
        datosRegistro.estadoMilitar = formData.estadoMilitar;
        datosRegistro.componente = formData.componente;
        datosRegistro.unidad = formData.unidad || undefined;
      }

      if (selectedPatientType === 'AFILIADO') {
        const titularCiCompleta = `${afiliadoData.titularCiTipo}-${afiliadoData.titularCiNumeros}`;
        datosRegistro.afiliadoData = {
          nroCarnet: afiliadoData.nroCarnet,
          parentesco: afiliadoData.parentesco,
          titularNombre: afiliadoData.titularNombre,
          titularCi: titularCiCompleta,
          titularGrado: afiliadoData.titularGrado,
          titularComponente: afiliadoData.titularComponente,
          fechaAfiliacion: afiliadoData.fechaAfiliacion,
          vigente: afiliadoData.vigente,
        };
      }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Registrar Nuevo Paciente</h2>
        <p className={styles.subtitle}>Complete los datos del paciente</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Sección: Datos de Identificación */}
        <div className={styles.section}>
          <h3>Datos de Identificación</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup} style={{ gridColumn: '1 / 2' }}>
              <label>Cédula de Identidad *</label>
              <div className={styles.ciInput}>
                <select
                  value={ciTipo}
                  onChange={(e) => setCiTipo(e.target.value)}
                  disabled={submitting}
                >
                  <option value="V">V</option>
                  <option value="E">E</option>
                  <option value="P">P</option>
                </select>
                <input
                  type="text"
                  placeholder="12345678"
                  value={ciNumeros}
                  onChange={(e) => handleCINumerosChange(e.target.value)}
                  disabled={submitting}
                  maxLength={8}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup} style={{ gridColumn: '2 / -1' }}>
              <label>Apellidos y Nombres *</label>
              <input
                type="text"
                name="apellidosNombres"
                value={formData.apellidosNombres}
                onChange={handleInputChange}
                placeholder="Ej: PÉREZ GARCÍA JUAN CARLOS"
                disabled={submitting}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Sexo *</label>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleInputChange}
                disabled={submitting}
                required
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Fecha de Nacimiento *</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleInputChange}
                disabled={submitting}
                required
              />
            </div>
          </div>
        </div>

        {/* Sección: Datos de Contacto */}
        <div className={styles.section}>
          <h3>Datos de Contacto</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Teléfono</label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                placeholder="0414-1234567"
                disabled={submitting}
              />
            </div>

            <div className={styles.formGroup} style={{ gridColumn: '2 / -1' }}>
              <label>Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                placeholder="Calle, Ciudad, Estado"
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        {/* Sección: Datos Militares */}
        <div className={styles.section}>
          <h3>Datos Militares</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Grado Militar</label>
              <select
                name="gradoMilitar"
                value={formData.gradoMilitar}
                onChange={handleInputChange}
                disabled={submitting}
              >
                {GRADOS_MILITARES.map((grado) => (
                  <option key={grado} value={grado}>
                    {grado}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Componente</label>
              <select
                name="componente"
                value={formData.componente}
                onChange={handleInputChange}
                disabled={submitting}
              >
                {COMPONENTES.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Unidad</label>
              <input
                type="text"
                name="unidad"
                value={formData.unidad}
                onChange={handleInputChange}
                placeholder="Ej: Batallón Ayacucho"
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <div className={styles.formActions}>
          {showCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelBtn}
              disabled={submitting}
            >
              Cancelar
            </button>
          )}
          <button type="submit" className={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Registrando...' : 'Registrar Paciente'}
          </button>
        </div>
      </form>
    </div>
  );
}
