/**
 * Componente Reutilizable para Registrar Nuevo Paciente
 * Usado por:
 * - AdminDashboard: Registro manual de pacientes
 * - RegistrarEmergencia: Cuando paciente no existe en emergencias
 * - RegistrarAdmision: Cuando paciente no existe en hospitalización
 * 
 * FORMULARIO COMPLETO con todos los campos del formato oficial de "Control de Admisión"
 */

import { useState, useEffect } from 'react';
import styles from '../pages/AdminDashboard/AdminDashboard.module.css';
import { PatientTypeSelector } from './PatientTypeSelector/PatientTypeSelector';
import { SearchableSelect } from './SearchableSelect/SearchableSelect';
import { AfiliadoDataSection, type AfiliadoData } from './AfiliadoDataSection/AfiliadoDataSection';
import { ESTADOS_VENEZUELA, NACIONALIDADES, RELIGIONES, GRADOS_MILITARES, COMPONENTES_MILITARES } from '../constants/venezuela';
import { getTodayVenezuelaISO, getCurrentTimeVenezuela } from '../utils/dateUtils';
import { API_BASE_URL } from '../utils/constants';

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
    // ADMISION
    nroHistoria: '',
    formaIngreso: 'AMBULANTE',
    fechaAdmision: getTodayVenezuelaISO(),
    horaAdmision: getCurrentTimeVenezuela(),
    
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

  // Cargar siguiente nro de historia
  useEffect(() => {
    const cargarSiguienteNroHistoria = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/pacientes/ultimos?limit=1`);
        if (!response.ok) throw new Error('Error al obtener último nro de historia');
        
        const data = await response.json();
        const ultimoPaciente = data.data?.[0];
        
        if (ultimoPaciente?.nroHistoria) {
          // Parsear formato XX-XX-XX e incrementar
          const partes = ultimoPaciente.nroHistoria.split('-');
          const ultimoNumero = parseInt(partes[2], 10);
          const siguienteNumero = ultimoNumero + 1;
          const nuevoNroHistoria = `${partes[0]}-${partes[1]}-${siguienteNumero.toString().padStart(2, '0')}`;
          setFormData(prev => ({ ...prev, nroHistoria: nuevoNroHistoria }));
        } else {
          // Si no hay pacientes, iniciar con 01-01-01
          setFormData(prev => ({ ...prev, nroHistoria: '01-01-01' }));
        }
      } catch (error) {
        console.error('Error cargando nro de historia:', error);
        setFormData(prev => ({ ...prev, nroHistoria: '01-01-01' }));
      }
    };

    cargarSiguienteNroHistoria();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos requeridos
    const newErrors: {[key: string]: string} = {};
    if (!formData.nroHistoria) newErrors.nroHistoria = 'Error al generar número de historia';
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
        nroHistoria: formData.nroHistoria,
        formaIngreso: formData.formaIngreso,
        fechaAdmision: formData.fechaAdmision,
        horaAdmision: formData.horaAdmision,
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
        datosRegistro.grado = formData.grado;
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

      // NO crear el paciente aquí. Solo retornar los datos validados.
      // El componente padre (RegistrarEmergencia, RegisterPatientForm, etc.) 
      // es responsable de crear el Paciente + Admisión con el tipo correcto.
      setRegistrando(false);
      onSuccess(datosRegistro);
    } catch (err: any) {
      setError(err.message || 'Error al validar los datos');
      console.error(err);
      setRegistrando(false);
    }
  };

  // Si no hay tipo seleccionado, mostrar selector
  if (!selectedPatientType) {
    return (
      <section className={styles["form-section"]}>
        <PatientTypeSelector onSelectType={setSelectedPatientType} />
        {showCancel && (
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={onCancel}
            >
              ← Cancelar
            </button>
          </div>
        )}
      </section>
    );
  }

  // Formulario completo con todos los campos
  return (
    <section className={styles["form-section"]}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2>Registrar Nuevo Paciente</h2>
          <p className={styles["form-description"]}>
            Tipo: <strong>{selectedPatientType}</strong> | Complete todos los campos requeridos (*)
          </p>
        </div>
        <button 
          type="button"
          onClick={() => setSelectedPatientType(null)}
          className={styles["back-button"]}
          style={{ 
            padding: '0.5rem 1rem',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
          disabled={registrando}
        >
          ← Cambiar tipo
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles["patient-form"]}>
        {/* SECCIÓN 1: DATOS PERSONALES */}
        <div className={styles["form-section-header"]}>
          <h3>1. Datos Personales del Paciente</h3>
        </div>
        
        <div className={styles["form-grid"]}>
            {/* Nro de Historia - AUTOGENERADO */}
            <div className={styles["form-group"]}>
              <label>Nro. Historia Clínica</label>
              <input
                type="text"
                value={formData.nroHistoria}
                disabled
                placeholder="Autogenerado..."
                style={{ background: 'var(--bg-tertiary)', cursor: 'not-allowed' }}
              />
              <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                (Autogenerado)
              </small>
              {errors.nroHistoria && <span className={styles["error-message"]}>{errors.nroHistoria}</span>}
            </div>

            <div className={styles["form-group"]}>
              <label>Apellidos y Nombres *</label>
              <input
                type="text"
                value={formData.apellidosNombres}
                onChange={(e) => setFormData({...formData, apellidosNombres: e.target.value})}
                placeholder="Apellidos y Nombres completos"
                disabled={registrando}
              />
              {errors.apellidosNombres && <span className={styles["error-message"]}>{errors.apellidosNombres}</span>}
            </div>

            <div className={styles["form-group"]}>
              <label>Cédula de Identidad *</label>
              <div className={styles["dual-input-group"]}>
                <select
                  value={ciTipo}
                  onChange={(e) => setCiTipo(e.target.value)}
                  disabled={registrando}
                >
                  <option value="V">V</option>
                  <option value="E">E</option>
                  <option value="P">P</option>
                </select>
                <input
                  type="text"
                  value={ciNumeros}
                  onChange={(e) => handleCINumerosChange(e.target.value)}
                  placeholder="12345678"
                  maxLength={9}
                  disabled={registrando}
                />
              </div>
              {errors.ciNumeros && <span className={styles["error-message"]}>{errors.ciNumeros}</span>}
            </div>

            <div className={styles["form-group"]}>
              <label>Fecha de Nacimiento *</label>
              <input
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
                disabled={registrando}
              />
              {errors.fechaNacimiento && <span className={styles["error-message"]}>{errors.fechaNacimiento}</span>}
            </div>

            <div className={styles["form-group"]}>
              <label>Edad</label>
              <input
                type="number"
                disabled
                value={calcularEdad(formData.fechaNacimiento)}
                placeholder="Se calcula automáticamente"
              />
            </div>

            <div className={styles["form-group"]}>
              <label>Lugar de Nacimiento *</label>
              <SearchableSelect
                options={ESTADOS_VENEZUELA}
                value={formData.lugarNacimiento}
                onChange={(value) => setFormData({...formData, lugarNacimiento: value})}
                placeholder="Buscar estado..."
              />
              {errors.lugarNacimiento && <span className={styles["error-message"]}>{errors.lugarNacimiento}</span>}
            </div>

            <div className={styles["form-group"]}>
              <label>Sexo *</label>
              <select
                value={formData.sexo}
                onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                disabled={registrando}
              >
                <option value="">Seleccione...</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
              {errors.sexo && <span className={styles["error-message"]}>{errors.sexo}</span>}
            </div>

            <div className={styles["form-group"]}>
              <label>Nacionalidad *</label>
              <SearchableSelect
                options={NACIONALIDADES}
                value={formData.nacionalidad}
                onChange={(value) => setFormData({...formData, nacionalidad: value})}
                placeholder="Buscar nacionalidad..."
              />
              {errors.nacionalidad && <span className={styles["error-message"]}>{errors.nacionalidad}</span>}
            </div>

            <div className={styles["form-group"]}>
              <label>Estado de residencia *</label>
              <SearchableSelect
                options={ESTADOS_VENEZUELA}
                value={formData.estado}
                onChange={(value) => setFormData({...formData, estado: value})}
                placeholder="Buscar estado..."
              />
              {errors.estado && <span className={styles["error-message"]}>{errors.estado}</span>}
            </div>

            <div className={styles["form-group"]}>
              <label>Religión *</label>
              <SearchableSelect
                options={RELIGIONES}
                value={formData.religion}
                onChange={(value) => setFormData({...formData, religion: value})}
                placeholder="Buscar religión..."
              />
              {errors.religion && <span className={styles["error-message"]}>{errors.religion}</span>}
            </div>

            <div className={styles["form-group"]} style={{ gridColumn: '1 / -1' }}>
              <label>Dirección *</label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                placeholder="Dirección completa de residencia"
                disabled={registrando}
              />
              {errors.direccion && <span className={styles["error-message"]}>{errors.direccion}</span>}
            </div>

            <div className={styles["form-group"]}>
              <label>Teléfono *</label>
              <div className={styles.ciInput}>
                <select
                  value={formData.telefonoOperador}
                  onChange={(e) => setFormData({...formData, telefonoOperador: e.target.value})}
                  disabled={registrando}
                >
                  <option value="0412">0412</option>
                  <option value="0422">0422</option>
                  <option value="0416">0416</option>
                  <option value="0426">0426</option>
                  <option value="0414">0414</option>
                  <option value="0424">0424</option>
                </select>
                <input
                  type="text"
                  value={formData.telefonoNumeros}
                  onChange={(e) => handleTelefonoNumerosChange(e.target.value)}
                  placeholder="1234567"
                  maxLength={7}
                  disabled={registrando}
                />
              </div>
              {errors.telefonoNumeros && <span className={styles["error-message"]}>{errors.telefonoNumeros}</span>}
            </div>

            <div className={styles["form-group"]}>
              <label>Teléfono de Emergencia <span className={styles["hint"]}>(Familiar)</span></label>
              <div className={styles.ciInput}>
                <select
                  value={formData.telefonoEmergenciaOperador}
                  onChange={(e) => setFormData({...formData, telefonoEmergenciaOperador: e.target.value})}
                  disabled={registrando}
                >
                  <option value="0412">0412</option>
                  <option value="0422">0422</option>
                  <option value="0416">0416</option>
                  <option value="0426">0426</option>
                  <option value="0414">0414</option>
                  <option value="0424">0424</option>
                </select>
                <input
                  type="text"
                  value={formData.telefonoEmergenciaNumeros}
                  onChange={(e) => handleTelefonoEmergenciaNumerosChange(e.target.value)}
                  placeholder="1234567"
                  maxLength={7}
                  disabled={registrando}
                />
              </div>
              {errors.telefonoEmergenciaNumeros && <span className={styles["error-message"]}>{errors.telefonoEmergenciaNumeros}</span>}
            </div>
          </div>

        {/* SECCIÓN 2: DATOS SEGÚN TIPO DE PACIENTE */}
        {selectedPatientType === 'MILITAR' && (
          <>
            <div className={styles["form-section-header"]}>
              <h3>2. Datos de Personal Militar</h3>
            </div>
            
            <div className={styles.formGrid}>
              <div className={styles["form-group"]}>
                <label>Grado *</label>
                <SearchableSelect
                  options={GRADOS_MILITARES}
                  value={formData.grado}
                  onChange={(value) => setFormData({...formData, grado: value})}
                  placeholder="Seleccione el grado militar"
                />
                {errors.grado && <span className={styles["error-message"]}>{errors.grado}</span>}
              </div>

              <div className={styles["form-group"]}>
                <label>Componente *</label>
                <SearchableSelect
                  options={COMPONENTES_MILITARES}
                  value={formData.componente}
                  onChange={(value) => setFormData({...formData, componente: value})}
                  placeholder="Seleccione el componente militar"
                />
                {errors.componente && <span className={styles["error-message"]}>{errors.componente}</span>}
              </div>

              <div className={styles["form-group"]}>
                <label>Unidad</label>
                <input
                  type="text"
                  value={formData.unidad}
                  onChange={(e) => setFormData({...formData, unidad: e.target.value})}
                  placeholder="Ej: Batallón, Brigada"
                  disabled={registrando}
                />
              </div>

              <div className={styles["form-group"]} style={{ gridColumn: '1 / -1' }}>
                <label>Estado Militar *</label>
                <div className={styles["radio-group-inline"]}>
                  <label className={styles["radio-label"]}>
                    <input
                      type="radio"
                      name="estadoMilitar"
                      value="activo"
                      checked={formData.estadoMilitar === 'activo'}
                      onChange={(e) => setFormData({...formData, estadoMilitar: e.target.value})}
                      disabled={registrando}
                    />
                    Activo
                  </label>
                  <label className={styles["radio-label"]}>
                    <input
                      type="radio"
                      name="estadoMilitar"
                      value="disponible"
                      checked={formData.estadoMilitar === 'disponible'}
                      onChange={(e) => setFormData({...formData, estadoMilitar: e.target.value})}
                      disabled={registrando}
                    />
                    Disponible
                  </label>
                  <label className={styles["radio-label"]}>
                    <input
                      type="radio"
                      name="estadoMilitar"
                      value="resActiva"
                      checked={formData.estadoMilitar === 'resActiva'}
                      onChange={(e) => setFormData({...formData, estadoMilitar: e.target.value})}
                      disabled={registrando}
                    />
                    Reserva Activa
                  </label>
                </div>
                {errors.estadoMilitar && <span className={styles["error-message"]}>{errors.estadoMilitar}</span>}
              </div>
            </div>
          </>
        )}

        {selectedPatientType === 'AFILIADO' && (
          <AfiliadoDataSection 
            data={afiliadoData}
            onChange={setAfiliadoData}
            errors={errors}
            styles={styles}
          />
        )}

        {/* PNA no tiene sección 2 */}

        {error && (
          <div style={{ 
            padding: '12px 15px',
            background: '#fee',
            border: '1px solid #fcc',
            borderRadius: '6px',
            color: '#c33',
            fontSize: '14px',
            marginTop: '20px'
          }}>
            ⚠️ {error}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={registrando}>
            {registrando ? '⏳ Registrando...' : 'Registrar Paciente'}
          </button>
          {showCancel && (
            <button 
              type="button" 
              className="btn-secondary"
              onClick={onCancel}
              disabled={registrando}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
