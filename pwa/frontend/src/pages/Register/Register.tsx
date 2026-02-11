import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import FormInput from '@components/FormInput'
import FormSelect from '@components/FormSelect'
import PasswordToggle from '@components/PasswordToggle'
import { authService } from '@services/auth'
import styles from './Register.module.css'

// Códigos de error del sistema de whitelist
const ERROR_MESSAGES: Record<string, { title: string; description: string; icon: string }> = {
  NOT_IN_WHITELIST: {
    title: 'Acceso No Autorizado',
    description: 'Su cédula no se encuentra en la lista de personal autorizado del hospital.',
    icon: '🚫',
  },
  ALREADY_REGISTERED: {
    title: 'Usuario Ya Registrado',
    description: 'Ya existe una cuenta registrada con esta cédula. Si olvidó su contraseña, utilice la opción de recuperación en la pantalla de inicio de sesión.',
    icon: '⚠️',
  },
  NOT_ACTIVE: {
    title: 'Autorización Inactiva',
    description: 'Su autorización de acceso no está activa actualmente.',
    icon: '⏸️',
  },
  AUTHORIZATION_EXPIRED: {
    title: 'Autorización Vencida',
    description: 'Su autorización de acceso ha expirado.',
    icon: '📅',
  },
  NAME_MISMATCH: {
    title: 'Nombre No Coincide',
    description: 'El nombre proporcionado no coincide con nuestros registros. Por favor, ingrese su nombre exactamente como aparece en su documento de identidad.',
    icon: '📝',
  },
  ROLE_NOT_AUTHORIZED: {
    title: 'Rol No Autorizado',
    description: 'No está autorizado para registrarse con el rol seleccionado. Por favor, seleccione el rol que le fue asignado por el hospital.',
    icon: '👤',
  },
  DEFAULT: {
    title: 'Error de Registro',
    description: 'Ocurrió un error al procesar su solicitud. Por favor, intente nuevamente o contacte al soporte técnico.',
    icon: '❌',
  },
}

const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(2, 'Nombre completo debe tener al menos 2 caracteres'),
    ciTipo: z
      .string()
      .min(1, 'Tipo de cédula es requerido'),
    ciNumeros: z
      .string()
      .regex(
        /^\d{7,9}$/,
        'C.I. debe tener 7-9 dígitos (Ej: 12345678)'
      ),
    email: z
      .string()
      .min(1, 'Email es requerido')
      .email('Email inválido'),
    password: z
      .string()
      .min(1, 'Contraseña es requerida')
      .min(6, 'Contraseña debe tener al menos 6 caracteres'),
    role: z
      .string()
      .min(1, 'Tipo de usuario es requerido'),
  })

type RegisterFormData = z.infer<typeof registerSchema>

