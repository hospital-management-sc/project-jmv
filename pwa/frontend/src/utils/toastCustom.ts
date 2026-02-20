/**
 * Custom Toast Wrapper
 * Personalización garantizada de notificaciones Sonner con estilos glassmorphism
 */

import { toast } from 'sonner';

// Colores optimizados para contraste en tema oscuro
const COLORS = {
  success: '#20e7c1', // Turquesa brillante
  error: '#ff6b6b',   // Rojo brillante
  warning: '#fcd34d', // Amarillo claro
  info: '#20e7c1',    // Turquesa brillante
  text: '#ffffff',    // Texto blanco puro
  textSecondary: '#e2e8f0', // Texto secundario claro
};

const toastStyles = {
  base: {
    background: 'rgba(15, 23, 42, 0.35)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '1rem',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    padding: '1rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: COLORS.text,
  } as React.CSSProperties,

  success: {
    border: `1px solid rgba(32, 231, 193, 0.4)`,
    boxShadow: `0 8px 32px rgba(32, 231, 193, 0.25)`,
  } as React.CSSProperties,

  error: {
    border: `1px solid rgba(255, 107, 107, 0.4)`,
    boxShadow: `0 8px 32px rgba(255, 107, 107, 0.25)`,
  } as React.CSSProperties,

  info: {
    border: `1px solid rgba(32, 231, 193, 0.35)`,
    boxShadow: `0 8px 32px rgba(32, 231, 193, 0.2)`,
  } as React.CSSProperties,

  warning: {
    border: `1px solid rgba(252, 211, 77, 0.4)`,
    boxShadow: `0 8px 32px rgba(252, 211, 77, 0.25)`,
  } as React.CSSProperties,
};

export const toastCustom = {
  /**
   * Toast de éxito con estilo turquesa
   * @param message - Mensaje a mostrar
   * @param description - Descripción opcional
   */
  success: (message: string, description?: string) => {
    return toast.success(message, {
      description,
      style: {
        ...toastStyles.base,
        ...toastStyles.success,
      },
    });
  },

  /**
   * Toast de error con estilo rojo
   * @param message - Mensaje a mostrar
   * @param description - Descripción opcional
   */
  error: (message: string, description?: string) => {
    return toast.error(message, {
      description,
      style: {
        ...toastStyles.base,
        ...toastStyles.error,
      },
    });
  },

  /**
   * Toast de información con estilo turquesa
   * @param message - Mensaje a mostrar
   * @param description - Descripción opcional
   */
  info: (message: string, description?: string) => {
    return toast.info(message, {
      description,
      style: {
        ...toastStyles.base,
        ...toastStyles.info,
      },
    });
  },

  /**
   * Toast de advertencia con estilo ámbar
   * @param message - Mensaje a mostrar
   * @param description - Descripción opcional
   */
  warning: (message: string, description?: string) => {
    return toast.warning(message, {
      description,
      style: {
        ...toastStyles.base,
        ...toastStyles.warning,
      },
    });
  },

  /**
   * Toast de carga personalizado
   * @param message - Mensaje a mostrar
   */
  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        ...toastStyles.base,
        ...toastStyles.info,
      },
    });
  },
};
