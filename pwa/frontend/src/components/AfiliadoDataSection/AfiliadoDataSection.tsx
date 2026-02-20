import React from 'react';
import { SearchableSelect } from '../SearchableSelect';
import { GRADOS_MILITARES, COMPONENTES_MILITARES } from '../../constants/venezuela';

export interface AfiliadoData {
  nroCarnet: string;
  parentesco: string;
  titularNombre: string;
  titularCi: string;
  titularCiTipo: string;
  titularCiNumeros: string;
  titularGrado: string;
  titularComponente: string;
  fechaAfiliacion: string;
  vigente: boolean;
}

interface AfiliadoDataSectionProps {
  data: AfiliadoData;
  onChange: (data: AfiliadoData) => void;
  errors?: {[key: string]: string};
  styles: any;
}

const PARENTESCOS = [
  'ESPOSO/A',
  'HIJO/A',
  'PADRE',
  'MADRE',
  'HERMANO/A',
  'ABUELO/A',
  'NIETO/A',
  'OTRO'
];

export const AfiliadoDataSection: React.FC<AfiliadoDataSectionProps> = ({ 
  data, 
  onChange,
  errors = {},
  styles
}) => {
  const handleCITitularNumerosChange = (value: string) => {
    // Solo permitir números, máximo 9 dígitos
    if (/^\d{0,9}$/.test(value)) {
      onChange({...data, titularCiNumeros: value});
    }
  };

  return (
    <>
      <div className={styles["form-section-header"]}>
        <h3>3. Datos de Afiliación</h3>
      </div>

      <div className={styles["form-grid"]}>
        <div className={styles["form-group"]}>
          <label>Número de Carnet *</label>
          <input
            type="text"
            required
            value={data.nroCarnet}
            onChange={(e) => onChange({...data, nroCarnet: e.target.value})}
            placeholder="Ej: AF-12345678"
          />
          {errors.nroCarnet && <span className={styles["error-message"]}>{errors.nroCarnet}</span>}
        </div>

        <div className={styles["form-group"]}>
          <label>Parentesco *</label>
          <select
            required
            value={data.parentesco}
            onChange={(e) => onChange({...data, parentesco: e.target.value})}
          >
            <option value="">Seleccione...</option>
            {PARENTESCOS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.parentesco && <span className={styles["error-message"]}>{errors.parentesco}</span>}
        </div>

        <div className={styles["form-group"]}>
          <label>Nombre del Militar Titular *</label>
          <input
            type="text"
            required
            value={data.titularNombre}
            onChange={(e) => onChange({...data, titularNombre: e.target.value})}
            placeholder="Apellidos y Nombres completos"
          />
          {errors.titularNombre && <span className={styles["error-message"]}>{errors.titularNombre}</span>}
        </div>

        <div className={styles["form-group"]}>
          <label>CI del Militar Titular *</label>
          <div className={styles["dual-input-group"]}>
            <select
              value={data.titularCiTipo}
              onChange={(e) => onChange({...data, titularCiTipo: e.target.value})}
            >
              <option value="V">V</option>
              <option value="E">E</option>
              <option value="P">P</option>
            </select>
            <input
              type="text"
              required
              value={data.titularCiNumeros}
              onChange={(e) => handleCITitularNumerosChange(e.target.value)}
              placeholder="12345678"
              maxLength={9}
            />
          </div>
          {errors.titularCi && <span className={styles["error-message"]}>{errors.titularCi}</span>}
        </div>

        <div className={styles["form-group"]}>
          <label>Grado del Militar Titular *</label>
          <SearchableSelect
            options={GRADOS_MILITARES}
            value={data.titularGrado}
            onChange={(value) => onChange({...data, titularGrado: value})}
            placeholder="Seleccione el grado..."
          />
          {errors.titularGrado && <span className={styles["error-message"]}>{errors.titularGrado}</span>}
        </div>

        <div className={styles["form-group"]}>
          <label>Componente del Militar Titular *</label>
          <SearchableSelect
            options={COMPONENTES_MILITARES}
            value={data.titularComponente}
            onChange={(value) => onChange({...data, titularComponente: value})}
            placeholder="Seleccione el componente..."
          />
          {errors.titularComponente && <span className={styles["error-message"]}>{errors.titularComponente}</span>}
        </div>

        <div className={styles["form-group"]}>
          <label>Fecha de Afiliación *</label>
          <input
            type="date"
            required
            value={data.fechaAfiliacion}
            onChange={(e) => onChange({...data, fechaAfiliacion: e.target.value})}
          />
          {errors.fechaAfiliacion && <span className={styles["error-message"]}>{errors.fechaAfiliacion}</span>}
        </div>

        <div className={styles["form-group"]}>
          <label>Estado de Afiliación</label>
          <select
            value={data.vigente ? 'true' : 'false'}
            onChange={(e) => onChange({...data, vigente: e.target.value === 'true'})}
          >
            <option value="true">Vigente</option>
            <option value="false">No Vigente</option>
          </select>
        </div>
      </div>
    </>
  );
};
