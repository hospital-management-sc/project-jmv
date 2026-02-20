/**
 * Script para probar el formateo de fechas: con y sin conversión de timezone
 * Ejecutar con: npx tsx test-date-formats.ts
 */

const VENEZUELA_TIMEZONE = 'America/Los_Angeles';
const VENEZUELA_LOCALE = 'es-VE';

// Función LOCAL - SIN conversión de timezone (para fechas separadas)
function formatDateLocal(date: Date | string): string {
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

// Función VENEZUELA - CON conversión de timezone (para timestamps)
function formatDateVenezuela(date: Date | string | number): string {
  if (!date) return '-';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '-';
    
    const defaultOptions: Intl.DateTimeFormatOptions = {
      timeZone: VENEZUELA_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    
    return dateObj.toLocaleDateString(VENEZUELA_LOCALE, defaultOptions);
  } catch {
    return '-';
  }
}

console.log('=== Prueba de Formateo de Fechas ===\n');

// Caso 1: fechaCita (Date object con fecha 2025-12-10)
const fechaCita = new Date('2025-12-10T00:00:00.000Z');
console.log('📅 Caso 1: fechaCita (columna Date separada)');
console.log('  Input DB:          2025-12-10T00:00:00.000Z');
console.log('  Date object:      ', fechaCita.toString());
console.log('  ❌ formatDateVenezuela:', formatDateVenezuela(fechaCita), '← INCORRECTA (aplica timezone)');
console.log('  ✅ formatDateLocal:    ', formatDateLocal(fechaCita), '← CORRECTA (sin timezone)\n');

// Caso 2: fechaAdmision (Date object con fecha 2025-12-05)
const fechaAdmision = new Date('2025-12-05T00:00:00.000Z');
console.log('📅 Caso 2: fechaAdmision (columna Date separada)');
console.log('  Input DB:          2025-12-05T00:00:00.000Z');
console.log('  Date object:      ', fechaAdmision.toString());
console.log('  ❌ formatDateVenezuela:', formatDateVenezuela(fechaAdmision), '← INCORRECTA (aplica timezone)');
console.log('  ✅ formatDateLocal:    ', formatDateLocal(fechaAdmision), '← CORRECTA (sin timezone)\n');

// Caso 3: createdAt (timestamp completo con hora relevante)
const createdAt = new Date('2025-12-05T14:30:00.000Z');
console.log('📅 Caso 3: createdAt (timestamp completo)');
console.log('  Input DB:          2025-12-05T14:30:00.000Z (hora UTC relevante)');
console.log('  Date object:      ', createdAt.toString());
console.log('  ✅ formatDateVenezuela:', formatDateVenezuela(createdAt), '← CORRECTA (hora 14:30 UTC = 06:30 VE)');
console.log('  ❌ formatDateLocal:    ', formatDateLocal(createdAt), '← INCORRECTA (ignora timezone)\n');

// Caso 4: String YYYY-MM-DD (backend envía así fechaCita)
const stringFecha = '2025-12-10';
console.log('📅 Caso 4: String "YYYY-MM-DD" desde backend');
console.log('  Input:             "2025-12-10"');
console.log('  ✅ formatDateLocal:    ', formatDateLocal(stringFecha), '← CORRECTA\n');

console.log('=== Reglas de Uso ===\n');
console.log('📌 formatDateLocal() - Para columnas DATE separadas:');
console.log('   • fechaCita (Cita)');
console.log('   • fechaAdmision (Admision)');
console.log('   • fechaNacimiento (Paciente)');
console.log('   ✅ NO aplica conversión de timezone\n');

console.log('📌 formatDateVenezuela() - Para timestamps completos:');
console.log('   • createdAt');
console.log('   • updatedAt');
console.log('   • Cualquier columna con hora relevante');
console.log('   ✅ SÍ aplica conversión a timezone Venezuela\n');

console.log('=== Problema Resuelto ===');
console.log('Antes: fechaCita 10/12/2025 se mostraba como 09/12/2025 (timezone shift)');
console.log('Ahora: fechaCita 10/12/2025 se muestra como 10/12/2025 ✓');
