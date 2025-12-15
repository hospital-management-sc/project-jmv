# 🧪 Guía de Pruebas - Sistema de Gestión de Emergencias

## 📋 Pre-requisitos

- Backend corriendo en `http://localhost:3001`
- Frontend corriendo
- Base de datos con al menos 1 paciente registrado
- Usuario con rol MEDICO
- Usuario con rol ADMIN

---

## 🔬 Casos de Prueba

### Test 1: Emergencia SIN Hospitalización

**Objetivo:** Verificar que paciente NO aparece como hospitalizado

**Pasos:**

1. **Login como Médico**
   - Acceder a DoctorDashboard

2. **Registrar Emergencia**
   - Click en "🚨 Nuevo Paciente en Emergencia"
   - Buscar paciente existente o registrar nuevo
   - Llenar formato de emergencia:
     - Motivo de consulta: "Dolor de cabeza leve"
     - Impresión Dx: "Cefalea tensional"
     - **❌ NO marcar "¿Requiere hospitalización?"**
   - Submit

3. **Verificar en DoctorDashboard**
   - Ver stats: "🚨 Pacientes en Emergencia" debe aumentar
   - Click en "📊 Pacientes en Emergencia"
   - Verificar que paciente aparece listado
   - Verificar badge: NO debe mostrar "Requiere hospitalización"

4. **Verificar en AdminDashboard**
   - Login como Admin
   - Ver stats: "🚨 Pacientes en Emergencia" debe mostrar el mismo número
   - Click en "🚨 Emergencias Pendientes de Hospitalización"
   - ✅ **RESULTADO ESPERADO:** Lista vacía o paciente NO aparece
   - Click en "🏥 Pacientes Hospitalizados Actualmente"
   - ✅ **RESULTADO ESPERADO:** Paciente NO aparece aquí

**✅ Test PASADO si:**
- Paciente aparece solo en "Pacientes en Emergencia"
- NO aparece en "Emergencias Pendientes"
- NO aparece en "Pacientes Hospitalizados"

---

### Test 2: Emergencia CON Hospitalización - Workflow Completo

**Objetivo:** Verificar flujo médico → admin

**Parte A: Registro por Médico**

1. **Login como Médico**
   - Acceder a DoctorDashboard

2. **Registrar Emergencia con Hospitalización**
   - Click en "🚨 Nuevo Paciente en Emergencia"
   - Seleccionar paciente
   - Llenar formato:
     - Motivo: "Dolor abdominal agudo"
     - Impresión Dx: "Apendicitis aguda - requiere cirugía"
     - **✅ MARCAR "¿Requiere hospitalización?"**
   - Submit

3. **Verificar Registro**
   - Ver stats: "🚨 Pacientes en Emergencia" aumenta
   - Click en "📊 Pacientes en Emergencia"
   - Verificar paciente con badge "⚠️ Requiere hospitalización"

**Parte B: Asignación por Admin**

4. **Login como Admin**
   - Acceder a AdminDashboard

5. **Ver Pendientes**
   - Ver stats: "⚠️ Emergencias Pendientes" debe mostrar 1+
   - Click en "🚨 Emergencias Pendientes de Hospitalización"
   - ✅ **Verificar:** Paciente aparece en la lista
   - ✅ **Verificar:** Muestra tiempo en emergencia
   - ✅ **Verificar:** Muestra diagnóstico

6. **Asignar Cama**
   - Click en botón "Asignar Cama"
   - En el modal completar:
     - Servicio: "CIRUGIA"
     - Habitación: "201"
     - Cama: "B"
     - Observaciones: "Traslado programado para cirugía"
   - Click "Crear Hospitalización"
   - ✅ **Verificar:** Mensaje de éxito
   - ✅ **Verificar:** Modal se cierra
   - ✅ **Verificar:** Paciente desaparece de la lista

