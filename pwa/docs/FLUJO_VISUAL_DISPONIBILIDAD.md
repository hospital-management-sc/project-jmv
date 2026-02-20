# 📊 Flujo Visual - Sistema de Disponibilidad de Médicos

**Documento:** Diagrama de flujos, interacciones y arquitectura  
**Audiencia:** Todos los stackeholders (Devs, Product, Médicos)  

---

## 1️⃣ FLUJO DE USUARIO - "Generar Cita Médica"

### Antes (Actual - Sin Validación)
```
┌─────────────────────────────────────────────────────────┐
│ FLUJO ACTUAL - Sin Validación de Disponibilidad         │
└─────────────────────────────────────────────────────────┘

1. Admin: Buscar Paciente (CI)
   └─→ ✅ Paciente encontrado

2. Admin: Seleccionar Especialidad
   └─→ ✅ 15 especialidades disponibles

3. Admin: Ingresar Fecha
   └─→ ✅ Input date simple

4. Admin: Ingresar Hora
   └─→ ✅ Input time simple

5. Admin: Seleccionar Médico (OPCIONAL)
   └─→ ⚠️  Input text libre = PROBLEMA

6. Admin: Click "Programar Cita"
   └─→ Backend: Crear cita SIN validar disponibilidad
   └─→ ❌ RIESGO: Médico sobrecargado

   
┌─────────────────────────────────────────────────────────┐
│ PROBLEMAS IDENTIFICADOS:                                │
│ • No hay médicos mostrados por especialidad             │
│ • No se valida si el médico atiende ese día            │
│ • No se valida si el médico tiene capacidad            │
│ • Posibilidad de sobrecapacidad en jornada             │
└─────────────────────────────────────────────────────────┘
```

### Después (Propuesto - Con Validación)
```
┌─────────────────────────────────────────────────────────┐
│ FLUJO MEJORADO - Con Validación de Disponibilidad       │
└─────────────────────────────────────────────────────────┘

1. Admin: Buscar Paciente (CI)
   └─→ ✅ Paciente encontrado

2. Admin: Seleccionar Especialidad
   └─→ 🔄 Frontend: GET /api/medicos/especialidad/:especialidad
   └─→ ✅ Backend: Retorna lista de médicos + horarios
   └─→ ✅ Select se llena dinámicamente

3. Admin: Seleccionar Médico
   └─→ ✅ Select con médicos filtrados
   └─→ 📋 Muestra nombre y horarios disponibles

4. Admin: Seleccionar Fecha
   └─→ 🔄 Frontend: GET /api/medicos/:medicoId/disponibilidad?fecha=YYYY-MM-DD
   └─→ ✅ Backend: Valida
       • ¿Médico atiende ESE DÍA?
       • ¿Médico tiene CAPACIDAD disponible?
   └─→ Frontend: Muestra indicador visual
       ✅ "7/15 espacios disponibles" (verde)
       ❌ "No atiende viernes - Próximas fechas: Lunes, Martes" (rojo)

5. Admin: Ingresar Hora
   └─→ ✅ Input time
   └─→ 📋 Valida que esté en horario del médico

6. Admin: Click "Programar Cita"
   └─→ 🔄 POST /api/citas con validación COMPLETA
   └─→ Backend valida:
       ✅ Paciente existe
       ✅ Médico existe
       ✅ Médico atiende la especialidad
       ✅ Médico atiende ESE día
       ✅ Hora está en rango
       ✅ Hay CAPACIDAD disponible
   
   SI TODO ES VÁLIDO:
   └─→ ✅ Cita creada exitosamente
   └─→ Frontend: "✅ Cita programada 25/01/2026 a las 10:30"
   └─→ Disponibilidad actualizada: "6/15 espacios"
   
   SI HAY ERROR:
   └─→ ❌ Error específico + sugerencias
   └─→ "El médico alcanzó capacidad máxima el 25/01"
   └─→ "Próximas fechas disponibles: 26/01 (12 espacios), 27/01 (15 espacios)"

┌─────────────────────────────────────────────────────────┐
│ MEJORAS LOGRADAS:                                       │
│ ✅ Médicos mostrados dinámicamente                      │
│ ✅ Validación de horarios (qué días atienden)          │
│ ✅ Validación de capacidad (cuántos pacientes máx)     │
│ ✅ UX clara con feedback visual en tiempo real         │
│ ✅ Prevención de sobrecapacidad                         │
└─────────────────────────────────────────────────────────┘
```

