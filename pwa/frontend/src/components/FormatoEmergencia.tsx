/**
 * Componente Formato de Emergencia
 * Formulario clínico para atención de emergencia basado en formato oficial
 * 
 * Secciones:
 * 1. ANAMNESIS (Motivo consulta, Enfermedad actual, Antecedentes)
 * 2. EXAMEN FÍSICO (Funciones vitales, Examen general, Examen regional)
 * 3. IMPRESIÓN DIAGNÓSTICA
 */

import { useState, useEffect } from 'react';
import styles from './FormatoEmergencia.module.css';

interface FormatoEmergenciaProps {
  paciente: any;
  admisionId: number;
  onBack: () => void;
  onSuccess?: () => void;
}

interface FormatoEmergenciaData {
  // 1. ANAMNESIS
  motivoConsulta: string;
  enfermedadActual: string;
  antecedentesPersonales: string;
  antecedentesFamiliares: string;
  habitosPsicobiologicos: string;

  // 2. EXAMEN FISICO
  // 2.1. FUNCIONES VITALES
  fechaExamen: string;
  horaExamen: string;
  peso: string;
  talla: string;
  fc: string;
  fr: string;
  temperatura: string;
  taSistolica: string;
  taDiastolica: string;

  // 2.2. EXAMEN GENERAL
  examenGeneral: string;

  // 2.3. EXAMEN REGIONAL
  piel: string;
  cabeza: string;
  cuello: string;
  torax: string;
  pulmones: string;
  cardiovascular: string;
  abdomen: string;
  genital: string;
  anoRecto: string;
  neurologico: string;

  // 3. IMPRESION DIAGNOSTICA
  impresionDx: string;
  requiereHospitalizacion: boolean;
  observaciones: string;
}

