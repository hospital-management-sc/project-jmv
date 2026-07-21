import { useState } from 'react'
import { API_BASE_URL } from '@/utils/constants'
import styles from './ChangePassword.module.css'

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatusMessage(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Por favor complete todos los campos.' })
      return
    }

    if (newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' })
      return
    }

    if (currentPassword === newPassword) {
      setStatusMessage({ type: 'error', text: 'La nueva contraseña debe ser diferente a la actual.' })
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al cambiar la contraseña')
      }

      setStatusMessage({ type: 'success', text: '¡Contraseña actualizada exitosamente!' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error al cambiar la contraseña' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div>
        <h3 className={styles.title}>Cambiar Contraseña</h3>
        <p className={styles.subtitle}>
          Actualiza tu contraseña para mantener la seguridad de tu cuenta.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`${styles.message} ${
            statusMessage.type === 'success' ? styles.successMessage : styles.errorMessage
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Contraseña Actual</label>
          <div className={styles.inputWrapper}>
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Ingresa tu contraseña actual"
              required
              className={styles.input}
            />
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowCurrent(!showCurrent)}
              title={showCurrent ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showCurrent ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Nueva Contraseña</label>
          <div className={styles.inputWrapper}>
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              className={styles.input}
            />
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowNew(!showNew)}
              title={showNew ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showNew ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Confirmar Nueva Contraseña</label>
          <div className={styles.inputWrapper}>
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la nueva contraseña"
              required
              className={styles.input}
            />
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowConfirm(!showConfirm)}
              title={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? 'Actualizando...' : 'Guardar Nueva Contraseña'}
        </button>
      </form>
    </div>
  )
}
