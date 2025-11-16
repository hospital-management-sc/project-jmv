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
 * Add your database seed logic here
 * 
 * Examples:
 * - Create initial users/roles
 * - Create test data
 * - Initialize lookup tables
 */
async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Create test users
    const adminPassword = await hashPassword('admin123456');
    const doctorPassword = await hashPassword('doctor123456');
    const userPassword = await hashPassword('user123456');

    // Delete existing users (for testing purposes)
    await prisma.usuario.deleteMany();

    // Create admin user
    const admin = await prisma.usuario.create({
      data: {
        nombre: 'Administrador Sistema',
        email: 'admin@hospital.com',
        password: adminPassword,
        ci: 'V12345678',
        cargo: 'Administrador',
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin user created:', admin.email);

    // Create doctor user
    const doctor = await prisma.usuario.create({
      data: {
        nombre: 'Dr. Carlos García',
        email: 'carlos.garcia@hospital.com',
        password: doctorPassword,
        ci: 'V87654321',
        cargo: 'Médico General',
        role: 'MEDICO',
      },
    });
    console.log('✅ Doctor user created:', doctor.email);

    // Create nurse user
    const nurse = await prisma.usuario.create({
      data: {
        nombre: 'Lic. María López',
        email: 'maria.lopez@hospital.com',
        password: userPassword,
        ci: 'V11223344',
        cargo: 'Enfermera',
        role: 'ENFERMERO',
      },
    });
    console.log('✅ Nurse user created:', nurse.email);

    // Create regular user
    const regularUser = await prisma.usuario.create({
      data: {
        nombre: 'Juan Pérez',
        email: 'juan.perez@hospital.com',
        password: userPassword,
        ci: 'V55667788',
        cargo: 'Personal Administrativo',
        role: 'USUARIO',
      },
    });
    console.log('✅ Regular user created:', regularUser.email);

    console.log('\n🎯 Test User Credentials:');
    console.log('Admin    - admin@hospital.com / admin123456');
    console.log('Doctor   - carlos.garcia@hospital.com / doctor123456');
    console.log('Nurse    - maria.lopez@hospital.com / user123456');
    console.log('User     - juan.perez@hospital.com / user123456');

    console.log('\n✅ Seed completed successfully');
  } catch (error) {
    console.error('❌ Seed error:', error);
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
