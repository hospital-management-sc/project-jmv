# Análisis del Dashboard Administrativo - Estado Actual y Roadmap

**Fecha:** 24 de noviembre de 2025  
**Dashboard:** `frontend/src/pages/AdminDashboard.tsx`

---

## 📊 Estado Actual del Dashboard

### ✅ Funcionalidades Implementadas y Operativas

#### 1. **Registrar Nuevo Paciente**
**Frontend:** ✅ Completo y funcional
- Formulario con validación de campos
- Secciones: Admisión, Datos Personales, Datos Militares, Estancia Hospitalaria
- Validaciones de formato (CI, teléfono, historia clínica)
- Cálculo automático de edad
- Integración con API backend

**Backend:** ✅ Completo y funcional
- **Endpoint:** `POST /api/pacientes`
- **Controller:** `crearPaciente()` en `pacientes.ts`
- **Funcionalidad:**
  - Validación de campos requeridos
  - Transacción para crear paciente + admisión + datos militares + estancia hospitalaria
  - Validación de CI única
  - Validación de formato de historia clínica
  - Logging de operaciones

**Estado:** ✅ **100% IMPLEMENTADO**

---

#### 2. **Generar Cita Médica**
**Frontend:** ✅ Completo y funcional
- Búsqueda de paciente por CI con autocompletado
- Selección de especialidad (8 especialidades predefinidas)
- Fecha y hora de cita
- Campo opcional de médico
- Motivo de consulta
- Muestra citas programadas del paciente

**Backend:** ✅ Completo y funcional
- **Endpoint:** `POST /api/citas`
- **Controller:** `crearCita()` en `citas.ts`
- **Endpoints adicionales:**
  - `GET /api/citas/paciente/:pacienteId` - Citas por paciente
  - `GET /api/citas/medico/:medicoId` - Citas por médico
  - `GET /api/citas/:id` - Obtener cita específica
  - `PUT /api/citas/:id` - Actualizar cita
  - `PATCH /api/citas/:id/cancelar` - Cancelar cita
  - `GET /api/citas/lista/proximas` - Listar citas próximas
  - `GET /api/citas/info/especialidades` - Obtener especialidades

**Estado:** ✅ **100% IMPLEMENTADO**

---

#### 3. **Consultar Historia Clínica**
**Frontend:** ✅ Básico implementado
- Búsqueda por CI o Nro. Historia
- Muestra datos del paciente encontrado
- Cálculo de edad
- Formateo de fecha de nacimiento (corregido recientemente)
- Muestra contadores de admisiones y encuentros
- Muestra datos militares si existen

**Backend:** ✅ Completo y funcional
- **Endpoint:** `GET /api/pacientes/search?ci=X&historia=Y`
- **Controller:** `buscarPaciente()` en `pacientes.ts`
- **Funcionalidad:**
  - Búsqueda por CI o historia clínica
  - Incluye relaciones: personalMilitar, admisiones, encuentros
  - Serialización correcta de fechas (fix reciente)

**Estado:** 🟡 **70% IMPLEMENTADO** (falta detalle de admisiones/encuentros)

---

#### 4. **Estadísticas del Dashboard**
**Frontend:** ✅ Implementado
- Total de Pacientes
- Citas Programadas Hoy
- Registros de Auditoría
- Actualización automática cada 30 segundos
- Manejo de errores

**Backend:** ✅ Implementado
- **Endpoint:** `GET /api/dashboard/stats`
- **Controller:** `getStats()` en `dashboard.ts`
- **Funcionalidad:**
  - Total de pacientes
  - Citas programadas hoy
  - Registros de auditoría
  - Caching con Redis (opcional)

**Estado:** ✅ **100% IMPLEMENTADO**

---

## 🚧 Funcionalidades Pendientes y Limitaciones

### 1. **Gestión de Admisiones** ⚠️ NO IMPLEMENTADO

**Situación actual:**
- El formulario "Registrar Nuevo Paciente" **crea automáticamente una admisión** con cada paciente nuevo
- No existe una vista independiente para **registrar admisiones de pacientes existentes**
- No hay endpoints para consultar/listar admisiones

**¿Qué falta?**

#### Backend
```typescript
// FALTA CREAR estos endpoints:
POST   /api/admisiones              // Crear nueva admisión para paciente existente
GET    /api/admisiones/:id          // Obtener admisión específica
GET    /api/admisiones/paciente/:id // Listar admisiones de un paciente
PUT    /api/admisiones/:id          // Actualizar admisión
PATCH  /api/admisiones/:id/alta     // Registrar alta del paciente
GET    /api/admisiones/activas      // Listar pacientes hospitalizados actualmente
```

#### Frontend
- Vista para **registrar admisión de paciente existente** (readmisión)
- Vista para **listar pacientes hospitalizados** (admisiones activas sin fecha de alta)
- Vista para **dar de alta a un paciente** (actualizar fechaAlta, diagnosticoEgreso, diasHosp)
- Detalle completo de admisión en "Consultar Historia Clínica"

