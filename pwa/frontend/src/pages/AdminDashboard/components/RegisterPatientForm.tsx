/**
 * RegisterPatientForm - Formulario de registro de paciente
 * Componente extraído de AdminDashboard para modularización
 */

import { useState, useEffect } from 'react'
import { SearchableSelect } from '@/components/SearchableSelect/SearchableSelect'
import { PatientTypeSelector } from '@/components/PatientTypeSelector'
import { AfiliadoDataSection, type AfiliadoData } from '@/components/AfiliadoDataSection'
import { API_BASE_URL } from '@/utils/constants'
import { getTodayVenezuelaISO, getCurrentTimeVenezuela } from '@/utils/dateUtils'
import { ESTADOS_VENEZUELA, NACIONALIDADES, RELIGIONES, GRADOS_MILITARES, COMPONENTES_MILITARES } from '@/constants/venezuela'
import styles from '../AdminDashboard.module.css'

export function RegisterPatientForm() {
  // Estado para tipo de paciente seleccionado
  const [selectedPatientType, setSelectedPatientType] = useState<'MILITAR' | 'AFILIADO' | 'PNA' | null>(null)

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
  })

  const [formData, setFormData] = useState({
    // ADMISION
    nroHistoria: '',
    formaIngreso: 'AMBULANTE',
    fechaAdmision: getTodayVenezuelaISO(),
    horaAdmision: getCurrentTimeVenezuela(),
    firmaFacultativo: '',
    habitacion: '',
    
    // PACIENTE - DATOS PERSONALES
    apellidosNombres: '',
    ciTipo: 'V',
    ciNumeros: '',
    fechaNacimiento: '',
    sexo: '',
    lugarNacimiento: '',
    nacionalidad: '',
    estado: '',
    religion: '',
    direccion: '',
    telefonoOperador: '0412',
    telefonoNumeros: '',
    telefonoEmergenciaOperador: '0412',
    telefonoEmergenciaNumeros: '',
    
    // PERSONAL MILITAR
    grado: '',
    estadoMilitar: '', // '' | 'activo' | 'disponible' | 'resActiva'
    componente: '',
    unidad: '',
    
    // ESTANCIA HOSPITALARIA
    diagnosticoIngreso: '',
    diagnosticoEgreso: '',
    fechaAlta: '',
    diasHospitalizacion: '',
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // Calcular edad desde fecha de nacimiento
  const calcularEdad = (fechaNac: string): number => {
    if (!fechaNac) return 0
    const hoy = new Date()
    const nac = new Date(fechaNac)
    let edad = hoy.getFullYear() - nac.getFullYear()
    const diferenciaMeses = hoy.getMonth() - nac.getMonth()
    if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < nac.getDate())) {
      edad--
    }
    return edad
  }

  // Validar que el formato completo sea correcto
  const isHistoriaFormatValid = (value: string): boolean => {
    const pattern = /^\d{2}-\d{2}-\d{2}$/
    return pattern.test(value)
  }

  // Validar números de cédula (7-9 dígitos)
  const validateCINumeros = (value: string): boolean => {
    const pattern = /^\d{0,9}$/
    return pattern.test(value)
  }

  // Validar que la cédula tenga mínimo 7 dígitos para CI y máximo 9 para pasaporte
  const validateCINumerosLength = (value: string): boolean => {
    return value.length >= 7 && value.length <= 9
  }

  // Validar números de teléfono (hasta 7 dígitos para entrada, exactamente 7 para validación final)
  const validateTelefonoNumeros = (value: string): boolean => {
    const pattern = /^\d{0,7}$/
    return pattern.test(value)
  }

  const handleCINumerosChange = (value: string) => {
    if (validateCINumeros(value)) {
      setFormData({...formData, ciNumeros: value})
      setErrors({...errors, ciNumeros: ''})
    }
  }

  const handleTelefonoNumerosChange = (value: string) => {
    if (validateTelefonoNumeros(value)) {
      setFormData({...formData, telefonoNumeros: value})
      setErrors({...errors, telefonoNumeros: ''})
    }
  }

  const handleTelefonoEmergenciaNumerosChange = (value: string) => {
    if (validateTelefonoNumeros(value)) {
      setFormData({...formData, telefonoEmergenciaNumeros: value})
      setErrors({...errors, telefonoEmergenciaNumeros: ''})
    }
  }

  // Cargar el siguiente número de historia clínica de la BD
  const cargarSiguienteNroHistoria = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pacientes/ultimos?limit=1`)
      const result = await response.json()
      
      let siguiente = '00-00-01' // Valor por defecto si no hay pacientes
      
      if (result.success && result.data && result.data.length > 0) {
        const ultimoPaciente = result.data[0]
        const ultimoHistoria = ultimoPaciente.nroHistoria
        
        // Parsear el formato XX-XX-XX y convertir a número
        const partes = ultimoHistoria.split('-')
        const numeroCompleto = parseInt(partes.join(''), 10)
        const siguienteNumero = numeroCompleto + 1
        
        // Convertir de vuelta al formato XX-XX-XX
        const numeroStr = String(siguienteNumero).padStart(6, '0')
        siguiente = `${numeroStr.slice(0, 2)}-${numeroStr.slice(2, 4)}-${numeroStr.slice(4, 6)}`
      }
      
      setFormData({...formData, nroHistoria: siguiente})
      setErrors({...errors, nroHistoria: ''})
    } catch (error) {
      console.error('Error al cargar siguiente número de historia:', error)
      setFormData({...formData, nroHistoria: '00-00-01'})
      setErrors({...errors, nroHistoria: ''})
    }
  }

  // Cargar siguiente número al montar el componente
  useEffect(() => {
    cargarSiguienteNroHistoria()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos requeridos
    const newErrors: {[key: string]: string} = {}
    if (!formData.nroHistoria) newErrors.nroHistoria = 'Requerido'
    if (formData.nroHistoria && !isHistoriaFormatValid(formData.nroHistoria)) newErrors.nroHistoria = 'Formato: 00-00-00'
    if (!formData.apellidosNombres) newErrors.apellidosNombres = 'Requerido'
    if (!formData.ciNumeros) newErrors.ciNumeros = 'Requerido'
    if (formData.ciNumeros && !validateCINumerosLength(formData.ciNumeros)) newErrors.ciNumeros = 'Debe tener entre 7 y 9 dígitos'
    if (!formData.fechaAdmision) newErrors.fechaAdmision = 'Requerido'
    if (!formData.horaAdmision) newErrors.horaAdmision = 'Requerido'
    if (!formData.sexo) newErrors.sexo = 'Requerido'
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'Requerido'
    if (!formData.lugarNacimiento) newErrors.lugarNacimiento = 'Requerido'
    if (!formData.nacionalidad) newErrors.nacionalidad = 'Requerido'
    if (!formData.estado) newErrors.estado = 'Requerido'
    if (!formData.religion) newErrors.religion = 'Requerido'
    if (!formData.direccion) newErrors.direccion = 'Requerido'
    if (!formData.telefonoNumeros) newErrors.telefonoNumeros = 'Requerido'
    if (formData.telefonoNumeros && formData.telefonoNumeros.length !== 7) newErrors.telefonoNumeros = 'Debe tener exactamente 7 dígitos'
    if (formData.telefonoEmergenciaNumeros && formData.telefonoEmergenciaNumeros.length !== 7) newErrors.telefonoEmergenciaNumeros = 'Debe tener exactamente 7 dígitos'
    if (formData.telefonoNumeros && formData.telefonoNumeros.length !== 7) newErrors.telefonoNumeros = 'Debe tener exactamente 7 dígitos'

    // Validaciones específicas por tipo de paciente
    if (selectedPatientType === 'MILITAR') {
      if (!formData.grado) newErrors.grado = 'Requerido para personal militar'
      if (!formData.componente) newErrors.componente = 'Requerido para personal militar'
      if (!formData.estadoMilitar) newErrors.estadoMilitar = 'Requerido para personal militar'
    }

    if (selectedPatientType === 'AFILIADO') {
      if (!afiliadoData.nroCarnet) newErrors.nroCarnet = 'Requerido'
      if (!afiliadoData.parentesco) newErrors.parentesco = 'Requerido'
      if (!afiliadoData.titularNombre) newErrors.titularNombre = 'Requerido'
      if (!afiliadoData.titularCiNumeros) newErrors.titularCi = 'Requerido'
      if (afiliadoData.titularCiNumeros && afiliadoData.titularCiNumeros.length < 7) newErrors.titularCi = 'Debe tener entre 7 y 9 dígitos'
      if (!afiliadoData.titularGrado) newErrors.titularGrado = 'Requerido'
      if (!afiliadoData.titularComponente) newErrors.titularComponente = 'Requerido'
      if (!afiliadoData.fechaAfiliacion) newErrors.fechaAfiliacion = 'Requerido'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const ciCompleta = `${formData.ciTipo}-${formData.ciNumeros}`
    const telefonoCompleto = formData.telefonoNumeros ? `${formData.telefonoOperador}-${formData.telefonoNumeros}` : ''
    const telefonoEmergenciaCompleto = formData.telefonoEmergenciaNumeros ? `${formData.telefonoEmergenciaOperador}-${formData.telefonoEmergenciaNumeros}` : ''
    
    // Preparar datos para enviar al backend
    const datosRegistro: any = {
      nroHistoria: formData.nroHistoria,
      formaIngreso: formData.formaIngreso,
      fechaAdmision: formData.fechaAdmision,
      horaAdmision: formData.horaAdmision,
      firmaFacultativo: formData.firmaFacultativo,
      habitacion: formData.habitacion,
      apellidosNombres: formData.apellidosNombres,
      ci: ciCompleta,
      ciTipo: formData.ciTipo,
      fechaNacimiento: formData.fechaNacimiento,
      sexo: formData.sexo,
      lugarNacimiento: formData.lugarNacimiento,
      nacionalidad: formData.nacionalidad,
      estado: formData.estado,
      religion: formData.religion,
      direccion: formData.direccion,
      telefono: telefonoCompleto,
      telefonoEmergencia: telefonoEmergenciaCompleto,
      diagnosticoIngreso: formData.diagnosticoIngreso,
      diagnosticoEgreso: formData.diagnosticoEgreso,
      fechaAlta: formData.fechaAlta,
      diasHospitalizacion: formData.diasHospitalizacion,
      tipoPaciente: selectedPatientType || 'PNA',
    }

    // Agregar datos específicos según tipo de paciente
    if (selectedPatientType === 'MILITAR') {
      datosRegistro.grado = formData.grado
      datosRegistro.estadoMilitar = formData.estadoMilitar
      datosRegistro.componente = formData.componente
      datosRegistro.unidad = formData.unidad
    }

    if (selectedPatientType === 'AFILIADO') {
      const titularCiCompleta = `${afiliadoData.titularCiTipo}-${afiliadoData.titularCiNumeros}`
      datosRegistro.afiliadoData = {
        nroCarnet: afiliadoData.nroCarnet,
        parentesco: afiliadoData.parentesco,
        titularNombre: afiliadoData.titularNombre,
        titularCi: titularCiCompleta,
        titularGrado: afiliadoData.titularGrado,
        titularComponente: afiliadoData.titularComponente,
        fechaAfiliacion: afiliadoData.fechaAfiliacion,
        vigente: afiliadoData.vigente,
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/pacientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosRegistro),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al registrar el paciente')
      }

      // Éxito - mostrar mensaje y limpiar formulario
      alert(`✅ Paciente registrado exitosamente\nNro. Historia: ${result.data.nroHistoria}\nCI: ${result.data.ci}`)
      
      // Limpiar formulario SOLO si el registro fue exitoso
      setFormData({
        nroHistoria: '',
        formaIngreso: 'AMBULANTE',
        fechaAdmision: getTodayVenezuelaISO(),
        horaAdmision: getCurrentTimeVenezuela(),
        firmaFacultativo: '',
        habitacion: '',
        apellidosNombres: '',
        ciTipo: 'V',
        ciNumeros: '',
        fechaNacimiento: '',
        sexo: '',
        lugarNacimiento: '',
        nacionalidad: '',
        estado: '',
        religion: '',
        direccion: '',
        telefonoOperador: '0412',
        telefonoNumeros: '',
        telefonoEmergenciaOperador: '0412',
        telefonoEmergenciaNumeros: '',
        grado: '',
        estadoMilitar: '',
        componente: '',
        unidad: '',
        diagnosticoIngreso: '',
        diagnosticoEgreso: '',
        fechaAlta: '',
        diasHospitalizacion: '',
      })
      setErrors({})
    } catch (error: any) {
      console.error('Error:', error)
      // Mostrar error SIN limpiar el formulario
      alert(`❌ Error: ${error.message}\n\nLos datos del formulario se han mantenido. Por favor, verifique los errores marcados en rojo.`)
      // NO limpiar formData - mantener los datos ingresados
    }
  }

  return (
    <section className={styles["form-section"]}>
      {!selectedPatientType ? (
        // Mostrar selector de tipo de paciente
        <PatientTypeSelector onSelectType={setSelectedPatientType} />
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2>Control de Admisión - Registro de Paciente</h2>
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
            >
              ← Cambiar tipo
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className={styles["patient-form"]}>
        {/* SECCIÓN 1: DATOS DE ADMISIÓN */}
        <div className={styles["form-section-header"]}>
          <h3>1. Datos de Admisión</h3>
        </div>

        <div className={styles["form-grid"]}>
          <div className={styles["form-group"]}>
            <label>Nro. Historia Clínica * <span className={styles["hint"]}>(Autogenerado)</span></label>
            <input
              type="text"
              required
              disabled
              value={formData.nroHistoria}
              placeholder="00-00-00"
              title="Se genera automáticamente del último paciente registrado"
            />
            {errors.nroHistoria && <span className={styles["error-message"]}>{errors.nroHistoria}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Forma de Ingreso *</label>
            <div className={styles["radio-group"]}>
              <label className={styles["radio-label"]}>
                <input
                  type="radio"
                  name="formaIngreso"
                  value="AMBULANTE"
                  checked={formData.formaIngreso === 'AMBULANTE'}
                  onChange={(e) => setFormData({...formData, formaIngreso: e.target.value})}
                />
                Ambulante
              </label>
              <label className={styles["radio-label"]}>
                <input
                  type="radio"
                  name="formaIngreso"
                  value="AMBULANCIA"
                  checked={formData.formaIngreso === 'AMBULANCIA'}
                  onChange={(e) => setFormData({...formData, formaIngreso: e.target.value})}
                />
                Ambulancia
              </label>
            </div>
          </div>

          <div className={styles["form-group"]}>
            <label>Fecha de Admisión *</label>
            <input
              type="date"
              required
              value={formData.fechaAdmision}
              onChange={(e) => setFormData({...formData, fechaAdmision: e.target.value})}
            />
            {errors.fechaAdmision && <span className={styles["error-message"]}>{errors.fechaAdmision}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Hora de Admisión *</label>
            <input
              type="time"
              required
              value={formData.horaAdmision}
              onChange={(e) => setFormData({...formData, horaAdmision: e.target.value})}
            />
            {errors.horaAdmision && <span className={styles["error-message"]}>{errors.horaAdmision}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Habitación</label>
            <input
              type="text"
              value={formData.habitacion}
              onChange={(e) => setFormData({...formData, habitacion: e.target.value})}
              placeholder="Ej: 101, 205"
            />
          </div>

          <div className={styles["form-group"]}>
            <label>Firma de Facultativo</label>
            <input
              type="text"
              value={formData.firmaFacultativo}
              onChange={(e) => setFormData({...formData, firmaFacultativo: e.target.value})}
              placeholder="Nombre del médico"
            />
          </div>

          <div className={styles["form-group"]} style={{ gridColumn: '1 / -1' }}>
            <label>Diagnóstico de Ingreso</label>
            <input
              type="text"
              value={formData.diagnosticoIngreso}
              onChange={(e) => setFormData({...formData, diagnosticoIngreso: e.target.value})}
              placeholder="Ej: Hipertensión Arterial, Fractura de tibia, etc."
            />
          </div>
        </div>

        {/* SECCIÓN 2: DATOS PERSONALES DEL PACIENTE */}
        <div className={styles["form-section-header"]}>
          <h3>2. Datos Personales del Paciente</h3>
        </div>

        <div className={styles["form-grid"]}>
          <div className={styles["form-group"]}>
            <label>Apellidos y Nombres *</label>
            <input
              type="text"
              required
              value={formData.apellidosNombres}
              onChange={(e) => setFormData({...formData, apellidosNombres: e.target.value})}
              placeholder="Apellidos y Nombres completos"
            />
            {errors.apellidosNombres && <span className={styles["error-message"]}>{errors.apellidosNombres}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Cédula de Identidad *</label>
            <div className={styles["dual-input-group"]}>
              <select
                value={formData.ciTipo}
                onChange={(e) => setFormData({...formData, ciTipo: e.target.value})}
              >
                <option value="V">V</option>
                <option value="E">E</option>
                <option value="P">P</option>
              </select>
              <input
                type="text"
                required
                value={formData.ciNumeros}
                onChange={(e) => handleCINumerosChange(e.target.value)}
                placeholder="12345678"
                maxLength={9}
              />
            </div>
            {errors.ciNumeros && <span className={styles["error-message"]}>{errors.ciNumeros}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Fecha de Nacimiento *</label>
            <input
              type="date"
              required
              value={formData.fechaNacimiento}
              onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
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
              required
              value={formData.sexo}
              onChange={(e) => setFormData({...formData, sexo: e.target.value})}
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

          <div className="form-group full-width">
            <label>Dirección *</label>
            <input
              type="text"
              required
              value={formData.direccion}
              onChange={(e) => setFormData({...formData, direccion: e.target.value})}
              placeholder="Dirección completa de residencia"
            />
            {errors.direccion && <span className={styles["error-message"]}>{errors.direccion}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Teléfono *</label>
            <div className={styles["dual-input-group"]}>
              <select
                value={formData.telefonoOperador}
                onChange={(e) => setFormData({...formData, telefonoOperador: e.target.value})}
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
                required
                value={formData.telefonoNumeros}
                onChange={(e) => handleTelefonoNumerosChange(e.target.value)}
                placeholder="1234567"
                maxLength={7}
              />
            </div>
            {errors.telefonoNumeros && <span className={styles["error-message"]}>{errors.telefonoNumeros}</span>}
          </div>

          <div className={styles["form-group"]}>
            <label>Teléfono de Emergencia <span className={styles["hint"]}>(Familiar)</span></label>
            <div className={styles["dual-input-group"]}>
              <select
                value={formData.telefonoEmergenciaOperador}
                onChange={(e) => setFormData({...formData, telefonoEmergenciaOperador: e.target.value})}
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
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: DATOS SEGÚN TIPO DE PACIENTE */}
        {selectedPatientType === 'MILITAR' && (
          <>
            <div className={styles["form-section-header"]}>
              <h3>3. Datos de Personal Militar</h3>
            </div>

            <div className={styles["form-grid"]}>
              <SearchableSelect
                label="Grado *"
                options={GRADOS_MILITARES}
                value={formData.grado}
                onChange={(value) => setFormData({...formData, grado: value})}
                placeholder="Seleccione el grado militar"
              />
              {errors.grado && <div style={{ gridColumn: '1 / -1' }}><span className={styles["error-message"]}>{errors.grado}</span></div>}

              <SearchableSelect
                label="Componente *"
                options={COMPONENTES_MILITARES}
                value={formData.componente}
                onChange={(value) => setFormData({...formData, componente: value})}
                placeholder="Seleccione el componente militar"
              />
              {errors.componente && <div style={{ gridColumn: '1 / -1' }}><span className={styles["error-message"]}>{errors.componente}</span></div>}

              <div className={styles["form-group"]}>
                <label>Unidad</label>
                <input
                  type="text"
                  value={formData.unidad}
                  onChange={(e) => setFormData({...formData, unidad: e.target.value})}
                  placeholder="Ej: Batallón, Brigada"
                />
              </div>

              <div className="form-group full-width">
                <label>Estado Militar *</label>
                <div className={styles["radio-group-inline"]}>
                  <label className={styles["radio-label"]}>
                    <input
                      type="radio"
                      name="estadoMilitar"
                      value="activo"
                      checked={formData.estadoMilitar === 'activo'}
                      onChange={(e) => setFormData({...formData, estadoMilitar: e.target.value})}
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

        {/* PNA no tiene sección 3 */}

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Registrar Admisión
          </button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => {
              setFormData({
                nroHistoria: '',
                formaIngreso: 'AMBULANTE',
                fechaAdmision: getTodayVenezuelaISO(),
                horaAdmision: getCurrentTimeVenezuela(),
                firmaFacultativo: '',
                habitacion: '',
                apellidosNombres: '',
                ciTipo: 'V',
                ciNumeros: '',
                fechaNacimiento: '',
                sexo: '',
                lugarNacimiento: '',
                nacionalidad: '',
                estado: '',
                religion: '',
                direccion: '',
                telefonoOperador: '0412',
                telefonoNumeros: '',
                telefonoEmergenciaOperador: '0412',
                telefonoEmergenciaNumeros: '',
                grado: '',
                estadoMilitar: '',
                componente: '',
                unidad: '',
                diagnosticoIngreso: '',
                diagnosticoEgreso: '',
                fechaAlta: '',
                diasHospitalizacion: '',
              })
              setAfiliadoData({
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
              })
              setErrors({})
              cargarSiguienteNroHistoria()
            }}
          >
            Limpiar Formulario
          </button>
        </div>
      </form>
        </>
      )}
    </section>
  )
}

export default RegisterPatientForm
