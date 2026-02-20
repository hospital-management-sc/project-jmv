# 📖 Database Schema Reference

## 📋 Overview

Referencia completa del esquema Prisma del Hospital Management System con 12 modelos, relaciones e índices.

---

## 🏗️ Modelos Principales

### **Core Clínico**

#### **Paciente**
```prisma
model Paciente {
  id                BigInt   @id @default(autoincrement())
  nroHistoria       String   @unique
  apellidosNombres  String
  ci                String   @unique
  fechaNacimiento   DateTime?
  sexo              String?  // M, F
  nacionalidad      String?
  direccion         String?
  telefono          String?
  estado            String?
  region            String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relaciones
  personalMilitar   PersonalMilitar?
  admisiones        Admision[]
  encuentros        Encuentro[]
  antecedentes      Antecedente[]
}
```
**Propósito:** Información base del paciente
**Índices:** ci, nroHistoria
**Relaciones:** 1:n con Admision, Encuentro, Antecedente; 1:1 con PersonalMilitar

---

#### **PersonalMilitar**
```prisma
model PersonalMilitar {
  id        BigInt  @id @default(autoincrement())
  pacienteId BigInt @unique
  grado     String?
  componente String?
  unidad    String?

  // Relaciones
  paciente  Paciente @relation(fields: [pacienteId], references: [id], onDelete: Cascade)
}
```
**Propósito:** Información militar adicional del paciente
**Relaciones:** 1:1 con Paciente

---

#### **Usuario**
```prisma
model Usuario {
  id        BigInt   @id @default(autoincrement())
  nombre    String
  ci        String?
  cargo     String?
  email     String?
  role      String?  // MEDICO, ENFERMERO, ADMIN, etc
  createdAt DateTime @default(now())

  // Relaciones
  admisiones   Admision[]
  encuentros   Encuentro[]
  auditorias   AuditLog[]
}
```
**Propósito:** Médicos y administrativos del sistema
**Relaciones:** 1:n con Admision, Encuentro, AuditLog

---

### **Flujo de Admisión**

#### **Admision**
```prisma
model Admision {
  id               BigInt   @id @default(autoincrement())
  pacienteId       BigInt
  fechaAdmision    DateTime
  horaAdmision     DateTime?
  formaIngreso     String?  // AMBULANTE, AMBULANCIA
  habitacion       String?
  firmaFacultativo String?
  estadoAdmision   String?
  createdById      BigInt?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  // Relaciones
  paciente              Paciente @relation(fields: [pacienteId], references: [id])
  createdBy             Usuario? @relation(fields: [createdById], references: [id])
  estanciaHospitalaria  EstanciaHospitalaria?
  encuentros            Encuentro[]
}
```
**Propósito:** Registro de admisión inicial
**Índices:** pacienteId, fechaAdmision
**Relaciones:** 1:n Paciente, 1:1 EstanciaHospitalaria, 1:n Encuentro

---

#### **EstanciaHospitalaria**
```prisma
model EstanciaHospitalaria {
  id                  BigInt   @id @default(autoincrement())
  admisionId          BigInt   @unique
  fechaAlta           DateTime?
  diasHosp            Int?
  diagnosticoIngresoId BigInt?
  diagnosticoEgresoId BigInt?
  notas               String?
  updatedAt           DateTime @updatedAt

  // Relaciones
  admision            Admision @relation(fields: [admisionId], references: [id], onDelete: Cascade)
  diagnosticoIngreso  Diagnostico? @relation("ingreso", fields: [diagnosticoIngresoId], references: [id])
  diagnosticoEgreso   Diagnostico? @relation("egreso", fields: [diagnosticoEgresoId], references: [id])
}
```
**Propósito:** Registro de alta hospitalaria y cálculo de días
**Relaciones:** 1:1 Admision, 1:n Diagnostico (ingreso/egreso)

---

### **Encuentros y Observaciones**

#### **Encuentro**
```prisma
model Encuentro {
  id               BigInt   @id @default(autoincrement())
  pacienteId       BigInt
  admisionId       BigInt?
  tipo             String   // EMERGENCIA, HOSPITALIZACION, CONSULTA, OTRO
  fecha            DateTime
  hora             DateTime?
  motivoConsulta   String?
  enfermedadActual String?
  procedencia      String?
  nroCama          String?
  createdById      BigInt?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  // Relaciones
  paciente         Paciente @relation(fields: [pacienteId], references: [id])
  admision         Admision? @relation(fields: [admisionId], references: [id])
  createdBy        Usuario? @relation(fields: [createdById], references: [id])
  signosVitales    SignosVitales[]
  examenRegional   ExamenRegional?
  impresiones      ImpresionDiagnostica[]
}
```
**Propósito:** Visitas/atenciones (emergencia, hospitalización, consulta)
**Índices:** pacienteId, fecha
**Relaciones:** 1:n SignosVitales, 1:1 ExamenRegional, 1:n ImpresionDiagnostica

---

#### **SignosVitales**
```prisma
model SignosVitales {
  id             BigInt   @id @default(autoincrement())
  encuentroId    BigInt
  taSistolica    Int?     // Tensión arterial sistólica
  taDiastolica   Int?     // Tensión arterial diastólica
  pulso          Int?
  temperatura    Decimal? // 36.5, 37.2, etc
  fr             Int?     // Frecuencia respiratoria
  observaciones  String?
  registradoEn   DateTime @default(now())

  // Relaciones
  encuentro      Encuentro @relation(fields: [encuentroId], references: [id], onDelete: Cascade)
}
```
**Propósito:** Signos vitales del paciente en cada encuentro
**Relaciones:** 1:n Encuentro (cascade delete)

