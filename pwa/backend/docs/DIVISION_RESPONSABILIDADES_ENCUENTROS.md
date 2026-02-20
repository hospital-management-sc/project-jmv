# División de Responsabilidades: Encuentros Médicos

**Fecha:** 25 de noviembre de 2025  
**Contexto:** Sistema de Gestión Hospitalaria - PWA

---

## 🎯 Concepto Clave: ¿Qué son los Encuentros?

### Diferencia Conceptual

- **📅 Cita:** Promesa futura de atención (agendamiento)
- **🏥 Admisión:** Proceso administrativo de ingreso al hospital
- **👨‍⚕️ Encuentro:** Atención médica real que ocurrió

---

## 📋 Ejemplos Prácticos

### **Ejemplo 1: Paciente con Cita Programada**

**Flujo completo:**

1. **Lunes 8:00 AM** - Administrativo registra **CITA**:
   - Especialidad: Medicina General
   - Fecha: Miércoles 25/11/2025 - 10:00 AM
   - Motivo: "Dolor de cabeza persistente"
   - **Estado:** PROGRAMADA ✅

2. **Miércoles 10:00 AM** - Médico atiende y registra **ENCUENTRO**:
   - Tipo: CONSULTA
   - Médico: Dr. García
   - Signos vitales: PA 120/80, Temp 36.5°C
   - Diagnóstico: "Cefalea tensional"
   - Tratamiento: "Ibuprofeno 400mg c/8h x 5 días"
   - **Estado:** COMPLETADO ✅
   - **Vinculado a:** Cita #123

3. **Resultado:** 
   - Cita marcada como COMPLETADA
   - Registro médico real de la atención

---

### **Ejemplo 2: Emergencia SIN Cita Previa**

**Situación:** Soldado llega en ambulancia con trauma.

**Flujo:**

1. **No existe cita previa** (emergencia no programada)
2. Administrativo registra ingreso rápido
3. Médico de turno registra **ENCUENTRO** inmediatamente:
   - Tipo: EMERGENCIA 🚨
   - Procedencia: "Ambulancia - accidente de tránsito"
   - Hora llegada: 14:35
   - Signos vitales: PA 90/60, FC 120
   - Diagnóstico: "TCE leve + herida en brazo"
   - Conducta: "Sutura + observación"

**¿Por qué no es una Admisión?**
- Atendido en emergencia
- Se fue a casa el mismo día
- NO necesitó cama
- Duración: 3 horas

**Registro:**
- ✅ **Encuentro de emergencia** → Historia médica
- ❌ Sin admisión → No hospitalizado
- ❌ Sin cita → No programado

---

### **Ejemplo 3: Paciente Hospitalizado - Múltiples Encuentros**

**Situación:** María ingresa por neumonía.

**Flujo:**

1. **Día 1 - ADMISIÓN (Administrativo):**
   - Forma ingreso: EMERGENCIA
   - Diagnóstico: "Neumonía"
   - Cama: 305-B
   - Fecha: 20/11/2025
   - **Estado:** HOSPITALIZADA 🛏️

2. **Día 1 - Primer ENCUENTRO (Médico):**
   - Tipo: HOSPITALIZACIÓN
   - Signos vitales: Fiebre 39°C, Sat 88%
   - Diagnóstico: "Neumonía bilateral"
   - Tratamiento: "Antibióticos IV"

3. **Día 2 - Segundo ENCUENTRO (Médico):**
   - Evolución matutina
   - Signos vitales: Fiebre 38°C, Sat 92%
   - Nota: "Responde favorablemente"

4. **Día 3 - Tercer ENCUENTRO (Médico):**
   - Ronda médica
   - Signos vitales: Afebril, Sat 95%
   - Nota: "Estable, se planifica alta"

5. **Día 3 - Cierre ADMISIÓN (Administrativo):**
   - Fecha alta: 23/11/2025
   - Días hospitalización: 3
   - **Estado:** ALTA ✅

