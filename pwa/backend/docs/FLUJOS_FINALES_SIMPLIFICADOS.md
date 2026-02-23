# Flujos Finales y Reales - Sistema Hospital Militar

**Fecha:** 12 de diciembre de 2025  
**Documento:** Flujos simplificados definitivos para 2 roles (Admin y Médico)

---

## 🎯 **Contexto del Hospital**

### **Información clave proporcionada por la Dra.:**
- **Ingreso principal:** Paciente ingresa la mayoría de las veces por **EMERGENCIA**
- **Límite temporal:** Si la atención se extiende más de **24 horas**, se considera **HOSPITALIZACIÓN**
- **Disponibilidad de personal:** 
  - Médicos: 24/7 (guardias rotativas)
  - Personal administrativo: Horarios de oficina (limitado en madrugada/fines de semana)

### **Roles del sistema:**
1. **Personal Administrativo** → Usa `AdminDashboard`
2. **Médicos** → Usa `DoctorDashboard`

---

## ✅ **FLUJO 1: EMERGENCIA (Autónomo 24/7)**

### **Características:**
- ✅ Médico es **autónomo**, no depende de Admin
- ✅ Funciona **24/7** (madrugada, fines de semana, feriados)
- ✅ Proceso **rápido**, sin esperas ni bloqueos

### **Flujo paso a paso:**

```
1. MÉDICO recibe paciente en Emergencia
   ↓
   
2. MÉDICO solicita CI al paciente: "V-12345678"
   ↓
   
3. MÉDICO busca en sistema por CI
   │
   ├─ ✅ EXISTE EN SISTEMA
   │  └─ Sistema muestra datos básicos:
   │     • Nombre: Juan Pérez
   │     • Edad: 45 años
   │     • Sexo: Masculino
   │     • Historia clínica: HCM-2025-00123
   │  └─ Continuar directamente al PASO 4
   │
   └─ ❌ NO EXISTE EN SISTEMA
      └─ Sistema muestra: "Paciente no registrado"
      └─ Médico llena formulario de registro:
         • CI: V-12345678
         • Nombre completo: Juan Pérez
         • Sexo: Masculino
         • Fecha de nacimiento: 1980-05-15
         • Teléfono: 0414-1234567
         • Dirección (opcional)
      └─ Sistema AUTOMÁTICAMENTE:
         ✓ Crea registro del paciente
         ✓ Crea admisión tipo EMERGENCIA
         ✓ Vincula paciente con admisión
      └─ Continuar al PASO 4
   ↓
   
4. MÉDICO llena FORMATO DE EMERGENCIA
   Datos clínicos:
   • Motivo de consulta
   • Enfermedad actual
   • Signos vitales (TA, FC, FR, Temp, SpO2)
   • Impresión diagnóstica
   • Indicaciones/tratamiento
   ↓
   
5. Sistema guarda formato y admisión
   ↓
   
6. RESULTADO DE LA EMERGENCIA
   │
   ├─ Se resuelve en MENOS de 24 horas
   │  └─ Médico da ALTA
   │  └─ Paciente se retira
   │  └─ FIN ✓
   │
   └─ Requiere MÁS de 24 horas o complicaciones
      └─ Médico determina: "Requiere hospitalización"
      └─ Ver FLUJO 2: HOSPITALIZACIÓN ↓
```

---

## ✅ **FLUJO 2: HOSPITALIZACIÓN (Admin gestiona camas)**

### **Características:**
- ✅ Admin controla **disponibilidad de camas**
- ✅ Admin asigna **servicios hospitalarios**
- ✅ Gestión de **recursos hospitalarios**
- ✅ Horario de Admin (no requiere ser 24/7 porque se hace después de estabilizar)

### **Flujo paso a paso:**