7. **Verificar Hospitalización**
   - Click en "🏥 Pacientes Hospitalizados Actualmente"
   - ✅ **RESULTADO ESPERADO:** Paciente ahora aparece aquí
   - ✅ **Verificar:** Muestra servicio "CIRUGIA"
   - ✅ **Verificar:** Muestra habitación "201", cama "B"

**✅ Test PASADO si:**
- Workflow completo funciona sin errores
- Paciente transiciona correctamente de pendiente a hospitalizado
- Datos se guardan correctamente (servicio, habitación, cama)

---

### Test 3: Sistema de Alertas por Tiempo

**Objetivo:** Verificar clasificación visual por tiempo

**Setup:**
```sql
-- Ejecutar en base de datos para crear emergencias antiguas
UPDATE "Admision" 
SET "fechaAdmision" = CURRENT_DATE - INTERVAL '1 day',
    "horaAdmision" = '10:00'
WHERE id = [ID_DE_EMERGENCIA];
```

**Pasos:**

1. **Crear 3 Emergencias con Diferentes Tiempos**
   - Emergencia 1: Hoy, hace 2 horas (verde - normal)
   - Emergencia 2: Ayer, hace 18 horas (amarillo - alerta)
   - Emergencia 3: Hace 2 días, hace 50 horas (rojo - crítico)

2. **Verificar en Vista de Emergencias**
   - Click en "📊 Pacientes en Emergencia"
   - ✅ **Verificar colores:**
     - < 12h: Fondo verde
     - 12-24h: Fondo amarillo
     - > 24h: Fondo rojo

3. **Verificar Stats**
   - Stats bar debe mostrar:
     - Total en emergencia: 3
     - Pacientes >24h en emergencia: 1

**✅ Test PASADO si:**
- Colores se aplican correctamente según tiempo
- Stats reflejan correctamente los números

---

### Test 4: Auto-Refresh

**Objetivo:** Verificar actualización automática cada 30 segundos

**Pasos:**

1. **Abrir Vista de Emergencias**
   - Login como Admin o Médico
   - Navegar a "📊 Pacientes en Emergencia"
   - Anotar número actual de pacientes

2. **Crear Nueva Emergencia en Otra Pestaña**
   - Abrir nueva ventana/pestaña
   - Login como Médico
   - Registrar nueva emergencia

3. **Verificar Auto-Refresh**
   - Volver a pestaña original
   - ✅ **Esperar máximo 30 segundos**
   - ✅ **RESULTADO ESPERADO:** Lista se actualiza automáticamente
   - ✅ **Verificar:** Nueva emergencia aparece sin refresh manual

**✅ Test PASADO si:**
- Update ocurre dentro de 30 segundos
- No requiere refresh manual del navegador

---

### Test 5: Validación de Formulario

**Objetivo:** Verificar validaciones en asignación de cama

**Pasos:**

1. **Abrir Modal de Asignación**
   - Como Admin
   - Click en "Asignar Cama" en emergencia pendiente

2. **Intentar Submit Vacío**
   - Click "Crear Hospitalización" sin llenar nada
   - ✅ **RESULTADO ESPERADO:** 
     - Navegador muestra validación de campos requeridos
     - No se envía request

3. **Llenar Solo Servicio**
   - Seleccionar servicio
   - Dejar habitación y cama vacíos
   - Click "Crear Hospitalización"
   - ✅ **RESULTADO ESPERADO:** Validación requiere habitación

4. **Llenar Todos los Campos Requeridos**
   - Servicio: "MEDICINA_INTERNA"
   - Habitación: "101"
   - Cama: "A"
   - Observaciones: (dejar vacío - es opcional)
   - Click "Crear Hospitalización"
   - ✅ **RESULTADO ESPERADO:** 
     - Submit exitoso
     - Hospitalización creada

**✅ Test PASADO si:**
- Validaciones funcionan correctamente
- Campos opcionales no bloquean submit
- Submit con campos requeridos funciona

---

### Test 6: Stats en Dashboard

**Objetivo:** Verificar precisión de estadísticas

