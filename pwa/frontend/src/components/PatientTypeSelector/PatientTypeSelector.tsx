import React from 'react';
import styles from './PatientTypeSelector.module.css';

interface PatientTypeSelectorProps {
  onSelectType: (type: 'MILITAR' | 'AFILIADO' | 'PNA') => void;
}

export const PatientTypeSelector: React.FC<PatientTypeSelectorProps> = ({ onSelectType }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Registrar Nuevo Paciente</h2>
      <p className={styles.subtitle}>Seleccione el tipo de paciente:</p>
      
      <div className={styles.buttonGrid}>
        <button 
          type="button"
          className={`${styles.typeButton} ${styles.militar}`}
          onClick={() => onSelectType('MILITAR')}
        >
          <h3>MILITAR</h3>
          <p>Personal Militar Activo</p>
        </button>

        <button 
          type="button"
          className={`${styles.typeButton} ${styles.afiliado}`}
          onClick={() => onSelectType('AFILIADO')}
        >
          <h3>AFILIADO</h3>
          <p>Familiar de Militar</p>
        </button>

        <button 
          type="button"
          className={`${styles.typeButton} ${styles.pna}`}
          onClick={() => onSelectType('PNA')}
        >
          <h3>PNA</h3>
          <p>Paciente No Afiliado</p>
        </button>
      </div>
    </div>
  );
};