```
1. MÉDICO (desde Emergencia o Consulta) decide:
   "Este paciente necesita hospitalización"
   ↓
   
2. MÉDICO comunica a Admin (presencial/teléfono/chat):
   "Paciente CI V-12345678 requiere cama"
   ↓
   
3. ADMIN en AdminDashboard → "Nueva Admisión de Hospitalización"
   ↓
   
4. ADMIN busca paciente por CI: V-12345678
   │
   ├─ ✅ YA EXISTE (viene de Emergencia)
   │  └─ Sistema muestra datos:
   │     • Nombre: Juan Pérez
   │     • CI: V-12345678
   │     • Admisión EMERGENCIA activa
   │  └─ Continuar al PASO 5
   │
   └─ ❌ NO EXISTE (caso raro, pero posible)
      └─ Admin registra al paciente:
         • CI, Nombre, Sexo, Fecha Nac, Teléfono
      └─ Continuar al PASO 5
   ↓
   
5. ADMIN crea ADMISIÓN DE HOSPITALIZACIÓN
   • Selecciona servicio: MEDICINA_INTERNA / CIRUGÍA / UCI / etc.
   • Asigna habitación: "201"
   • Asigna cama: "Cama A"
   • Observaciones (si necesario)
   • Guarda admisión
   ↓
   
6. Sistema AUTOMÁTICAMENTE:
   ✓ Crea admisión tipo HOSPITALIZACIÓN
   ✓ Vincula con paciente
   ✓ Marca cama como OCUPADA
   ✓ Notifica a médico (dashboard)
   ↓
   
7. ADMIN comunica a médico:
   "Paciente Juan Pérez asignado a Piso 2, Cama 201"
   ↓
   
8. MÉDICO ve notificación en DoctorDashboard:
   "Nuevo paciente hospitalizado: Juan Pérez - Cama 201"
   ↓
   
9. MÉDICO abre FORMATO DE HOSPITALIZACIÓN
   (11 secciones que se llenan progresivamente)
   • Datos generales
   • Signos vitales
   • Laboratorios
   • Estudios especiales
   • Electrocardiogramas
   • Clínica I: Antecedentes
   • Clínica II: Examen funcional
   • Clínica III: Examen físico
   • Resumen de ingreso
   • Órdenes médicas
   • Evoluciones médicas diarias
   ↓
   
10. Durante la hospitalización:
    • Médico hace evoluciones DIARIAS
    • Médico registra órdenes médicas
    • Laboratorio sube resultados
    • Enfermería registra signos vitales
    ↓
    
11. Cuando paciente mejora:
    Médico da ALTA médica
    Admin libera cama
    FIN ✓
```

---

## 🏗️ **Estructura de Componentes**

### **DoctorDashboard (Médicos):**

```
DoctorDashboard
  ├─ "Nuevo Paciente en Emergencia" 
  │  └─ RegistrarEmergencia.tsx
  │     ├─ Solicita CI
  │     ├─ Busca en sistema
  │     ├─ Si NO existe → Muestra formulario registro
  │     └─ Redirige a FORMATO_EMERGENCIA
  │
  ├─ "Mis Formatos Pendientes"
  │  └─ Lista de formatos activos
  │     ├─ Formato Emergencia (sin completar)
  │     └─ Formato Hospitalización (sin completar)
  │
  └─ "Mis Pacientes Hospitalizados"
     └─ Ver pacientes con admisiones ACTIVAS
        (para hacer evoluciones diarias)
```

### **AdminDashboard (Personal Administrativo):**

```
AdminDashboard
  ├─ "Registrar Nuevo Paciente"
  │  └─ RegistrarPaciente.tsx
  │     └─ Formulario completo
  │        • CI, Nombre, Sexo, Fecha Nac
  │        • Teléfono, Dirección
  │        • Datos militares (grado, componente, unidad)
  │
  ├─ "Nueva Admisión de Hospitalización"
  │  └─ RegistrarAdmision.tsx (REFACTORIZADO)
  │     ├─ SOLO tipo HOSPITALIZACIÓN
  │     ├─ Busca paciente por CI
  │     ├─ Si no existe → Opción de registrarlo
  │     ├─ Asigna servicio hospitalario
  │     └─ Asigna cama + habitación
  │
  ├─ "Ver Admisiones Activas"
  │  └─ Control de camas ocupadas
  │     └─ Ver estado de hospitalización
  │
  └─ "Buscar Pacientes"
     └─ Búsqueda avanzada por CI/Nombre/Historia
```

---

## 📊 **Permisos por Rol**

