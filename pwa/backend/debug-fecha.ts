import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('=== DEBUG: Analizando formato de fechaNacimiento ===\n')
    
    const paciente = await prisma.paciente.findFirst({
      orderBy: { createdAt: 'desc' },
      select: {
        nroHistoria: true,
        apellidosNombres: true,
        fechaNacimiento: true,
      }
    })

    if (!paciente) {
      console.log('No hay pacientes en la DB')
      return
    }

    console.log('Paciente:', paciente.apellidosNombres)
    console.log('\n--- Análisis de fechaNacimiento ---')
    console.log('Valor RAW:', paciente.fechaNacimiento)
    console.log('Tipo:', typeof paciente.fechaNacimiento)
    console.log('Constructor:', paciente.fechaNacimiento?.constructor?.name)
    console.log('Es Date?:', paciente.fechaNacimiento instanceof Date)
    
    if (paciente.fechaNacimiento) {
      // Convertir a string
      const fechaStr = paciente.fechaNacimiento.toString()
      console.log('\ntoString():', fechaStr)
      console.log('toISOString():', paciente.fechaNacimiento instanceof Date ? (paciente.fechaNacimiento as Date).toISOString() : 'N/A')
      console.log('toLocaleDateString():', paciente.fechaNacimiento instanceof Date ? (paciente.fechaNacimiento as Date).toLocaleDateString('es-VE') : 'N/A')
      
      // Calcular edad
      const hoy = new Date()
      const nac = paciente.fechaNacimiento instanceof Date ? paciente.fechaNacimiento : new Date(paciente.fechaNacimiento)
      let edad = hoy.getFullYear() - nac.getFullYear()
      const diferenciaMeses = hoy.getMonth() - nac.getMonth()
      if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < nac.getDate())) {
        edad--
      }
      console.log('\n--- Cálculo de Edad ---')
      console.log('Hoy:', hoy.toISOString())
      console.log('Nacimiento:', nac.toISOString())
      console.log('Edad calculada:', edad, 'años')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
