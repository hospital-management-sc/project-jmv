# Flujos Clínicos y Administrativos - Sistema Hospital Militar

**Fecha:** 24 de noviembre de 2025  
**Documento:** Guía de implementación de flujos hospitalarios basados en estándares internacionales

---

## 🏥 **Roles y Responsabilidades en el Flujo Hospitalario**

### **1. Personal Administrativo (Admisiones)**
**Responsabilidades:**
- ✅ **Registro inicial del paciente** (datos demográficos básicos)
- ✅ **Control de Admisión** (cuando el paciente llega al hospital)
- ✅ **Asignación de cama/habitación**
- ✅ **Verificación de seguro/beneficios militares**
- ✅ **Creación del expediente físico y digital**
- ❌ **NO llenan datos clínicos** (diagnósticos, exámenes, evoluciones)

### **2. Personal Médico/Residentes**
**Responsabilidades:**
- ✅ **Formato de Emergencia** (cuando el paciente llega a emergencias)
- ✅ **Formato de Hospitalización** (cuando el paciente es internado)
- ✅ **Evoluciones médicas diarias**
- ✅ **Órdenes médicas**
- ✅ **Interpretación de laboratorios y estudios**
- ✅ **Impresiones diagnósticas**
- ✅ **Alta médica**

### **3. Enfermería**
**Responsabilidades:**
- ✅ **Signos vitales** (múltiples veces al día)
- ✅ **Cumplimiento de órdenes médicas**
- ✅ **Administración de medicamentos**
- ✅ **Notas de enfermería**

---

## 🚨 **Escenarios Comunes en Hospitales Maduros**

### **Escenario 1: Paciente NO registrado llega a Emergencia**

**Flujo en sistemas maduros (ej: USA, España, Chile):**

```
1. TRIAGE/CLASIFICACIÓN (Enfermería) - 2-5 minutos
   → Se asigna prioridad según gravedad
   → Se crea registro temporal ("John Doe #12345" si está inconsciente)
   → Si está consciente, se toman datos mínimos (nombre, edad, síntomas)

2. ATENCIÓN MÉDICA INMEDIATA (Médico/Residente)
   → Se atiende la emergencia PRIMERO
   → Se llena el "Formato de Emergencia" con datos clínicos
   → Paciente vinculado temporalmente al registro

3. REGISTRO ADMINISTRATIVO (Paralelo o posterior)
   → Mientras el médico atiende, admisiones registra al paciente
   → Si el paciente está inconsciente/grave: se registra como "NN" con número temporal
   → Familiar/acompañante proporciona datos si es posible
   → Se busca en DB si ya existe (por CI, nombre, huellas digitales en algunos países)

4. VINCULACIÓN (Una vez estabilizado)
   → Si se encuentra registro previo: se vincula la atención a ese paciente
   → Si no existe: se completa el registro y se convierte en permanente
   → Si era "NN": se actualiza con datos reales cuando se identifique
```

**⚠️ Principio fundamental:** 
> **"LA ATENCIÓN MÉDICA NO SE DETIENE POR FALTA DE REGISTRO ADMINISTRATIVO"**

---

### **Escenario 2: Paciente NO registrado necesita Hospitalización**

**Flujo correcto:**

```
1. EMERGENCIA/CONSULTA (Médico determina necesidad de hospitalización)
   → Médico llena formato de emergencia/consulta
   → Decide: "Paciente requiere hospitalización"
   → Genera orden de internación

2. ADMISIONES (Registra o busca al paciente)
   → Busca en DB por CI, nombre, historia clínica previa
   → Si NO existe: crea registro nuevo (formulario de admisión)
   → Si existe: recupera datos existentes
   → Crea registro de ADMISIÓN (ingreso hospitalario)
   → Asigna cama, servicio (Medicina Interna, Cirugía, etc.)

3. SERVICIO DE HOSPITALIZACIÓN (Médico/Residente)
   → Recibe al paciente con su registro de admisión
   → Inicia "Formato de Hospitalización"
   → Realiza valoración completa
   → Inicia evoluciones médicas diarias
```

---

### **Escenario 3: Paciente registrado hace años, regresa**

**Flujo:**

```
1. BÚSQUEDA EN SISTEMA
   → Admisiones busca por CI o número de historia clínica
   → Recupera datos demográficos existentes
   → Verifica/actualiza datos si hay cambios (dirección, teléfono)

2. NUEVA ADMISIÓN (reutiliza datos del paciente)
   → Se crea una NUEVA admisión (episodio hospitalario nuevo)
   → Se mantiene el historial previo (admisiones anteriores visibles)
   → Médico puede revisar historial de hospitalizaciones previas
   → Nuevo formato de hospitalización para esta admisión
```