---

## 2️⃣ DIAGRAMA DE INTERACCIÓN - Frontend ↔ Backend

```
┌──────────────────────────┐                ┌──────────────────────────┐
│                          │                │                          │
│   FRONTEND (React)       │                │  BACKEND (Node.js)       │
│ CreateAppointmentForm    │                │  Controllers + Services  │
│                          │                │                          │
└──────────────────────────┘                └──────────────────────────┘
           │                                              │
           │                                              │
    ┌──────▼──────┐                              ┌────────▼─────────┐
    │ Especialidad │                             │ GET /medicos/:    │
    │  Selecciona  │─────────────────────────→   │ especialidad      │
    └──────────────┘                             │                   │
           │                                      └────────┬─────────┘
           │                                              │
           │                            ┌────────────────▼──────────┐
           │                            │ Query BD:                 │
           │                            │ - HorarioMedico           │
           │                            │ - WHERE especialidad=XYZ  │
           │                            │ - GROUP BY usuarioId      │
           │                            └────────┬───────────────────┘
           │                                     │
           │  ┌──────────────────────────────────▼──────┐
           │  │ [{                                       │
           │  │   id: 5,                                │
           │  │   nombre: "Dr. Juan Pérez",           │
           │  │   horarios: [                          │
           │  │     { diaSemana: 0, horaInicio, ... }, │
           │  │     { diaSemana: 1, horaInicio, ... }  │
           │  │   ]                                    │
           │  │ }]                                     │
           │  └──────────────────────────────┬──────────┘
           │                                  │
    ┌──────▼──────────┐             ┌────────▼────────────┐
    │ Select Médico   │             │ Llena select con    │
    │ (populate list) │◄────────────│ lista de médicos    │
    └──────┬──────────┘             └─────────────────────┘
           │
    ┌──────▼──────┐                ┌──────────────────────┐
    │ Fecha        │                │ GET /medicos/:medico │
    │  Selecciona  │───────────────→│ /disponibilidad      │
    └──────────────┘                │                      │
           │                         └────────┬─────────────┘
           │                                  │
           │                 ┌────────────────▼──────────┐
           │                 │ Servicio:                 │
           │                 │ validarDisponibilidad()   │
           │                 │ - ¿Atiende ese día?       │
           │                 │ - Contar citas del día    │
           │                 │ - Capacidad restante?     │
           │                 └────────┬───────────────────┘
           │                          │
    ┌──────▼──────────────┐ ┌────────▼────────────────┐
    │ Muestra:            │ │ {                       │
    │ ✅/❌ Disponible    │ │   atiendeSeDia: true,   │
    │ 7/15 espacios       │ │   horaInicio: "09:00",  │
    │ O sugerencias       │ │   capacidadTotal: 15,   │
    └──────────────────────┘ │   citasYaProgramadas: 8 │
                             │ }                       │
                             └─────────────────────────┘
           │
    ┌──────▼──────┐                ┌──────────────────┐
    │ Hora         │                │ POST /citas      │
    │ Ingresa      │───────────────→│                  │
    └──────────────┘                │ VALIDAR:         │
           │                        │ - Médico existe  │
           │                        │ - Atiende esp.   │
           │                        │ - Atiende día    │
           │                        │ - Hora en rango  │
           │                        │ - Capacidad      │
           │                        └────────┬─────────┘
           │                                 │
    ┌──────▼──────────────┐    ┌────────────▼─────────┐
    │ Click "Programar"   │    │ SI TODO VÁLIDO:      │
    │                     │    │ INSERT INTO citas    │
    │ (validaciones       │    │ RETURN 201 + datos   │
    │  frontend)          │    └──────┬────────────────┘
    │                     │           │
    │                     │    ┌──────▼──────────────┐
    └─────────────────────┘    │ {                  │
                               │   id: 456,         │
                               │   estado: "PROG",  │
                               │   medico: {...}    │
                               │ }                  │
                               └──────┬─────────────┘
                                      │
                           ┌──────────▼──────────┐
                           │ Frontend:           │
                           │ ✅ Cita creada      │
                           │ Actualiza lista     │
                           │ Limpia formulario   │
                           └─────────────────────┘
```