**Setup:**
- Tener mix de admisiones:
  - 2 Emergencias sin hospitalización
  - 1 Emergencia con requiereHospitalizacion=true (pendiente)
  - 3 Hospitalizaciones activas

**Pasos:**

1. **Admin Dashboard**
   - Ver stats card "🏥 Pacientes Hospitalizados"
   - ✅ **RESULTADO ESPERADO:** Muestra 3
   
   - Ver stats card "🚨 Pacientes en Emergencia"
   - ✅ **RESULTADO ESPERADO:** Muestra 3 (total emergencias)
   
   - Ver stats card "⚠️ Emergencias Pendientes"
   - ✅ **RESULTADO ESPERADO:** Muestra 1

2. **Doctor Dashboard**
   - Ver stats card "Pacientes Hospitalizados"
   - ✅ **RESULTADO ESPERADO:** Muestra 3
   
   - Ver stats card "🚨 Pacientes en Emergencia"
   - ✅ **RESULTADO ESPERADO:** Muestra 3

3. **Crear Nueva Emergencia**
   - Registrar nueva emergencia sin hospitalización
   - Volver a dashboard (esperar auto-refresh de 2 min)
   - ✅ **RESULTADO ESPERADO:** 
     - "Pacientes en Emergencia" aumenta a 4
     - "Emergencias Pendientes" sigue en 1

4. **Marcar Emergencia como Requiere Hospitalización**
   - Editar formato de emergencia existente
   - Marcar requiereHospitalizacion
   - Verificar stats
   - ✅ **RESULTADO ESPERADO:** "Emergencias Pendientes" aumenta

**✅ Test PASADO si:**
- Todos los contadores reflejan estado real
- Stats se actualizan correctamente

---

### Test 7: Expandir/Contraer Tarjetas

**Objetivo:** Verificar funcionalidad de tarjetas expandibles

**Pasos:**

1. **Vista de Pacientes en Emergencia**
   - Navegar a "📊 Pacientes en Emergencia"
   - Ver lista de pacientes

2. **Click en Tarjeta**
   - Click en primera tarjeta
   - ✅ **RESULTADO ESPERADO:** 
     - Tarjeta se expande
     - Muestra detalles completos:
       - Observaciones
       - Fecha y hora completas
       - Todos los datos del paciente

3. **Click en Otra Tarjeta**
   - Click en segunda tarjeta
   - ✅ **RESULTADO ESPERADO:**
     - Primera tarjeta se contrae automáticamente
     - Segunda tarjeta se expande
     - Solo una tarjeta expandida a la vez

4. **Click en Tarjeta Expandida**
   - Click en tarjeta actualmente expandida
   - ✅ **RESULTADO ESPERADO:** Tarjeta se contrae

**✅ Test PASADO si:**
- Expansión/contracción funciona suavemente
- Solo una tarjeta expandida a la vez
- Datos se muestran correctamente en expansión

---

### Test 8: Manejo de Errores

**Objetivo:** Verificar manejo de errores de red

**Pasos:**

1. **Simular Error de Backend**
   - Detener el servidor backend
   - Intentar cargar "Pacientes en Emergencia"
   - ✅ **RESULTADO ESPERADO:** 
     - Mensaje de error visible
     - No crash de aplicación
     - UI mantiene estado

2. **Intentar Asignar Cama Sin Backend**
   - Backend detenido
   - Abrir modal de asignación
   - Llenar formulario
   - Submit
   - ✅ **RESULTADO ESPERADO:**
     - Error visible en UI
     - Modal no se cierra
     - Datos del formulario se mantienen
     - Usuario puede reintentar

3. **Recuperación Automática**
   - Reiniciar backend
   - En vista de emergencias, esperar auto-refresh
   - ✅ **RESULTADO ESPERADO:** 
     - Datos se cargan automáticamente
     - Error desaparece
     - UI vuelve a funcionar normal

**✅ Test PASADO si:**
- Errores se muestran claramente
- No hay crashes
- Recuperación automática funciona

---

### Test 9: Responsive Design

