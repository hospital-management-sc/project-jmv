import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

/**
 * Script para cargar y actualizar la lista oficial de médicos y sus horarios de consulta
 * según la programación física del hospital.
 */

interface HorarioEntrada {
  nombre: string
  especialidad: string
  diaSemana: number // 0=Lunes, 1=Martes, 2=Miércoles, 3=Jueves, 4=Viernes
  horaInicio: string
  horaFin: string
  observacion?: string
}

// Lista oficial transcribiendo la tabla "HORARIO DE CONSULTAS"
const HORARIOS_OFICIALES: HorarioEntrada[] = [
  // 1. MEDICINA INTERNA
  { nombre: 'Dra. Mariana Ranuarez', especialidad: 'Medicina Interna', diaSemana: 0, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dra. Anni Boraure', especialidad: 'Medicina Interna', diaSemana: 1, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dra. Elsy Rodriguez', especialidad: 'Medicina Interna', diaSemana: 4, horaInicio: '08:00', horaFin: '13:00', observacion: 'Cada 15 días' },

  // 2. HEMATOLOGIA
  { nombre: 'Dra. Rocio Arrioja', especialidad: 'Hematología', diaSemana: 2, horaInicio: '08:00', horaFin: '13:00', observacion: 'Disponibilidad de fecha' },

  // 3. PEDIATRIA
  { nombre: 'Dra. Ali Tovar', especialidad: 'Pediatría', diaSemana: 0, horaInicio: '07:00', horaFin: '12:00', observacion: 'Cada 15 días' },
  { nombre: 'Dra. Mariana Castillo', especialidad: 'Pediatría', diaSemana: 1, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dra. Mariangel Martinez', especialidad: 'Pediatría', diaSemana: 1, horaInicio: '14:00', horaFin: '17:00' },
  { nombre: 'Dra. Dixneris Perez', especialidad: 'Pediatría', diaSemana: 1, horaInicio: '07:00', horaFin: '12:00' },
  { nombre: 'Dra. Samantha Martinez', especialidad: 'Pediatría', diaSemana: 2, horaInicio: '07:00', horaFin: '12:00' },
  { nombre: 'Dr. Ceballos', especialidad: 'Pediatría', diaSemana: 4, horaInicio: '07:00', horaFin: '12:00', observacion: 'Cada 15 días' },

  // 4. NEUMOPEDIATRIA
  { nombre: 'Dra. Karielys Guzman', especialidad: 'Neumopediatría', diaSemana: 2, horaInicio: '13:00', horaFin: '17:00' },

  // 5. DERMATOLOGIA
  { nombre: 'Dra. Maryelin Marin', especialidad: 'Dermatología', diaSemana: 0, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dra. Nuvilazka Rojas', especialidad: 'Dermatología', diaSemana: 0, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Dra. Tanhelis Huertado', especialidad: 'Dermatología', diaSemana: 1, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dra. Oscarimar Cedeño', especialidad: 'Dermatología', diaSemana: 1, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Dra. Genesis Luis', especialidad: 'Dermatología', diaSemana: 2, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dra. Danixa Yepez', especialidad: 'Dermatología', diaSemana: 2, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Dra. Oscibel Ortega', especialidad: 'Dermatología', diaSemana: 3, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dra. Emily Montero', especialidad: 'Dermatología', diaSemana: 3, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Dra. Zendimar Blanco', especialidad: 'Dermatología', diaSemana: 4, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dra. Emily Montero', especialidad: 'Dermatología', diaSemana: 4, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Dra. Maury Araque', especialidad: 'Dermatología', diaSemana: 4, horaInicio: '13:00', horaFin: '17:00' },

  // 6. CIRUGIA
  { nombre: 'Dra. Gregoria Aular', especialidad: 'Cirugía General', diaSemana: 0, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Dr. Williams Gonzalez', especialidad: 'Cirugía General', diaSemana: 1, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dra. Cariuska Rios', especialidad: 'Cirugía General', diaSemana: 1, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Dra. Nizoly Perdomo', especialidad: 'Cirugía General', diaSemana: 2, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dra. Maria Azuaje', especialidad: 'Cirugía General', diaSemana: 2, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Dra. Cristal Rodriguez', especialidad: 'Cirugía General', diaSemana: 3, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dra. Diana Herrada', especialidad: 'Cirugía General', diaSemana: 3, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Dra. Aura Pico', especialidad: 'Cirugía General', diaSemana: 4, horaInicio: '08:00', horaFin: '13:00', observacion: 'Cirujana Oncólogo' },
  { nombre: 'Dra. Jorselin Guazz', especialidad: 'Cirugía General', diaSemana: 4, horaInicio: '13:00', horaFin: '17:00' },

  // 7. TRAUMATOLOGIA
  { nombre: 'Dr. Edson Rivero', especialidad: 'Traumatología', diaSemana: 2, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dra. Omarelys', especialidad: 'Traumatología', diaSemana: 3, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dr. Nelson Castillo', especialidad: 'Traumatología', diaSemana: 4, horaInicio: '08:00', horaFin: '13:00' },

  // 8. PSICOLOGIA
  { nombre: 'Lic. Elio Barrios', especialidad: 'Psicología', diaSemana: 1, horaInicio: '13:00', horaFin: '17:00' },

  // 9. GINECOLOGIA
  { nombre: 'Dra. Lilibeth Armas', especialidad: 'Ginecología', diaSemana: 0, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Dra. Beatriz Martinez', especialidad: 'Ginecología', diaSemana: 1, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dra. Ana Hernandez', especialidad: 'Ginecología', diaSemana: 1, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Dra. Mariana Diaz', especialidad: 'Ginecología', diaSemana: 1, horaInicio: '07:00', horaFin: '12:00' },
  { nombre: 'Dra. Ana Rodriguez', especialidad: 'Ginecología', diaSemana: 2, horaInicio: '07:00', horaFin: '12:00' },
  { nombre: 'Dra. Kamali Sevilla', especialidad: 'Ginecología', diaSemana: 2, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Dra. Luciana Itriago', especialidad: 'Ginecología', diaSemana: 3, horaInicio: '07:00', horaFin: '12:00' },
  { nombre: 'Dra. Yelica Marchan', especialidad: 'Ginecología', diaSemana: 4, horaInicio: '08:00', horaFin: '13:00' },

  // 10. GASTROENTEROLOGIA
  { nombre: 'Dra. Liliana Nieves', especialidad: 'Gastroenterología', diaSemana: 3, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dr. Maholis Cordoba', especialidad: 'Gastroenterología', diaSemana: 4, horaInicio: '08:00', horaFin: '13:00' },

  // 11. ORL
  { nombre: 'Dra. Karen Tovar', especialidad: 'Otorrinolaringología', diaSemana: 0, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dra. Karla Perez', especialidad: 'Otorrinolaringología', diaSemana: 1, horaInicio: '07:00', horaFin: '12:00' },
  { nombre: 'Dra. Carianny Lucena', especialidad: 'Otorrinolaringología', diaSemana: 3, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dra. Noretsy Tovar', especialidad: 'Otorrinolaringología', diaSemana: 3, horaInicio: '13:00', horaFin: '17:00' },

  // 12. NEUROCIRUJANO
  { nombre: 'Dr. Felix Herrera', especialidad: 'Neurocirugía', diaSemana: 0, horaInicio: '08:00', horaFin: '13:00' },

  // 13. FISIATRIA
  { nombre: 'Lcda. Dilia Neder', especialidad: 'Fisiatría', diaSemana: 1, horaInicio: '07:00', horaFin: '12:00' },

  // 14. ECOGRAFIA
  { nombre: 'Dr. Oscar Dominguez', especialidad: 'Ecografía', diaSemana: 0, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dra. Ninibeth Mireles', especialidad: 'Ecografía', diaSemana: 1, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Dra. Reina Gomez', especialidad: 'Ecografía', diaSemana: 2, horaInicio: '07:00', horaFin: '12:00' },
  { nombre: 'Dra. Euryth Loreto', especialidad: 'Ecografía', diaSemana: 3, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Dra. Keyla Padrino', especialidad: 'Ecografía', diaSemana: 3, horaInicio: '13:00', horaFin: '17:00' },

  // 15. ODONTOLOGIA
  { nombre: 'Od. Genesis Albornoz', especialidad: 'Odontología', diaSemana: 0, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Od. Shakira Oropeza', especialidad: 'Odontología', diaSemana: 0, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Od. Bernardo Jimenez', especialidad: 'Odontología', diaSemana: 0, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Od. Simon Liendo', especialidad: 'Odontología', diaSemana: 1, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Od. Mercedes Rivas', especialidad: 'Odontología', diaSemana: 1, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Od. Yuleidis Hernandez', especialidad: 'Odontología', diaSemana: 1, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Od. Sol Viera', especialidad: 'Odontología', diaSemana: 2, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Od. Simon Liendo', especialidad: 'Odontología', diaSemana: 2, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Od. Bernardo Liendo', especialidad: 'Odontología', diaSemana: 2, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Od. Genesis Albornoz', especialidad: 'Odontología', diaSemana: 3, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Od. Mercedes Rivas', especialidad: 'Odontología', diaSemana: 3, horaInicio: '08:00', horaFin: '13:00' },
  { nombre: 'Od. Yuleidis Hernandez', especialidad: 'Odontología', diaSemana: 3, horaInicio: '13:00', horaFin: '17:00' },
  { nombre: 'Od. Sol Viera', especialidad: 'Odontología', diaSemana: 4, horaInicio: '08:00', horaFin: '13:00' },
]

function generateEmail(nombre: string): string {
  const clean = nombre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^(dra?\.|lic\.|lcda\.|od\.)\s*/, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '.')
  return `${clean}@hospital.com`
}

function generateCI(index: number): string {
  const baseNum = 15000000 + index
  return `V${baseNum}`
}

async function main() {
  console.log('🩺 Actualizando lista de médicos y horarios de consulta oficiales...\n')

  const defaultPassword = await bcrypt.hash('Doctor2026!', 10)
  const medicosCreados: Map<string, any> = new Map()

  // 1. Obtener lista única de médicos
  const medicosUnicos = Array.from(
    new Set(HORARIOS_OFICIALES.map((h) => `${h.nombre}|||${h.especialidad}`))
  ).map((str) => {
    const [nombre, especialidad] = str.split('|||')
    return { nombre, especialidad }
  })

  console.log(`📋 Total de médicos a procesar: ${medicosUnicos.length}`)

  // 2. Crear o encontrar usuarios y whitelist para cada médico
  let indexCI = 100
  for (const item of medicosUnicos) {
    const email = generateEmail(item.nombre)
    indexCI++
    const ci = generateCI(indexCI)

    // Buscar si ya existe por email o por nombre aproximado
    let usuario = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email },
          { nombre: { contains: item.nombre.replace(/^(dra?\.|lic\.|lcda\.|od\.)\s*/i, '').trim(), mode: 'insensitive' } },
        ],
      },
    })

    if (!usuario) {
      usuario = await prisma.usuario.create({
        data: {
          nombre: item.nombre,
          email,
          password: defaultPassword,
          ci,
          cargo: `Médico de ${item.especialidad}`,
          especialidad: item.especialidad,
          role: 'MEDICO',
        },
      })
      console.log(`  ✅ Creado usuario: ${usuario.nombre} (${item.especialidad})`)
    } else {
      // Asegurar especialidad y rol
      usuario = await prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          especialidad: item.especialidad,
          role: 'MEDICO',
        },
      })
      console.log(`  ℹ️  Actualizado usuario: ${usuario.nombre} (${item.especialidad})`)
    }

    // Registrar o actualizar Whitelist PersonalAutorizado
    const personalExistente = await prisma.personalAutorizado.findFirst({
      where: {
        OR: [
          { email: usuario.email },
          { usuarioId: usuario.id },
        ],
      },
    })

    if (!personalExistente) {
      await prisma.personalAutorizado.create({
        data: {
          ci: usuario.ci || ci,
          nombreCompleto: usuario.nombre,
          email: usuario.email,
          rolAutorizado: 'MEDICO',
          departamento: item.especialidad,
          especialidad: item.especialidad,
          cargo: `Médico de ${item.especialidad}`,
          estado: 'ACTIVO',
          fechaIngreso: new Date(),
          autorizadoPor: 'RRHH - Horarios Oficiales',
          registrado: true,
          fechaRegistro: new Date(),
          usuarioId: usuario.id,
        },
      })
    }

    medicosCreados.set(`${item.nombre}|||${item.especialidad}`, usuario)
  }

  // 3. Crear registros en HorarioMedico
  console.log('\n📅 Insertando horarios de consulta...')
  let totalHorarios = 0

  for (const horario of HORARIOS_OFICIALES) {
    const usuario = medicosCreados.get(`${horario.nombre}|||${horario.especialidad}`)
    if (!usuario) continue

    await prisma.horarioMedico.upsert({
      where: {
        usuarioId_especialidad_diaSemana: {
          usuarioId: usuario.id,
          especialidad: horario.especialidad,
          diaSemana: horario.diaSemana,
        },
      },
      update: {
        horaInicio: horario.horaInicio,
        horaFin: horario.horaFin,
        capacidadPorDia: 20,
        activo: true,
      },
      create: {
        usuarioId: usuario.id,
        especialidad: horario.especialidad,
        diaSemana: horario.diaSemana,
        horaInicio: horario.horaInicio,
        horaFin: horario.horaFin,
        capacidadPorDia: 20,
        activo: true,
      },
    })

    totalHorarios++
  }

  console.log(`\n🎉 ¡Carga completada exitosamente!`)
  console.log(`  - Médicos cargados/actualizados: ${medicosUnicos.length}`)
  console.log(`  - Horarios de consulta asignados: ${totalHorarios}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error ejecutando script:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