---

#### **ExamenRegional**
```prisma
model ExamenRegional {
  id          BigInt   @id @default(autoincrement())
  encuentroId BigInt   @unique
  piel        String?
  cabeza      String?
  cuello      String?
  torax       String?
  pulmones    String?
  corazon     String?
  abdomen     String?
  anoRecto    String?
  genitales   String?

  // Relaciones
  encuentro   Encuentro @relation(fields: [encuentroId], references: [id], onDelete: Cascade)
}
```
**Propósito:** Examen físico por regiones del cuerpo
**Relaciones:** 1:1 Encuentro (cascade delete)

---

### **Diagnósticos**

#### **Diagnostico**
```prisma
model Diagnostico {
  id           BigInt   @id @default(autoincrement())
  codigoCie    String?  // Código CIE-10
  descripcion  String
  tipo         String?
  createdAt    DateTime @default(now())

  // Relaciones
  estanciaIngresos EstanciaHospitalaria[] @relation("ingreso")
  estanciaEgresos  EstanciaHospitalaria[] @relation("egreso")
}
```
**Propósito:** Catálogo de diagnósticos CIE
**Índices:** codigoCie
**Relaciones:** 1:n EstanciaHospitalaria (ingreso/egreso)

---

#### **ImpresionDiagnostica**
```prisma
model ImpresionDiagnostica {
  id          BigInt   @id @default(autoincrement())
  encuentroId BigInt
  codigoCie   String?  // Código CIE
  descripcion String?
  clase       String   // PRESUNTIVO, CONFIRMADO
  createdAt   DateTime @default(now())

  // Relaciones
  encuentro   Encuentro @relation(fields: [encuentroId], references: [id], onDelete: Cascade)
}
```
**Propósito:** Diagnósticos de cada encuentro
**Índices:** codigoCie, encuentroId
**Relaciones:** 1:n Encuentro (cascade delete)

---

### **Antecedentes**

#### **Antecedente**
```prisma
model Antecedente {
  id           BigInt   @id @default(autoincrement())
  pacienteId   BigInt
  tipo         String   // PERSONAL, FAMILIAR, OTRO
  descripcion  String
  registradoEn DateTime @default(now())

  // Relaciones
  paciente     Paciente @relation(fields: [pacienteId], references: [id], onDelete: Cascade)
}
```
**Propósito:** Historial personal y familiar del paciente
**Relaciones:** 1:n Paciente (cascade delete)

---

### **Auditoría**

#### **AuditLog**
```prisma
model AuditLog {
  id         BigInt   @id @default(autoincrement())
  tabla      String   // Nombre de la tabla modificada
  registroId BigInt?  // ID del registro modificado
  usuarioId  BigInt?
  accion     String   // CREATE, UPDATE, DELETE
  detalle    Json?    // Detalles en JSON
  creadoEn   DateTime @default(now())

  // Relaciones
  usuario    Usuario? @relation(fields: [usuarioId], references: [id])
}
```
**Propósito:** Auditoría de cambios críticos
**Índices:** tabla, usuarioId
**Relaciones:** 1:n Usuario

---

## 🔗 Relaciones Visuales

```
Paciente (1) ──→ (1) PersonalMilitar
    │
    ├──→ (n) Admision
    │         │
    │         ├──→ (1) EstanciaHospitalaria
    │         │         └──→ (n) Diagnostico
    │         │
    │         └──→ (n) Encuentro
    │
    ├──→ (n) Encuentro
    │         ├──→ (1) ExamenRegional
    │         ├──→ (n) SignosVitales
    │         └──→ (n) ImpresionDiagnostica
    │
    └──→ (n) Antecedente

Usuario
    ├──→ (n) Admision
    ├──→ (n) Encuentro
    └──→ (n) AuditLog
```

---

## 📊 Índices

| Modelo | Campo | Propósito |
|--------|-------|-----------|
| Paciente | ci | Búsqueda rápida por cédula |
| Paciente | nroHistoria | Búsqueda por número de historia |
| Encuentro | pacienteId, fecha | Encuentros por paciente y fecha |
| Admision | pacienteId | Admisiones por paciente |
| ImpresionDiagnostica | codigoCie | Búsqueda por código CIE |
| AuditLog | tabla, usuarioId | Auditoría por tabla y usuario |

---

## 📝 Convenciones Usadas

### **Campos Temporales**
- `createdAt` - Fecha de creación (auto-timestamp)
- `updatedAt` - Última actualización (auto-timestamp)
- `registradoEn` - Cuando se registró (timestamp)

### **Tipos de Datos**
- `BigInt` - IDs y números grandes
- `String` - Texto (con límite @db.VarChar)
- `DateTime` - Fechas y horas
- `Decimal` - Números decimales (temperatura, etc)
- `Json` - Datos complejos (auditoría)

### **Relaciones**
- `@relation` - Define relación
- `onDelete: Cascade` - Borra registros relacionados
- `@unique` - Única relación 1:1

---

## 🔄 Migraciones

Las migraciones versionan cambios del schema:

```bash
# Crear migración nueva
npm run db:migrate:dev --name "descripcion"

# Ver historial
ls prisma/migrations/
```

---

## 📚 Recursos

- [Prisma Data Model](https://www.prisma.io/docs/concepts/components/prisma-schema/data-model)
- [Relations](https://www.prisma.io/docs/concepts/relations/relations)
- [Field Types](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#field-types)

---

**Versión:** 1.0
**Última actualización:** 10 Nov 2025
**Modelos:** 12
**Relaciones:** 18+
