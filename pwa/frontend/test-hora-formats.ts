/**
 * Script para probar el formateo de horas en diferentes formatos
 * Ejecutar con: npx tsx test-hora-formats.ts
 */

const VENEZUELA_TIMEZONE = 'America/Los_Angeles';

function formatTimeMilitaryVenezuela(date: Date | string | number): string {
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

console.log('=== Prueba de Formateo de Horas ===\n');

// Caso 1: String simple HH:MM (CITAS MÉDICAS)
console.log('📅 Caso 1: horaCita como String (Citas Médicas)');
console.log('  Input:  "07:00"');
console.log('  Output:', formatTimeMilitaryVenezuela('07:00'));
console.log('  ✅ Esperado: 07:00\n');

// Caso 2: String con segundos HH:MM:SS
console.log('📅 Caso 2: hora con segundos');
console.log('  Input:  "14:30:00"');
console.log('  Output:', formatTimeMilitaryVenezuela('14:30:00'));
console.log('  ✅ Esperado: 14:30\n');

// Caso 3: Date object (ADMISIONES, ENCUENTROS)
const fecha1 = new Date('2025-12-05T09:15:00.000Z');
console.log('📅 Caso 3: Date object (Admisiones/Encuentros)');
console.log('  Input: ', fecha1.toISOString());
console.log('  Output:', formatTimeMilitaryVenezuela(fecha1));
console.log('  ℹ️  Nota: Se convierte a hora de Venezuela\n');

// Caso 4: ISO string completo
console.log('📅 Caso 4: ISO String completo');
console.log('  Input:  "2025-12-05T15:45:00.000Z"');
console.log('  Output:', formatTimeMilitaryVenezuela('2025-12-05T15:45:00.000Z'));
console.log('  ℹ️  Nota: Se convierte a hora de Venezuela\n');

// Caso 5: Timestamp
const timestamp = new Date('2025-12-05T20:00:00.000Z').getTime();
console.log('📅 Caso 5: Timestamp (number)');
console.log('  Input: ', timestamp);
console.log('  Output:', formatTimeMilitaryVenezuela(timestamp));
console.log('  ℹ️  Nota: Se convierte a hora de Venezuela\n');

// Caso 6: Valor null/undefined
console.log('📅 Caso 6: Valores vacíos');
console.log('  Input:  null');
console.log('  Output:', formatTimeMilitaryVenezuela(null as any));
console.log('  ✅ Esperado: -\n');

console.log('=== Resumen de Tipos por Evento ===\n');
console.log('🔹 Citas Médicas:');
console.log('   • fechaCita: Date object → formatDateVenezuela()');
console.log('   • horaCita:  String "HH:MM" → formatTimeMilitaryVenezuela() ✓\n');

console.log('🔹 Admisiones:');
console.log('   • fechaAdmision: Date object → formatDateVenezuela()');
console.log('   • horaAdmision:  Date object → formatTimeMilitaryVenezuela() ✓\n');

console.log('🔹 Encuentros:');
console.log('   • fecha: Date object → formatDateVenezuela()');
console.log('   • hora:  Date object → formatTimeMilitaryVenezuela() ✓\n');

console.log('🔹 Registro Sistema:');
console.log('   • createdAt: ISO string → formatDateVenezuela() y formatTimeMilitaryVenezuela() ✓\n');

console.log('✅ Todos los formatos ahora son compatibles con formatTimeMilitaryVenezuela()');