export default function FormatoEmergencia({
  paciente,
  admisionId,
  onBack,
  onSuccess,
}: FormatoEmergenciaProps) {
  const [seccionActiva, setSeccionActiva] = useState(1);
  const [formData, setFormData] = useState<FormatoEmergenciaData>({
    motivoConsulta: '',
    enfermedadActual: '',
    antecedentesPersonales: '',
    antecedentesFamiliares: '',
    habitosPsicobiologicos: '',
    fechaExamen: new Date().toISOString().split('T')[0],
    horaExamen: new Date().toTimeString().slice(0, 5),
    peso: '',
    talla: '',
    fc: '',
    fr: '',
    temperatura: '',
    taSistolica: '',
    taDiastolica: '',
    examenGeneral: '',
    piel: '',
    cabeza: '',
    cuello: '',
    torax: '',
    pulmones: '',
    cardiovascular: '',
    abdomen: '',
    genital: '',
    anoRecto: '',
    neurologico: '',
    impresionDx: '',
    requiereHospitalizacion: false,
    observaciones: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [guardadoAutomatico, setGuardadoAutomatico] = useState('');

  // Cargar formato existente si hay
  useEffect(() => {
    cargarFormatoExistente();
  }, [admisionId]);

  const cargarFormatoExistente = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/formato-emergencia/admision/${admisionId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.formato) {
          setFormData({
            motivoConsulta: data.formato.motivoConsulta || '',
            enfermedadActual: data.formato.enfermedadActual || '',
            antecedentesPersonales: data.formato.antecedentesPersonales || '',
            antecedentesFamiliares: data.formato.antecedentesFamiliares || '',
            habitosPsicobiologicos: data.formato.habitosPsicobiologicos || '',
            fechaExamen: data.formato.fechaExamen ? data.formato.fechaExamen.split('T')[0] : new Date().toISOString().split('T')[0],
            horaExamen: data.formato.horaExamen || new Date().toTimeString().slice(0, 5),
            peso: data.formato.peso?.toString() || '',
            talla: data.formato.talla?.toString() || '',
            fc: data.formato.fc?.toString() || '',
            fr: data.formato.fr?.toString() || '',
            temperatura: data.formato.temperatura?.toString() || '',
            taSistolica: data.formato.taSistolica?.toString() || '',
            taDiastolica: data.formato.taDiastolica?.toString() || '',
            examenGeneral: data.formato.examenGeneral || '',
            piel: data.formato.piel || '',
            cabeza: data.formato.cabeza || '',
            cuello: data.formato.cuello || '',
            torax: data.formato.torax || '',
            pulmones: data.formato.pulmones || '',
            cardiovascular: data.formato.cardiovascular || '',
            abdomen: data.formato.abdomen || '',
            genital: data.formato.genital || '',
            anoRecto: data.formato.anoRecto || '',
            neurologico: data.formato.neurologico || '',
            impresionDx: data.formato.impresionDx || '',
            requiereHospitalizacion: data.formato.requiereHospitalizacion || false,
            observaciones: data.formato.observaciones || '',
          });
        }
      }
    } catch (err) {
      console.error('Error al cargar formato:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const guardarBorrador = async () => {
    try {
      setGuardadoAutomatico('Guardando...');
      
      const dataToSend = {
        admisionId,
        ...formData,
        peso: formData.peso ? parseFloat(formData.peso) : null,
        talla: formData.talla ? parseFloat(formData.talla) : null,
        fc: formData.fc ? parseInt(formData.fc) : null,
        fr: formData.fr ? parseInt(formData.fr) : null,
        temperatura: formData.temperatura ? parseFloat(formData.temperatura) : null,
        taSistolica: formData.taSistolica ? parseInt(formData.taSistolica) : null,
        taDiastolica: formData.taDiastolica ? parseInt(formData.taDiastolica) : null,
      };

      const response = await fetch('http://localhost:3001/api/formato-emergencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) throw new Error('Error al guardar');

      setGuardadoAutomatico('✓ Guardado');
      setTimeout(() => setGuardadoAutomatico(''), 2000);
    } catch (err) {
      setGuardadoAutomatico('✗ Error al guardar');
      setTimeout(() => setGuardadoAutomatico(''), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await guardarBorrador();
      alert('Formato de emergencia guardado exitosamente');
      if (onSuccess) onSuccess();
      else onBack();
    } catch (err: any) {
      setError(err.message || 'Error al guardar formato');
    } finally {
      setSubmitting(false);
    }
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
      {/* Header con info del paciente */}
      <div className={styles.header}>
        <button onClick={onBack} className={styles.backBtn}>
          ← Volver
        </button>
        <div className={styles.headerContent}>
          <h1>🚨 FORMATO DE EMERGENCIA</h1>
          <div className={styles.pacienteInfo}>
            <div className={styles.pacienteItem}>
              <strong>Paciente:</strong> {paciente.apellidosNombres}
            </div>
            <div className={styles.pacienteItem}>
              <strong>CI:</strong> {paciente.ci}
            </div>
            <div className={styles.pacienteItem}>
              <strong>H.C.:</strong> {paciente.nroHistoria}
            </div>
            <div className={styles.pacienteItem}>
              <strong>Edad:</strong> {calcularEdad(paciente.fechaNacimiento)} años
            </div>
            <div className={styles.pacienteItem}>
              <strong>Sexo:</strong> {paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}
            </div>
          </div>
        </div>
        {guardadoAutomatico && (
          <div className={styles.guardadoIndicador}>{guardadoAutomatico}</div>
        )}
      </div>

      {/* Navegación por secciones */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${seccionActiva === 1 ? styles.tabActive : ''}`}
          onClick={() => setSeccionActiva(1)}
        >
          1. Anamnesis
        </button>
        <button
          className={`${styles.tab} ${seccionActiva === 2 ? styles.tabActive : ''}`}
          onClick={() => setSeccionActiva(2)}
        >
          2. Examen Físico
        </button>
        <button
          className={`${styles.tab} ${seccionActiva === 3 ? styles.tabActive : ''}`}
          onClick={() => setSeccionActiva(3)}
        >
          3. Diagnóstico
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* SECCIÓN 1: ANAMNESIS */}
        {seccionActiva === 1 && (
          <div className={styles.section}>
            <h2>1. ANAMNESIS</h2>

            <div className={styles.subsection}>
              <h3>1.1. FILIACIÓN</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <strong>Apellidos y Nombres:</strong> {paciente.apellidosNombres}
                </div>
                <div className={styles.infoItem}>
                  <strong>Sexo:</strong> {paciente.sexo === 'M' ? 'Masculino' : 'Femenino'}
                </div>
                <div className={styles.infoItem}>
                  <strong>Edad:</strong> {calcularEdad(paciente.fechaNacimiento)} años
                </div>
                <div className={styles.infoItem}>
                  <strong>H.C.:</strong> {paciente.nroHistoria}
                </div>
                <div className={styles.infoItem}>
                  <strong>Fecha de Nacimiento:</strong>{' '}
                  {paciente.fechaNacimiento
                    ? new Date(paciente.fechaNacimiento).toLocaleDateString('es-VE')
                    : 'N/A'}
                </div>
                <div className={styles.infoItem}>
                  <strong>Lugar de Nacimiento:</strong> {paciente.lugarNacimiento || 'N/A'}
                </div>
                <div className={styles.infoItem}>
                  <strong>Domicilio Actual:</strong> {paciente.direccion || 'N/A'}
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>MOTIVO DE CONSULTA *</label>
              <textarea
                name="motivoConsulta"
                value={formData.motivoConsulta}
                onChange={handleInputChange}
                rows={3}
                placeholder="Describa el motivo principal de la consulta de emergencia..."
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>1.2. ENFERMEDAD ACTUAL *</label>
              <textarea
                name="enfermedadActual"
                value={formData.enfermedadActual}
                onChange={handleInputChange}
                rows={5}
                placeholder="Describa la evolución de la enfermedad actual, síntomas, duración..."
                required
              />
            </div>

            <h3>1.3. ANTECEDENTES PATOLÓGICOS</h3>

            <div className={styles.formGroup}>
              <label>PERSONALES</label>
              <textarea
                name="antecedentesPersonales"
                value={formData.antecedentesPersonales}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enfermedades previas, cirugías, alergias, medicamentos actuales..."
              />
            </div>

            <div className={styles.formGroup}>
              <label>FAMILIARES</label>
              <textarea
                name="antecedentesFamiliares"
                value={formData.antecedentesFamiliares}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enfermedades hereditarias, condiciones familiares relevantes..."
              />
            </div>

            <div className={styles.formGroup}>
              <label>HÁBITOS PSICOBIOLÓGICOS</label>
              <textarea
                name="habitosPsicobiologicos"
                value={formData.habitosPsicobiologicos}
                onChange={handleInputChange}
                rows={3}
                placeholder="Tabaquismo, alcohol, drogas, actividad física, alimentación..."
              />
            </div>
          </div>
        )}

        {/* SECCIÓN 2: EXAMEN FÍSICO */}
        {seccionActiva === 2 && (
          <div className={styles.section}>
            <h2>2. EXAMEN FÍSICO</h2>

            <h3>2.1. FUNCIONES VITALES</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Fecha</label>
                <input
                  type="date"
                  name="fechaExamen"
                  value={formData.fechaExamen}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Hora</label>
                <input
                  type="time"
                  name="horaExamen"
                  value={formData.horaExamen}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Peso (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  name="peso"
                  value={formData.peso}
                  onChange={handleInputChange}
                  placeholder="70.5"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Talla (cm)</label>
                <input
                  type="number"
                  step="0.01"
                  name="talla"
                  value={formData.talla}
                  onChange={handleInputChange}
                  placeholder="170"
                />
              </div>
              <div className={styles.formGroup}>
                <label>F.C. (x') *</label>
                <input
                  type="number"
                  name="fc"
                  value={formData.fc}
                  onChange={handleInputChange}
                  placeholder="80"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>F.R. (x') *</label>
                <input
                  type="number"
                  name="fr"
                  value={formData.fr}
                  onChange={handleInputChange}
                  placeholder="18"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tº (°C) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="temperatura"
                  value={formData.temperatura}
                  onChange={handleInputChange}
                  placeholder="36.5"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>P.A. Sistólica (mmHg) *</label>
                <input
                  type="number"
                  name="taSistolica"
                  value={formData.taSistolica}
                  onChange={handleInputChange}
                  placeholder="120"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>P.A. Diastólica (mmHg) *</label>
                <input
                  type="number"
                  name="taDiastolica"
                  value={formData.taDiastolica}
                  onChange={handleInputChange}
                  placeholder="80"
                  required
                />
              </div>
            </div>

            <h3>2.2. EXAMEN GENERAL</h3>
            <div className={styles.formGroup}>
              <textarea
                name="examenGeneral"
                value={formData.examenGeneral}
                onChange={handleInputChange}
                rows={4}
                placeholder="Estado general, nivel de conciencia, hidratación, coloración de piel y mucosas..."
              />
            </div>

            <h3>2.3. EXAMEN REGIONAL</h3>
            <div className={styles.examRegionalGrid}>
              <div className={styles.formGroup}>
                <label>PIEL</label>
                <textarea
                  name="piel"
                  value={formData.piel}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Coloración, temperatura, humedad, lesiones..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>CABEZA</label>
                <textarea
                  name="cabeza"
                  value={formData.cabeza}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Inspección, palpación, características..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>CUELLO</label>
                <textarea
                  name="cuello"
                  value={formData.cuello}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Movilidad, adenopatías, tiroides..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>TÓRAX</label>
                <textarea
                  name="torax"
                  value={formData.torax}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Inspección, expansión, simetría..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>PULMONES</label>
                <textarea
                  name="pulmones"
                  value={formData.pulmones}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Auscultación, ruidos respiratorios, agregados..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>CARDIOVASCULAR</label>
                <textarea
                  name="cardiovascular"
                  value={formData.cardiovascular}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Ritmo cardíaco, soplos, ruidos..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>ABDOMEN</label>
                <textarea
                  name="abdomen"
                  value={formData.abdomen}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Inspección, palpación, dolor, masas..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>GENITAL</label>
                <textarea
                  name="genital"
                  value={formData.genital}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Examen genital..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>ANO Y RECTO</label>
                <textarea
                  name="anoRecto"
                  value={formData.anoRecto}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Examen anorrectal..."
                />
              </div>
              <div className={styles.formGroup}>
                <label>NEUROLÓGICO</label>
                <textarea
                  name="neurologico"
                  value={formData.neurologico}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Estado mental, reflejos, sensibilidad, motricidad..."
                />
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: IMPRESIÓN DIAGNÓSTICA */}
        {seccionActiva === 3 && (
          <div className={styles.section}>
            <h2>3. IMPRESIÓN DIAGNÓSTICA</h2>

            <div className={styles.formGroup}>
              <label>IMPRESIÓN DIAGNÓSTICA *</label>
              <textarea
                name="impresionDx"
                value={formData.impresionDx}
                onChange={handleInputChange}
                rows={4}
                placeholder="Diagnóstico presuntivo basado en la evaluación clínica..."
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="requiereHospitalizacion"
                  checked={formData.requiereHospitalizacion}
                  onChange={handleInputChange}
                />
                <span>¿Requiere hospitalización?</span>
              </label>
              {formData.requiereHospitalizacion && (
                <p className={styles.infoBox}>
                  ℹ️ El paciente será derivado al personal administrativo para asignación de cama y
                  creación de admisión de hospitalización.
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>OBSERVACIONES</label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleInputChange}
                rows={3}
                placeholder="Indicaciones, tratamiento, recomendaciones adicionales..."
              />
            </div>
          </div>
        )}

        {error && <div className={styles.errorAlert}>{error}</div>}

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={guardarBorrador}
            className={styles.guardarBtn}
            disabled={submitting}
          >
            💾 Guardar Borrador
          </button>
          <div className={styles.navigationBtns}>
            {seccionActiva > 1 && (
              <button
                type="button"
                onClick={() => setSeccionActiva(seccionActiva - 1)}
                className={styles.prevBtn}
              >
                ← Anterior
              </button>
            )}
            {seccionActiva < 3 && (
              <button
                type="button"
                onClick={() => setSeccionActiva(seccionActiva + 1)}
                className={styles.nextBtn}
              >
                Siguiente →
              </button>
            )}
            {seccionActiva === 3 && (
              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Guardando...' : '✓ Finalizar Formato de Emergencia'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
