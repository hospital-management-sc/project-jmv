import { useState, useRef, useEffect } from 'react';
import styles from './SearchableSelect.module.css';

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  error?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Seleccione...',
  label,
  disabled = false,
  error,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrar opciones según el texto de búsqueda
  useEffect(() => {
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchText, options]);

  // Cerrar el dropdown cuando se selecciona una opción
  useEffect(() => {
    if (value && isOpen) {
      setSearchText('');
    }
  }, [value]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    setIsOpen(true);
  };

  const handleOptionClick = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchText('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchText('');
  };

  const displayValue = value || searchText;

  return (
    <div className={styles.container} ref={containerRef}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles['input-wrapper']}>
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${styles.input} ${error ? styles.error : ''} ${isOpen ? styles.active : ''}`}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            className={styles['clear-btn']}
            onClick={handleClear}
            title="Limpiar selección"
            disabled={disabled}
          >
            ✕
          </button>
        )}
        <svg className={`${styles.icon} ${isOpen ? styles.rotated : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className={styles.dropdown}>
          {filteredOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`${styles.option} ${value === option ? styles.selected : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {value === option && <span className={styles.checkmark}>✓</span>}
              {option}
            </button>
          ))}
        </div>
      )}

      {isOpen && filteredOptions.length === 0 && searchText && (
        <div className={styles['no-results']}>
          No se encontraron opciones para "{searchText}"
        </div>
      )}

      {error && <span className={styles['error-message']}>{error}</span>}
    </div>
  );
}
