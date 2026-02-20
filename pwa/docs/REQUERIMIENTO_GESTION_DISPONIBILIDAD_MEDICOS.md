# Requerimiento: Sistema de Disponibilidad y Horarios de Médicos

**Versión:** 1.0  
**Fecha:** Enero 22, 2026  
**Prioridad:** Alta  
**Equipo Asignado:** 2 Desarrolladores  
**Tipo:** Backend + Frontend Integration  

---

## 📋 Resumen Ejecutivo

Actualmente, el formulario de "Generar Cita" permite al personal administrativo crear citas sin considerar:
1. Los médicos disponibles por especialidad
2. Los horarios de atención de cada médico (días específicos)
3. La capacidad limitada de pacientes por médico por jornada

Este requerimiento busca implementar un **sistema robusto de disponibilidad y horarios médicos** que asegure:
- Que las citas se asignen a médicos calificados en la especialidad solicitada
- Que se respete el calendario de atención de cada médico
- Que no se exceda la capacidad máxima de pacientes por jornada

---

## 🎯 Objetivos

### Backend
- Crear modelos de datos para almacenar horarios y disponibilidad de médicos
- Implementar validación de disponibilidad al crear citas
- Exponer endpoints que retornen médicos y espacios disponibles por especialidad y fecha

### Frontend
- Mostrar dinámicamente médicos según la especialidad seleccionada
- Indicar disponibilidad en tiempo real
- Validar antes de enviar la cita al backend
- Mejorar UX con feedback visual sobre disponibilidad

---

## 📊 Análisis del Flujo Actual

### Flujo Existente
```
1. Admin busca paciente (CI) ✅
2. Admin selecciona especialidad ✅
3. Admin ingresa fecha y hora ✅
4. Admin selecciona médico (OPCIONAL - no usa especialidad) ❌
5. Se guarda cita en BD (sin validación de disponibilidad) ❌
```

### Flujo Deseado
```
1. Admin busca paciente (CI) ✅
2. Admin selecciona especialidad ✅
3. Backend retorna lista de médicos para esa especialidad
4. Admin selecciona médico + fecha ✅ NUEVO
5. Backend valida:
   - Médico atiende ese día ✅ NUEVO
   - Médico tiene capacidad ✅ NUEVO
6. Se retorna hora disponible O se permite seleccionar de opciones ✅ NUEVO
7. Se guarda cita con validaciones ✅ MEJORADO
```

---

## 🗄️ Cambios en Modelo de Datos

### Tabla: `HorarioMedico` (NUEVA)

Almacena los horarios de atención de cada médico.

```prisma
model HorarioMedico {
  id              Int       @id @default(autoincrement())
  usuarioId       Int       // Médico (FK a Usuario)
  especialidad    String    @db.VarChar(100) // Especialidad que atiende
  diaSemana       Int       // 0=Lunes, 1=Martes, ... 4=Viernes
  horaInicio      String    @db.VarChar(8)  // HH:MM formato militar
  horaFin         String    @db.VarChar(8)  // HH:MM formato militar
  capacidadPorDia Int       // Máx. pacientes por jornada (ej: 15)
  activo          Boolean   @default(true)
  createdAt       DateTime  @default(now()) @db.Timestamptz()
  updatedAt       DateTime  @updatedAt @db.Timestamptz()

  // Relaciones
  usuario         Usuario   @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@index([usuarioId])
  @@index([especialidad])
  @@index([diaSemana])
  @@unique([usuarioId, especialidad, diaSemana]) // No duplicar
}
```

### Tabla: `Cita` (MODIFICAR)

Se debe garantizar que `medicoId` sea requerido (no opcional) cuando se crea una cita.

```prisma
model Cita {
  id                  Int    @id @default(autoincrement())
  pacienteId          Int
  medicoId            Int    // ⚠️ CAMBIO: Pasar a requerido (no nullable)
  fechaCita           DateTime  @db.Date
  horaCita            String?   @db.VarChar(8)
  especialidad        String    @db.VarChar(100)
  motivo              String?   @db.VarChar(500)
  estado              String    @default("PROGRAMADA") @db.VarChar(50)
  notas               String?   @db.Text
  recordatorioEnviado Boolean   @default(false)
  createdAt           DateTime  @default(now()) @db.Timestamptz()
  updatedAt           DateTime  @updatedAt @db.Timestamptz()

  // Relaciones
  paciente Paciente @relation("CitasPaciente", fields: [pacienteId], references: [id], onDelete: Cascade)
  medico   Usuario  @relation("CitasMedico", fields: [medicoId], references: [id])

  @@index([pacienteId])
  @@index([medicoId])
  @@index([fechaCita])
  @@index([estado])
}
```

