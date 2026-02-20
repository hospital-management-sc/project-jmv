import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Verificando tablas en la base de datos...\n')
    
    // Consultar las tablas que existen
    const result = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename;
    `
    
    console.log('Tablas encontradas:')
    result.forEach(row => {
      console.log(`  - ${row.tablename}`)
    })
    
    console.log(`\nTotal de tablas: ${result.length}`)
    
    // Verificar si existe la tabla Cita
    const citaExists = result.some(row => row.tablename === 'Cita')
    console.log(`\n¿Existe la tabla Cita?: ${citaExists ? 'SÍ' : 'NO'}`)
    
  } catch (error) {
    console.error('Error al verificar tablas:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
