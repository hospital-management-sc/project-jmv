// ==========================================
// COMPONENTE: Buscar Paciente
// ==========================================
import { useState } from "react";
import styles from "../DoctorDashboard.module.css";
import type { PatientBasic } from "../interfaces";
import { API_BASE_URL } from "@/utils/constants";
import { toastCustom } from "@/utils/toastCustom";

interface Props {
  onViewHistory: (patient: PatientBasic) => void;
  onRegisterEncounter: (patient: PatientBasic) => void;
}

export default function SearchPatient({
  onViewHistory,
  onRegisterEncounter,
}: Props) {
  const [searchType, setSearchType] = useState<"ci" | "historia">("ci");
  // Estados para búsqueda por CI
  const [searchCITipo, setSearchCITipo] = useState<'V' | 'E' | 'P'>('V');
  const [searchCINumeros, setSearchCINumeros] = useState("");
  // Estado para búsqueda por historia
  const [searchHistoria, setSearchHistoria] = useState("");
  const [searching, setSearching] = useState(false);
  const [paciente, setPaciente] = useState<PatientBasic | null>(null);
  const [ciErrors, setCIErrors] = useState<{[key: string]: string}>({});

  // Validar números de cédula (7-9 dígitos)
  const validateCINumeros = (value: string): boolean => {
    const pattern = /^\d{0,9}$/
    return pattern.test(value)
  }

  // Validar que la cédula tenga mínimo 7 dígitos
  const validateCINumerosLength = (value: string): boolean => {
    return value.length >= 7 && value.length <= 9
  }

  const handleCINumerosChange = (value: string) => {
    if (validateCINumeros(value)) {
      setSearchCINumeros(value)
      setCIErrors({...ciErrors, searchCINumeros: ''})
    }
  }

  // Auto-formato historia: XX-XX-XX (solo dígitos, guiones automáticos)
  const formatHistoria = (raw: string): string => {
    const digits = raw.replace(/\D/g, '').slice(0, 6)
    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`
    return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`
  }

  const handleHistoriaChange = (value: string) => {
    setSearchHistoria(formatHistoria(value))
  }

  const buscarPaciente = async () => {
    const newErrors: {[key: string]: string} = {}
    let searchValue = "";
    
    if (searchType === "ci") {
      if (!searchCINumeros.trim()) {
        newErrors.searchCINumeros = "Ingrese un número de cédula";
      }
      if (searchCINumeros && !validateCINumerosLength(searchCINumeros)) {
        newErrors.searchCINumeros = "Debe tener entre 7 y 9 dígitos";
      }
      
      if (Object.keys(newErrors).length > 0) {
        setCIErrors(newErrors)
        return;
      }
      
      searchValue = `${searchCITipo}-${searchCINumeros}`;
    } else {
      if (!searchHistoria.trim()) {
        toastCustom.error("Ingrese un número de historia");
        return;
      }
      searchValue = searchHistoria;
    }

    setSearching(true);
    setPaciente(null);

    try {
      const queryParam =
        searchType === "ci" ? `ci=${searchValue}` : `historia=${searchValue}`;
      const response = await fetch(
        `${API_BASE_URL}/pacientes/search?${queryParam}`
      );
      const result = await response.json();

      if (result.success && result.data) {
        setPaciente(result.data);
      } else {
        toastCustom.error("Paciente no encontrado");
      }
    } catch {
      toastCustom.error("Error al buscar paciente");
    } finally {
      setSearching(false);
    }
  };

  const calcularEdad = (fechaNac?: string) => {
    if (!fechaNac) return "N/A";
    const hoy = new Date();
    const nac = new Date(fechaNac);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const mes = hoy.getMonth() - nac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--;
    return `${edad} años`;
  };

  return (
    <section className={styles["view-section"]}>
      <div className={styles["section-header"]}>
        <h2>Buscar Paciente</h2>
        <p className={styles["section-subtitle"]}>
          Consulte la historia clínica y antecedentes del paciente
        </p>
      </div>

      <div className={styles["form-card"]}>
        <div className={styles["search-type-selector"]}>
          <label className={searchType === "ci" ? styles.active : ""}>
            <input
              type="radio"
              name="searchType"
              value="ci"
              checked={searchType === "ci"}
              onChange={() => {
                setSearchType("ci");
                setSearchHistoria("");
                setPaciente(null);
                setCIErrors({});
              }}
            />
            Buscar por Cédula
          </label>
          <label className={searchType === "historia" ? styles.active : ""}>
            <input
              type="radio"
              name="searchType"
              value="historia"
              checked={searchType === "historia"}
              onChange={() => {
                setSearchType("historia");
                setSearchCINumeros("");
                setPaciente(null);
                setCIErrors({});
              }}
            />
            Buscar por Nro. Historia
          </label>
        </div>

        <div className={styles["search-box"]}>
          {searchType === "ci" ? (
            <>
              <div className={styles["dual-input-group"]}>
                <select
                  value={searchCITipo}
                  onChange={(e) => setSearchCITipo(e.target.value as 'V' | 'E' | 'P')}
                >
                  <option value="V">V</option>
                  <option value="E">E</option>
                  <option value="P">P</option>
                </select>
                <input
                  type="text"
                  placeholder="12345678"
                  value={searchCINumeros}
                  onChange={(e) => handleCINumerosChange(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && buscarPaciente()}
                  maxLength={9}
                />
              </div>
              <button onClick={buscarPaciente} disabled={searching}>
                {searching ? "Buscando..." : "Buscar"}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="25-11-01"
                value={searchHistoria}
                onChange={(e) => handleHistoriaChange(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && buscarPaciente()}
                maxLength={8}
              />
              <button onClick={buscarPaciente} disabled={searching}>
                {searching ? "Buscando..." : "Buscar"}
              </button>
            </>
          )}
        </div>

        {ciErrors.searchCINumeros && searchType === "ci" && <p className={styles["error-text"]}>{ciErrors.searchCINumeros}</p>}

        {paciente && (
          <div className={styles["patient-result"]}>
            <div className={styles["patient-header"]}>
              <h3>{paciente.apellidosNombres}</h3>
              <span className={styles["historia-badge"]}>
                HC: {paciente.nroHistoria}
              </span>
            </div>

            <div className={styles["patient-info-grid"]}>
              <div className={styles["info-item"]}>
                <strong>Cédula:</strong>
                <span>{paciente.ci}</span>
              </div>
              <div className={styles["info-item"]}>
                <strong>Edad:</strong>
                <span>{calcularEdad(paciente.fechaNacimiento)}</span>
              </div>
              <div className={styles["info-item"]}>
                <strong>Sexo:</strong>
                <span>
                  {paciente.sexo === "M" ? "Masculino" : "Femenino"}
                </span>
              </div>
              <div className={styles["info-item"]}>
                <strong>Teléfono:</strong>
                <span>{paciente.telefono || "N/A"}</span>
              </div>
            </div>

            <div className={styles["patient-actions"]}>
              <button
                className={styles["btn-primary"]}
                onClick={() => onViewHistory(paciente)}
              >
                Ver Historia Completa
              </button>
              <button
                className={styles["btn-secondary"]}
                onClick={() => onRegisterEncounter(paciente)}
              >
                Nuevo Encuentro
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
