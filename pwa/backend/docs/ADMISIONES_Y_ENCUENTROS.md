# Admisiones y Encuentros en el Sistema Hospitalario

## Definiciones

### **Admisiones** 
Representa cada vez que el paciente **ingresa formalmente al hospital**. Una admisión es el registro oficial de entrada al sistema hospitalario.

**Información que contiene:**
- Fecha y hora de ingreso
- Forma de ingreso (Ambulante, Ambulancia, Emergencia)
- Número de historia clínica asignado
- Habitación asignada (si aplica)
- Diagnóstico de ingreso
- Diagnóstico de egreso (cuando se da de alta)
- Fecha de alta
- Días de hospitalización
- Firma del facultativo responsable

**Ejemplo:** Si el paciente "Juana Pérez" fue admitida el 16/11/2025 por hipertensión, eso genera **1 admisión** en su historial.

---

### **Encuentros**
Son las **interacciones médicas individuales** que ocurren durante o después de una admisión. Cada consulta, evaluación o atención médica es un "encuentro".

**Tipos de encuentros:**
- Consulta externa (sin internación)
- Evaluación de emergencia
- Visita médica durante hospitalización
- Consulta de seguimiento post-alta
- Procedimientos específicos

**Información que contiene:**
- Fecha y hora del encuentro
- Tipo de encuentro
- Médico que atendió
- Notas clínicas
- Diagnósticos
- Tratamientos prescritos
- Relación con una admisión (si aplica)

---

## **Relación entre Admisiones y Encuentros**

```
PACIENTE (Juana Pérez)
│
├── Admisión #1 (16/11/2025)
│   ├── Encuentro #1: Evaluación inicial (16/11 - 08:00)
│   ├── Encuentro #2: Ronda médica (16/11 - 14:00)
│   ├── Encuentro #3: Evaluación pre-alta (18/11 - 10:00)
│   └── Alta hospitalaria (18/11)
│
├── Admisión #2 (01/12/2025)
│   ├── Encuentro #4: Emergencia (01/12 - 03:00)
│   └── Encuentro #5: Control (01/12 - 12:00)
│
└── Encuentro #6: Consulta externa (10/12 - NO tiene admisión)
```

---

## **Estructura en Prisma**

```prisma
model Paciente {
  id          Int          @id @default(autoincrement())
  // ... otros campos ...
  admisiones  Admision[]   // Lista de todas las admisiones
  encuentros  Encuentro[]  // Lista de todos los encuentros
  citas       Cita[]       // Citas programadas
}

model Admision {
  id                    Int       @id @default(autoincrement())
  pacienteId            Int
  paciente              Paciente  @relation(fields: [pacienteId], references: [id])
  fechaAdmision         DateTime
  horaAdmision          DateTime  @db.Time
  formaIngreso          String    // AMBULANTE, AMBULANCIA, EMERGENCIA
  habitacion            String?
  diagnosticoIngreso    String?
  diagnosticoEgreso     String?
  fechaAlta             DateTime?
  diasHospitalizacion   Int?
  // ... otros campos ...
}

model Encuentro {
  id              Int       @id @default(autoincrement())
  pacienteId      Int
  paciente        Paciente  @relation(fields: [pacienteId], references: [id])
  admisionId      Int?
  admision        Admision? @relation(fields: [admisionId], references: [id])
  fecha           DateTime
  tipo            String    // CONSULTA_EXTERNA, EMERGENCIA, HOSPITALIZACION, SEGUIMIENTO
  medicoId        Int?
  medico          Usuario?  @relation(fields: [medicoId], references: [id])
  notasClinicas   String?   @db.Text
  diagnostico     String?
  // ... otros campos ...
}
```

---

## **¿Para qué sirven?**

| Dato | Propósito |
|------|-----------|
| **Admisiones** | Rastrear hospitalizaciones completas, calcular estadísticas de internación, auditoría de ingresos/egresos |
| **Encuentros** | Historial médico detallado, seguimiento de tratamientos, trazabilidad de atenciones |

---

## **Flujo de Trabajo Típico**

### Caso 1: Paciente Ambulatorio (Sin internación)
1. Paciente llega a consulta externa
2. Se registra un **Encuentro** sin admisión asociada
3. El médico atiende, registra notas y diagnóstico
4. Paciente se retira el mismo día

### Caso 2: Paciente Hospitalizado
1. Paciente ingresa al hospital → Se crea una **Admisión**
2. Evaluación inicial → Se crea **Encuentro #1** asociado a la admisión
3. Ronda médica diaria → Se crea **Encuentro #2, #3, #4...**
4. Alta médica → Se actualiza la admisión con fecha de alta

### Caso 3: Paciente Recurrente
1. Primera hospitalización → **Admisión #1** con 3 encuentros
2. Alta médica y seguimiento ambulatorio → **Encuentro** sin admisión
3. Reingreso por complicación → **Admisión #2** con nuevos encuentros

---

## **Métricas y Estadísticas**

### A nivel de Paciente
- Total de admisiones: Cuántas veces ha sido hospitalizado
- Total de encuentros: Todas las atenciones médicas recibidas
- Promedio de días por hospitalización
- Fecha de última atención

### A nivel de Hospital
- Admisiones del mes/año
- Encuentros por especialidad
- Tasa de readmisión (pacientes que vuelven en < 30 días)
- Promedio de estancia hospitalaria

---

## **Estado Actual del Sistema**

**Base de datos:** Tablas creadas y relaciones establecidas
**Backend:** Endpoints para crear pacientes y citas
**Frontend:** Vista de búsqueda muestra contadores de admisiones/encuentros

**Pendiente implementar:**
- Endpoints para registrar admisiones
- Endpoints para registrar encuentros
- Vistas para crear/consultar admisiones
- Vistas para registrar encuentros médicos
- Historial clínico completo del paciente

---

## **Ejemplo Práctico**

**Paciente:** Juana Pérez (CI: V-18200100)
- **Registrado:** 16/11/2025
- **Admisiones:** 0 (solo está registrado, no ha sido hospitalizado)
- **Encuentros:** 0 (no ha tenido atenciones médicas registradas)
- **Citas programadas:** Las que se creen desde el sistema

Cuando Juana acuda a su cita y el médico la atienda, se creará su primer **Encuentro**. Si requiere hospitalización, se creará su primera **Admisión**.