### Tabla: `Usuario` (VERIFICAR)

Asegurarse que exista un campo que identifique si el usuario es médico:

```prisma
model Usuario {
  id          Int    @id @default(autoincrement())
  // ... otros campos
  rol         String @db.VarChar(50) // MEDICO, ADMIN, COORDINADOR, etc.
  nombre      String @db.VarChar(200)
  email       String @unique @db.VarChar(200)
  // ... otros campos
  
  horarios    HorarioMedico[] @relation("UsuarioHorarios") // NUEVA RELACIÓN
  citasMedico Cita[] @relation("CitasMedico")
}
```

---

## 🔄 Endpoints Backend (Nuevos y Modificados)

### 1. **GET `/api/medicos/especialidad/:especialidad`**

Retorna lista de médicos que atienden una especialidad.

**Parámetros:**
- `especialidad` (path): Nombre de la especialidad (ej: "Medicina Interna")

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "nombre": "Dr. Juan Pérez",
      "email": "juan.perez@hospital.com",
      "especialidad": "Medicina Interna",
      "horarios": [
        {
          "id": 12,
          "diaSemana": 0,
          "horaInicio": "09:00",
          "horaFin": "17:00",
          "capacidadPorDia": 15,
          "activo": true
        },
        {
          "id": 13,
          "diaSemana": 2,
          "horaInicio": "09:00",
          "horaFin": "15:00",
          "capacidadPorDia": 12,
          "activo": true
        }
      ]
    },
    {
      "id": 6,
      "nombre": "Dra. María López",
      "email": "maria.lopez@hospital.com",
      "especialidad": "Medicina Interna",
      "horarios": [/* ... */]
    }
  ]
}
```

**Posibles Errores:**
- 404: Especialidad no encontrada

---

### 2. **GET `/api/medicos/:medicoId/disponibilidad`**

Retorna disponibilidad de un médico en una fecha específica.

**Parámetros:**
- `medicoId` (path): ID del médico
- `fecha` (query): Fecha en formato YYYY-MM-DD (ej: ?fecha=2026-01-25)
- `especialidad` (query): Especialidad (ej: ?especialidad=Medicina%20Interna)

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "medicoId": 5,
    "fecha": "2026-01-25",
    "diaSemana": 6,
    "atiendeSeDia": true,
    "horaInicio": "09:00",
    "horaFin": "17:00",
    "capacidadTotal": 15,
    "citasYaProgramadas": 8,
    "espaciosDisponibles": 7,
    "diasDisponibles": [
      {
        "dia": "Lunes",
        "fecha": "2026-01-26",
        "disponible": true,
        "espacios": 12
      },
      {
        "dia": "Martes",
        "fecha": "2026-01-27",
        "disponible": true,
        "espacios": 15
      }
      // ... resto de días
    ]
  }
}
```

**Posibles Errores:**
- 400: Parámetros inválidos
- 404: Médico no encontrado

---

### 3. **POST `/api/citas`** (MODIFICAR)

Se modifica el endpoint existente para requerir `medicoId` y validar disponibilidad.

**Body (Actualizado):**
```json
{
  "pacienteId": 123,
  "medicoId": 5,
  "fechaCita": "2026-01-25",
  "horaCita": "10:30",
  "especialidad": "Medicina Interna",
  "motivo": "Consulta de rutina",
  "notas": "Paciente diabético"
}
```

