import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import FormInput from '@components/FormInput'
import PasswordToggle from '@components/PasswordToggle'
import { authService } from '@services/auth'
import { useAuth } from '@/contexts/AuthContext'
import styles from './Login.module.css'

// Mensajes de error mejorados para login
const ERROR_MESSAGES: Record<string, { title: string; description: string; icon: string; suggestion?: string }> = {
  INVALID_CREDENTIALS: {
    title: 'Credenciales Incorrectas',
    description: 'El correo electrónico o la contraseña que ingresaste no son correctos.',
    icon: '🔐',
    suggestion: 'Verifica que tu correo esté bien escrito y que la contraseña sea la correcta. Recuerda que las contraseñas distinguen entre mayúsculas y minúsculas.',
  },
  NETWORK_ERROR: {
    title: 'Error de Conexión',
    description: 'No se pudo conectar con el servidor.',
    icon: '🌐',
    suggestion: 'Verifica tu conexión a internet e intenta nuevamente. Si el problema persiste, el servidor podría estar en mantenimiento.',
  },
  SERVER_ERROR: {
    title: 'Error del Servidor',
    description: 'Ocurrió un error interno en el servidor.',
    icon: '⚠️',
    suggestion: 'Por favor, intenta nuevamente en unos minutos. Si el problema continúa, contacta al soporte técnico.',
  },
  VALIDATION_ERROR: {
    title: 'Datos Incompletos',
    description: 'Por favor, completa todos los campos requeridos.',
    icon: '📝',
  },
  DEFAULT: {
    title: 'Error al Iniciar Sesión',
    description: 'Ocurrió un error inesperado.',
    icon: '❌',
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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

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
      const errorType = error?.name || 'Unknown'
      const errorMessage = error?.message || 'Error desconocido'
      const errorCode = detectErrorCode(errorMessage)
      setLoginError({ code: errorCode, message: errorMessage })
    }
  }

  const errorInfo = getErrorInfo()

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hospital JMV</h1>
      <p className={styles.subtitle}>Inicia sesión en tu cuenta</p>

      {/* Mensaje de error estilizado */}
      {errorInfo && (
        <div className={styles.errorAlert}>
          <div className={styles.alertIcon}>{errorInfo.icon}</div>
          <div className={styles.alertContent}>
            <h3 className={styles.alertTitle}>{errorInfo.title}</h3>
            <p className={styles.alertDescription}>{errorInfo.description}</p>
            {errorInfo.suggestion && (
              <p className={styles.alertSuggestion}>
                <strong>💡 Sugerencia:</strong> {errorInfo.suggestion}
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

      <p className={styles.forgotPasswordLink}>
        <Link to="/forgot-password" className={styles.link}>
          ¿Olvidaste tu contraseña?
        </Link>
      </p>

      <div className={styles.divider}>o</div>

      <p className={styles.registerLink}>
        ¿No tienes cuenta?{' '}
        <Link to="/register" className={styles.link}>
          Regístrate aquí
        </Link>
      </p>
    </div>
  )
}
