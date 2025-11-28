import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Hash password
 */
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Main seed function
 * 
 * IMPORTANTE: Este seed crea:
 * 1. Un SUPER_ADMIN inicial (único usuario que NO requiere whitelist)
 * 2. Registros de prueba en PersonalAutorizado (whitelist)
 * 
 * En producción, solo el SUPER_ADMIN se crea via seed.
 * Todo el demás personal debe ser agregado a la whitelist primero.
 */
async function main() {
  console.log('🌱 Starting database seed...');
  console.log('🔐 Sistema de Whitelist de Personal Autorizado habilitado\n');

  try {
    // ============================================
    // PASO 1: Crear SUPER_ADMIN (única excepción al whitelist)
    // ============================================
    console.log('📋 Paso 1: Creando SUPER_ADMIN inicial...');
    
    const superAdminPassword = await hashPassword('SuperAdmin2024!');
    
    // Verificar si ya existe un SUPER_ADMIN
    const existingSuperAdmin = await prisma.usuario.findFirst({
      where: { role: 'SUPER_ADMIN' },
    });

    let superAdmin;
    if (!existingSuperAdmin) {
      superAdmin = await prisma.usuario.create({
        data: {
          nombre: 'Super Administrador del Sistema',
          email: 'superadmin@hospital.com',
          password: superAdminPassword,
          ci: 'V00000001',
          cargo: 'Administrador General del Sistema',
          role: 'SUPER_ADMIN',
        },
      });
      console.log('✅ SUPER_ADMIN creado:', superAdmin.email);
      
      // Crear registro en PersonalAutorizado para el SUPER_ADMIN (ya registrado)
      await prisma.personalAutorizado.create({
        data: {
          ci: 'V00000001',
          nombreCompleto: 'Super Administrador del Sistema',
          email: 'superadmin@hospital.com',
          rolAutorizado: 'SUPER_ADMIN',
          departamento: 'Sistemas',
          cargo: 'Administrador General del Sistema',
          estado: 'ACTIVO',
          fechaIngreso: new Date(),
          autorizadoPor: 'Sistema (Seed Inicial)',
          registrado: true,
          fechaRegistro: new Date(),
          usuarioId: superAdmin.id,
        },
      });
    } else {
      console.log('ℹ️  SUPER_ADMIN ya existe:', existingSuperAdmin.email);
      superAdmin = existingSuperAdmin;
    }

    // ============================================
    // PASO 2: Crear Personal Autorizado de prueba (Whitelist)
    // ============================================
    console.log('\n📋 Paso 2: Creando Personal Autorizado de prueba (whitelist)...');
    
    // Personal autorizado de prueba que AÚN NO se ha registrado
    const personalAutorizadoPrueba = [
      {
        ci: 'V12345678',
        nombreCompleto: 'Dr. Carlos Eduardo García Méndez',
        email: 'carlos.garcia@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Medicina Interna',
        cargo: 'Médico Internista',
        fechaIngreso: new Date('2020-01-15'),
        autorizadoPor: 'RRHH - María González',
      },
      {
        ci: 'V87654321',
        nombreCompleto: 'Lic. María Elena López Rodríguez',
        email: 'maria.lopez@hospital.com',
        rolAutorizado: 'ENFERMERO',
        departamento: 'Emergencia',
        cargo: 'Enfermera Jefe',
        fechaIngreso: new Date('2019-06-01'),
        autorizadoPor: 'RRHH - María González',
      },
      {
        ci: 'V11223344',
        nombreCompleto: 'Juan Alberto Pérez Ramírez',
        email: 'juan.perez@hospital.com',
        rolAutorizado: 'ADMIN',
        departamento: 'Admisiones',
        cargo: 'Coordinador de Admisiones',
        fechaIngreso: new Date('2021-03-10'),
        autorizadoPor: 'RRHH - María González',
      },
      {
        ci: 'V55667788',
        nombreCompleto: 'Dra. Ana Sofía Martínez Duarte',
        email: 'ana.martinez@hospital.com',
        rolAutorizado: 'COORDINADOR',
        departamento: 'Cirugía General',
        cargo: 'Coordinadora del Servicio',
        fechaIngreso: new Date('2018-09-20'),
        autorizadoPor: 'RRHH - María González',
      },
      {
        ci: 'V99887766',
        nombreCompleto: 'Roberto José Hernández Blanco',
        email: 'roberto.hernandez@hospital.com',
        rolAutorizado: 'ADMIN',
        departamento: 'Administración',
        cargo: 'Asistente Administrativo',
        fechaIngreso: new Date('2022-07-01'),
        autorizadoPor: 'RRHH - María González',
      },
    ];

    for (const personal of personalAutorizadoPrueba) {
      // Verificar si ya existe antes de crear (idempotente)
      const existing = await prisma.personalAutorizado.findUnique({
        where: { ci: personal.ci },
      });
      
      if (!existing) {
        await prisma.personalAutorizado.create({
          data: {
            ...personal,
            estado: 'ACTIVO',
            registrado: false, // AÚN NO se han registrado en la app
          },
        });
        console.log(`   ✅ Autorizado: ${personal.nombreCompleto} (${personal.ci}) - ${personal.rolAutorizado}`);
      } else {
        console.log(`   ℹ️  Ya existe: ${personal.nombreCompleto} (${personal.ci})`);
      }
    }

    // ============================================
    // PASO 3: Mostrar resumen
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('🎯 RESUMEN DEL SEED');
    console.log('='.repeat(60));
    
    console.log('\n🔑 CREDENCIALES SUPER_ADMIN:');
    console.log('   Email:    superadmin@hospital.com');
    console.log('   Password: SuperAdmin2024!');
    console.log('   Rol:      SUPER_ADMIN');
    
    console.log('\n📋 PERSONAL AUTORIZADO PARA REGISTRO (whitelist):');
    console.log('   Estos usuarios pueden registrarse en la app:');
    console.log('   ─────────────────────────────────────────────');
    for (const personal of personalAutorizadoPrueba) {
      console.log(`   • ${personal.ci} - ${personal.nombreCompleto}`);
      console.log(`     Rol: ${personal.rolAutorizado} | Email sugerido: ${personal.email}`);
    }

    console.log('\n⚠️  IMPORTANTE:');
    console.log('   - Cualquier usuario que intente registrarse sin estar');
    console.log('     en la whitelist será RECHAZADO automáticamente.');
    console.log('   - El SUPER_ADMIN debe agregar personal a la whitelist');
    console.log('     vía POST /api/authorized-personnel antes de que');
    console.log('     puedan registrarse.');
    console.log('   - El nombre y CI deben coincidir EXACTAMENTE con la whitelist.');

    console.log('\n✅ Seed completado exitosamente');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error en seed:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