---

## 🎯 **Diseño de Datos - Estructura Correcta**

### **Modelo de Datos:**

```
PACIENTE (Registro único, permanente)
  ├─ Datos demográficos (CI, nombre, fecha nacimiento, etc.)
  ├─ Datos militares (grado, componente, unidad)
  └─ Estado registro: TEMPORAL | PERMANENTE | NN

ADMISION (Múltiples por paciente, una por episodio hospitalario)
  ├─ Tipo: EMERGENCIA | HOSPITALIZACION | CONSULTA_EXTERNA | UCI
  ├─ Servicio: EMERGENCIA | MEDICINA_INTERNA | CIRUGIA | UCI | PEDIATRIA
  ├─ Estado: ACTIVA | ALTA | TRANSFERIDO | FALLECIDO | CANCELADA
  ├─ Fecha/hora admisión
  ├─ Fecha/hora alta
  ├─ Tipo alta: MEJORIA | VOLUNTARIA | TRANSFERENCIA | FALLECIMIENTO
  └─ Cama asignada

FORMATO_EMERGENCIA (Uno por admisión de tipo EMERGENCIA)
  ├─ Datos clínicos de emergencia
  ├─ Llenado por: Médico de emergencias
  ├─ Vinculado a: Admisión específica
  └─ Contenido: Motivo consulta, signos vitales, impresión dx inicial

FORMATO_HOSPITALIZACION (Uno por admisión de tipo HOSPITALIZACIÓN)
  ├─ 11 secciones del formato oficial
  ├─ Llenado por: Médico/Residente del servicio
  ├─ Vinculado a: Admisión específica
  ├─ Componentes:
  │   ├─ Signos vitales (múltiples registros)
  │   ├─ Laboratorios (múltiples registros)
  │   ├─ Estudios especiales
  │   ├─ Electrocardiogramas
  │   ├─ Antecedentes detallados
  │   ├─ Examen funcional
  │   ├─ Examen físico completo
  │   ├─ Resumen de ingreso
  │   ├─ Órdenes médicas (múltiples)
  │   └─ Evoluciones médicas (diarias)
```

**Relaciones clave:**
```
Paciente (1) ──→ (N) Admision (1) ──→ (1) FormatoEmergencia
                                    └──→ (1) FormatoHospitalizacion
```

---

## 📋 **Flujo Completo - Caso A: Emergencia**

### **Paciente NO registrado llega a Emergencia**

```typescript
// PASO 1: Atención inmediata (Médico)
1. Médico accede al sistema
2. Sistema ofrece: "¿Paciente está registrado?"
   → NO → "Crear registro temporal de emergencia"
   → SÍ → "Buscar por CI/Historia"

3. Si NO está registrado:
   → Sistema crea registro MÍNIMO temporal:
     - Nombre (aunque sea aproximado o "NN")
     - Sexo
     - Edad aproximada
     - Estado: TEMPORAL
   
4. Sistema crea automáticamente:
   → ADMISION (tipo: EMERGENCIA, estado: ACTIVA)
   → FORMATO_EMERGENCIA (vinculado a esa admisión)
   
5. Médico llena formato de emergencia:
   → Motivo consulta
   → Enfermedad actual
   → Signos vitales
   → Impresión diagnóstica
   → Indicaciones

// PASO 2: Registro completo (Admisiones - PARALELO o POSTERIOR)
6. Admisiones completa el registro del paciente:
   → Si existe en DB: vincula la atención al registro existente
   → Si NO existe: completa datos demográficos completos
   → Cambia estado de TEMPORAL a PERMANENTE
   → Asigna número de historia clínica definitivo
```

---

## 📋 **Flujo Completo - Caso B: Hospitalización**

### **Paciente necesita Hospitalización (esté o no registrado)**

