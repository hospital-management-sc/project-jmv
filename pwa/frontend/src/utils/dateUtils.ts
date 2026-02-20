/**
 * Utilidades para el manejo de fechas con zona horaria de Venezuela
 * 
 * IMPORTANTE: Todas las fechas se guardan en UTC en la base de datos (Timestamptz),
 * pero se muestran al usuario en la zona horaria de Venezuela (America/Caracas, UTC-4)
 */

// Zona horaria de Venezuela
export const VENEZUELA_TIMEZONE = 'America/Caracas'; // UTC-4
export const VENEZUELA_LOCALE = 'es-VE';

/**
 * Formatea una fecha LOCAL sin conversión de timezone
 * USAR PARA: fechas en columnas separadas (fechaCita, fechaAdmision, fechaNacimiento)
 * NO usar con timestamps completos (createdAt, horaAdmision)
 * @param date - Fecha a formatear (Date, string YYYY-MM-DD)
 * @returns Fecha formateada como DD/MM/YYYY
 */
export function formatDateLocal(
  date: Date | string
): string {
  if (!date) return '-';
  
  try {
    let dateStr: string;
    
    if (date instanceof Date) {
      // Si es Date object, extraer la parte ISO (YYYY-MM-DD) y usar UTC para evitar timezone shift
      const isoString = date.toISOString();
      dateStr = isoString.split('T')[0];
    } else if (typeof date === 'string') {
      // Si es string, asumimos formato YYYY-MM-DD o ISO
      dateStr = date.includes('T') ? date.split('T')[0] : date;
    } else {
      return '-';
    }
    
    // Parsear y formatear como DD/MM/YYYY
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  } catch {
    return '-';
  }
}

/**
 * Formatea una fecha para mostrar solo la fecha (sin hora)
 * USAR PARA: timestamps completos que necesitan conversión de timezone (createdAt)
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
 * @param options - Opciones adicionales de formato
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
 * Formatea hora en formato militar (24 horas) sin AM/PM
 * @param date - Fecha a formatear o string de hora (HH:MM o HH:MM:SS)
 * @returns Hora en formato HH:MM (24 horas)
 */
