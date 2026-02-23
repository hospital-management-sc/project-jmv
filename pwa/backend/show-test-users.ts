/**
 * Script para listar usuarios de prueba y sus contraseñas
 * desde el archivo seed.ts
 * 
 * Uso:
 *   npx tsx show-test-users.ts
 */

console.log('👥 USUARIOS DE PRUEBA DEL SISTEMA');
console.log('==================================\n');

console.log('🔐 SUPER ADMIN (creado por seed)');
console.log('   Email: superadmin@hospital.com');
console.log('   CI: V00000001');
console.log('   Contraseña: SuperAdmin2024!');
console.log('   Rol: SUPER_ADMIN\n');

console.log('📋 PERSONAL AUTORIZADO (whitelist de prueba)');
console.log('   Estos usuarios están autorizados pero NO registrados aún.');
console.log('   Deben registrarse usando el endpoint /auth/register\n');

const personalAutorizado = [
  {
    ci: 'V12345678',
    nombre: 'Dr. Carlos Eduardo García Méndez',
    email: 'carlos.garcia@hospital.com',
    rol: 'MEDICO',
    departamento: 'Medicina Interna',
  },
  {
    ci: 'V11223344',
    nombre: 'Juan Alberto Pérez Ramírez',
    email: 'juan.perez@hospital.com',
    rol: 'ADMIN',
    departamento: 'Admisiones',
  },
  {
    ci: 'V99887766',
    nombre: 'Roberto José Hernández Blanco',
    email: 'roberto.hernandez@hospital.com',
    rol: 'ADMIN',
    departamento: 'Administración',
  },
];

personalAutorizado.forEach((p, i) => {
  console.log(`${i + 1}. ${p.nombre}`);
  console.log(`   CI: ${p.ci}`);
  console.log(`   Email: ${p.email}`);
  console.log(`   Rol: ${p.rol}`);
  console.log(`   Departamento: ${p.departamento}`);
  console.log(`   Estado: Autorizado (sin registrar)\n`);
});

console.log('💡 NOTAS:');
console.log('   • El SUPER_ADMIN ya tiene usuario creado');
console.log('   • El personal autorizado debe registrarse usando su CI');
console.log('   • Las contraseñas las eligen ellos al registrarse');
console.log('   • Para verificar un hash bcrypt, usa: npx tsx check-password.ts\n');