interface ApiError {
  code: string
  message: string
}

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState<ApiError | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  // Detectar código de error del mensaje de la API
  const detectErrorCode = (message: string): string => {
    if (message.includes('No está autorizado para registrarse') && message.includes('Contacte al departamento')) {
      return 'NOT_IN_WHITELIST'
    }
    if (message.includes('Ya existe una cuenta') || message.includes('ya está registrad')) {
      return 'ALREADY_REGISTERED'
    }
    if (message.includes('estado') && (message.includes('INACTIVO') || message.includes('SUSPENDIDO') || message.includes('BAJA'))) {
      return 'NOT_ACTIVE'
    }
    if (message.includes('vencid') || message.includes('expirad')) {
      return 'AUTHORIZATION_EXPIRED'
    }
    if (message.includes('nombre') && message.includes('no coincide')) {
      return 'NAME_MISMATCH'
    }
    if (message.includes('rol') && (message.includes('no autorizado') || message.includes('No está autorizado'))) {
      return 'ROLE_NOT_AUTHORIZED'
    }
    return 'DEFAULT'
  }

  const onSubmit = async (data: RegisterFormData) => {
    // Limpiar errores previos
    setApiError(null)
    setShowSuccessMessage(false)
    
    try {
      console.log('[Register] Form submitted with email:', data.email)
      
      const ciCompleta = `${data.ciTipo}${data.ciNumeros}`
      const response = await authService.register({
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        ci: ciCompleta.toUpperCase(),
        role: data.role,
      })
      
      console.log('[Register] Response received:', response)
      
      if (response.success) {
        console.log('[Register] Registration successful, redirecting to login')
        setShowSuccessMessage(true)
        setTimeout(() => {
          navigate('/login')
        }, 2500)
      } else {
        const errorMsg = response.error || 'Respuesta inválida del servidor'
        const errorCode = detectErrorCode(errorMsg)
        setApiError({ code: errorCode, message: errorMsg })
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Error desconocido'
      console.error('[Register] Exception caught:', errorMessage)
      const errorCode = detectErrorCode(errorMessage)
      setApiError({ code: errorCode, message: errorMessage })
    }
  }

  const getErrorInfo = () => {
    if (!apiError) return null
    return ERROR_MESSAGES[apiError.code] || ERROR_MESSAGES.DEFAULT
  }

  const errorInfo = getErrorInfo()

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hospital JMV</h1>
      <p className={styles.subtitle}>
        Registro en el sistema
      </p>

      {/* Mensaje de advertencia sobre sistema cerrado */}
      <div className={styles.securityNotice}>
        <span className={styles.securityIcon}>🔒</span>
        <p>
          Este es un sistema cerrado. Solo el personal previamente autorizado por
          el hospital puede crear una cuenta.
        </p>
      </div>

      {/* Mensaje de éxito */}
      {showSuccessMessage && (
        <div className={styles.successAlert}>
          <div className={styles.alertIcon}>✅</div>
          <div className={styles.alertContent}>
            <h3 className={styles.alertTitle}>¡Registro Exitoso!</h3>
            <p className={styles.alertDescription}>
              Su cuenta ha sido creada correctamente. Será redirigido a la página de inicio de sesión...
            </p>
          </div>
        </div>
      )}

      {/* Mensaje de error detallado */}
      {errorInfo && (
        <div className={styles.errorAlert}>
          <div className={styles.alertIcon}>{errorInfo.icon}</div>
          <div className={styles.alertContent}>
            <h3 className={styles.alertTitle}>{errorInfo.title}</h3>
            <p className={styles.alertDescription}>{errorInfo.description}</p>
            {apiError?.message && apiError.code !== 'DEFAULT' && (
              <p className={styles.alertDetail}>
                <strong>Detalle:</strong> {apiError.message}
              </p>
            )}
          </div>
          <button
            type="button"
            className={styles.alertClose}
            onClick={() => setApiError(null)}
            aria-label="Cerrar mensaje"
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormSelect
          id="role"
          label="Tipo de Usuario"
          placeholder="Selecciona tu rol autorizado"
          error={errors.role?.message}
          options={[
            { value: 'MEDICO', label: 'Médico' },
            { value: 'ADMIN', label: 'Personal Administrativo' },
          ]}
          {...register('role')}
        />

        <FormInput
          id="nombre"
          label="Nombre Completo (como aparece en su cédula)"
          placeholder="Ej: Leslie Sofía Acevedo Martínez"
          error={errors.nombre?.message}
          {...register('nombre')}
        />

        <div className={styles.ciGroup}>
          <label htmlFor="ciTipo" className={styles.label}>C.I. (Cédula de Identidad)</label>
          <div className={styles.ciInputsWrapper}>
            <select
              id="ciTipo"
              {...register('ciTipo')}
              className={errors.ciTipo ? styles.inputError : ''}
            >
              <option value="V">V</option>
              <option value="E">E</option>
              <option value="P">P</option>
            </select>
            <input
              type="text"
              id="ciNumeros"
              placeholder="10200300"
              maxLength={9}
              {...register('ciNumeros')}
              className={`${styles.ciNumberInput} ${errors.ciNumeros ? styles.inputError : ''}`}
            />
          </div>
          {errors.ciTipo?.message && <span className={styles.error}>{errors.ciTipo.message}</span>}
          {errors.ciNumeros?.message && <span className={styles.error}>{errors.ciNumeros.message}</span>}
        </div>

        <FormInput
          id="email"
          type="email"
          label="Email"
          placeholder="tu.correo@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <div style={{ position: 'relative' }}>
          <FormInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            error={errors.password?.message}
            {...register('password')}
          />
          <PasswordToggle isVisible={showPassword} onChange={setShowPassword} />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting || showSuccessMessage}
        >
          {isSubmitting ? 'Verificando autorización...' : 'Registrarse'}
        </button>
      </form>

      <p className={styles.loginLink}>
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className={styles.link}>
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
