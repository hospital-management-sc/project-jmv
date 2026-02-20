# 📄 ONE-PAGER: Sistema de Disponibilidad de Médicos

**Proyecto:** Hospital Management PWA | **Feature:** Disponibilidad Médicos  
**Fecha:** 22 Enero 2026 | **Equipo:** 2 Devs | **Duración:** 9 días  

---

## 🎯 RESUMEN EJECUTIVO

**Problema:** El formulario de citas no valida disponibilidad de médicos → sobrecapacidad  
**Solución:** Implementar sistema de horarios y disponibilidad con validación en tiempo real  
**Impacto:** Mejor UX para admin + prevención de sobrecarga de médicos  

---

## 📊 LO QUE CAMBIA

| Aspecto | Antes | Después |
|---------|-------|---------|
| **Médicos** | Input text libre | Select dinámico (por especialidad) |
| **Validación** | Ninguna ❌ | 5 niveles de validación ✅ |
| **Feedback** | Sin indicador | Visual: "7/15 espacios" ⏱️ |
| **Horarios** | No se valida | Se valida (día, hora, capacidad) ✅ |
| **UX** | Confusa | Clara y confiable ✅ |

---

## 🗄️ CAMBIOS DE BASE DE DATOS

### Nueva Tabla: `HorarioMedico`
```sql
usuarioId | especialidad | diaSemana | horaInicio | horaFin | capacidadPorDia
    5     | Medicina Int |     0     |   09:00    | 17:00   |      15
```

### Modificación: `Cita.medicoId`
```
ANTES: Integer (NULL) - OPCIONAL
DESPUÉS: Integer - REQUERIDO ⚠️
```

---

## 🔌 3 ENDPOINTS NUEVOS/MODIFICADOS

### 1. GET `/api/medicos/especialidad/{esp}`
**Retorna:** Lista de médicos + horarios de especialidad  
**Uso:** Llenar select al seleccionar especialidad  

### 2. GET `/api/medicos/{id}/disponibilidad?fecha=...`
**Retorna:** Disponibilidad del médico en esa fecha  
**Uso:** Validación y feedback visual en tiempo real  

### 3. POST `/api/citas` (MODIFICADO)
**Ahora:** Requiere `medicoId` + valida disponibilidad  
**Rechaza:** Si no hay capacidad, si no atiende ese día, etc.  

---

## 💻 CAMBIOS FRONTEND

**Archivo:** `CreateAppointmentForm.tsx`

```jsx
// Nuevo flujo:
1. Especialidad → 🔄 Carga médicos automáticamente
2. Médico → 🔄 Valida disponibilidad
3. Fecha → Muestra ✅/❌ con espacios restantes
4. Enviar → Validación backend completa
```

**Nuevos States:**
- `medicosDisponibles[]` - Médicos de la especialidad
- `disponibilidadMedico{}` - Info de disponibilidad actual

**Nuevos Effects:**
- Cargar médicos al cambiar especialidad
- Validar disponibilidad al cambiar fecha/médico

---

## ✅ VALIDACIONES (5 NIVELES)

```
¿Médico existe?
  ├─ ¿Atiende la especialidad?
  │   ├─ ¿Atiende ese día?
  │   │   ├─ ¿Hora en rango?
  │   │   │   └─ ¿Hay capacidad?
  │   │   │       └─ ✅ CITA CREADA
  │   │   │       └─ ❌ Sugerir fechas alternativas
  │   │   └─ ❌ Mostrar días disponibles
  │   └─ ❌ Mostrar especialidades del médico
  └─ ❌ Médico no existe
```

---

## 📋 TAREAS DIVIDIDAS

### Dev Backend (4 días)
- [ ] Crear tabla + migrations (1 día)
- [ ] Crear servicio de disponibilidad (1 día)
- [ ] Implementar 3 endpoints (1.5 días)
- [ ] Testing + seed data (0.5 días)

