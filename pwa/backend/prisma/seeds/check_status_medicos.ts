import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkStatus() {
  console.log('📊 Generando reporte de estado de médicos...\n')

  const usuarios = await prisma.usuario.findMany({
    where: {
      OR: [
        { role: 'MEDICO' },
        { role: 'DOCTOR' },
      ],
    },
    select: {
      id: true,
      nombre: true,
      email: true,
      ci: true,
      especialidad: true,
      horariosDisponibilidad: true,
      personalAutorizado: true,
    },
    orderBy: {
      especialidad: 'asc',
    },
  })

  console.log(`📋 Total de médicos en la BD: ${usuarios.length}\n`)

  const porEspecialidad: { [esp: string]: typeof usuarios } = {}

  for (const u of usuarios) {
    const esp = u.especialidad || 'Sin especialidad'
    if (!porEspecialidad[esp]) porEspecialidad[esp] = []
    porEspecialidad[esp].push(u)
  }

  for (const [esp, medicos] of Object.entries(porEspecialidad)) {
    console.log(`📌 ESPECIALIDAD: ${esp} (${medicos.length} médicos)`)
    for (const m of medicos) {
      console.log(`   • ${m.nombre} | Email: ${m.email} | CI: ${m.ci || 'N/A'} | Horarios: ${m.horariosDisponibilidad.length} turnos`)
    }
    console.log('')
  }
}

checkStatus()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
  })