**Objetivo:** Verificar funcionamiento en diferentes tamaños de pantalla

**Pasos:**

1. **Desktop (> 1024px)**
   - Abrir en pantalla completa
   - ✅ **Verificar:** Grid de tarjetas en 2-3 columnas
   - ✅ **Verificar:** Stats bar horizontal
   - ✅ **Verificar:** Modal centrado

2. **Tablet (768px - 1024px)**
   - Reducir ventana del navegador
   - ✅ **Verificar:** Grid ajusta a 1-2 columnas
   - ✅ **Verificar:** Stats bar se reorganiza
   - ✅ **Verificar:** Textos legibles

3. **Mobile (< 768px)**
   - Reducir a tamaño móvil o usar DevTools
   - ✅ **Verificar:** Tarjetas en columna única
   - ✅ **Verificar:** Stats apilados verticalmente
   - ✅ **Verificar:** Botones accesibles
   - ✅ **Verificar:** Modal responsive

**✅ Test PASADO si:**
- Layout se adapta correctamente
- Todo el contenido es accesible
- No hay overflow horizontal
- Interacciones funcionan en touch

---

### Test 10: Integración End-to-End

**Objetivo:** Verificar flujo completo de emergencia a alta

**Pasos Completos:**

1. **Registro de Emergencia (Médico)**
   - Login como Médico
   - Registrar nuevo paciente de emergencia
   - Marcar requiere hospitalización
   - Verificar en lista de emergencias

2. **Asignación de Cama (Admin)**
   - Login como Admin
   - Ver en emergencias pendientes
   - Asignar cama en servicio UCI
   - Verificar en hospitalizados

3. **Seguimiento Médico (Médico)**
   - Login como Médico
   - Click en "Pacientes Hospitalizados"
   - Encontrar paciente
   - Click "Ver Historia Clínica"
   - Verificar ambas admisiones (emergencia + hospitalización)

4. **Alta Médica** (cuando esté implementado)
   - Registrar alta de hospitalización
   - Verificar paciente desaparece de hospitalizados
   - Emergencia original debe tener fechaAlta también

**✅ Test PASADO si:**
- Flujo completo funciona sin interrupciones
- Datos persisten correctamente en cada paso
- Historiales se mantienen íntegros

---

## 📊 Checklist de Testing

| Test | Descripción | Status |
|------|-------------|--------|
| 1 | Emergencia sin hospitalización | ⬜ |
| 2 | Emergencia con hospitalización - Workflow | ⬜ |
| 3 | Sistema de alertas por tiempo | ⬜ |
| 4 | Auto-refresh | ⬜ |
| 5 | Validación de formulario | ⬜ |
| 6 | Stats en dashboard | ⬜ |
| 7 | Expandir/contraer tarjetas | ⬜ |
| 8 | Manejo de errores | ⬜ |
| 9 | Responsive design | ⬜ |
| 10 | Integración end-to-end | ⬜ |

---

## 🐛 Reporte de Bugs

Si encuentra algún bug durante las pruebas, favor documentar:

```markdown
### Bug: [Título breve]

**Severidad:** [Crítico / Alto / Medio / Bajo]

**Pasos para Reproducir:**
1. 
2. 
3. 

**Resultado Esperado:**


**Resultado Actual:**


**Screenshots/Logs:**


**Ambiente:**
- Browser: 
- OS: 
- Backend version: 
- Frontend version: 
```

---

## ✅ Criterios de Aceptación

El sistema se considera ACEPTADO si:

- ✅ Todos los 10 tests pasan exitosamente
- ✅ No hay errores de consola críticos
- ✅ Performance es aceptable (< 2s carga inicial)
- ✅ Stats reflejan estado real en todo momento
- ✅ Workflow médico-admin funciona sin fricción
- ✅ UI es intuitiva y responsive
- ✅ Manejo de errores es claro y útil

---

**Tester:** _______________  
**Fecha:** _______________  
**Resultado:** ⬜ APROBADO | ⬜ RECHAZADO  
**Notas:** _______________