### Dev Frontend (3 días)
- [ ] Estados + effects (1 día)
- [ ] UI + indicadores (1 día)
- [ ] Integración + testing (1 día)

### Ambos (2 días)
- [ ] Testing E2E, code review, fixes
- [ ] Documentación + deployment

**Total: 9 días** (con overlap)

---

## 🎨 EJEMPLO DE UX

```
Admin selecciona "Medicina Interna"
  ↓
[Dr. Juan Pérez]  [Dra. María López]  ← Se cargan automáticamente

Admin elige Dr. Juan Pérez y fecha 25/01/2026
  ↓
✅ DISPONIBLE
Lunes 09:00-17:00
Espacios: 7/15  ← Indicador visual

Si hubiera elegido viernes:
  ↓
❌ NO DISPONIBLE
No atiende viernes
Próximas fechas:
• Lunes 26/01 (12 espacios)
• Martes 27/01 (15 espacios)
```

---

## 📊 TIMELINE

```
Semana 1:
Lun   Día 1-2    Backend: Database + Migrations
Mart  Día 2-3    Backend: Servicios + Endpoints
Mié   Día 3-4    Frontend: Lógica + Effects
Jue   Día 4-5    Frontend: UI + Integración
Vie   Día 5-6    Testing + Code Review

Semana 2:
Lun   UAT con hospital
Mar-Mié Fixes basado en feedback
Jue   Aprobación + Deployment
```

---

## 🎯 CRITERIOS DE ACEPTACIÓN

- [ ] Médicos mostrados por especialidad
- [ ] Disponibilidad validada (día, hora, capacidad)
- [ ] Indicador visual "X/Y espacios"
- [ ] Mensajes de error claros + alternativas
- [ ] Respuesta < 500ms en todas las operaciones
- [ ] UI responsiva (desktop, tablet, mobile)
- [ ] 0 bugs críticos
- [ ] Documentación completa

---

## 📚 DOCUMENTACIÓN PROPORCIONADA

| Doc | Propósito | Tiempo |
|-----|-----------|--------|
| BRIEF | Resumen 2 páginas | 5 min |
| REQUERIMIENTO | Especificación completa | 30 min |
| CODIGO_REFERENCIA | Snippets listos | 25 min |
| FLUJO_VISUAL | Diagramas y casos | 20 min |
| CHECKLIST | Plan + seguimiento | 5 min |
| KICKOFF | Presentación | 30 min |

**Total lectura:** ~2 horas | **Todos los archivos** en `/pwa/docs/`

---

## ⚠️ PUNTOS CRÍTICOS

1. **Breaking Change:** medicoId pasa a REQUERIDO
   → Plan de migración: Validar citas existentes

2. **Tabla Nueva:** HorarioMedico no existe hoy
   → Necesita seed con horarios del hospital

3. **Two-Level Validation:** Frontend + Backend
   → Frontend: UX | Backend: Seguridad (siempre validar)

4. **Performance:** API se llamará frecuentemente
   → Considerar caché para horarios

---

## ❓ PREGUNTAS A RESOLVER HOY

1. ¿Horarios de médicos ya existen en algún lado?
2. ¿Capacidad típica por médico? (¿15 pacientes/día?)
3. ¿Qué hacer con citas existentes sin médico?
4. ¿Timeline 9 días es factible con recursos actuales?

---

## 🚀 SIGUIENTES PASOS

**Hoy:**
- Kickoff de 30 min
- Devs leen documentación (2 horas)
- Crean ramas en Git
- Responden preguntas del PM

**Mañana:** Dev Backend empieza Fase 1 (Database)  
**Mañana:** Dev Frontend prepara ambiente + studies  

**Semana:** Daily 15min + code reviews + testing

---

## 📞 CONTACTOS

- **PM/Product:** [Nombre]
- **Tech Lead:** [Nombre]
- **Hospital/Stakeholder:** [Nombre]

---

**Impreso y compartido:** 22 Enero 2026 ✅

