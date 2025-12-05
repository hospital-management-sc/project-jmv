/**
 * Utilidades para el manejo de fechas con zona horaria de Venezuela
 * 
 * IMPORTANTE: Todas las fechas se guardan en UTC en la base de datos (Timestamptz),
 * pero se muestran al usuario en la zona horaria de Venezuela (America/Caracas, UTC-4)
 */

// Zona horaria de Venezuela
export const VENEZUELA_TIMEZONE = 'America/Los_Angeles'; // Cambiado a zona horaria local (GMT-8)
export const VENEZUELA_LOCALE = 'es-VE';

/**
 * Formatea una fecha para mostrar solo la fecha (sin hora)
 * @param date - Fecha a formatear (Date, string ISO, o timestamp)
 * @param options - Opciones adicionales de formato
 * @returns Fecha formateada en zona horaria de Venezuela
 */
export function formatDateVenezuela(
  date: Date | string | number,
  options?: Partial<Intl.DateTimeFormatOptions>
): string {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      timeZone: VENEZUELA_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...options
    };
    
    return dateObj.toLocaleDateString(VENEZUELA_LOCALE, defaultOptions);
  } catch {
    return '-';
  }
}

/**
 * Formatea una fecha para mostrar fecha y hora
 * @param date - Fecha a formatear (Date, string ISO, o timestamp)
 * @param options - Opciones adicionales de formato
 * @returns Fecha y hora formateadas en zona horaria de Venezuela
 */
export function formatDateTimeVenezuela(
  date: Date | string | number,
  options?: Partial<Intl.DateTimeFormatOptions>
): string {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      timeZone: VENEZUELA_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      ...options
    };
    
    return dateObj.toLocaleString(VENEZUELA_LOCALE, defaultOptions);
  } catch {
    return '-';
  }
}

/**
 * Formatea solo la hora
 * @param date - Fecha a formatear
 * @returns Hora formateada en zona horaria de Venezuela
 */
export function formatTimeVenezuela(
  date: Date | string | number,
  options?: Partial<Intl.DateTimeFormatOptions>
): string {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      timeZone: VENEZUELA_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      ...options
    };
    
    return dateObj.toLocaleTimeString(VENEZUELA_LOCALE, defaultOptions);
  } catch {
    return '-';
  }
}

/**
 * Formatea una fecha de forma legible (ej: "Lunes, 15 de enero de 2024")
 * @param date - Fecha a formatear
 * @returns Fecha legible en español de Venezuela
 */
export function formatDateLongVenezuela(date: Date | string | number): string {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    
    return dateObj.toLocaleDateString(VENEZUELA_LOCALE, {
      timeZone: VENEZUELA_TIMEZONE,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return '-';
  }
}

/**
 * Formatea una fecha de forma corta legible (ej: "Lun, 15 Ene")
 * @param date - Fecha a formatear
 * @returns Fecha corta en español de Venezuela
 */
export function formatDateShortVenezuela(date: Date | string | number): string {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    
    return dateObj.toLocaleDateString(VENEZUELA_LOCALE, {
      timeZone: VENEZUELA_TIMEZONE,
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return '-';
  }
}

/**
 * Obtiene la fecha actual en Venezuela como string ISO para inputs de tipo date
 * @returns Fecha en formato YYYY-MM-DD
 */
export function getTodayVenezuelaISO(): string {
  const now = new Date();
  
  // Crear formateador para obtener las partes de la fecha en zona horaria de Venezuela
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: VENEZUELA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const parts = formatter.formatToParts(now);
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  
  return `${year}-${month}-${day}`; // Formato: YYYY-MM-DD
}

/**
 * Obtiene la hora actual en Venezuela
 * @returns Hora en formato HH:MM
 */
export function getCurrentTimeVenezuela(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: VENEZUELA_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(now);
  const hour = parts.find(p => p.type === 'hour')?.value;
  const minute = parts.find(p => p.type === 'minute')?.value;
  
  return `${hour}:${minute}`; // Formato: HH:MM
}

/**
 * Convierte una fecha local de Venezuela a UTC para enviar al servidor
 * Útil cuando el usuario ingresa una fecha/hora en un formulario
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @param timeString - Hora en formato HH:MM (opcional)
 * @returns Fecha como objeto Date en UTC
 */
export function toUTCFromVenezuela(dateString: string, timeString?: string): Date {
  // Venezuela está en UTC-4
  const VENEZUELA_OFFSET = -4;
  
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString ? timeString.split(':').map(Number) : [0, 0];
  
  // Crear fecha en UTC considerando el offset de Venezuela
  const utcHours = hours - VENEZUELA_OFFSET;
  
  return new Date(Date.UTC(year, month - 1, day, utcHours, minutes, 0, 0));
}

/**
 * Formatea la fecha relativa (ej: "hace 5 minutos", "ayer", etc.)
 * @param date - Fecha a formatear
 * @returns Texto relativo en español
 */
export function formatRelativeTimeVenezuela(date: Date | string | number): string {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSeconds < 60) return 'hace un momento';
    if (diffMinutes < 60) return `hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
    if (diffHours < 24) return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    if (diffDays === 1) return 'ayer';
    if (diffDays < 7) return `hace ${diffDays} días`;
    if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
    
    // Si es más de un mes, mostrar fecha normal
    return formatDateVenezuela(dateObj);
  } catch {
    return '-';
  }
}

/**
 * Calcula la edad a partir de una fecha de nacimiento
 * @param birthDate - Fecha de nacimiento
 * @returns Edad en años
 */
export function calculateAge(birthDate: Date | string | number): number {
  if (!birthDate) return 0;
  
  try {
    const birth = new Date(birthDate);
    if (isNaN(birth.getTime())) return 0;
    
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  } catch {
    return 0;
  }
}

/**
 * Verifica si una fecha es hoy (en zona horaria de Venezuela)
 * @param date - Fecha a verificar
 * @returns true si la fecha es hoy
 */
export function isToday(date: Date | string | number): boolean {
  if (!date) return false;
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return false;
    
    const todayVE = getTodayVenezuelaISO();
    const dateVE = new Intl.DateTimeFormat('en-CA', {
      timeZone: VENEZUELA_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(dateObj);
    
    return todayVE === dateVE;
  } catch {
    return false;
  }
}

// Exportar todo como un objeto también para importación conveniente
const dateUtils = {
  VENEZUELA_TIMEZONE,
  VENEZUELA_LOCALE,
  formatDateVenezuela,
  formatDateTimeVenezuela,
  formatTimeVenezuela,
  formatDateLongVenezuela,
  formatDateShortVenezuela,
  getTodayVenezuelaISO,
  getCurrentTimeVenezuela,
  toUTCFromVenezuela,
  formatRelativeTimeVenezuela,
  calculateAge,
  isToday
};

export default dateUtils;
