import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import FormInput from '@components/FormInput'
import FormSelect from '@components/FormSelect'
import { authService } from '@services/auth'
import { UserType } from '../types/auth'
import styles from './Register.module.css'

const registerSchema = z
  .object({
    ci: z
      .string()
      .min(1, 'C.I. es requerido')
      .regex(/^[0-9]+$/, 'C.I. debe contener solo números'),
    firstName: z
      .string()
      .min(2, 'Nombre debe tener al menos 2 caracteres'),
    lastName: z
      .string()
      .min(2, 'Apellido debe tener al menos 2 caracteres'),
    email: z
      .string()
      .min(1, 'Email es requerido')
      .email('Email inválido'),
    type: z.string().min(1, 'Selecciona un tipo de usuario'),
    password: z
      .string()
      .min(1, 'Contraseña es requerida')
      .min(8, 'Contraseña debe tener al menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Contraseña debe contener mayúsculas, minúsculas y números'
      ),
    confirmPassword: z
      .string()
      .min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await authService.register(data as any)
      authService.setToken(response.token)
      navigate('/')
    } catch (error) {
      console.error('Register error:', error)
      alert('Error al registrarse. Intenta nuevamente.')
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Registrarse</h1>
      <p className={styles.subtitle}>Crea tu cuenta en el sistema</p>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <FormInput
          id="ci"
          label="C.I. (Cédula de Identidad)"
          placeholder="Ej: 12345678"
          error={errors.ci?.message}
          {...register('ci')}
        />

        <div className={styles.twoColumn}>
          <FormInput
            id="firstName"
            label="Nombres"
            placeholder="Tu nombre"
            error={errors.firstName?.message}
            {...register('firstName')}
          />

          <FormInput
            id="lastName"
            label="Apellidos"
            placeholder="Tu apellido"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <FormInput
          id="email"
          type="email"
          label="Email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <FormSelect
          id="type"
          label="Tipo de Usuario"
          error={errors.type?.message}
          placeholder="Selecciona tu tipo de usuario"
          options={[
            { value: UserType.MEDICAL, label: 'Personal Médico / Coordinador' },
            {
              value: UserType.ADMINISTRATIVE,
              label: 'Personal Administrativo',
            },
          ]}
          {...register('type')}
        />

        <div className={styles.twoColumn}>
          <FormInput
            id="password"
            type="password"
            label="Contraseña"
            placeholder="Mín. 8 caracteres"
            hint="Debe contener mayúsculas, minúsculas y números"
            error={errors.password?.message}
            {...register('password')}
          />

          <FormInput
            id="confirmPassword"
            type="password"
            label="Confirmar Contraseña"
            placeholder="Repite tu contraseña"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrando...' : 'Registrarse'}
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
