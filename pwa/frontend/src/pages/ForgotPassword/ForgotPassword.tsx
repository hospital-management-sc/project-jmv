import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import FormInput from '@components/FormInput';
import PasswordToggle from '@components/PasswordToggle';
import { authService } from '@services/auth';
import styles from './ForgotPassword.module.css';
import { toast } from 'sonner';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email es requerido')
    .email('Email inválido'),
  ci: z
    .string()
    .min(1, 'Cédula es requerida')
    .regex(/^[VEPJvepj]-?\d{6,9}$/, 'Formato de cédula inválido (Ej: V12345678)'),
  newPassword: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z
    .string()
    .min(1, 'Debes confirmar la contraseña'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authService.forgotPassword({
        email: data.email,
        ci: data.ci,
        newPassword: data.newPassword,
      });

      setIsSuccess(true);
      toast.success('¡Contraseña actualizada exitosamente!');

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Error al restablecer la contraseña';
      
      toast.error(errorMessage);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✅</div>
            <h2>¡Contraseña Restablecida!</h2>
            <p>Tu contraseña ha sido actualizada correctamente.</p>
            <p className={styles.redirectMessage}>
              Serás redirigido al inicio de sesión en unos segundos...
            </p>
            <Link to="/login" className={styles.loginLink}>
              Ir al login ahora →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>🔐 Recuperar Contraseña</h1>
          <p className={styles.subtitle}>
            Ingresa tu correo y cédula para restablecer tu contraseña
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <FormInput
            label="Correo Electrónico"
            type="email"
            placeholder="tu.email@hospital.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <FormInput
            label="Cédula de Identidad"
            type="text"
            placeholder="V12345678"
            error={errors.ci?.message}
            hint="Formato: V12345678 o V-12345678"
            {...register('ci')}
          />

          <div className={styles.passwordGroup}>
            <FormInput
              label="Nueva Contraseña"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />
            <PasswordToggle
              isVisible={showPassword}
              onChange={setShowPassword}
            />
          </div>

          <div className={styles.passwordGroup}>
            <FormInput
              label="Confirmar Nueva Contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repite tu nueva contraseña"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <PasswordToggle
              isVisible={showConfirmPassword}
              onChange={setShowConfirmPassword}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.submitButton}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                Restableciendo...
              </>
            ) : (
              'Restablecer Contraseña'
            )}
          </button>

          <div className={styles.links}>
            <Link to="/login" className={styles.backLink}>
              ← Volver al inicio de sesión
            </Link>
          </div>

          <div className={styles.infoBox}>
            <p>
              <strong>⚠️ Nota de Seguridad:</strong>
            </p>
            <p>
              Para tu seguridad, necesitamos verificar tu identidad con tu correo
              electrónico registrado y tu cédula de identidad.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
