/**
 * Componente para Registrar Nueva Emergencia (DoctorDashboard)
 * Flujo:
 * 1. Solicita CI del paciente
 * 2. Busca en sistema
 * 3. Si no existe → Muestra formulario de registro
 * 4. Redirige a FORMATO_EMERGENCIA
 */

import { useState } from 'react';
import styles from './RegistrarEmergencia.module.css';
import RegistrarPaciente from './RegistrarPaciente';
import FormatoEmergencia from './FormatoEmergencia';

interface RegistrarEmergenciaProps {
  onBack: () => void;
}

export default function RegistrarEmergencia({ onBack }: RegistrarEmergenciaProps) {
  const [paso, setPaso] = useState<'busqueda' | 'registro' | 'paciente-encontrado' | 'formato-emergencia'>('busqueda');
  const [ciTipo, setCiTipo] = useState('V');
  const [ciNumeros, setCiNumeros] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [pacienteEncontrado, setPacienteEncontrado] = useState<any>(null);
  const [admisionId, setAdmisionId] = useState<number | null>(null);

  const handleCINumerosChange = (value: string) => {
    const soloNumeros = value.replace(/\D/g, '').slice(0, 8);
    setCiNumeros(soloNumeros);
    setErrorBusqueda('');
  };

  const buscarPaciente = async () => {
    if (!ciNumeros.trim() || ciNumeros.length < 7) {
      setErrorBusqueda('CI debe tener al menos 7 dígitos');
      return;
    }

    setBuscando(true);
    setErrorBusqueda('');

    try {
      const ciCompleta = `${ciTipo}-${ciNumeros}`;
      const response = await fetch(`http://localhost:3001/api/pacientes/search?ci=${encodeURIComponent(ciCompleta)}`);

      if (!response.ok) {
        if (response.status === 404) {
          // Paciente no existe → Mostrar formulario de registro
          setPaso('registro');
        } else {
          throw new Error('Error al buscar paciente');
        }
      } else {
        const result = await response.json();
        setPacienteEncontrado(result.data);
        setPaso('paciente-encontrado');
      }
    } catch (err: any) {
      setErrorBusqueda(err.message || 'Error al buscar paciente');
      console.error(err);
    } finally {
      setBuscando(false);
    }
  };

  const handlePacienteRegistrado = async (datosRegistro: any) => {
    try {
      // Crear Paciente + Admisión de EMERGENCIA en una sola operación
      const datosCompletos = {
        ...datosRegistro,
        tipoAdmision: 'EMERGENCIA', // Indica que la admisión inicial es de tipo EMERGENCIA
        servicioAdmision: 'EMERGENCIA',
      };

      const response = await fetch('http://localhost:3001/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosCompletos),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Error al registrar el paciente');
      }

      const result = await response.json();
      
      // Construir objeto paciente completo para mostrar
      const pacienteCompleto = {
        id: result.data.pacienteId,
        nroHistoria: result.data.nroHistoria,
        ci: result.data.ci,
        apellidosNombres: result.data.apellidosNombres,
        ...datosRegistro,
      };
      
      setPacienteEncontrado(pacienteCompleto);
      setAdmisionId(Number(result.data.admisionId)); // La admisión ya viene creada con tipo EMERGENCIA
      setPaso('paciente-encontrado');
    } catch (err: any) {
      alert('Error al registrar paciente: ' + err.message);
      console.error(err);
    }
  };

  const handleCancelarRegistro = () => {
    setCiNumeros('');
    setPaso('busqueda');
  };

  const handleIrAFormatoEmergencia = async () => {
    // Si ya tenemos admisionId (paciente recién registrado), ir directo al formato
    if (admisionId) {
      setPaso('formato-emergencia');
      return;
    }

    // Si no hay admisionId, crear una nueva admisión de EMERGENCIA (paciente existente)
    try {
      const response = await fetch('http://localhost:3001/api/admisiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pacienteId: pacienteEncontrado.id,
          tipo: 'EMERGENCIA',
          servicio: 'EMERGENCIA',
          fechaAdmision: new Date().toISOString().split('T')[0],
          horaAdmision: new Date().toTimeString().slice(0, 5),
          formaIngreso: 'AMBULANTE',
        }),
      });

      if (!response.ok) throw new Error('Error al crear admisión');

      const result = await response.json();
      setAdmisionId(result.admision.id);
      setPaso('formato-emergencia');
    } catch (err: any) {
      alert('Error al crear admisión: ' + err.message);
      console.error(err);
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
      {/* Paso 1: Búsqueda de Paciente */}
      {paso === 'busqueda' && (
        <>
          <div className={styles.header}>
            <h1>🚨 Nuevo Paciente en Emergencia</h1>
            <p className={styles.subtitle}>Busque al paciente por CI para iniciar atención</p>
          </div>

          <div className={styles.busquedaCard}>
            <div className={styles.busquedaContent}>
              <h3>Cédula de Identidad del Paciente</h3>
              <p>Ingrese el CI del paciente para verificar si está registrado en el sistema</p>

              <div className={styles.busquedaInput}>
                <select
                  value={ciTipo}
                  onChange={(e) => setCiTipo(e.target.value)}
                  disabled={buscando}
                  className={styles.ciSelect}
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
                  onKeyDown={(e) => e.key === 'Enter' && buscarPaciente()}
                  disabled={buscando}
                  maxLength={8}
                  className={styles.ciInput}
                />
                <button
                  onClick={buscarPaciente}
                  disabled={buscando}
                  className={styles.buscarBtn}
                >
                  {buscando ? '🔍 Buscando...' : '🔍 Buscar'}
                </button>
              </div>

              {errorBusqueda && (
                <div className={styles.errorMsg}>
                  ⚠️ {errorBusqueda}
                </div>
              )}
            </div>

            <div className={styles.busquedaInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>✅</span>
                <div>
                  <strong>Si el paciente está registrado:</strong>
                  <p>Se mostrarán sus datos y podrá continuar con el formato de emergencia.</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}>📝</span>
                <div>
                  <strong>Si el paciente NO está registrado:</strong>
                  <p>Podrá registrarlo rápidamente antes de atenderlo.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button onClick={onBack} className={styles.backBtn}>
              ← Volver
            </button>
          </div>
        </>
      )}

      {/* Paso 2: Registrar Paciente Nuevo */}
      {paso === 'registro' && (
        <>
          <div className={styles.registroHeader}>
            <h2>❌ Paciente NO Registrado</h2>
            <p>
              No se encontró paciente con CI: <strong>{ciTipo}-{ciNumeros}</strong>
            </p>
            <p className={styles.registroSubtext}>
              Complete el siguiente formulario para registrar al paciente antes de atenderlo
            </p>
          </div>

          <RegistrarPaciente
            ciPreFilled={`${ciTipo}-${ciNumeros}`}
            onSuccess={handlePacienteRegistrado}
            onCancel={handleCancelarRegistro}
          />
        </>
      )}

      {/* Paso 3: Paciente Encontrado - Ir a Formato */}
      {paso === 'paciente-encontrado' && pacienteEncontrado && (
        <>
          <div className={styles.header}>
            <h1>✅ Paciente Encontrado</h1>
          </div>

          <div className={styles.pacienteCard}>
            <div className={styles.pacienteHeader}>
              <h2>{pacienteEncontrado.apellidosNombres}</h2>
              <span className={styles.pacienteBadge}>
                {pacienteEncontrado.sexo === 'M' ? '👨' : '👩'} {pacienteEncontrado.sexo === 'M' ? 'Masculino' : 'Femenino'}
              </span>
            </div>

            <div className={styles.pacienteGrid}>
              <div className={styles.pacienteItem}>
                <span className={styles.itemLabel}>CI:</span>
                <span className={styles.itemValue}>{pacienteEncontrado.ci}</span>
              </div>
              <div className={styles.pacienteItem}>
                <span className={styles.itemLabel}>Historia Clínica:</span>
                <span className={styles.itemValue}>{pacienteEncontrado.nroHistoria}</span>
              </div>
              <div className={styles.pacienteItem}>
                <span className={styles.itemLabel}>Edad:</span>
                <span className={styles.itemValue}>
                  {calcularEdad(pacienteEncontrado.fechaNacimiento)} años
                </span>
              </div>
              <div className={styles.pacienteItem}>
                <span className={styles.itemLabel}>Fecha de Nacimiento:</span>
                <span className={styles.itemValue}>
                  {pacienteEncontrado.fechaNacimiento
                    ? new Date(pacienteEncontrado.fechaNacimiento).toLocaleDateString('es-VE')
                    : 'N/A'}
                </span>
              </div>
              {pacienteEncontrado.telefono && (
                <div className={styles.pacienteItem}>
                  <span className={styles.itemLabel}>Teléfono:</span>
                  <span className={styles.itemValue}>{pacienteEncontrado.telefono}</span>
                </div>
              )}
              {pacienteEncontrado.gradoMilitar && pacienteEncontrado.gradoMilitar !== 'CIVIL' && (
                <div className={styles.pacienteItem}>
                  <span className={styles.itemLabel}>Grado:</span>
                  <span className={styles.itemValue}>{pacienteEncontrado.gradoMilitar}</span>
                </div>
              )}
              {pacienteEncontrado.componente && pacienteEncontrado.componente !== 'CIVIL' && (
                <div className={styles.pacienteItem}>
                  <span className={styles.itemLabel}>Componente:</span>
                  <span className={styles.itemValue}>
                    {pacienteEncontrado.componente.replace(/_/g, ' ')}
                  </span>
                </div>
              )}
            </div>

            {pacienteEncontrado.admisiones && pacienteEncontrado.admisiones.length > 0 && (
              <div className={styles.historialBox}>
                <strong>📋 Historial:</strong> {pacienteEncontrado.admisiones.length} admisión(es) previa(s)
              </div>
            )}
          </div>

          <div className={styles.confirmarActions}>
            <button onClick={handleCancelarRegistro} className={styles.cambiarBtn}>
              ← Buscar otro paciente
            </button>
            <button onClick={handleIrAFormatoEmergencia} className={styles.continuarBtn}>
              Continuar a Formato de Emergencia →
            </button>
          </div>
        </>
      )}

      {/* Paso 4: Formato de Emergencia */}
      {paso === 'formato-emergencia' && pacienteEncontrado && admisionId && (
        <FormatoEmergencia
          paciente={pacienteEncontrado}
          admisionId={admisionId}
          onBack={() => {
            setPaso('busqueda');
            setPacienteEncontrado(null);
            setAdmisionId(null);
            setCiNumeros('');
          }}
          onSuccess={() => {
            alert('✓ Formato de emergencia completado exitosamente');
            onBack();
          }}
        />
      )}
    </div>
  );
}
