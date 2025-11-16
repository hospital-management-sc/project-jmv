import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import FormInput from '@components/FormInput'
import { authService } from '@services/auth'
import styles from './Login.module.css'

const loginSchema = z.object({
  ci: z
    .string()
    .min(1, 'C.I. es requerido')
    .regex(/^[0-9]+$/, 'C.I. debe contener solo números'),
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

export default function Login() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authService.login(data)
      authService.setToken(response.token)
      // Redirect to dashboard or home
      navigate('/')
    } catch (error) {
      console.error('Login error:', error)
      alert('Error al iniciar sesión. Verifica tus credenciales.')
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hospital Management System</h1>
      <p className={styles.subtitle}>Inicia sesión en tu cuenta</p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormInput
          id="ci"
          label="C.I. (Cédula de Identidad)"
          placeholder="Ej: 12345678"
          error={errors.ci?.message}
          {...register('ci')}
        />

        <FormInput
          id="email"
          type="email"
          label="Email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <FormInput
          id="password"
          type="password"
          label="Contraseña"
          placeholder="Tu contraseña"
          error={errors.password?.message}
          {...register('password')}
        />

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

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
