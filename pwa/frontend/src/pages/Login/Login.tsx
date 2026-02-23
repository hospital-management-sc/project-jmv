import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import FormInput from '@components/FormInput'
import PasswordToggle from '@components/PasswordToggle'
import { authService } from '@services/auth'
import { useAuth } from '@/contexts/AuthContext'
import {
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
  startWebAuthnAuthentication,
  getWebAuthnErrorMessage,
} from '@/utils/webauthn'
import styles from './Login.module.css'

// Mensajes de error mejorados para login
const ERROR_MESSAGES: Record<string, { title: string; description: string; suggestion?: string }> = {
  INVALID_CREDENTIALS: {
    title: 'Credenciales Incorrectas',
    description: 'El correo electrónico o la contraseña que ingresaste no son correctos.',
    suggestion: 'Verifica que tu correo esté bien escrito y que la contraseña sea la correcta. Recuerda que las contraseñas distinguen entre mayúsculas y minúsculas.',
  },
  NETWORK_ERROR: {
    title: 'Error de Conexión',
    description: 'No se pudo conectar con el servidor.',
    suggestion: 'Verifica tu conexión a internet e intenta nuevamente. Si el problema persiste, el servidor podría estar en mantenimiento.',
  },
  SERVER_ERROR: {
    title: 'Error del Servidor',
    description: 'Ocurrió un error interno en el servidor.',
    suggestion: 'Por favor, intenta nuevamente en unos minutos. Si el problema continúa, contacta al soporte técnico.',
  },
  VALIDATION_ERROR: {
    title: 'Datos Incompletos',
    description: 'Por favor, completa todos los campos requeridos.',
  },
  DEFAULT: {
    title: 'Error al Iniciar Sesión',
    description: 'Ocurrió un error inesperado.',
    suggestion: 'Por favor, intenta nuevamente. Si el problema persiste, contacta al soporte técnico.',
  },
}

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'Contraseña es requerida')
    .min(6, 'Contraseña debe tener al menos 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginError {
  code: string
  message: string
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState<LoginError | null>(null)
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const [biometricLoading, setBiometricLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // Check biometric availability once on mount
  useEffect(() => {
    const check = async () => {
      if (isWebAuthnSupported()) {
        const available = await isPlatformAuthenticatorAvailable()
        setBiometricAvailable(available)
      }
    }
    check()
  }, [])

  // Detectar tipo de error del mensaje de la API
  const detectErrorCode = (message: string): string => {
    const lowerMessage = message.toLowerCase()
    
    // Errores de credenciales
    if (
      lowerMessage.includes('credenciales') ||
      lowerMessage.includes('invalid') ||
      lowerMessage.includes('password') ||
      lowerMessage.includes('contraseña') ||
      lowerMessage.includes('correo') ||
      lowerMessage.includes('email')
    ) {
      return 'INVALID_CREDENTIALS'
    }
    
    // Errores de red
    if (
      lowerMessage.includes('network') ||
      lowerMessage.includes('fetch') ||
      lowerMessage.includes('conexión') ||
      lowerMessage.includes('connect') ||
      lowerMessage.includes('timeout')
    ) {
      return 'NETWORK_ERROR'
    }
    
    // Errores del servidor
    if (
      lowerMessage.includes('500') ||
      lowerMessage.includes('server') ||
      lowerMessage.includes('interno')
    ) {
      return 'SERVER_ERROR'
    }
    
    // Errores de validación
    if (
      lowerMessage.includes('requerido') ||
      lowerMessage.includes('required') ||
      lowerMessage.includes('validación')
    ) {
      return 'VALIDATION_ERROR'
    }
    
    return 'DEFAULT'
  }

  const getErrorInfo = () => {
    if (!loginError) return null
    return ERROR_MESSAGES[loginError.code] || ERROR_MESSAGES.DEFAULT
  }

  const handleBiometricLogin = async () => {
    setLoginError(null)
    setBiometricLoading(true)
    try {
      // 1. Get challenge from server
      const initiateRes = await fetch('/api/biometric/authenticate/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!initiateRes.ok) {
        throw new Error('No se pudo iniciar la autenticación biométrica')
      }
      const initiateData = await initiateRes.json()
      const authOptions = initiateData.data

      // 2. Browser prompts for biometrics
      let assertionResponse
      try {
        assertionResponse = await startWebAuthnAuthentication(authOptions)
      } catch (webAuthnErr) {
        throw new Error(getWebAuthnErrorMessage(webAuthnErr))
      }

      // 3. Verify with server
      const verifyRes = await fetch('/api/biometric/authenticate/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          credentialId: assertionResponse.id,
          assertionResponse,
        }),
      })
      const verifyData = await verifyRes.json()
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.message || 'Verificación biométrica fallida')
      }

      // 4. Log in via AuthContext
      const { id, nombre, email, role, especialidad, token } = verifyData.data
      login({ id, nombre, email, role, especialidad }, token)
      navigate(role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/medico')
    } catch (err: any) {
      const msg = err?.message || 'Error desconocido en autenticación biométrica'
      setLoginError({ code: 'DEFAULT', message: msg })
    } finally {
      setBiometricLoading(false)
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    // Limpiar errores previos
    setLoginError(null)
    
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
      })
      
      if (response.success && response.data?.token) {
        // Usar el método login del contexto
        const userData = {
          id: response.data.id,
          email: response.data.email,
          role: response.data.role,
          nombre: response.data.nombre,
          especialidad: response.data.especialidad,
        }
        
        login(userData, response.data.token)
        
        // Redirigir al dashboard correspondiente según el rol
        const dashboardPath = userData.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/medico'
        navigate(dashboardPath)
      } else {
        const errorMsg = response.error || 'Respuesta inválida del servidor'
        const errorCode = detectErrorCode(errorMsg)
        setLoginError({ code: errorCode, message: errorMsg })
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Error desconocido'
      const errorCode = detectErrorCode(errorMessage)
      setLoginError({ code: errorCode, message: errorMessage })
    }
  }

  const errorInfo = getErrorInfo()

  return (
    <div className={styles.container}>
      <h1 className={styles.up_title}>Hospital Militar</h1>
      <h1 className={styles.title}>"Dr. José María Vargas"</h1>
      <p className={styles.subtitle}>Inicia sesión en tu cuenta</p>

      {/* Mensaje de error estilizado */}
      {errorInfo && (
        <div className={styles.errorAlert}>
          <div className={styles.alertContent}>
            <h3 className={styles.alertTitle}>{errorInfo.title}</h3>
            <p className={styles.alertDescription}>{errorInfo.description}</p>
            {errorInfo.suggestion && (
              <p className={styles.alertSuggestion}>
                <strong>Sugerencia:</strong> {errorInfo.suggestion}
              </p>
            )}
          </div>
          <button
            type="button"
            className={styles.alertClose}
            onClick={() => setLoginError(null)}
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormInput
          id="email"
          type="email"
          label="Email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div style={{ position: 'relative' }}>
          <FormInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="Contraseña"
            placeholder="Tu contraseña"
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordToggle isVisible={showPassword} onChange={setShowPassword} />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      {biometricAvailable && (
        <>
          <div className={styles.divider}>
            <span>o</span>
          </div>
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
          <p className={styles.biometricHint}>Más rápido y seguro usando tu huella, rostro o PIN del dispositivo.</p>
        </>
      )}

      <p className={styles.forgotPasswordLink}>
        <Link to="/forgot-password" className={styles.link}>
          ¿Olvidaste tu contraseña?
        </Link>
      </p>

      <div className={styles.divider}>———————</div>

      <p className={styles.registerLink}>
        ¿No tienes cuenta?{' '}
        <Link to="/register" className={styles.link}>
          Regístrate aquí
        </Link>
      </p>
    </div>
  )
}
