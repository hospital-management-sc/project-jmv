import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Consolidando médicos reales con horarios oficiales...\n')

  // Mapeo de coincidencias entre nombres del horario y usuarios reales ya registrados
  const mapeos: { [nombreHorario: string]: string } = {
    'Dra. Emily Montero': 'monteroemi2617@gmail.com',
    'Dra. Oscibel Ortega': 'oscibelortega@gmail.com',
    'Dra. Oscarimar Cedeño': 'oscarimar.95@gmail.com',
    'Dr. Williams Gonzalez': 'batuzay714@gmail.com',
    'Dra. Cariuska Rios': 'kariuskarios1990@gmail.com',
    'Dra. Dixneris Perez': 'dixneryperez@gmail.com',
    'Dra. Keyla Padrino': 'drakeylapadrino@gmail.com',
    'Dra. Euryth Loreto': 'eurythloreto@gmail.com',
    'Dr. Maholis Cordoba': 'maolycaridadcordobabolivar@gmail.com',
    'Dra. Liliana Nieves': 'lilibolivar11121986@gmail.com',
    'Dra. Luciana Itriago': 'lucyitriago22@gmail.com',
    'Dra. Yelica Marchan': 'yelikyta.m@gmail.com',
    'Dra. Beatriz Martinez': 'bmartinezinfante@gmail.com',
    'Dra. Anni Boraure': 'annyboraure3@gmail.com',
    'Dra. Elsy Rodriguez': 'elsygrodrigueze@gmail.com',
    'Dra. Carianny Lucena': 'caria090604@gmail.com',
    'Dra. Karen Tovar': 'karenastridtovar@gmail.com',
    'Dra. Mariangel Martinez': 'gregoriamariangelm@gmail.com',
    'Dra. Mariana Castillo': 'majecastillo95@gmail.com',
    'Dra. Omarelys': 'dralelysalvarez14@gmail.com',
    'Dra. Karielys Guzman': 'kariguzman@gmail.com',
  }

  for (const [nombreHorario, realEmail] of Object.entries(mapeos)) {
    const realUser = await prisma.usuario.findUnique({
      where: { email: realEmail },
    })

    if (!realUser) continue

    // Buscar el usuario placeholder generado por el script
    const placeholderUser = await prisma.usuario.findFirst({
      where: {
        nombre: nombreHorario,
        email: { endsWith: '@hospital.com' },
      },
    })

    if (placeholderUser) {
      // Transferir horarios del placeholder al usuario real
      const horariosPlaceholder = await prisma.horarioMedico.findMany({
        where: { usuarioId: placeholderUser.id },
      })

      for (const h of horariosPlaceholder) {
        await prisma.horarioMedico.upsert({
          where: {
            usuarioId_especialidad_diaSemana: {
              usuarioId: realUser.id,
              especialidad: h.especialidad,
              diaSemana: h.diaSemana,
            },
          },
          update: {
            horaInicio: h.horaInicio,
            horaFin: h.horaFin,
            activo: true,
          },
          create: {
            usuarioId: realUser.id,
            especialidad: h.especialidad,
            diaSemana: h.diaSemana,
            horaInicio: h.horaInicio,
            horaFin: h.horaFin,
            capacidadPorDia: h.capacidadPorDia,
            activo: true,
          },
        })
      }

      // Actualizar especialidad y rol en el usuario real
      await prisma.usuario.update({
        where: { id: realUser.id },
        data: {
          especialidad: placeholderUser.especialidad || realUser.especialidad,
          role: 'MEDICO',
        },
      })

      // Eliminar el usuario placeholder temporal
      await prisma.horarioMedico.deleteMany({ where: { usuarioId: placeholderUser.id } })
      await prisma.personalAutorizado.deleteMany({ where: { usuarioId: placeholderUser.id } })
      await prisma.usuario.delete({ where: { id: placeholderUser.id } })

      console.log(`  ✅ Vinculados horarios de "${nombreHorario}" -> Usuario Real "${realUser.nombre}" (${realUser.email})`)
    }
  }

  console.log('\n🎉 Consolidación finalizada con éxito.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })
