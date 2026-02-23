import { forwardRef } from 'react'
import styles from './FormInput.module.css'

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, hint, ...props }, ref) => {
    return (
      <div className={styles.formGroup}>
        <label htmlFor={props.id} className={styles.label}>
          {label}
        </label>
        <input
          ref={ref}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          {...props}
        />
        {error && <span className={styles.error}>{error}</span>}
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

export default FormInput