export function formatTimeMilitaryVenezuela(
  date: Date | string | number
): string {
  if (!date) return '-';
  
  try {
    // Si es un string de hora simple (HH:MM o HH:MM:SS), devolverlo directamente
    if (typeof date === 'string') {
      // Verificar si es formato HH:MM o HH:MM:SS
      const timeRegex = /^(\d{2}):(\d{2})(:\d{2})?$/;
      const match = date.match(timeRegex);
      if (match) {
        return `${match[1]}:${match[2]}`; // Devolver solo HH:MM
      }
    }
    
    // Si es Date o ISO string, procesarlo normalmente
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: VENEZUELA_TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const parts = formatter.formatToParts(dateObj);
    const hour = parts.find(p => p.type === 'hour')?.value;
    const minute = parts.find(p => p.type === 'minute')?.value;
    
    return `${hour}:${minute}`;
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
 * Formatea una fecha LOCAL de forma larga legible SIN conversión de zona horaria
 * USAR PARA: fechas en columnas separadas (fechaCita, fechaAdmision, fechaNacimiento)
 * (ej: "lunes, 16 de febrero de 2026")
 * @param date - Fecha a formatear (Date, string ISO YYYY-MM-DD o ISO completo)
 * @returns Fecha legible en español de Venezuela SIN aplicar timezone
 */
export function formatDateLongLocal(date: Date | string | number): string {
  if (!date) return '-';
  
  try {
    let dateStr: string;
    
    if (date instanceof Date) {
      // Si es Date object, extraer la parte ISO en UTC
      const isoString = date.toISOString();
      dateStr = isoString.split('T')[0]; // Obtener YYYY-MM-DD
    } else if (typeof date === 'string') {
      // Si es string, extraer la parte de fecha
      dateStr = date.includes('T') ? date.split('T')[0] : date;
    } else {
      return '-';
    }
    
    // Parsear YYYY-MM-DD
    const [year, month, day] = dateStr.split('-').map(Number);
    
    // MÉTODO CORRECTO: Crear la Date como si fuera la fecha local (Venezuela)
    // Sumarle 4 horas para convertir de UTC (lo que el backend envía) a Venezuela (UTC-4)
    // Ejemplo: 2026-02-16T00:00:00.000Z en UTC = 2026-02-15T20:00:00 en Venezuela
    // Sumamos 4 horas: 2026-02-16T04:00:00.000Z para que en UTC-4 sea 2026-02-16T00:00:00
    const dateObj = new Date(Date.UTC(year, month - 1, day, 4, 0, 0));
    
    // Formatear CON timeZone de Venezuela
    // Ahora como tenemos 04:00 UTC, en UTC-4 será las 00:00 del mismo día
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
 * Convierte una fecha/hora local de Venezuela a string ISO UTC para enviar al backend
 * IMPORTANTE: Usar esta función al crear/actualizar registros con fecha/hora del formulario
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @param timeString - Hora en formato HH:MM (opcional)
 * @returns String ISO en UTC listo para enviar al backend
 */
export function toISOStringFromVenezuela(dateString: string, timeString?: string): string {
  if (!dateString) return '';
  
  try {
    // Parsear fecha y hora
    const [year, month, day] = dateString.split('-').map(Number);
    const [hours, minutes] = timeString ? timeString.split(':').map(Number) : [0, 0];
    
    // MÉTODO SIMPLIFICADO:
    // Crear el string en formato ISO compatible con la zona horaria
    // America/Caracas es UTC-4, entonces cuando es 10:00 allí, en UTC son las 14:00
    const offsetHours = 4; // UTC-4 significa +4 horas para convertir a UTC
    
    // Calcular la hora UTC
    let utcHours = hours + offsetHours;
    let utcDay = day;
    let utcMonth = month;
    let utcYear = year;
    
    // Manejar overflow de horas (si pasa de 23)
    if (utcHours >= 24) {
      utcHours -= 24;
      utcDay += 1;
      
      // Manejar overflow de días
      const daysInMonth = new Date(utcYear, utcMonth, 0).getDate();
      if (utcDay > daysInMonth) {
        utcDay = 1;
        utcMonth += 1;
        
        // Manejar overflow de meses
        if (utcMonth > 12) {
          utcMonth = 1;
          utcYear += 1;
        }
      }
    }
    
    // Crear la fecha UTC directamente
    const utcDate = new Date(Date.UTC(utcYear, utcMonth - 1, utcDay, utcHours, minutes, 0, 0));
    
    return utcDate.toISOString();
  } catch (error) {
    console.error('Error al convertir fecha/hora a UTC:', error);
    return '';
  }
}

/**
 * Convierte una fecha local de Venezuela a UTC para enviar al servidor
 * Útil cuando el usuario ingresa una fecha/hora en un formulario
 * @param dateString - Fecha en formato YYYY-MM-DD
 * @param timeString - Hora en formato HH:MM (opcional)
 * @returns Fecha como objeto Date en UTC
 * @deprecated Usar toISOStringFromVenezuela en su lugar
 */
export function toUTCFromVenezuela(dateString: string, timeString?: string): Date {
  const isoString = toISOStringFromVenezuela(dateString, timeString);
  return new Date(isoString);
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
  formatDateLocal,
  formatDateVenezuela,
  formatDateTimeVenezuela,
  formatTimeVenezuela,
  formatTimeMilitaryVenezuela,
  formatDateLongVenezuela,
  formatDateLongLocal,
  formatDateShortVenezuela,
  getTodayVenezuelaISO,
  getCurrentTimeVenezuela,
  toISOStringFromVenezuela,
  toUTCFromVenezuela,
  formatRelativeTimeVenezuela,
  calculateAge,
  isToday
};

export default dateUtils;
