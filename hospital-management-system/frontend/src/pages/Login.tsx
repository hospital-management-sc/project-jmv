import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';

import FormInput from '@components/FormInput';
import PasswordToggle from '@components/PasswordToggle';
import { authService } from '@services/auth';
import useAuth from '@/hooks/useAuth';
import useTheme from '@hooks/useTheme';
import styles from './Login.module.css';

const loginSchema = z.object({
  email: z.string().min(1, 'Email es requerido').email('Email inválido'),
  password: z.string().min(1, 'Contraseña es requerida').min(6, 'Contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { login } = useAuth();
  const [ showPassword, setShowPassword ] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('[Login] Form submitted with email:', data.email);
      console.log('[Login] API_BASE_URL:', import.meta.env.VITE_API_URL || 'using constants');
      
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });
      
      console.log('[Login] Response received:', response)
      
      if ( response.success && response.data?.token ) {
        console.log('[Login] Token validated, saving to localStorage');
        
        // Usar el método login del contexto
        const userData = {
          id: response.data.id,
          email: response.data.email,
          role: response.data.role,
          nombre: response.data.nombre,
        }
        
        login(userData, response.data.token);
        
        console.log('[Login] User data saved via context:', userData);
        console.log('[Login] Redirecting to dashboard for role:', userData.role);
        
        // Redirigir al dashboard correspondiente según el rol
        const dashboardPath = userData.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/medico';
        navigate(dashboardPath);
      } else {
        const errorMsg = response.error || 'Respuesta inválida del servidor';
        console.error('[Login] Invalid response structure:', { response, errorMsg });
        alert('Error: ' + errorMsg);
      }
    } catch (error: any) {
      const errorType = error?.name || 'Unknown';
      const errorMessage = error?.message || 'Error desconocido';
      console.error('[Login] Exception caught:', {
        type: errorType,
        message: errorMessage,
        stack: error?.stack,
        fullError: error,
      })
      alert('Error al iniciar sesión: ' + errorMessage);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hospital Management System</h1>
      <p className={styles.subtitle}>Inicia sesión en tu cuenta</p>

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

      <div className={styles.divider}>o</div>

      <p className={styles.registerLink}>
        ¿No tienes cuenta?{' '}
        <Link to="/register" className={styles.link}>
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