---

## 3️⃣ MODELO DE DATOS - Relaciones

```
┌────────────────────────────────────────────────────────────────┐
│ BASE DE DATOS - Tablas y Relaciones                            │
└────────────────────────────────────────────────────────────────┘

    ┌─────────────────────┐
    │  Usuario            │
    ├─────────────────────┤
    │ id (PK)             │
    │ nombre              │ 1 ─────────┐
    │ email               │            │ (MEDICO)
    │ rol (MEDICO/ADMIN)  │            │
    │                     │            │
    └─────────────────────┘            │
              ▲                         │
              │                         │
              │                         │
              │                    ┌────▼────────────────────┐
              │ FK                 │  HorarioMedico (NUEVO)  │
              │                    ├─────────────────────────┤
    ┌─────────┴──────────┐         │ id (PK)                 │
    │   Cita             │         │ usuarioId (FK) ──────┐  │
    ├────────────────────┤         │ especialidad        │  │
    │ id (PK)            │         │ diaSemana (0-4)     │  │
    │ pacienteId (FK)    │◄────┐   │ horaInicio (HH:MM)  │  │
    │ medicoId (FK)  ────┤─┐   │   │ horaFin (HH:MM)     │  │
    │ fechaCita          │ │   │   │ capacidadPorDia     │  │
    │ horaCita           │ │   │   │ activo (boolean)    │  │
    │ especialidad       │ │   │   │                     │  │
    │ motivo             │ │   │   └─────────────────────┘  │
    │ estado (PROGRAMADA)│ │   │                             │
    │                    │ │   └─ Médico ATIENDE:            │
    └────────────────────┘ │      • Especialidades           │
              ▲            │      • Días: L-V                │
              │            │      • Horas: inicio-fin        │
              │ FK         │      • Máx pacientes/día        │
              │            │                                 │
    ┌─────────┴──────────┐ │                                 │
    │  Paciente          │ │                                 │
    ├────────────────────┤ │                                 │
    │ id (PK)            │─┘                                 │
    │ nroHistoria        │                                   │
    │ apellidosNombres   │                                   │
    │ ci (UNIQUE)        │                                   │
    │ ...otros campos    │                                   │
    └────────────────────┘                                   │

RELACIONES CLAVE:
  • 1 Usuario (Médico) → N HorarioMedico
  • 1 Usuario (Médico) → N Cita (medicoId)
  • 1 Paciente → N Cita
  
ÍNDICES IMPORTANTES:
  • HorarioMedico: (usuarioId, especialidad, diaSemana)
  • Cita: (medicoId, fechaCita, estado)
  • Cita: (pacienteId, estado)
```

---

## 4️⃣ ESTADO DE LA APLICACIÓN (React)

```
CreateAppointmentForm Component State:
┌────────────────────────────────────────────────────────────┐
│                                                             │
│  const [selectedPatient, setSelectedPatient] = null        │
│  const [appointmentData, setAppointmentData] = {           │
│    fecha: "2026-01-25",                                    │
│    hora: "10:30",                                          │
│    especialidad: "Medicina Interna",                       │
│    medico: "5",  ← NUEVO: ID del médico                   │
│    motivo: "Consulta"                                      │
│  }                                                         │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ NUEVOS ESTADOS:                                     │  │
│  ├─────────────────────────────────────────────────────┤  │
│  │                                                     │  │
│  │ const [medicosDisponibles, setMedicosDisponibles]  │  │
│  │   = []  // [{id, nombre, horarios}, ...]           │  │
│  │                                                     │  │
│  │ const [loadingMedicos, setLoadingMedicos]           │  │
│  │   = false                                           │  │
│  │                                                     │  │
│  │ const [disponibilidadMedico, setDisponibilidad]    │  │
│  │   = null  // { atiendeSeDia, espacios, ... }       │  │
│  │                                                     │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                             │
└────────────────────────────────────────────────────────────┘

FLUJO DE CAMBIOS DE ESTADO:
┌─────────────────┐
│ especialidad    │
│   seleccionada  │
└────────┬────────┘
         │
         ▼
    useEffect() ─→ cargarMedicosEspecialidad()
         │
         ├─→ setLoadingMedicos(true)
         │
         ├─→ fetch GET /api/medicos/especialidad/:esp
         │
         ├─→ setMedicosDisponibles([...])
         │
         └─→ setLoadingMedicos(false)
         
         
┌────────────────────┐
│ medico + fecha     │
│   seleccionados    │
└────────┬───────────┘
         │
         ▼
    useEffect() ─→ validarDisponibilidadMedico()
         │
         ├─→ fetch GET /api/medicos/:id/disponibilidad
         │
         ├─→ setDisponibilidadMedico({...})
         │
         ├─→ Actualizar errors si aplica
         │
         └─→ UI se re-renderiza automáticamente
```

