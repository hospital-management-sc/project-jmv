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
    // Doctores para TODAS las 15 especialidades del sistema
    const personalAutorizadoPrueba = [
      // 1. Medicina Interna
      {
        ci: 'V12345678',
        nombreCompleto: 'Dr. Carlos Eduardo García Méndez',
        email: 'carlos.garcia@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Medicina Interna',
        especialidad: 'Medicina Interna',
        cargo: 'Médico Internista',
        fechaIngreso: new Date('2020-01-15'),
        autorizadoPor: 'RRHH - María González',
      },
      // 2. Medicina Paliativa
      {
        ci: 'V13579246',
        nombreCompleto: 'Dra. Francisca del Carmen Henríquez Soto',
        email: 'francisca.henriquez@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Medicina Paliativa',
        especialidad: 'Medicina Paliativa',
        cargo: 'Médica Paliativa',
        fechaIngreso: new Date('2019-03-20'),
        autorizadoPor: 'RRHH - María González',
      },
      // 3. Cirugía General
      {
        ci: 'V11223344',
        nombreCompleto: 'Dr. Juan Alberto Pérez Ramírez',
        email: 'juan.perez@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Cirugía General',
        especialidad: 'Cirugía General',
        cargo: 'Médico Cirujano',
        fechaIngreso: new Date('2021-03-10'),
        autorizadoPor: 'RRHH - María González',
      },
      // 4. Pediatría
      {
        ci: 'V87654321',
        nombreCompleto: 'Dra. Ana Sofía Martínez García',
        email: 'ana.martinez@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Pediatría',
        especialidad: 'Pediatría',
        cargo: 'Médica Pediatra',
        fechaIngreso: new Date('2019-06-01'),
        autorizadoPor: 'RRHH - María González',
      },
      // 5. Neumología Pediátrica
      {
        ci: 'V24681357',
        nombreCompleto: 'Dr. Andrés Felipe Rodríguez Cortés',
        email: 'andres.rodriguez@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Pediatría',
        especialidad: 'Neumología Pediátrica',
        cargo: 'Neumologo Pediátrico',
        fechaIngreso: new Date('2020-07-15'),
        autorizadoPor: 'RRHH - María González',
      },
      // 6. Traumatología
      {
        ci: 'V44332211',
        nombreCompleto: 'Dr. Luis Fernando Castro Mendoza',
        email: 'luis.castro@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Traumatología',
        especialidad: 'Traumatología',
        cargo: 'Médico Traumatólogo',
        fechaIngreso: new Date('2017-05-15'),
        autorizadoPor: 'RRHH - María González',
      },
      // 7. Cirugía de Manos
      {
        ci: 'V35791113',
        nombreCompleto: 'Dr. Gonzalo Javier Valenzuela Rivas',
        email: 'gonzalo.valenzuela@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Cirugía General',
        especialidad: 'Cirugía de Manos',
        cargo: 'Cirujano de Manos',
        fechaIngreso: new Date('2018-09-10'),
        autorizadoPor: 'RRHH - María González',
      },
      // 8. Odontología
      {
        ci: 'V46802468',
        nombreCompleto: 'Dra. Viviana Catalina Morales Bravo',
        email: 'viviana.morales@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Odontología',
        especialidad: 'Odontología',
        cargo: 'Cirujana Dentista',
        fechaIngreso: new Date('2021-01-20'),
        autorizadoPor: 'RRHH - María González',
      },
      // 9. Otorrinolaringología
      {
        ci: 'V66778899',
        nombreCompleto: 'Dr. Pedro Andrés Flores Reyes',
        email: 'pedro.flores@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Otorrinolaringología',
        especialidad: 'Otorrinolaringología',
        cargo: 'Médico ORL',
        fechaIngreso: new Date('2019-08-10'),
        autorizadoPor: 'RRHH - María González',
      },
      // 10. Dermatología
      {
        ci: 'V22334455',
        nombreCompleto: 'Dra. Vanessa Irina Moreno Díaz',
        email: 'vanessa.moreno@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Dermatología',
        especialidad: 'Dermatología',
        cargo: 'Médica Dermatóloga',
        fechaIngreso: new Date('2020-11-20'),
        autorizadoPor: 'RRHH - María González',
      },
      // 11. Fisiatría
      {
        ci: 'V57912346',
        nombreCompleto: 'Dr. Cristóbal Miguel Sánchez López',
        email: 'cristobal.sanchez@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Fisiatría',
        especialidad: 'Fisiatría',
        cargo: 'Médico Fisiatra',
        fechaIngreso: new Date('2019-02-10'),
        autorizadoPor: 'RRHH - María González',
      },
      // 12. Ginecología
      {
        ci: 'V55667788',
        nombreCompleto: 'Dra. María Elena López Rodríguez',
        email: 'maria.elena@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Ginecología y Obstetricia',
        especialidad: 'Ginecología',
        cargo: 'Médica Ginecóloga',
        fechaIngreso: new Date('2018-09-20'),
        autorizadoPor: 'RRHH - María González',
      },
      // 13. Gastroenterología
      {
        ci: 'V68024680',
        nombreCompleto: 'Dr. Roberto Ignacio Vargas Muñoz',
        email: 'roberto.vargas@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Gastroenterología',
        especialidad: 'Gastroenterología',
        cargo: 'Médico Gastroenterólogo',
        fechaIngreso: new Date('2020-05-15'),
        autorizadoPor: 'RRHH - María González',
      },
      // 14. Hematología
      {
        ci: 'V79135792',
        nombreCompleto: 'Dra. Eliana Patricia Reyes Serrano',
        email: 'eliana.reyes@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Hematología',
        especialidad: 'Hematología',
        cargo: 'Médica Hematóloga',
        fechaIngreso: new Date('2019-11-05'),
        autorizadoPor: 'RRHH - María González',
      },
      // 15. Psicología
      {
        ci: 'V80246813',
        nombreCompleto: 'Dr. Enrique Sebastián Díaz Flores',
        email: 'enrique.diaz@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Psicología',
        especialidad: 'Psicología',
        cargo: 'Psicólogo Clínico',
        fechaIngreso: new Date('2021-08-10'),
        autorizadoPor: 'RRHH - María González',
      },
      // Admin de prueba
      {
        ci: 'V99887766',
        nombreCompleto: 'Dr. Roberto José Hernández Blanco',
        email: 'roberto.hernandez@hospital.com',
        rolAutorizado: 'ADMIN',
        departamento: 'Administración',
        cargo: 'Coordinador Administrativo',
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
    console.log('   ✅ 15 DOCTORES - Una para cada especialidad del sistema');
    console.log('   ✅ 1 ADMIN de prueba');
    console.log('   ─────────────────────────────────────────────────────────');
    
    let contador = 1;
    for (const personal of personalAutorizadoPrueba) {
      console.log(`\n   ${contador}. ${personal.nombreCompleto}`);
      console.log(`      CI: ${personal.ci}`);
      console.log(`      Email: ${personal.email}`);
      if (personal.especialidad) {
        console.log(`      Especialidad: ${personal.especialidad}`);
      } else {
        console.log(`      Rol: ${personal.rolAutorizado}`);
      }
      console.log(`      Departamento: ${personal.departamento}`);
      console.log(`      Cargo: ${personal.cargo}`);
      contador++;
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