**Validaciones Backend:**
- ✅ Paciente existe
- ✅ Médico existe
- ✅ **Médico atiende la especialidad especificada**
- ✅ **Médico atiende el día de la cita**
- ✅ **Hora está dentro del horario del médico**
- ✅ **Médico tiene capacidad disponible ese día**
- ✅ No hay cita duplicada (mismo paciente, médico, fecha)

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Cita programada exitosamente",
  "data": {
    "id": 456,
    "pacienteId": 123,
    "medicoId": 5,
    "medicoNombre": "Dr. Juan Pérez",
    "especialidad": "Medicina Interna",
    "fechaCita": "2026-01-25",
    "horaCita": "10:30",
    "estado": "PROGRAMADA",
    "createdAt": "2026-01-22T14:30:00Z"
  }
}
```

**Posibles Errores:**
- 400: Validación fallida (especificar cuál)
- 404: Paciente/Médico no existe
- 409: Conflicto (médico no disponible, no tiene capacidad)

**Ejemplos de Mensajes de Error:**
```json
{
  "success": false,
  "message": "El médico no atiende la especialidad seleccionada"
}
```

```json
{
  "success": false,
  "message": "El médico no atiende los viernes. Días disponibles: Lunes, Miércoles, Jueves"
}
```

```json
{
  "success": false,
  "message": "El médico ha alcanzado su capacidad máxima (15 pacientes) para el 2026-01-25. Espacios disponibles: Lunes 2026-01-26 (12 espacios)"
}
```

---

### 4. **GET `/api/medicos/especialidad/:especialidad/disponibilidad`** (BONUS)

Retorna matriz de disponibilidad para todos los médicos de una especialidad en los próximos X días.

**Parámetros:**
- `especialidad` (path)
- `dias` (query, optional): Número de días a mostrar (default: 7)

**Respuesta:**
```json
{
  "success": true,
  "especialidad": "Medicina Interna",
  "data": [
    {
      "medicoId": 5,
      "medicoNombre": "Dr. Juan Pérez",
      "disponibilidad": {
        "2026-01-25": { "disponible": true, "espacios": 7, "horaInicio": "09:00", "horaFin": "17:00" },
        "2026-01-26": { "disponible": false, "espacios": 0 },
        "2026-01-27": { "disponible": true, "espacios": 10 }
      }
    },
    {
      "medicoId": 6,
      "medicoNombre": "Dra. María López",
      "disponibilidad": {
        "2026-01-25": { "disponible": true, "espacios": 15 },
        "2026-01-26": { "disponible": true, "espacios": 12 }
      }
    }
  ]
}
```

---

## 🎨 Cambios en Frontend

### Componente: `CreateAppointmentForm.tsx` (Modificaciones)

#### Paso 1: Estado Adicional
```tsx
// Después de especialidades
const [medicosDisponibles, setMedicosDisponibles] = useState<any[]>([])
const [medicos, setMedicos] = useState<any[]>([])
const [disponibilidadMedico, setDisponibilidadMedico] = useState<any>(null)
const [loadingMedicos, setLoadingMedicos] = useState(false)
```

#### Paso 2: Effect - Cargar Médicos al Cambiar Especialidad
```tsx
// Agregar este useEffect
useEffect(() => {
  if (appointmentData.especialidad) {
    cargarMedicosEspecialidad(appointmentData.especialidad)
  } else {
    setMedicosDisponibles([])
  }
}, [appointmentData.especialidad])

const cargarMedicosEspecialidad = async (especialidad: string) => {
  setLoadingMedicos(true)
  try {
    const response = await fetch(
      `${API_BASE_URL}/medicos/especialidad/${encodeURIComponent(especialidad)}`
    )
    const result = await response.json()

    if (result.success) {
      setMedicosDisponibles(result.data || [])
    } else {
      setSearchError('No se pudieron cargar los médicos')
    }
  } catch (err: any) {
    console.error('Error al cargar médicos:', err)
    setSearchError('Error al cargar médicos disponibles')
  } finally {
    setLoadingMedicos(false)
  }
}
```

#### Paso 3: Effect - Validar Disponibilidad Médico al Cambiar Fecha
```tsx
// Agregar este useEffect
useEffect(() => {
  if (appointmentData.medico && appointmentData.fecha) {
    validarDisponibilidadMedico()
  }
}, [appointmentData.fecha, appointmentData.medico])