---

## 5️⃣ VALIDACIONES - Árbol de Decisión

```
USUARIO INTENTA CREAR CITA
│
├─ ¿Paciente existe?
│  ├─ NO → ❌ "Paciente no encontrado"
│  └─ SÍ ↓
│
├─ ¿Médico existe?
│  ├─ NO → ❌ "Médico no existe"
│  └─ SÍ ↓
│
├─ ¿Médico ATIENDE la especialidad?
│  ├─ NO → ❌ "Médico no atiende Medicina Interna"
│  │       Sugerir: "Médicos disponibles: Dr. X, Dra. Y"
│  └─ SÍ ↓
│
├─ ¿Médico ATIENDE el día seleccionado?
│  ├─ NO (ej: viernes) → ❌ "Médico no atiende viernes"
│  │                      Sugerir: "Próximas fechas: Lunes, Martes..."
│  └─ SÍ ↓
│
├─ ¿Hora está en rango [horaInicio, horaFin]?
│  ├─ NO → ❌ "Médico atiende 09:00-17:00"
│  └─ SÍ ↓
│
├─ ¿Médico tiene CAPACIDAD disponible?
│  │  (citasYaProgramadas < capacidadPorDia)
│  ├─ NO → ❌ "Médico alcanzó capacidad máxima (15/15)"
│  │        Sugerir: "Próximas fechas: 26/01 (12 espacios)..."
│  └─ SÍ ↓
│
└─ ✅ CITA CREADA EXITOSAMENTE
   └─ Actualizar UI
   └─ Mostrar: "Cita programada para 25/01/2026 a las 10:30"
```

---

## 6️⃣ TIMELINE - Gantt Simplificado

```
SEMANA 1:
┌─────────────────────────────────────────────────────┐
│ Día 1-2   │ Backend Infrastructure                  │
│ ·         │ [████░░░░░░] Migrations, Schema        │
│ ·         │                                          │
│ Día 3-4   │ Backend Services & Endpoints           │
│ ·         │ [████████░░] Lógica de validación      │
│ ·         │                                          │
│ Día 1-3   │ Frontend Logic                         │
│ ·         │ [████░░░░░░] States, Effects           │
│ ·         │                                          │
│ Día 4-5   │ Frontend UI                            │
│ ·         │ [███░░░░░░░] Componentes visuales      │
│ ·         │                                          │
│ Día 6-9   │ Testing, Integration, Docs             │
│ ·         │ [██████░░░░] Testing y refinement      │
└─────────────────────────────────────────────────────┘

TOTAL: 9 días hábiles aprox.
```

---

## 7️⃣ CASOS DE USO PRINCIPALES

### Caso 1: Cita Exitosa
```
Actor: Admin del Hospital
Objetivo: Programar cita para paciente

Paso 1: Buscar paciente
  Admin ingresa CI: V-12345678
  Sistema: ✅ "Juan Pérez encontrado"

Paso 2: Seleccionar especialidad
  Admin elige: "Medicina Interna"
  Sistema: 🔄 Carga médicos...
           ✅ Muestra: Dr. Juan Pérez, Dra. María López

Paso 3: Seleccionar médico
  Admin elige: "Dr. Juan Pérez"
  
Paso 4: Seleccionar fecha
  Admin elige: 25/01/2026 (sábado... no, 25 es lunes)
  Sistema: ✅ "Disponible: Lunes, 09:00-17:00"
           "Espacios: 7/15"

Paso 5: Ingresar hora
  Admin ingresa: 10:30
  
Paso 6: Ingresar motivo
  Admin ingresa: "Consulta de rutina"
  
Paso 7: Enviar
  Admin click "Programar Cita"
  Sistema: ✅ Cita #456 programada
           "25/01/2026 a las 10:30"

Resultado: ✅ ÉXITO
```

