import { forwardRef } from 'react'
import styles from './FormSelect.module.css'

export interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, options, placeholder, ...props }, ref) => {
    return (
      <div className={styles.formGroup}>
        <label htmlFor={props.id} className={styles.label}>
          {label}
        </label>
        <select
          ref={ref}
          className={`${styles.select} ${error ? styles.selectError : ''}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'

export default FormSelect
