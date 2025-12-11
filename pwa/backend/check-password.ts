/**
 * Script para verificar contraseñas contra hashes bcrypt
 * 
 * NOTA IMPORTANTE:
 * bcrypt es un hash UNIDIRECCIONAL - NO se puede "descifrar"
 * Este script prueba contraseñas conocidas contra el hash
 * 
 * Uso:
 *   npx tsx check-password.ts
 */

import bcrypt from 'bcryptjs';
import * as readline from 'readline';

// Contraseñas de prueba conocidas del sistema
const KNOWN_PASSWORDS = [
  'SuperAdmin2024!',
  'Admin123',
  'Medico123',
  'Password123',
  'Hospital2024',
  'Test123',
  '123456',
  'password',
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function main() {
  console.log('🔐 Verificador de Contraseñas bcrypt');
  console.log('=====================================\n');
  console.log('⚠️  NOTA: bcrypt NO se puede descifrar (hash unidireccional)');
  console.log('Este script prueba contraseñas conocidas contra el hash.\n');

  const hash = await question('Ingresa el hash bcrypt: ');
  
  if (!hash || !hash.startsWith('$2')) {
    console.log('\n❌ El texto ingresado no parece ser un hash bcrypt válido');
    console.log('   Un hash bcrypt comienza con $2a$ o $2b$\n');
    rl.close();
    return;
  }

  console.log('\n🔍 Probando contraseñas conocidas del sistema...\n');

  let found = false;
  for (const password of KNOWN_PASSWORDS) {
    try {
      const match = await bcrypt.compare(password, hash);
      if (match) {
        console.log(`✅ ¡CONTRASEÑA ENCONTRADA!`);
        console.log(`   Contraseña: ${password}\n`);
        found = true;
        break;
      } else {
        console.log(`   ❌ "${password}" - No coincide`);
      }
    } catch (error) {
      console.log(`   ⚠️  Error probando "${password}"`);
    }
  }

  if (!found) {
    console.log('\n❌ No se encontró coincidencia con contraseñas conocidas.');
    console.log('\n💡 Opciones:');
    console.log('   1. Probar manualmente otras contraseñas');
    console.log('   2. Resetear la contraseña desde la DB');
    console.log('   3. Crear un nuevo usuario de prueba\n');
    
    const tryCustom = await question('¿Quieres probar una contraseña personalizada? (s/n): ');
    
    if (tryCustom.toLowerCase() === 's') {
      const customPassword = await question('Ingresa la contraseña a probar: ');
      const match = await bcrypt.compare(customPassword, hash);
      
      if (match) {
        console.log(`\n✅ ¡CONTRASEÑA CORRECTA!`);
        console.log(`   Contraseña: ${customPassword}\n`);
      } else {
        console.log('\n❌ La contraseña no coincide.\n');
      }
    }
  }

  rl.close();
}

main().catch((error) => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
