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
        email: 'medicina-interna@hospital.com',
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
        email: 'medicina-paliativa@hospital.com',
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
        email: 'cirugia-general@hospital.com',
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
        email: 'pediatria@hospital.com',
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
        email: 'neumologia-pediatrica@hospital.com',
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
        email: 'traumatologia@hospital.com',
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
        email: 'cirugia-manos@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Cirugía General',
        especialidad: 'Cirugía de Manos',
        cargo: 'Cirujano de Manos',
        fechaIngreso: new Date('2018-09-10'),
        autorizadoPor: 'RRHH - María González',
      },
      // 8. Cirugía Pediátrica
      {
        ci: 'V57913579',
        nombreCompleto: 'Dr. Claudio Andrés Sepúlveda Torres',
        email: 'cirugia-pediatrica@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Cirugía General',
        especialidad: 'Cirugía Pediátrica',
        cargo: 'Cirujano Pediátrico',
        fechaIngreso: new Date('2022-02-15'),
        autorizadoPor: 'RRHH - María González',
      },
      // 9. Odontología
      {
        ci: 'V46802468',
        nombreCompleto: 'Dra. Viviana Catalina Morales Bravo',
        email: 'odontologia@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Odontología',
        especialidad: 'Odontología',
        cargo: 'Cirujana Dentista',
        fechaIngreso: new Date('2021-01-20'),
        autorizadoPor: 'RRHH - María González',
      },
      // 10. Otorrinolaringología
      {
        ci: 'V66778899',
        nombreCompleto: 'Dr. Pedro Andrés Flores Reyes',
        email: 'otorrinolaringologia@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Otorrinolaringología',
        especialidad: 'Otorrinolaringología',
        cargo: 'Médico ORL',
        fechaIngreso: new Date('2019-08-10'),
        autorizadoPor: 'RRHH - María González',
      },
      // 11. Dermatología
      {
        ci: 'V22334455',
        nombreCompleto: 'Dra. Vanessa Irina Moreno Díaz',
        email: 'dermatologia@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Dermatología',
        especialidad: 'Dermatología',
        cargo: 'Médica Dermatóloga',
        fechaIngreso: new Date('2020-11-20'),
        autorizadoPor: 'RRHH - María González',
      },
      // 12. Fisiatría
      {
        ci: 'V57912346',
        nombreCompleto: 'Dr. Cristóbal Miguel Sánchez López',
        email: 'fisiatra@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Fisiatría',
        especialidad: 'Fisiatría',
        cargo: 'Médico Fisiatra',
        fechaIngreso: new Date('2019-02-10'),
        autorizadoPor: 'RRHH - María González',
      },
      // 13. Ginecología
      {
        ci: 'V55667788',
        nombreCompleto: 'Dra. María Elena López Rodríguez',
        email: 'ginecologia@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Ginecología',
        especialidad: 'Ginecología',
        cargo: 'Médica Ginecóloga',
        fechaIngreso: new Date('2018-09-20'),
        autorizadoPor: 'RRHH - María González',
      },
      // 14. Gastroenterología
      {
        ci: 'V68024680',
        nombreCompleto: 'Dr. Roberto Ignacio Vargas Muñoz',
        email: 'gastroenterologia@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Gastroenterología',
        especialidad: 'Gastroenterología',
        cargo: 'Médico Gastroenterólogo',
        fechaIngreso: new Date('2020-05-15'),
        autorizadoPor: 'RRHH - María González',
      },
      // 15. Hematología
      {
        ci: 'V79135792',
        nombreCompleto: 'Dra. Eliana Patricia Reyes Serrano',
        email: 'hematologia@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Hematología',
        especialidad: 'Hematología',
        cargo: 'Médica Hematóloga',
        fechaIngreso: new Date('2019-11-05'),
        autorizadoPor: 'RRHH - María González',
      },
      // 16. Psicología
      {
        ci: 'V80246813',
        nombreCompleto: 'Dr. Enrique Sebastián Díaz Flores',
        email: 'psicologia@hospital.com',
        rolAutorizado: 'MEDICO',
        departamento: 'Psicología',
        especialidad: 'Psicología',
        cargo: 'Psicólogo Clínico',
        fechaIngreso: new Date('2021-08-10'),
        autorizadoPor: 'RRHH - María González',
      },
      // 17. Admin de prueba
      {
        ci: 'V99887766',
        nombreCompleto: 'Dr. Roberto José Hernández Blanco',
        email: 'administracion@hospital.com',
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
    // PASO 3: Crear Horarios de Prueba para Médicos
    // ============================================
    console.log('\n📅 Paso 3: Creando horarios de atención para médicos...');
    
    // Mapeo de especialidades a horarios típicos basados en datos reales del hospital
    // Basado en DOCTORES_ACTIVOS_REGISTRO.md
    const horariosTemplate = [
      // Medicina Interna: Lunes, Martes, Viernes 8am-5pm (15 pacientes/día)
      { especialidad: 'Medicina Interna', dias: [0, 1, 4], horaInicio: '08:00', horaFin: '17:00', capacidad: 15 },
      
      // Medicina Paliativa: Miércoles, Jueves 8am-3pm (12 pacientes/día)
      { especialidad: 'Medicina Paliativa', dias: [2, 3], horaInicio: '08:00', horaFin: '15:00', capacidad: 12 },
      
      // Cirugía General: Martes, Miércoles, Jueves 8am-5pm (10 pacientes/día)
      { especialidad: 'Cirugía General', dias: [1, 2, 3], horaInicio: '08:00', horaFin: '17:00', capacidad: 10 },
      
      // Pediatría: Lunes, Miércoles, Jueves 7am-3pm (20 pacientes/día)
      { especialidad: 'Pediatría', dias: [0, 2, 3], horaInicio: '07:00', horaFin: '15:00', capacidad: 20 },
      
      // Neumología Pediátrica: Miércoles 1pm-5pm (8 pacientes/día)
      { especialidad: 'Neumología Pediátrica', dias: [2], horaInicio: '13:00', horaFin: '17:00', capacidad: 8 },
      
      // Traumatología: Miércoles, Jueves, Viernes 8am-4pm (12 pacientes/día)
      { especialidad: 'Traumatología', dias: [2, 3, 4], horaInicio: '08:00', horaFin: '16:00', capacidad: 12 },
      
      // Cirugía de Manos: Lunes, Miércoles 8am-2pm (6 cirugías/día)
      { especialidad: 'Cirugía de Manos', dias: [0, 2], horaInicio: '08:00', horaFin: '14:00', capacidad: 6 },
      
      // Cirugía Pediátrica: Martes 9am-5pm (8 pacientes/día)
      { especialidad: 'Cirugía Pediátrica', dias: [1], horaInicio: '09:00', horaFin: '17:00', capacidad: 8 },
      
      // Odontología: Lunes a Viernes 8am-5pm (25 pacientes/día - alta demanda)
      { especialidad: 'Odontología', dias: [0, 1, 2, 3, 4], horaInicio: '08:00', horaFin: '17:00', capacidad: 25 },
      
      // Otorrinolaringología: Lunes 1pm-5pm, Miércoles, Jueves 7am-3pm (15 pacientes/día)
      { especialidad: 'Otorrinolaringología', dias: [0], horaInicio: '13:00', horaFin: '17:00', capacidad: 10 },
      { especialidad: 'Otorrinolaringología', dias: [2, 3], horaInicio: '07:00', horaFin: '15:00', capacidad: 15 },
      
      // Dermatología: Lunes a Viernes 8am-5pm (20 pacientes/día - alta demanda)
      { especialidad: 'Dermatología', dias: [0, 1, 2, 3, 4], horaInicio: '08:00', horaFin: '17:00', capacidad: 20 },
      
      // Fisiatría: Jueves 7am-3pm (15 pacientes/día)
      { especialidad: 'Fisiatría', dias: [3], horaInicio: '07:00', horaFin: '15:00', capacidad: 15 },
      
      // Ginecología: Lunes 1pm-5pm, Martes, Miércoles, Jueves, Viernes 7am-4pm (18 pacientes/día)
      { especialidad: 'Ginecología', dias: [0], horaInicio: '13:00', horaFin: '17:00', capacidad: 12 },
      { especialidad: 'Ginecología', dias: [1, 2, 3, 4], horaInicio: '07:00', horaFin: '16:00', capacidad: 18 },
      
      // Gastroenterología: Lunes, Miércoles, Viernes 8am-4pm (12 pacientes/día)
      { especialidad: 'Gastroenterología', dias: [0, 2, 4], horaInicio: '08:00', horaFin: '16:00', capacidad: 12 },
      
      // Hematología: Miércoles 8am-4pm (10 pacientes/día)
      { especialidad: 'Hematología', dias: [2], horaInicio: '08:00', horaFin: '16:00', capacidad: 10 },
      
      // Psicología: Martes 1pm-6pm, Jueves 9am-5pm (12 pacientes/día)
      { especialidad: 'Psicología', dias: [1], horaInicio: '13:00', horaFin: '18:00', capacidad: 12 },
      { especialidad: 'Psicología', dias: [3], horaInicio: '09:00', horaFin: '17:00', capacidad: 12 },
    ];

    // Obtener el personal autorizado para mapear especialidades
    const personalMedico = await prisma.personalAutorizado.findMany({
      where: { 
        rolAutorizado: 'MEDICO',
        registrado: true,
      },
      include: {
        usuario: true,
      },
    });

    let horariosCreados = 0;
    
    // Crear horarios para cada médico basándose en su especialidad
    for (const personal of personalMedico) {
      if (!personal.usuario || !personal.especialidad) continue;

      // Buscar el template de horario para esta especialidad
      const templates = horariosTemplate.filter(h => h.especialidad === personal.especialidad);
      
      if (templates.length === 0) {
        console.log(`   ⚠️  Sin template de horario para: ${personal.especialidad}`);
        continue;
      }

      // Crear horarios para cada template (puede haber múltiples rangos horarios)
      for (const template of templates) {
        for (const dia of template.dias) {
          // Verificar si ya existe este horario
          const existeHorario = await prisma.horarioMedico.findUnique({
            where: {
              usuarioId_especialidad_diaSemana: {
                usuarioId: personal.usuario.id,
                especialidad: personal.especialidad,
                diaSemana: dia,
              },
            },
          });

          if (!existeHorario) {
            await prisma.horarioMedico.create({
              data: {
                usuarioId: personal.usuario.id,
                especialidad: personal.especialidad,
                diaSemana: dia,
                horaInicio: template.horaInicio,
                horaFin: template.horaFin,
                capacidadPorDia: template.capacidad,
                activo: true,
              },
            });
            horariosCreados++;
          }
        }
      }
      
      console.log(`   ✅ Horarios para: ${personal.nombreCompleto} (${personal.especialidad})`);
    }

    console.log(`\n   ✅ Total de ${horariosCreados} horarios creados`);

    // ============================================
    // PASO 4: Mostrar resumen
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

    console.log('\n📅 HORARIOS DE ATENCIÓN MÉDICA:');
    console.log(`   ✅ ${horariosCreados} horarios creados para médicos`);
    console.log('   📍 Días de semana: 0=Lunes, 1=Martes, 2=Miércoles, 3=Jueves, 4=Viernes');
    console.log('   💡 Los horarios incluyen capacidad diaria por especialidad');
    console.log('   💡 Puedes verificar con: npx prisma studio');

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