---

### 2. **Gestión de Encuentros** ⚠️ NO IMPLEMENTADO

**Situación actual:**
- El schema de Prisma tiene el modelo `Encuentro` completo
- **No existen endpoints** para gestionar encuentros
- **No existe UI** para registrar encuentros

**¿Qué falta?**

#### Backend
```typescript
// FALTA CREAR estos endpoints:
POST   /api/encuentros              // Registrar nuevo encuentro (consulta, emergencia, etc.)
GET    /api/encuentros/:id          // Obtener encuentro específico
GET    /api/encuentros/paciente/:id // Listar encuentros de un paciente
PUT    /api/encuentros/:id          // Actualizar encuentro
GET    /api/encuentros/hoy          // Encuentros del día actual
GET    /api/encuentros/tipo/:tipo   // Encuentros por tipo (EMERGENCIA, CONSULTA, etc.)
```

#### Frontend
- Vista para **registrar encuentro** (consulta médica, emergencia, hospitalización)
- Formulario con:
  - Tipo de encuentro (EMERGENCIA, HOSPITALIZACIÓN, CONSULTA, OTRO)
  - Fecha y hora
  - Motivo de consulta
  - Enfermedad actual (descripción)
  - Procedencia
  - Nro. de cama (si aplica)
  - Relación con admisión (opcional)
- Vista para **listar encuentros del paciente** en historia clínica
- Vista para **registrar signos vitales** durante encuentro
- Vista para **registrar impresión diagnóstica**

---

### 3. **Historia Clínica Completa** 🟡 PARCIALMENTE IMPLEMENTADO

**Situación actual:**
- Búsqueda básica muestra datos demográficos
- Muestra **contadores** de admisiones/encuentros pero no el **detalle**
- No muestra el historial completo

**¿Qué falta?**

#### Frontend
- **Sección de Admisiones:**
  - Tabla con todas las admisiones del paciente
  - Fecha ingreso, forma ingreso, diagnóstico, fecha alta, días hospitalización
  - Botón para ver detalle completo
  - Estado (Activo/Alta)

- **Sección de Encuentros:**
  - Timeline o tabla con todos los encuentros
  - Fecha, tipo, médico, motivo, impresión diagnóstica
  - Signos vitales registrados
  - Botón para ver detalle completo

- **Sección de Citas:**
  - Historial de citas programadas/completadas/canceladas
  - Estado de cada cita

- **Botones de acción:**
  - "Ver Historia Completa" → Actualmente no hace nada
  - "Imprimir Resumen" → No implementado
  - "Programar Cita" → No redirige a formulario de citas

---

### 4. **Gestión de Usuarios/Personal Médico** ⚠️ NO IMPLEMENTADO

**Situación actual:**
- Sistema de autenticación existe (`auth.ts`)
- No hay vista administrativa para **gestionar usuarios**
- No se pueden **asignar médicos** en el dashboard

**¿Qué falta?**

#### Backend
```typescript
// Verificar si existen estos endpoints:
GET    /api/usuarios              // Listar usuarios (médicos, administrativos)
POST   /api/usuarios              // Crear nuevo usuario
PUT    /api/usuarios/:id          // Actualizar usuario
PATCH  /api/usuarios/:id/estado   // Activar/desactivar usuario
GET    /api/usuarios/medicos      // Listar solo médicos
GET    /api/usuarios/roles        // Obtener roles disponibles
```

#### Frontend
- Vista para **listar usuarios del sistema**
- Formulario para **crear nuevo usuario** (médico, administrativo)
- Gestión de **roles y permisos**
- Vista para **asignar médico a especialidad**

---

### 5. **Reportes y Estadísticas Avanzadas** ⚠️ NO IMPLEMENTADO

**¿Qué falta?**

#### Backend
```typescript
// Endpoints de reportes:
GET /api/reportes/admisiones-mes      // Total admisiones por mes
GET /api/reportes/especialidades-top  // Especialidades más solicitadas
GET /api/reportes/tiempo-espera       // Tiempo promedio de espera en citas
GET /api/reportes/ocupacion-camas     // Tasa de ocupación hospitalaria
GET /api/reportes/diagnosticos-top    // Diagnósticos más frecuentes
```

#### Frontend
- Dashboard con gráficos (Chart.js o Recharts)
- Filtros por fecha, especialidad, tipo
- Exportación de reportes a PDF/Excel

---

### 6. **Gestión de Auditoría** 🟡 PARCIALMENTE IMPLEMENTADO

**Situación actual:**
- El contador "Registros de Auditoría" muestra el total
- No hay vista para **consultar los logs de auditoría**

**¿Qué falta?**

#### Backend
- Ya existe el modelo `AuditoriaAcceso` en Prisma
- Verificar endpoints de consulta

#### Frontend
- Vista para **listar logs de auditoría**
- Filtros por usuario, acción, fecha
- Detalle de cada operación

---

## 🎯 Prioridades de Implementación

### **Prioridad Alta** (Funcionalidad Core)

