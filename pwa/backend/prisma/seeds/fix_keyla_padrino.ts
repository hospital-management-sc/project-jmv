import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Actualizando horario de la Dra. Keyla Padrino...')

  // Buscar usuario de la Dra. Keyla Padrino
  const usuario = await prisma.usuario.findFirst({
    where: {
      OR: [
        { email: 'drakeylapadrino@gmail.com' },
        { email: 'keyla.padrino@hospital.com' },
        { nombre: { contains: 'Keyla Padrino', mode: 'insensitive' } },
      ],
    },
  })

  if (!usuario) {
    console.error('❌ No se encontró a la Dra. Keyla Padrino')
    return
  }

  // Eliminar horarios anteriores para Ecografía / Ecosonografía
  await prisma.horarioMedico.deleteMany({
    where: { usuarioId: usuario.id },
  })

  // Crear nuevo horario: VIERNES (diaSemana 4) a las 08:00 AM
  await prisma.horarioMedico.create({
    data: {
      usuarioId: usuario.id,
      especialidad: usuario.especialidad || 'Ecografía',
      diaSemana: 4, // Viernes
      horaInicio: '08:00',
      horaFin: '13:00',
      capacidadPorDia: 20,
      activo: true,
    },
  })

  console.log(`✅ Horario actualizado para ${usuario.nombre} (${usuario.email}): Viernes 08:00 AM`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })
