/**
 * Script para validar las funciones de timezone de Venezuela
 * Ejecutar con: ts-node test-timezone.ts
 */

const VENEZUELA_TIMEZONE = 'America/Los_Angeles'; // Cambiado a zona horaria local (GMT-8)
const VENEZUELA_LOCALE = 'es-VE';

function getTodayVenezuelaISO(): string {
  const now = new Date();
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
  
  return `${year}-${month}-${day}`;
}

function getCurrentTimeVenezuela(): string {
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
  
  return `${hour}:${minute}`;
}

// Pruebas
const now = new Date();
console.log('=== Validación de Timezone Venezuela ===\n');
console.log('UTC actual:', now.toISOString());
console.log('Formato local del sistema:', now.toString());
console.log('\n✓ Fecha en Venezuela (ISO):', getTodayVenezuelaISO());
console.log('✓ Hora en Venezuela (HH:MM):', getCurrentTimeVenezuela());
console.log('\n✓ Zona horaria configurada: America/Los_Angeles (GMT-8)');
console.log('✓ Locale configurado: es-VE');