**Resultado en Historia:**
```
📁 Admisión #45 (20/11 - 23/11) - Neumonía
  └─ 👨‍⚕️ Encuentro 1 (20/11 - Dr. García): Evaluación inicial
  └─ 👨‍⚕️ Encuentro 2 (21/11 - Dra. López): Seguimiento
  └─ 👨‍⚕️ Encuentro 3 (22/11 - Dr. García): Pre-alta
```

---

## 📊 Comparación Visual

| Situación | ¿Cita? | ¿Admisión? | ¿Encuentro? |
|-----------|--------|------------|-------------|
| Paciente agenda consulta futura | ✅ | ❌ | ❌ |
| Paciente llega a consulta programada | ✅ (completada) | ❌ | ✅ (atención real) |
| Emergencia sin cita previa | ❌ | ❌ | ✅ |
| Paciente ingresa hospitalizado | ❌ | ✅ | ✅ (evaluación) |
| Médico revisa paciente en cama | ❌ | ✅ (activa) | ✅ (c/revisión) |
| Paciente recibe alta hospitalaria | ❌ | ✅ (cierra) | ✅ (nota egreso) |

---

## 👥 División de Responsabilidades

### **Personal Administrativo** 📋

**Lo que SÍ hacen:**
- ✅ Registrar pacientes nuevos
- ✅ Agendar citas médicas
- ✅ Registrar admisiones (ingresos hospitalarios)
- ✅ Dar de alta administrativamente
- ✅ Consultar historia clínica (solo lectura)
- ✅ **Ver encuentros** (solo lectura)
- ✅ Generar reportes administrativos

**Lo que NO hacen:**
- ❌ Registrar diagnósticos
- ❌ Registrar signos vitales
- ❌ Escribir evoluciones médicas
- ❌ Indicar tratamientos
- ❌ Crear/editar encuentros médicos

---

### **Personal Médico** 👨‍⚕️👩‍⚕️

**Lo que SÍ hacen:**
- ✅ **Registrar encuentros médicos** ⭐
- ✅ Registrar signos vitales
- ✅ Escribir diagnósticos
- ✅ Indicar tratamientos
- ✅ Evoluciones diarias
- ✅ Notas de egreso
- ✅ Consultar historia clínica completa

---

## 🎯 Flujos de Trabajo

### **Caso 1: Consulta Programada**

**Administrativo (Recepción):**
1. ✅ Agenda cita
2. ✅ Cuando llega: "Marcar como llegó"
3. ⏸️ Envía al consultorio

**Médico (Consultorio):**
1. ✅ Ve pacientes en espera
2. ✅ Selecciona paciente
3. ✅ **Registra encuentro:**
   - Signos vitales
   - Diagnóstico
   - Tratamiento
4. ✅ Guarda → Cita COMPLETADA

---

### **Caso 2: Emergencia**

**Administrativo (Emergencia):**
1. ✅ Ingreso rápido:
   - Datos básicos
   - Motivo llegada
2. ⏸️ Notifica médico turno

**Médico de Turno:**
1. ✅ "Nueva Emergencia"
2. ✅ **Registra encuentro emergencia:**
   - Evaluación inicial
   - Signos vitales
   - Conducta
3. ✅ Decide: ¿Hospitalizar o alta?

---

### **Caso 3: Paciente Hospitalizado**

**Administrativo (Admisión):**
1. ✅ Registra admisión
2. ✅ Asigna cama
3. ⏸️ Termina su parte

**Médico (Rondas Diarias):**
1. ✅ "Mis Pacientes Hospitalizados"
2. ✅ **Registra encuentro diario:**
   - Signos vitales
   - Evolución
   - Plan
3. ✅ Día alta: **Encuentro de egreso**

---

## 🖥️ Dashboards

### **Dashboard Administrativo** (AdminDashboard.tsx)
```
📋 AdminDashboard
├─ ✅ Registrar Paciente
├─ ✅ Generar Cita
├─ ✅ Consultar Historia Clínica
│   ├─ Datos demográficos
│   ├─ Admisiones (lectura)
│   └─ **Encuentros (solo lectura)** ⭐
├─ ✅ Registrar Admisión
└─ ❌ NO registra encuentros
```