1. **Gestión de Encuentros** (Registrar consultas/atenciones médicas)
   - Sin esto, el historial médico no tiene sentido
   - Necesario para workflow de médicos

2. **Gestión de Admisiones** (Registrar ingresos hospitalarios)
   - Completar ciclo de hospitalización
   - Necesario para reportes de ocupación

3. **Historia Clínica Completa** (Ver detalle de admisiones/encuentros)
   - Actualmente solo se ven contadores
   - Necesario para toma de decisiones médicas

### **Prioridad Media** (Operaciones administrativas)

4. **Gestión de Usuarios** (CRUD de personal médico/administrativo)
   - Necesario para asignar médicos a citas
   - Control de acceso por roles

5. **Completar Acciones de Historia Clínica** (Imprimir, Programar Cita desde historial)
   - Mejorar UX del flujo administrativo

### **Prioridad Baja** (Análisis y mejoras)

6. **Reportes y Estadísticas Avanzadas**
   - Análisis de datos, KPIs, gráficos

7. **Vista de Auditoría Detallada**
   - Consulta de logs, compliance

---

## 📋 Roadmap Sugerido

### **Sprint 1: Encuentros Médicos** (1-2 semanas)
- Backend: Crear controller y routes de encuentros
- Frontend: Vista para registrar encuentro
- Frontend: Formulario de signos vitales
- Frontend: Sección de encuentros en historia clínica

### **Sprint 2: Gestión de Admisiones** (1-2 semanas)
- Backend: Endpoints de admisiones
- Frontend: Vista para registrar admisión de paciente existente
- Frontend: Vista de pacientes hospitalizados (admisiones activas)
- Frontend: Formulario de alta médica

### **Sprint 3: Historia Clínica Completa** (1 semana)
- Frontend: Detalle de admisiones en historia clínica
- Frontend: Timeline de encuentros
- Frontend: Historial de citas
- Frontend: Implementar acciones (Imprimir, Programar Cita)

### **Sprint 4: Gestión de Usuarios** (1-2 semanas)
- Backend: Endpoints de usuarios (si no existen)
- Frontend: Vista administrativa de usuarios
- Frontend: CRUD de personal médico
- Frontend: Asignación de roles

### **Sprint 5: Reportes** (1-2 semanas)
- Backend: Endpoints de reportes
- Frontend: Dashboard con gráficos
- Frontend: Exportación de datos

---

## 🔧 Recomendaciones Técnicas

### Backend
1. **Crear controllers faltantes:**
   - `admisiones.ts`
   - `encuentros.ts`
   - `usuarios.ts` (si no existe)
   - `reportes.ts`

2. **Agregar middleware de autenticación** a todas las rutas en producción

3. **Implementar paginación** en listados largos

4. **Agregar validaciones robustas** con Zod o class-validator

### Frontend
1. **Componentizar formularios repetitivos:**
   - Formulario de búsqueda de paciente (se repite en Citas y Consulta)
   - Tabla de resultados

2. **Implementar estado global** (Context API o Zustand) para:
   - Usuario autenticado
   - Configuración del sistema
   - Caché de datos frecuentes

3. **Agregar loading states** y feedback visual en todas las operaciones

4. **Implementar manejo de errores consistente**

---

## 📊 Resumen Ejecutivo

| Área | Estado | Completitud | Prioridad |
|------|--------|-------------|-----------|
| Registro de Pacientes | ✅ Completo | 100% | - |
| Generación de Citas | ✅ Completo | 100% | - |
| Búsqueda de Pacientes | 🟡 Básico | 70% | Alta |
| Gestión de Admisiones | ❌ No implementado | 0% | Alta |
| Gestión de Encuentros | ❌ No implementado | 0% | Alta |
| Historia Clínica Detallada | ❌ No implementado | 20% | Alta |
| Gestión de Usuarios | ❌ No implementado | 0% | Media |
| Reportes/Estadísticas | 🟡 Básico | 20% | Baja |
| Auditoría | 🟡 Básico | 30% | Baja |

**Progreso General del Dashboard Administrativo: ~40%**

---

## 🚀 Próximos Pasos Inmediatos

1. **Implementar Gestión de Encuentros:**
   - Crear `backend/src/controllers/encuentros.ts`
   - Crear `backend/src/routes/encuentros.ts`
   - Agregar vista en dashboard para registrar encuentros

2. **Implementar Gestión de Admisiones:**
   - Crear `backend/src/controllers/admisiones.ts`
   - Crear `backend/src/routes/admisiones.ts`
   - Agregar vista para registrar nuevas admisiones

3. **Completar Historia Clínica:**
   - Agregar secciones expandibles de admisiones/encuentros
   - Implementar vista de detalle completo

---

**Conclusión:** El dashboard administrativo tiene una base sólida (40% completo) con las funciones de registro de pacientes y citas totalmente implementadas. El siguiente paso crítico es implementar la gestión de **Encuentros** y **Admisiones** para completar el ciclo de atención hospitalaria.