const validarDisponibilidadMedico = async () => {
  try {
    const medicoId = appointmentData.medico
    const fecha = appointmentData.fecha

    const response = await fetch(
      `${API_BASE_URL}/medicos/${medicoId}/disponibilidad?fecha=${fecha}&especialidad=${encodeURIComponent(appointmentData.especialidad)}`
    )
    const result = await response.json()

    if (result.success) {
      setDisponibilidadMedico(result.data)

      if (!result.data.atiendeSeDia) {
        setErrors({
          ...errors,
          fecha: `El médico no atiende ${obtenerDiaSemana(result.data.diaSemana)}`
        })
      } else if (result.data.espaciosDisponibles <= 0) {
        setErrors({
          ...errors,
          fecha: 'El médico no tiene disponibilidad ese día'
        })
      }
    }
  } catch (err: any) {
    console.error('Error al validar disponibilidad:', err)
  }
}
```

#### Paso 4: Reemplazar Campo "Médico"

Cambiar de input text a select con médicos cargados:

```tsx
<div className={styles["form-group"]}>
  <label>Médico * <span className={styles["required"]}>Requerido</span></label>
  {appointmentData.especialidad ? (
    <>
      {loadingMedicos ? (
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Cargando médicos...</p>
      ) : medicosDisponibles.length > 0 ? (
        <select
          required
          value={appointmentData.medico}
          onChange={(e) => {
            setAppointmentData({...appointmentData, medico: e.target.value})
            setErrors({...errors, medico: ''})
          }}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '0.375rem',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
          }}
        >
          <option value="">Seleccione médico...</option>
          {medicosDisponibles.map((medico: any) => (
            <option key={medico.id} value={medico.id}>
              {medico.nombre}
            </option>
          ))}
        </select>
      ) : (
        <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>
          No hay médicos disponibles para esta especialidad
        </p>
      )}
      {errors.medico && <span className={styles["error-message"]}>{errors.medico}</span>}
    </>
  ) : (
    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
      Selecciona una especialidad primero
    </p>
  )}
</div>
```

#### Paso 5: Mostrar Disponibilidad Visual
```tsx
{disponibilidadMedico && appointmentData.medico && (
  <div style={{
    padding: '1rem',
    backgroundColor: disponibilidadMedico.atiendeSeDia ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    borderLeft: `3px solid ${disponibilidadMedico.atiendeSeDia ? '#10b981' : '#ef4444'}`,
    borderRadius: '0.375rem',
    marginBottom: '1rem',
    fontSize: '0.9rem'
  }}>
    {disponibilidadMedico.atiendeSeDia ? (
      <>
        <p><strong>✅ Disponible:</strong> {disponibilidadMedico.horaInicio} - {disponibilidadMedico.horaFin}</p>
        <p><strong>Espacios:</strong> {disponibilidadMedico.espaciosDisponibles}/{disponibilidadMedico.capacidadTotal}</p>
      </>
    ) : (
      <>
        <p><strong>❌ No disponible</strong> el {obtenerDiaSemana(disponibilidadMedico.diaSemana)}</p>
        <p>Próximas fechas disponibles:</p>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          {disponibilidadMedico.diasDisponibles?.slice(0, 3).map((d: any) => (
            <li key={d.fecha}>{d.dia} {d.fecha} ({d.espacios} espacios)</li>
          ))}
        </ul>
      </>
    )}
  </div>
)}
```

#### Paso 6: Validación al Enviar
```tsx
// En handleSubmit, agregar validación de médico
const newErrors: {[key: string]: string} = {}
if (!appointmentData.fecha) newErrors.fecha = 'Requerido'
if (!appointmentData.hora) newErrors.hora = 'Requerido'
if (!appointmentData.especialidad) newErrors.especialidad = 'Requerido'
if (!appointmentData.medico) newErrors.medico = 'Requerido' // NUEVO

// En citaData, incluir medicoId
const citaData = {
  pacienteId: selectedPatient.id,
  medicoId: Number(appointmentData.medico), // NUEVO - REQUERIDO
  fechaCita: appointmentData.fecha,
  horaCita: appointmentData.hora,
  especialidad: appointmentData.especialidad,
  motivo: appointmentData.motivo || null,
  notas: null,
}
```

---

## 🗂️ Plan de Implementación

### Fase 1: Backend (3-4 días)
- [ ] Crear migration para tabla `HorarioMedico`
- [ ] Actualizar migration de tabla `Cita` (medicoId requerido)
- [ ] Implementar servicio de validación de disponibilidad
- [ ] Crear endpoints GET `/api/medicos/especialidad/:especialidad`
- [ ] Crear endpoint GET `/api/medicos/:medicoId/disponibilidad`
- [ ] Modificar POST `/api/citas` con validaciones
- [ ] Crear seeds de ejemplo (médicos, horarios)
- [ ] Testing manual de endpoints

### Fase 2: Frontend (2-3 días)
- [ ] Modificar `CreateAppointmentForm.tsx` (estados, effects)
- [ ] Implementar carga dinámica de médicos
- [ ] Implementar validación de disponibilidad
- [ ] Mejorar UI con feedback visual
- [ ] Testing de flujos completos
- [ ] Validar respuestas de error

### Fase 3: Integración y Testing (1-2 días)
- [ ] Testing E2E del flujo completo
- [ ] Verificar edge cases
- [ ] Performance testing (validación en tiempo real)
- [ ] Documentación de API
- [ ] Manual de uso para personal administrativo

---

## 💾 Datos de Ejemplo para Seeding

### Médicos
```sql
-- Medicina Interna
INSERT INTO "Usuario" (nombre, email, rol) VALUES ('Dr. Juan Pérez', 'juan.perez@hospital.com', 'MEDICO');
INSERT INTO "Usuario" (nombre, email, rol) VALUES ('Dra. María López', 'maria.lopez@hospital.com', 'MEDICO');

