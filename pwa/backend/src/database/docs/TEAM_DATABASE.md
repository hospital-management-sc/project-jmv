# 🗄️ EQUIPO DE BASE DE DATOS - Hospital Management System

## 👥 Responsabilidades del Equipo DB

- 📋 Diseño y modelado del esquema PostgreSQL
- 🔄 Migraciones de base de datos
- 📊 Optimización de consultas
- 🔐 Seguridad y normalización de datos
- 📈 Performance y indexación
- 🌱 Seeds y datos de prueba

---

## 📂 Estructura de Archivos para el Equipo DB

```
backend/
├── prisma/                          ← 🎯 TODO DEL EQUIPO DB
│   ├── schema.prisma                ← Esquema principal (CRÍTICO)
│   ├── migrations/                  ← Auto-generadas por Prisma
│   ├── seeds/
│   │   └── seed.ts                  ← Datos iniciales
│   ├── sql-reference/
│   │   └── hospital_original_schema.sql  ← Tu SQL aquí
│   └── schema-reference.md          ← Documentación del schema
│
├── src/database/
│   └── connection.ts                ← Configuración de Prisma
│
├── DATABASE_SETUP.md                ← Guía de setup (Este archivo)
├── .env.example                     ← Variables de entorno
└── package.json                     ← Con scripts de BD
```

---

## 🚀 INICIO RÁPIDO PARA EL EQUIPO DB

### 1️⃣ **Instalación**
```bash
cd backend
npm install
```

### 2️⃣ **Colocar archivo SQL**
```
Copia tu archivo `hospital_schema.sql` en:
backend/prisma/sql-reference/hospital_schema.sql
```

### 3️⃣ **Configurar `.env`**
```bash
cp .env.example .env

# Edita .env con tus credenciales PostgreSQL:
DATABASE_URL="postgresql://user:password@localhost:5432/hospital_db"
```

### 4️⃣ **Crear el schema de Prisma**

Lee tu archivo SQL y traduce los tablas/relaciones a `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Aquí van tus modelos (traducidos de SQL)
model Patient {
  id        Int     @id @default(autoincrement())
  cedula    String  @unique
  name      String
  // ... más campos
}
```

### 5️⃣ **Crear migración**
```bash
npm run db:migrate:dev --name init
```

### 6️⃣ **Verificar en Prisma Studio**
```bash
npm run db:studio
```

---

## 📝 Guía: Convertir SQL a Prisma

### Ejemplo SQL → Prisma

**SQL Original:**
```sql
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  cedula VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  date_of_birth DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  cedula VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(100),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  patient_id INT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id INT NOT NULL REFERENCES doctors(id),
  appointment_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT
);
```

**Prisma Equivalente:**
```prisma
model Patient {
  id            Int       @id @default(autoincrement())
  cedula        String    @unique
  name          String
  email         String?   @unique
  phone         String?
  dateOfBirth   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relaciones
  appointments  Appointment[]
}

model Doctor {
  id            Int       @id @default(autoincrement())
  cedula        String    @unique
  name          String
  specialty     String?
  email         String?   @unique
  createdAt     DateTime  @default(now())
  
  // Relaciones
  appointments  Appointment[]
}

model Appointment {
  id              Int     @id @default(autoincrement())
  patientId       Int
  doctorId        Int
  appointmentDate DateTime
  status          String  @default("pending")
  notes           String?
  
  // Relaciones
  patient         Patient @relation(fields: [patientId], references: [id], onDelete: Cascade)
  doctor          Doctor  @relation(fields: [doctorId], references: [id])
}
```

---

## 🔧 Scripts de Desarrollo Disponibles

```bash
# Crear/actualizar migración
npm run db:migrate:dev --name <nombre_migracion>

# Aplicar migraciones en producción
npm run db:migrate:deploy

# Resetear BD (⚠️ Borra todo - solo desarrollo)
npm run db:reset

# Ejecutar seeds
npm run db:seed

# Ver/editar datos en UI
npm run db:studio

# Sincronizar schema con BD
npm run db:push

# Generar cliente Prisma
npm run db:generate
```

---

## 📋 Checklist para Nueva Funcionalidad

Cuando agregues una nueva entidad/tabla:

1. ✅ Agregar modelo a `prisma/schema.prisma`
2. ✅ Especificar relaciones correctamente
3. ✅ Ejecutar: `npm run db:migrate:dev --name <descripcion>`
4. ✅ Verificar en `prisma/studio`: `npm run db:studio`
5. ✅ Actualizar `prisma/schema-reference.md` si es necesario
6. ✅ Crear servicio en `src/services/` si aplica
7. ✅ Hacer commit de la migración (en `prisma/migrations/`)

---

## 🔐 Mejores Prácticas

### ✅ DO's
- Usar nombres en **snake_case** para campos: `patient_id`, `date_of_birth`
- Usar nombres en **PascalCase** para modelos: `Patient`, `Doctor`
- Documentar relaciones complejas
- Usar enums para estados: `enum AppointmentStatus { PENDING, CONFIRMED, COMPLETED }`
- Agregar timestamps: `createdAt`, `updatedAt`

### ❌ DON'Ts
- No modificar migraciones después de hacer commit (crea una nueva)
- No usar nombres reservados SQL sin comillas
- No olvidar `@default` en timestamps
- No crear índices sin documentar por qué

---

## 📚 Recursos Útiles

- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [Prisma Relations](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [Database Best Practices](https://www.prisma.io/docs/guides/database/optimizing-queries)

---

## ❓ Preguntas Comunes

**P: ¿Dónde va mi archivo SQL original?**
R: En `backend/prisma/sql-reference/` - es solo de referencia para traducir a Prisma.

**P: ¿Cómo agregar un nuevo campo?**
R: Edita `prisma/schema.prisma`, luego ejecuta:
```bash
npm run db:migrate:dev --name add_<campo>_to_<tabla>
```

**P: ¿Cómo manejar relaciones complejas?**
R: Ve [Prisma Relations Guide](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/many-to-many)

**P: ¿Necesito escribir SQL?**
R: No normalmente. Prisma genera todo. SQL solo para queries complejas.

---

**Equipo DB, bienvenidos al proyecto! 🚀**