### **Dashboard Médico** (MedicoDashboard.tsx)
```
🩺 MedicoDashboard
├─ ✅ Mis Citas del Día
├─ ✅ Pacientes en Espera
├─ ✅ Mis Pacientes Hospitalizados
├─ ✅ **Registrar Encuentro** ⭐
│   ├─ Signos Vitales
│   ├─ Examen Físico
│   ├─ Diagnóstico
│   └─ Plan de Tratamiento
└─ ✅ Ver Historia Completa
```

---

## 🔐 Control de Acceso

```typescript
// Backend: Permisos por rol

// ✅ ADMIN/ADMINISTRATIVO
POST   /api/pacientes
POST   /api/citas
POST   /api/admisiones
GET    /api/pacientes/search
GET    /api/encuentros/paciente/:id  // Solo lectura ⭐

// ✅ MEDICO
GET    /api/pacientes/search
POST   /api/encuentros               // ⭐ Solo médicos
PUT    /api/encuentros/:id           // ⭐ Solo médicos
GET    /api/encuentros/paciente/:id
PATCH  /api/citas/:id/completar

// ❌ ADMINISTRATIVO NO puede
POST   /api/encuentros  // FORBIDDEN 403
PUT    /api/encuentros/:id  // FORBIDDEN 403
```

---

## 🎯 Razón de Ser de los Encuentros

### **Sin Encuentros:**
- ❌ Solo agenda (citas) y "hotel" (admisiones)
- ❌ No hay historia médica real
- ❌ No puedes facturar servicios
- ❌ No hay diagnósticos registrados
- ❌ No hay evidencia de atención
- ❌ Emergencias sin registro

### **Con Encuentros:**
- ✅ Historia médica completa
- ✅ Trazabilidad de tratamientos
- ✅ Base para facturación
- ✅ Datos para reportes
- ✅ Evidencia médico-legal
- ✅ Registro de emergencias

---

## 📋 Próximos Pasos (Dashboard Administrativo)

### **Implementar: Ver Encuentros (Solo Lectura)**

#### Backend Necesario:
```typescript
// Ya debe existir o crear:
GET /api/encuentros/paciente/:id  // Listar encuentros del paciente
GET /api/encuentros/:id           // Detalle de un encuentro
```

#### Frontend (AdminDashboard):
1. **En sección "Consultar Historia Clínica":**
   - Agregar pestaña/sección "Encuentros"
   - Mostrar tabla/timeline de encuentros
   - Campos a mostrar:
     * Fecha/hora
     * Tipo (Consulta, Emergencia, Hospitalización)
     * Médico tratante
     * Motivo/Diagnóstico
     * Estado
   - Botón "Ver Detalle" → Modal/página con:
     * Signos vitales
     * Impresión diagnóstica completa
     * Tratamiento indicado
     * Observaciones
   - **TODO en modo solo lectura** (sin editar)

2. **Indicadores visuales:**
   - 🩺 CONSULTA (verde)
   - 🚨 EMERGENCIA (rojo)
   - 🛏️ HOSPITALIZACIÓN (azul)
   - 📋 OTRO (gris)

---

## 🔧 Estado Actual del Proyecto

### Dashboard Administrativo:
- ✅ Registrar Paciente (100%)
- ✅ Generar Cita (100%)
- 🟡 Consultar Historia (70%) - Falta detalle de encuentros
- ⚠️ Registrar Admisión (0%)
- ⚠️ Ver Encuentros (0%) ← **PRÓXIMO OBJETIVO**

### Dashboard Médico:
- 🟡 Parcialmente implementado
- ⚠️ Registrar Encuentros - Pendiente completar

---

**Conclusión:** Los encuentros son el corazón del sistema médico. El administrativo los consulta (lectura) para información, pero solo los médicos los crean y editan porque contienen decisiones clínicas y responsabilidad médico-legal.