```typescript
// PASO 1: Decisión médica
1. Médico decide: "Requiere hospitalización"
2. Genera ORDEN DE INTERNACIÓN

// PASO 2: Admisiones hospitalarias
3. Admisiones busca al paciente:
   → Si NO existe: crea registro completo (formulario de admisión)
   → Si existe: recupera datos
   
4. Admisiones crea ADMISION nueva:
   - Tipo: HOSPITALIZACION
   - Servicio: MEDICINA_INTERNA | CIRUGIA | UCI
   - Cama: asigna cama disponible
   - Estado: ACTIVA

// PASO 3: Servicio de Hospitalización
5. Paciente llega al servicio (piso/sala)
6. Médico/Residente inicia FORMATO_HOSPITALIZACION:
   → Sistema crea automáticamente vinculado a la admisión
   → Médico llena las 11 secciones progresivamente
   → No necesita llenar todo de una vez (se va completando)
   
7. Durante la hospitalización:
   → Evoluciones médicas diarias
   → Órdenes médicas
   → Laboratorios/estudios (registrados por laboratorio)
   → Signos vitales (registrados por enfermería)
   
8. Alta médica:
   → Médico registra fecha/hora de alta
   → Tipo de alta (mejoría, voluntaria, etc.)
   → Diagnóstico de egreso
   → Admisión cambia estado a: ALTA
```

---

## 🔑 **Características Clave de Sistemas Maduros**

### **1. Registro Temporal/Rápido**
- Permite atención inmediata sin datos completos
- Estado: TEMPORAL hasta que se complete
- Se puede "promover" a registro permanente
- Para casos de pacientes inconscientes o situaciones críticas

### **2. Búsqueda Inteligente**
- Busca por múltiples criterios: CI, nombre, historia clínica
- Detecta duplicados potenciales
- Sugiere registros similares antes de crear uno nuevo
- Implementar búsqueda fonética para nombres

### **3. Workflows por Rol**

#### **ADMISIONES:**
- Registrar paciente nuevo
- Buscar paciente existente
- Crear admisión (asignar cama)
- Completar datos administrativos

#### **MÉDICO EMERGENCIA:**
- Triage/Clasificación
- Crear registro temporal si es necesario
- Llenar formato de emergencia
- Ordenar hospitalización si requiere

#### **MÉDICO PISO/RESIDENTE:**
- Recibir paciente hospitalizado
- Llenar formato de hospitalización
- Evoluciones diarias
- Órdenes médicas
- Alta médica

#### **ENFERMERÍA:**
- Signos vitales (múltiples veces al día)
- Cumplir órdenes médicas
- Notas de enfermería
- Control de medicamentos

### **4. Permisos Diferenciados**

```typescript
ADMINISTRATIVO:
  ✅ Crear/editar datos demográficos del paciente
  ✅ Crear admisión
  ✅ Asignar cama
  ✅ Actualizar datos de contacto
  ❌ NO puede ver/editar datos clínicos
  ❌ NO puede ver diagnósticos
  ❌ NO puede ver evoluciones médicas

MÉDICO:
  ✅ Leer datos demográficos (solo lectura)
  ✅ Crear/editar formatos clínicos
  ✅ Evoluciones, órdenes, diagnósticos
  ✅ Alta médica
  ✅ Ver historial completo del paciente
  ❌ NO puede editar datos administrativos

ENFERMERÍA:
  ✅ Leer datos demográficos y clínicos
  ✅ Registrar signos vitales
  ✅ Cumplir órdenes médicas
  ✅ Notas de enfermería
  ❌ NO puede crear diagnósticos
  ❌ NO puede crear órdenes médicas
  ❌ NO puede dar alta médica

LABORATORIO:
  ✅ Ver órdenes de laboratorio
  ✅ Registrar resultados de laboratorio
  ✅ Adjuntar archivos de resultados
  ❌ NO puede ver evoluciones médicas
  ❌ NO puede crear órdenes

DIRECTOR/ADMINISTRADOR:
  ✅ Acceso completo a todo
  ✅ Reportes y estadísticas
  ✅ Gestión de usuarios
  ✅ Auditoría
```

---

## 💡 **Implementación en el Sistema**

### **Tipos de Admisión:**
```typescript
enum TipoAdmision {
  EMERGENCIA          // Paciente llega a emergencias
  HOSPITALIZACION     // Paciente será internado
  CONSULTA_EXTERNA    // Consulta ambulatoria
  UCI                 // Unidad de Cuidados Intensivos
  CIRUGIA             // Ingreso programado para cirugía
}
```

### **Estados de Admisión:**
```typescript
enum EstadoAdmision {
  ACTIVA              // Paciente actualmente hospitalizado
  ALTA                // Paciente dado de alta
  TRANSFERIDO         // Transferido a otro servicio u hospital
  FALLECIDO           // Paciente falleció
  CANCELADA           // Admisión cancelada (ej: paciente no llegó)
  EN_ESPERA           // Esperando cama disponible
}
```

