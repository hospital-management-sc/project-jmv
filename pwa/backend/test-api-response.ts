import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Simular la función convertBigIntToString del controlador (CORREGIDA)
function convertBigIntToString(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  // Preservar objetos Date (se serializarán automáticamente a ISO string en JSON)
  if (obj instanceof Date) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => convertBigIntToString(item));
  }
  
  if (typeof obj === 'object') {
    const converted: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        converted[key] = convertBigIntToString(obj[key]);
      }
    }
    return converted;
  }
  
  return obj;
}

async function main() {
  try {
    console.log('=== Simulando respuesta del endpoint /api/pacientes/search ===\n')
    
    const paciente = await prisma.paciente.findFirst({
      where: { ci: 'V-18200100' },
      include: {
        personalMilitar: true,
        admisiones: true,
        encuentros: true,
      }
    })

    if (!paciente) {
      console.log('Paciente no encontrado')
      return
    }

    console.log('--- Objeto Prisma RAW ---')
    console.log('fechaNacimiento tipo:', typeof paciente.fechaNacimiento)
    console.log('fechaNacimiento valor:', paciente.fechaNacimiento)
    console.log('fechaNacimiento instanceof Date:', paciente.fechaNacimiento instanceof Date)
    
    // Convertir BigInt
    const converted = convertBigIntToString(paciente)
    console.log('\n--- Después de convertBigIntToString ---')
    console.log('fechaNacimiento tipo:', typeof converted.fechaNacimiento)
    console.log('fechaNacimiento valor:', converted.fechaNacimiento)
    console.log('fechaNacimiento instanceof Date:', converted.fechaNacimiento instanceof Date)
    
    // Simular JSON.stringify (lo que hace res.json())
    const jsonString = JSON.stringify({ success: true, data: converted })
    console.log('\n--- Después de JSON.stringify ---')
    console.log('JSON String (primeros 500 chars):', jsonString.substring(0, 500))
    
    // Parsear como lo hace el frontend
    const parsed = JSON.parse(jsonString)
    console.log('\n--- Después de JSON.parse (como recibe el frontend) ---')
    console.log('fechaNacimiento tipo:', typeof parsed.data.fechaNacimiento)
    console.log('fechaNacimiento valor:', parsed.data.fechaNacimiento)
    console.log('fechaNacimiento instanceof Date:', parsed.data.fechaNacimiento instanceof Date)
    
    // Probar el cálculo de edad como lo hace el frontend
    if (parsed.data.fechaNacimiento) {
      const fechaStr = parsed.data.fechaNacimiento.split('T')[0]
      const [year, month, day] = fechaStr.split('-').map(Number)
      const nac = new Date(year, month - 1, day)
      
      const hoy = new Date()
      let edad = hoy.getFullYear() - nac.getFullYear()
      const diferenciaMeses = hoy.getMonth() - nac.getMonth()
      if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < nac.getDate())) {
        edad--
      }
      
      console.log('\n--- Cálculo de Edad (método frontend) ---')
      console.log('Fecha extraída:', fechaStr)
      console.log('Fecha parseada:', nac.toLocaleDateString('es-VE'))
      console.log('Edad calculada:', edad, 'años')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