-- Cirugía General
INSERT INTO "Usuario" (nombre, email, rol) VALUES ('Dr. Carlos Gutiérrez', 'carlos.gutierrez@hospital.com', 'MEDICO');
```

### Horarios
```sql
-- Dr. Juan Pérez - Medicina Interna
-- Lunes a Viernes, 09:00-17:00, máx 15 pacientes/día
INSERT INTO "HorarioMedico" (usuarioId, especialidad, diaSemana, horaInicio, horaFin, capacidadPorDia) 
VALUES (1, 'Medicina Interna', 0, '09:00', '17:00', 15);
INSERT INTO "HorarioMedico" (usuarioId, especialidad, diaSemana, horaInicio, horaFin, capacidadPorDia) 
VALUES (1, 'Medicina Interna', 1, '09:00', '17:00', 15);
-- ... repetir para Miércoles (2), Jueves (3), Viernes (4)

-- Dra. María López - Medicina Interna
-- Lunes, Miércoles, Viernes
INSERT INTO "HorarioMedico" (usuarioId, especialidad, diaSemana, horaInicio, horaFin, capacidadPorDia) 
VALUES (2, 'Medicina Interna', 0, '08:00', '15:00', 12);
-- ... etc.
```

---

## 🔍 Consideraciones Importantes

### Seguridad
- Validar que solo ADMIN/COORDINADOR puedan crear citas
- Validar que médicos solo vean sus propias citas
- No exponer información sensible en respuestas de error

### Performance
- Cachear horarios de médicos (actualizar cada 24h)
- Indexar queries frecuentes en BD
- Considerar caché Redis para disponibilidad real-time

### Compatibilidad
- Asegurar que el cambio a `medicoId` requerido NO rompa citas existentes
  - Opción 1: Hacer null el medicoId en citas existentes
  - Opción 2: Asignar médico automáticamente basado en especialidad
  - **Recomendación:** Validar con equipo de negocio

### Datos Existentes
- ¿Hay citas ya programadas sin médico?
- ¿Cómo migrar esas citas?
- ¿Necesita script de limpieza?

---

## 📝 Criterios de Aceptación

- [ ] Un médico NO puede tener citas sobrepasando capacidad diaria
- [ ] Un médico solo atiende las especialidades asignadas
- [ ] Un médico solo atiende los días especificados
- [ ] La hora de cita está dentro del horario del médico
- [ ] Frontend muestra médicos dinámicamente por especialidad
- [ ] Frontend valida disponibilidad antes de enviar
- [ ] Mensajes de error claros y accionables
- [ ] Respuestas incluyen sugerencias de fechas alternativas
- [ ] El personal administrativo puede ver claramente disponibilidad

---

## 📚 Referencias

- **Archivo:** `CreateAppointmentForm.tsx`
- **Rutas Backend:** `src/routes/citas.ts`
- **Controlador:** `src/controllers/citas.ts`
- **Schema Prisma:** `prisma/schema.prisma`
- **Especialidades Actuales:** 15 (Medicina Interna, Cirugía, Pediatría, etc.)

---

## ❓ Preguntas para Aclarar

Antes de iniciar, confirmar con el equipo/stakeholders:

1. **Horarios Internos:** ¿Ya hay horarios de médicos definidos en sistema físico/papel?
2. **Capacidad:** ¿Cuál es la capacidad típica por médico por día? ¿Varía por especialidad?
3. **Migración:** ¿Qué hacer con citas existentes sin médico asignado?
4. **Asignación Automática:** ¿Debería el sistema sugerir médico automáticamente o solo validar?
5. **Reserva de Espacios:** ¿Hay espacios reservados para casos de urgencia?
6. **Notificaciones:** ¿Notificar al médico cuando se le asigne una cita?

---

## 📞 Contacto y Escalaciones

- **Product Manager:** [Nombre]
- **Tech Lead:** [Nombre]
- **Stakeholder Médico:** [Nombre/Área]

Para dudas sobre requerimientos médicos o flujos operacionales, contactar con personal del hospital antes de implementar.

---

**Fin del Documento**