### **Tipos de Alta:**
```typescript
enum TipoAlta {
  MEJORIA             // Alta por mejoría clínica
  VOLUNTARIA          // Paciente solicita alta voluntaria
  TRANSFERENCIA       // Transferido a otro centro
  FALLECIMIENTO       // Paciente falleció
  FUGA                // Paciente se retiró sin autorización
  ADMINISTRATIVA      // Alta administrativa
}
```

### **Servicios Hospitalarios:**
```typescript
enum ServicioHospitalario {
  EMERGENCIA
  MEDICINA_INTERNA
  CIRUGIA_GENERAL
  TRAUMATOLOGIA
  UCI
  PEDIATRIA
  GINECO_OBSTETRICIA
  CARDIOLOGIA
  NEUROLOGIA
  ONCOLOGIA
}
```

### **Estado de Registro del Paciente:**
```typescript
enum EstadoRegistroPaciente {
  TEMPORAL            // Registro incompleto, en proceso
  PERMANENTE          // Registro completo y validado
  NN                  // Paciente no identificado
}
```

---

## 🎬 **Implementación Práctica - Flujos de UI**

### **Vista 1: Admisiones - Nuevo Paciente en Emergencia**

```
Pantalla: "Nueva Admisión - Emergencia"

┌─────────────────────────────────────────┐
│  NUEVA ADMISIÓN - EMERGENCIA            │
├─────────────────────────────────────────┤
│                                         │
│  PASO 1: ¿Paciente registrado?         │
│                                         │
│  ┌───────────────┐  ┌───────────────┐  │
│  │ Buscar        │  │ Paciente      │  │
│  │ Paciente      │  │ Nuevo         │  │
│  └───────────────┘  └───────────────┘  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Emergencia Sin Identificar      │   │
│  │ (NN - No Identificado)          │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘

Si selecciona "Paciente Nuevo":

┌─────────────────────────────────────────┐
│  REGISTRO RÁPIDO - EMERGENCIA           │
├─────────────────────────────────────────┤
│  Nombre completo: [____________]        │
│  CI (si tiene):   [____________]        │
│  Edad aproximada: [__] años             │
│  Sexo: ○ M  ○ F                         │
│                                         │
│  [Guardar y Crear Admisión]             │
└─────────────────────────────────────────┘

→ Sistema crea:
  - Paciente (estado: TEMPORAL)
  - Admisión (tipo: EMERGENCIA, estado: ACTIVA)
  - FormatoEmergencia (listo para llenar)

→ Redirige al médico para llenar formato
```

### **Vista 2: Médico - Formato de Emergencia**

```
Pantalla: "Formato de Emergencia"

┌─────────────────────────────────────────┐
│  FORMATO DE EMERGENCIA                  │
│  Paciente: Juan Pérez                   │
│  CI: 12345678                           │
│  Edad: 45 años                          │
│  Admisión: #00123 - 24/11/2025 10:30   │
├─────────────────────────────────────────┤
│                                         │
│  MOTIVO DE CONSULTA:                    │
│  [_____________________________]        │
│  [_____________________________]        │
│                                         │
│  ENFERMEDAD ACTUAL:                     │
│  [_____________________________]        │
│  [_____________________________]        │
│  [_____________________________]        │
│                                         │
│  SIGNOS VITALES:                        │
│  T.A.: [___]/[___] mmHg                 │
│  FC:   [___] lpm                        │
│  FR:   [___] rpm                        │
│  Temp: [___] °C                         │
│  SpO2: [___] %                          │
│                                         │
│  IMPRESIÓN DIAGNÓSTICA:                 │
│  [_____________________________]        │
│  [_____________________________]        │
│                                         │
│  INDICACIONES:                          │
│  [_____________________________]        │
│  [_____________________________]        │
│                                         │
│  ¿Requiere hospitalización?             │
│  ○ Sí  ○ No                             │
│                                         │
│  [Guardar]  [Guardar y Ordenar Ingreso] │
└─────────────────────────────────────────┘
```

### **Vista 3: Admisiones - Registrar Hospitalización**

