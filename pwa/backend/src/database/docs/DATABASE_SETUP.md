# 🗄️ Database Setup Guide - Hospital Management System

## 📋 Overview

This guide covers the setup and configuration of PostgreSQL with Prisma ORM for the Hospital Management System backend.

---

## ✅ PASO 1: Instalar Dependencias

```bash
cd backend

# Install dependencies (includes Prisma)
npm install
```

✨ Esto instala:
- `@prisma/client` - Cliente Prisma para TypeScript
- `prisma` - CLI de Prisma para migraciones

---

## 📝 PASO 2: Colocar tu Archivo SQL

1. **Ubica tu archivo `.sql` del hospital** (ej: `hospital_schema.sql`)

2. **Colócalo aquí:**
   ```
   backend/prisma/sql-reference/
   ```
   Ejemplo:
   ```
   backend/prisma/sql-reference/hospital_original_schema.sql
   ```

3. **Este archivo es de REFERENCIA.** No se ejecutará directamente, pero lo usaremos como base para crear el schema de Prisma.

---

## 🔧 PASO 3: Configurar Variables de Entorno

1. **Copia el archivo de ejemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Edita `.env` con tus credenciales PostgreSQL:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/hospital_db"
   NODE_ENV=development
   PORT=5000
   ```

   ⚠️ **Reemplaza:**
   - `username` - tu usuario PostgreSQL
   - `password` - tu contraseña
   - `localhost` - host (puede ser `db` si usas Docker)
   - `hospital_db` - nombre de la BD

---

## 🏗️ PASO 4: Convertir SQL a Prisma Schema

### Opción A: Si tu BD ya existe

```bash
# Prisma introspect genera el schema desde la BD
npx prisma db pull
```

Esto crea `prisma/schema.prisma` basado en tu BD existente.

### Opción B: Crear desde Cero (Recomendado)

1. **Abre `prisma/schema.prisma`**

2. **Traduce tu SQL al formato Prisma** basándote en tu archivo en `prisma/sql-reference/`

Ejemplo:
```prisma
model Patient {
  id        Int     @id @default(autoincrement())
  cedula    String  @unique
  name      String
  email     String  @unique
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relaciones
  medicalRecords MedicalRecord[]
  appointments   Appointment[]
}

model Doctor {
  id        Int     @id @default(autoincrement())
  cedula    String  @unique
  name      String
  specialty String
  email     String  @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relaciones
  appointments Appointment[]
}

model Appointment {
  id        Int     @id @default(autoincrement())
  patientId Int
  doctorId  Int
  dateTime  DateTime
  status    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relaciones
  patient Patient @relation(fields: [patientId], references: [id], onDelete: Cascade)
  doctor  Doctor @relation(fields: [doctorId], references: [id], onDelete: Cascade)
}
```

---

## 🔄 PASO 5: Crear Primera Migración

```bash
# Genera el Prisma Client y crea la migración
npx prisma migrate dev --name init

# Se te pedirá un nombre para la migración. Escribe: init
```

✨ Esto:
- ✅ Crea la carpeta `prisma/migrations/`
- ✅ Genera `@prisma/client` automáticamente
- ✅ Aplica los cambios a la BD

---

## 📊 PASO 6: Verificar en Prisma Studio

```bash
# Abre interfaz gráfica para ver/editar datos
npx prisma studio
```

Se abrirá en `http://localhost:5555`

---

## 🌱 PASO 7 (Opcional): Agregar Seeds

Si necesitas datos iniciales:

1. **Edita `prisma/seeds/seed.ts`:**
   ```typescript
   import { PrismaClient } from '@prisma/client';
   
   const prisma = new PrismaClient();
   
   async function main() {
     // Crear doctor de prueba
     const doctor = await prisma.doctor.create({
       data: {
         cedula: 'V12345678',
         name: 'Dr. Juan García',
         specialty: 'Cardiología',
         email: 'juan@hospital.com',
       },
     });
     console.log('Doctor creado:', doctor);
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
   ```

2. **Ejecuta el seed:**
   ```bash
   npx prisma db seed
   ```

---

## 🛠️ Comandos Útiles

### Migraciones
```bash
# Crear nueva migración
npm run db:migrate:dev

# Aplicar migraciones pendientes
npm run db:migrate:deploy

# Resetear BD (⚠️ BORRA TODO)
npm run db:reset
```

### Utilidades
```bash
# Generar Prisma Client
npm run db:generate

# Ver datos en UI
npm run db:studio

# Sincronizar schema con BD (sin migraciones)
npm run db:push
```

---

## 📁 Estructura Final

```
backend/
├── prisma/
│   ├── schema.prisma           ← Tu esquema Prisma (convertido de SQL)
│   ├── migrations/
│   │   └── 20241110_init/      ← Auto-generadas
│   ├── seeds/
│   │   └── seed.ts
│   ├── sql-reference/
│   │   └── hospital_original_schema.sql  ← Tu SQL original (referencia)
│   └── schema-reference.md
├── src/
│   ├── database/
│   │   ├── docs/               ← Documentación (este archivo está aquí)
│   │   └── connection.ts       ← Conexión Prisma
│   ├── services/               ← Lógica de BD
│   └── ...
├── .env                        ← Variables de entorno (NO COMMITEAR)
├── .env.example                ← Plantilla (SÍ COMMITEAR)
└── package.json
```

---

## 🚀 Próximos Pasos

1. ✅ Colocar archivo SQL en `prisma/sql-reference/`
2. ✅ Configurar `.env` con credenciales PostgreSQL
3. ✅ Convertir SQL a Prisma schema en `prisma/schema.prisma`
4. ✅ Ejecutar: `npm run db:migrate:dev --name init`
5. ✅ Crear servicios en `src/services/` que usen Prisma
6. ✅ Crear controladores que llamen a los servicios

---

## 📚 Recursos

- [Prisma Docs](https://www.prisma.io/docs/)
- [PostgreSQL Data Types](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#postgresql)
- [Prisma Relations](https://www.prisma.io/docs/concepts/relations)
- [Best Practices](https://www.prisma.io/docs/guides/performance-optimization)

---

## ❓ Preguntas Frecuentes

**Q: ¿Dónde pongo mi archivo `.sql`?**
A: En `backend/prisma/sql-reference/` - es solo referencia.

**Q: ¿Tengo que escribir SQL?**
A: No. Escribes en `prisma/schema.prisma` y Prisma genera el SQL.

**Q: ¿Cómo convierto SQL a Prisma?**
A: Lee tu SQL y traduce a modelos Prisma. Consulta la [documentación](https://www.prisma.io/docs/concepts/components/prisma-schema).

**Q: ¿Qué pasa si cambian los requisitos?**
A: Edita `schema.prisma` y ejecuta: `npm run db:migrate:dev --name <descripcion>`

---

**Listo para empezar?** ✨
