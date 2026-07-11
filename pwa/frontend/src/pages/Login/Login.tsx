import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PasswordToggle from '@components/PasswordToggle'
import { useAuth } from '@/contexts/AuthContext'
import { API_BASE_URL } from '@/utils/constants'
import {
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
  startWebAuthnAuthentication,
  getWebAuthnErrorMessage,
} from '@/utils/webauthn'
import styles from './Login.module.css'

const loginSchema = z.object({
  ciTipo: z.string().min(1),
  ciNumeros: z.string().regex(/^\d{7,9}$/, 'Debe tener 7-9 dígitos'),
  password: z.string().min(1, 'Contraseña requerida'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const [biometricLoading, setBiometricLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { ciTipo: 'V' },
  })

  useEffect(() => {
    const check = async () => {
      if (isWebAuthnSupported()) {
        const available = await isPlatformAuthenticatorAvailable()
        setBiometricAvailable(available)
      }
    }
    check()
  }, [])

  const handleBiometricLogin = async () => {
    setLoginError(null)
    setBiometricLoading(true)
    try {
      const initiateRes = await fetch(`${API_BASE_URL}/biometric/authenticate/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!initiateRes.ok) throw new Error('No se pudo iniciar la autenticación biométrica')
      const initiateData = await initiateRes.json()
      const { challengeToken, ...webAuthnOptions } = initiateData.data

      let assertionResponse
      try {
        assertionResponse = await startWebAuthnAuthentication(webAuthnOptions)
      } catch (err) {
        throw new Error(getWebAuthnErrorMessage(err))
      }

      const verifyRes = await fetch(`${API_BASE_URL}/biometric/authenticate/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credentialId: assertionResponse.id, assertionResponse, challengeToken }),
      })
      const verifyData = await verifyRes.json()
      if (!verifyRes.ok || !verifyData.success) throw new Error(verifyData.message || 'Verificación biométrica fallida')

      const { id, nombre, email, role, especialidad, token } = verifyData.data
      login({ id, nombre, email, role, especialidad }, token)
      navigate(role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/medico')
    } catch (err: any) {
      setLoginError(err?.message || 'Error en autenticación biométrica')
    } finally {
      setBiometricLoading(false)
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null)
    const ci = `${data.ciTipo}${data.ciNumeros}`.toUpperCase()
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ci, password: data.password }),
      })
      const json = await res.json()

      if (json.success && json.data?.token) {
        const { id, nombre, email, role, especialidad, token } = json.data
        login({ id, nombre, email, role, especialidad }, token)
        if (role === 'SUPER_ADMIN') navigate('/dashboard/superadmin')
        else if (role === 'ADMIN') navigate('/dashboard/admin')
        else navigate('/dashboard/medico')
      } else {
        setLoginError(json.message || 'Cédula o contraseña incorrectos.')
      }
    } catch {
      setLoginError('No se pudo conectar con el servidor. Verifica tu conexión.')
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.up_title}>Hospital Militar</h1>
      <h1 className={styles.title}>"Dr. José María Vargas"</h1>
      <p className={styles.subtitle}>Accede al sistema</p>

      {loginError && (
        <div className={styles.errorAlert}>
          <div className={styles.alertContent}>
            <p className={styles.alertDescription}>{loginError}</p>
          </div>
          <button
            type="button"
            className={styles.alertClose}
            onClick={() => setLoginError(null)}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Campo CI */}
        <div className={styles.formGroup}>
          <label>Cédula de Identidad</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              {...register('ciTipo')}
              style={{
                width: '4.5rem',
                flexShrink: 0,
                padding: '0.625rem 0.5rem',
                fontSize: '0.95rem',
                border: '1.5px solid rgba(148,163,184,0.2)',
                borderRadius: '0.875rem',
                background: 'rgba(15,23,42,0.5)',
                color: '#f1f5f9',
              }}
            >
              <option value="V">V</option>
              <option value="E">E</option>
              <option value="P">P</option>
            </select>
            <input
              {...register('ciNumeros')}
              type="text"
              inputMode="numeric"
              placeholder="12345678"
              maxLength={9}
              style={{
                flex: 1,
                padding: '0.625rem 0.875rem',
                fontSize: '0.95rem',
                border: `1.5px solid ${errors.ciNumeros ? 'rgba(239,68,68,0.5)' : 'rgba(148,163,184,0.2)'}`,
                borderRadius: '0.875rem',
                background: 'rgba(15,23,42,0.5)',
                color: '#f1f5f9',
              }}
            />
          </div>
          {errors.ciNumeros && (
            <span className={styles.error}>{errors.ciNumeros.message}</span>
          )}
        </div>

        {/* Campo Contraseña */}
        <div className={styles.formGroup}>
          <label>Contraseña</label>
          <div style={{ position: 'relative' }}>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Tu contraseña"
              style={{
                width: '100%',
                padding: '0.625rem 2.5rem 0.625rem 0.875rem',
                fontSize: '0.95rem',
                border: `1.5px solid ${errors.password ? 'rgba(239,68,68,0.5)' : 'rgba(148,163,184,0.2)'}`,
                borderRadius: '0.875rem',
                background: 'rgba(15,23,42,0.5)',
                color: '#f1f5f9',
                boxSizing: 'border-box',
              }}
            />
            <PasswordToggle isVisible={showPassword} onChange={setShowPassword} />
          </div>
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Accediendo...' : 'Acceder'}
        </button>
      </form>

      {biometricAvailable && (
        <>
          <div className={styles.divider}><span>o</span></div>
          <button
            type="button"
            className={styles.biometricButton}
            onClick={handleBiometricLogin}
            disabled={biometricLoading || isSubmitting}
          >
            {biometricLoading ? (
              <span className={styles.biometricSpinner} />
            ) : (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
                <path d="M2 12a10 10 0 0 1 18-6" />
                <path d="M2 16h.01" />
                <path d="M21.8 16c.2-2 .131-5.354 0-6" />
                <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
                <path d="M8.65 22c.21-.66.45-1.32.57-2" />
                <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
              </svg>
            )}
            <span>{biometricLoading ? 'Verificando...' : 'Acceso Biométrico'}</span>
          </button>
          <p className={styles.biometricHint}>Más rápido usando tu huella, rostro o PIN del dispositivo.</p>
        </>
      )}

      <p className={styles.forgotPasswordLink}>
        <Link to="/forgot-password" className={styles.link}>
          ¿Olvidaste tu contraseña?
        </Link>
      </p>

      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#475569', marginTop: '1rem', lineHeight: 1.5 }}>
        Tu contraseña inicial es tu número de cédula.<br />
        Cámbiala en Ajustes tras tu primer acceso.
      </p>
    </div>
  )
}
