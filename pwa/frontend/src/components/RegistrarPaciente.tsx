/**
 * Componente Reutilizable para Registrar Nuevo Paciente
 * Usado por:
 * - AdminDashboard: Registro manual de pacientes
 * - RegistrarEmergencia: Cuando paciente no existe en emergencias
 * - RegistrarAdmision: Cuando paciente no existe en hospitalización
 */

import { useState } from 'react';
import styles from './RegistrarPaciente.module.css';

interface RegistrarPacienteProps {
  onSuccess: (paciente: any) => void;
  onCancel: () => void;
  ciPreFilled?: string; // CI pre-rellenada si ya se buscó
  showCancel?: boolean; // Mostrar botón cancelar (default: true)
}

const GRADOS_MILITARES = [
  'GENERAL',
  'CORONEL',
  'TENIENTE CORONEL',
  'MAYOR',
  'CAPITAN',
  'TENIENTE',
  'SUBTENIENTE',
  'SARGENTO MAYOR',
  'SARGENTO PRIMERO',
  'SARGENTO SEGUNDO',
  'CABO PRIMERO',
  'CABO SEGUNDO',
  'DISTINGUIDO',
  'SOLDADO',
  'CIVIL',
];

const COMPONENTES = [
  'EJERCITO',
  'ARMADA',
  'AVIACION',
  'GUARDIA_NACIONAL',
  'MILICIA',
  'CIVIL',
];

export default function RegistrarPaciente({
  onSuccess,
  onCancel,
  ciPreFilled,
  showCancel = true,
}: RegistrarPacienteProps) {
  const [ciTipo, setCiTipo] = useState('V');
  const [ciNumeros, setCiNumeros] = useState(ciPreFilled ? ciPreFilled.replace(/^[VEP]-/, '') : '');
  
  const [formData, setFormData] = useState({
    apellidosNombres: '',
    sexo: 'M',
    fechaNacimiento: '',
    telefono: '',
    direccion: '',
    gradoMilitar: 'CIVIL',
    componente: 'CIVIL',
    unidad: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCINumerosChange = (value: string) => {
    const soloNumeros = value.replace(/\D/g, '').slice(0, 8);
    setCiNumeros(soloNumeros);
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

    // Validaciones
    if (!ciNumeros.trim() || ciNumeros.length < 7) {
      setError('CI debe tener al menos 7 dígitos');
      return;
    }

    if (!formData.apellidosNombres.trim()) {
      setError('Nombre completo es requerido');
      return;
    }

    if (!formData.fechaNacimiento) {
      setError('Fecha de nacimiento es requerida');
      return;
    }

    setSubmitting(true);

    try {
      const ciCompleta = `${ciTipo}-${ciNumeros}`;
      
      const dataToSend = {
        ci: ciCompleta,
        apellidosNombres: formData.apellidosNombres.trim(),
        sexo: formData.sexo,
        fechaNacimiento: formData.fechaNacimiento,
        telefono: formData.telefono.trim() || undefined,
        direccion: formData.direccion.trim() || undefined,
        gradoMilitar: formData.gradoMilitar,
        componente: formData.componente,
        unidad: formData.unidad.trim() || undefined,
      };

      const response = await fetch('http://localhost:3001/api/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar paciente');
      }

      const result = await response.json();
      onSuccess(result.paciente);
    } catch (err: any) {
      setError(err.message || 'Error al registrar paciente');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

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