| Acción | **Admin** | **Médico** |
|--------|-----------|------------|
| **Registrar paciente nuevo** | ✅ (siempre, en cualquier momento) | ✅ (solo en contexto de emergencia) |
| **Crear admisión EMERGENCIA** | ❌ | ✅ (automático al llenar formato) |
| **Llenar FORMATO_EMERGENCIA** | ❌ | ✅ |
| **Crear admisión HOSPITALIZACIÓN** | ✅ (asigna cama) | ❌ |
| **Asignar cama/servicio** | ✅ | ❌ |
| **Llenar FORMATO_HOSPITALIZACIÓN** | ❌ | ✅ |
| **Evoluciones médicas diarias** | ❌ | ✅ |
| **Dar alta médica** | ❌ | ✅ |
| **Ver reportes administrativos** | ✅ | ❌ |

---

## 🔑 **Casos de Uso Comunes**

### **Caso 1: Paciente nuevo llega a Emergencia (3 AM)**

```
Médico de guardia:
  1. Pide CI: V-98765432
  2. Busca en sistema → NO existe
  3. Registra rápido:
     • Nombre: María García
     • Sexo: F
     • Fecha Nac: 1990-03-20
     • Teléfono: 0424-9876543
  4. Sistema crea paciente + admisión emergencia
  5. Llena formato emergencia (síntomas, diagnóstico)
  6. Se resuelve en 2 horas → Alta
```

**✅ No necesita Admin, funciona 24/7**

### **Caso 2: Paciente de Emergencia necesita hospitalización**

```
Día 1 - Emergencia:
  1. Paciente V-12345678 llega a emergencia (10 PM)
  2. Médico lo registra y atiende
  3. Formato emergencia completado
  
Día 2 - Hospitalización:
  4. Médico ve que no mejora en 24hrs
  5. Médico avisa a Admin (8 AM cuando llega):
     "Paciente V-12345678 necesita cama"
  6. Admin busca paciente (ya existe)
  7. Admin asigna: Medicina Interna, Piso 2, Cama 201
  8. Médico recibe notificación
  9. Médico inicia formato de hospitalización
```

**✅ Transición fluida de Emergencia → Hospitalización**

### **Caso 3: Paciente registrado hace meses regresa**

```
Admin:
  1. Busca CI: V-11111111
  2. Sistema muestra:
     • Nombre: Carlos López
     • Última admisión: 3 meses atrás (ya con alta)
     • Historia clínica: HCM-2025-00050
  3. Usa datos existentes
  4. Crea NUEVA admisión de hospitalización
  5. Asigna cama
```

**✅ Reutiliza datos, mantiene historial**

---

## 🚀 **Cambios Técnicos Requeridos**

### **1. Base de Datos (Prisma Schema)**
```prisma
model Paciente {
  // ... campos existentes
  // No requiere campo estadoRegistro (siempre será PERMANENTE)
}

model Admision {
  tipo         TipoAdmision  // EMERGENCIA | HOSPITALIZACION
  servicio     String?       // Solo para HOSPITALIZACION
  habitacion   String?       // Solo para HOSPITALIZACION
  cama         String?       // Solo para HOSPITALIZACION
  // ... otros campos
}

enum TipoAdmision {
  EMERGENCIA
  HOSPITALIZACION
}
```

### **2. Componentes Nuevos**
- `RegistrarEmergencia.tsx` (DoctorDashboard)
- `RegistrarPaciente.tsx` (Componente reutilizable)

### **3. Componentes a Refactorizar**
- `RegistrarAdmision.tsx` → Solo HOSPITALIZACIÓN
- `AdminDashboard.tsx` → Remover opción EMERGENCIA
- `DoctorDashboard.tsx` → Agregar "Nuevo Paciente Emergencia"

### **4. Backend (API)**
- Endpoint: `POST /api/emergencia/registrar` (crear paciente + admisión + formato)
- Endpoint: `POST /api/admisiones/hospitalizacion` (solo hospitalización)
- Endpoint: `GET /api/pacientes/buscar?ci=V-12345678`

---

## ✅ **Ventajas de Este Flujo**

1. **✅ Autonomía médica 24/7:** Médico no depende de Admin en emergencias
2. **✅ Control administrativo:** Admin gestiona camas y recursos
3. **✅ Simple y práctico:** Sin complejidades innecesarias
4. **✅ Basado en realidad del hospital:** Según indicaciones de la Dra.
5. **✅ Escalable:** Se puede agregar más roles después si se necesita

---

**Conclusión:** Este documento establece los flujos definitivos y simplificados basados en la realidad operativa del hospital militar, con 2 roles (Admin y Médico) y considerando disponibilidad 24/7 de médicos vs. horarios limitados de personal administrativo.