### Caso 2: Sin Disponibilidad
```
Actor: Admin del Hospital
Objetivo: Programar cita pero no hay disponibilidad

Paso 1-3: [Como en Caso 1]

Paso 4: Seleccionar fecha
  Admin elige: 25/01/2026
  Sistema: ✅ "Disponible: Lunes, 09:00-17:00"
           "Espacios: 0/15"  ← SIN ESPACIOS

Paso 5: Intenta enviar
  Sistema: ❌ "El médico alcanzó capacidad máxima"
           "Próximas fechas disponibles:"
           "• Martes 26/01 (12 espacios)"
           "• Miércoles 27/01 (15 espacios)"

Resultado: ❌ RECHAZADA + Sugerencias alternativas
```

### Caso 3: Médico no Atiende ese Día
```
Actor: Admin del Hospital
Objetivo: Programar cita para viernes

Paso 1-3: [Como en Caso 1]

Paso 4: Seleccionar fecha
  Admin elige: 31/01/2026 (viernes)
  Sistema: ❌ "Este médico no atiende viernes"
           "Días disponibles:"
           "• Lunes (10/15)"
           "• Martes (15/15)"
           "• Miércoles (8/15)"
           "• Jueves (14/15)"

Resultado: ❌ RECHAZADA + Alternativas de días
```

---

## 8️⃣ MÉTRICAS Y MONITOREO

```
Después de implementar, monitorear:

PERFORMANCE:
  • Tiempo de carga médicos: < 500ms
  • Tiempo de validación disponibilidad: < 300ms
  • Tiempo de creación cita: < 1000ms
  
NEGOCIO:
  • % de citas exitosas (vs rechazadas)
  • Tiempo promedio de cita/admin (debe bajar)
  • Satisfacción admin con disponibilidad
  
ERRORES:
  • % de requests 409 (sin disponibilidad)
  • % de requests 400 (parámetros inválidos)
  • Logs de excepciones no esperadas
  
DATOS:
  • Promedio citas/médico/día
  • Rango de capacidad utilizada (%)
  • Especialidades más demandadas
```

---

## 9️⃣ PREGUNTAS FRECUENTES (FAQ)

### P1: ¿Qué pasa si hace overbooking en la BD directamente?
**R:** Se debe mantener validación en aplicación. Para datos históricos, ejecutar script de validación.

### P2: ¿Se puede cambiar especialidad luego de crear cita?
**R:** No, la especialidad es inmutable una vez creada la cita (para auditoría).

### P3: ¿Cómo manejar urgencias que reservan espacio?
**R:** Crear tipo de cita "URGENCIA" que no cuenta en capacidad, o reducir capacidad X% por urgencias.

### P4: ¿Qué si un médico no viene?
**R:** Marcar cita como "CANCELADA" o "NO_ASISTIO", libera espacio para otros.

### P5: ¿Sincronización con calendario externo (Outlook/Google)?
**R:** Out of scope para v1. Considerar v2 si es crítico.

### P6: ¿Múltiples especialidades por médico?
**R:** Soportado. Un médico puede tener HorarioMedico para varias especialidades.

---

## 🔟 ROLLOUT PLAN

```
SEMANA DE IMPLEMENTACIÓN:
  L-M-X: Desarrollo y testing interno
  J:     QA testing + UAT con personal hospital
  V:     Feedback + fixes rápidos

POST-IMPLEMENTACIÓN:
  Semana 2-3: Monitoreo intenso en producción
  Semana 4+:  Mejoras basadas en feedback real
```

---

**Documento Versión:** 1.0  
**Última actualización:** 22 Enero 2026  
**Aprobado por:** [Nombre PM/CTO]