```
Pantalla: "Nueva Admisión - Hospitalización"

┌─────────────────────────────────────────┐
│  NUEVA ADMISIÓN - HOSPITALIZACIÓN       │
├─────────────────────────────────────────┤
│  PASO 1: Buscar paciente                │
│                                         │
│  Buscar por CI: [____________] 🔍       │
│  O por Historia: [____________] 🔍      │
│                                         │
│  → Resultado:                           │
│  ┌─────────────────────────────────┐   │
│  │ Juan Pérez                      │   │
│  │ CI: 12345678                    │   │
│  │ Historia: HCM-2025-00001        │   │
│  │ [Seleccionar]                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  PASO 2: Datos de admisión              │
│                                         │
│  Servicio: [▼ Medicina Interna]         │
│  Cama: [▼ Piso 2 - Cama 201] ✓ Disponible │
│  Forma ingreso: [▼ Ambulante]           │
│  Orden internación: [____________]      │
│                                         │
│  [Crear Admisión]                       │
└─────────────────────────────────────────┘

→ Sistema crea:
  - Admisión (tipo: HOSPITALIZACION)
  - FormatoHospitalizacion (vacío)
  - Notifica al servicio/médico
```

### **Vista 4: Médico - Formato de Hospitalización**

```
Pantalla: "Formato de Hospitalización"

┌─────────────────────────────────────────┐
│  FORMATO DE HOSPITALIZACIÓN             │
│  Paciente: Juan Pérez                   │
│  Admisión: #00124 - Medicina Interna    │
│  Cama: 201                              │
├─────────────────────────────────────────┤
│  Pestañas:                              │
│  [1.General] [2.Signos] [3.Labs]        │
│  [4.Estudios] [5.EKG] [6.Clínica I]     │
│  [7.Clínica II] [8.Clínica III]         │
│  [9.Resumen] [10.Órdenes] [11.Evoluciones] │
├─────────────────────────────────────────┤
│  Contenido de la pestaña activa...     │
│                                         │
│  → No se llena todo de una vez          │
│  → Se completa progresivamente          │
│  → Sistema guarda automáticamente       │
└─────────────────────────────────────────┘
```

---

## ✅ **Respuestas Directas - Resumen**

| Pregunta | Respuesta |
|----------|-----------|
| ¿Quién llena el formato de Emergencia? | **Médico de emergencias** (inmediatamente al recibir al paciente) |
| ¿Quién llena el formato de Hospitalización? | **Médico/Residente del servicio** (progresivamente durante la hospitalización) |
| ¿Qué hace el personal administrativo? | **Registro inicial**, **Creación de admisión**, **Asignación de cama** |
| ¿Paciente no registrado en emergencia? | Se crea **registro temporal mínimo**, se atiende PRIMERO, admisiones completa después |
| ¿Necesita hospitalización pero no está registrado? | Admisiones lo **registra completamente** antes de crear la admisión de hospitalización |
| ¿Cómo manejan otros países estos casos? | **EMERGENCIA = atención inmediata**, **HOSPITALIZACIÓN = registro previo**, **Permiten registros temporales** |

---

## 🚀 **Próximos Pasos de Implementación**

### **Fase 1: Actualizar Schema de Base de Datos**
1. Modificar modelo `Admision`:
   - Agregar campo `tipo` (EMERGENCIA, HOSPITALIZACION, etc.)
   - Agregar campo `servicio`
   - Agregar campo `estado` (ACTIVA, ALTA, etc.)
   - Agregar campos de alta (fechaAlta, tipoAlta)

2. Modificar modelo `Paciente`:
   - Agregar campo `estadoRegistro` (TEMPORAL, PERMANENTE, NN)

3. Crear modelos nuevos:
   - `FormatoEmergencia`
   - `FormatoHospitalizacion`
   - `SignosVitalesHosp`
   - `Laboratorio`
   - `EstudioEspecial`
   - `Electrocardiograma`
   - `AntecedentesDetallados`
   - `ExamenFuncional`
   - `ResumenIngreso`
   - `OrdenMedica`
   - `EvolucionMedica`

### **Fase 2: Implementar Backend**
1. Controllers para cada módulo
2. Routes y endpoints
3. Validaciones y middleware
4. Sistema de permisos por rol

### **Fase 3: Implementar Frontend**
1. Vistas de admisiones (emergencia y hospitalización)
2. Formato de emergencia (médico)
3. Formato de hospitalización con 11 pestañas (médico/residente)
4. Vistas de enfermería (signos vitales, órdenes)
5. Vistas de laboratorio
6. Dashboard por rol

### **Fase 4: Testing y Ajustes**
1. Pruebas de flujos completos
2. Validación con usuarios finales
3. Ajustes de UX
4. Optimización de rendimiento

---

**Conclusión:** Este documento establece los flujos obligatorios basados en estándares internacionales y la práctica hospitalaria moderna. La implementación de estos flujos garantiza un sistema robusto, escalable y alineado con las mejores prácticas mundiales.
