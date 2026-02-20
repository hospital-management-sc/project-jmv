/**
 * Script para validar la conversión de fecha/hora local a UTC
 * Ejecutar con: npx tsx test-timezone-conversion.ts
 */

const VENEZUELA_TIMEZONE = 'America/Los_Angeles'; // GMT-8
const VENEZUELA_LOCALE = 'es-VE';

function toISOStringFromVenezuela(dateString: string, timeString?: string): string {
  if (!dateString) return '';
  
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const [hours, minutes] = timeString ? timeString.split(':').map(Number) : [0, 0];
    
    // America/Los_Angeles es GMT-8, entonces cuando es 07:00 allí, en UTC son las 15:00
    const offsetHours = 8; // GMT-8 significa +8 horas para convertir a UTC
    
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

function formatDateVenezuela(date: Date | string): string {
  if (!date) return '-';
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString(VENEZUELA_LOCALE, {
    timeZone: VENEZUELA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function formatTimeMilitaryVenezuela(date: Date | string): string {
  if (!date) return '-';
  const dateObj = new Date(date);
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
}

// Pruebas
console.log('=== Prueba de Conversión de Zona Horaria ===\n');

// Caso 1: Cita para el 10/12/2025 a las 07:00 (hora Venezuela)
const fechaLocal1 = '2025-12-10';
const horaLocal1 = '07:00';

console.log('📅 Caso 1: Usuario programa cita');
console.log('  Fecha ingresada (local):', fechaLocal1);
console.log('  Hora ingresada (local):', horaLocal1);

const fechaHoraUTC1 = toISOStringFromVenezuela(fechaLocal1, horaLocal1);
console.log('  Convertido a UTC:', fechaHoraUTC1);

// Extraer fecha y hora UTC
const fechaUTC1 = fechaHoraUTC1.split('T')[0];
const horaUTC1 = fechaHoraUTC1.split('T')[1].substring(0, 5);
console.log('  Fecha UTC para DB:', fechaUTC1);
console.log('  Hora UTC para DB:', horaUTC1);

// Simular lectura desde DB (ya está en UTC)
console.log('\n  🔄 Leyendo desde DB y mostrando en UI:');
const fechaMostrada1 = formatDateVenezuela(fechaHoraUTC1);
const horaMostrada1 = formatTimeMilitaryVenezuela(fechaHoraUTC1);
console.log('  Fecha mostrada:', fechaMostrada1);
console.log('  Hora mostrada:', horaMostrada1);

console.log('\n  ✅ Resultado esperado: 10/12/2025 a las 07:00');
console.log(`  ✅ Resultado obtenido: ${fechaMostrada1} a las ${horaMostrada1}`);

// Caso 2: Cita para hoy a las 14:30
const fechaLocal2 = '2025-12-05';
const horaLocal2 = '14:30';

console.log('\n\n📅 Caso 2: Cita para las 14:30');
console.log('  Fecha ingresada (local):', fechaLocal2);
console.log('  Hora ingresada (local):', horaLocal2);

const fechaHoraUTC2 = toISOStringFromVenezuela(fechaLocal2, horaLocal2);
console.log('  Convertido a UTC:', fechaHoraUTC2);

const fechaMostrada2 = formatDateVenezuela(fechaHoraUTC2);
const horaMostrada2 = formatTimeMilitaryVenezuela(fechaHoraUTC2);
console.log('  Fecha mostrada:', fechaMostrada2);
console.log('  Hora mostrada:', horaMostrada2);

console.log('\n  ✅ Resultado esperado: 05/12/2025 a las 14:30');
console.log(`  ✅ Resultado obtenido: ${fechaMostrada2} a las ${horaMostrada2}`);

console.log('\n\n=== Fin de las pruebas ===');
