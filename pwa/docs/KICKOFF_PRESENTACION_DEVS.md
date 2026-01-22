# 🎯 KICKOFF - Presentación para Developers

**Fecha:** 22 Enero 2026  
**Duración:** 30 minutos  
**Asistentes:** Dev Backend, Dev Frontend, PM, Tech Lead  

---

## ⏱️ Agenda (30 min)

| Tiempo | Tema | Presentador |
|--------|------|-------------|
| 0-2 min | Contexto del Proyecto | PM |
| 2-5 min | Problema Identificado | PM |
| 5-10 min | Solución Propuesta | PM |
| 10-15 min | Arquitectura Técnica | Tech Lead |
| 15-20 min | División de Tareas | PM + Devs |
| 20-25 min | Q&A y Aclaraciones | Todos |
| 25-30 min | Siguientes Pasos | Tech Lead |

---

## 📝 SLIDE 1: Contexto del Proyecto

### Hospital Management PWA
- **Objetivo:** Sistema integral de gestión hospitalaria
- **Estado:** En desarrollo, MVP funcional
- **Usuarios:** Personal administrativo, médicos, pacientes
- **Requerimiento Actual:** Mejorar flujo de "Generar Cita Médica"

### Por qué ahora?
- Próximas reuniones con personal médico (feedback)
- Necesidad de validar disponibilidad en tiempo real
- Evitar sobrecarga de médicos por turno
- Mejorar UX del personal administrativo

---

## 📝 SLIDE 2: Problema Identificado

### Flujo Actual - Sin Validación
```
Admin busca paciente 
  → Selecciona especialidad 
    → Ingresa fecha/hora 
      → Selecciona médico (optional) 
        → Se guarda sin validaciones ❌

Problemas:
❌ No muestra médicos por especialidad
❌ No valida si médico atiende ese día
❌ No controla capacidad máxima/día
❌ Posibilidad de sobrecapacidad
```

### Impacto
- **Médicos:** Sobrecargados, jornadas desorganizadas
- **Pacientes:** Tiempos de espera largos
- **Admin:** Llamadas telefónicas para confirmar disponibilidad

---

## 📝 SLIDE 3: Solución Propuesta

### Visión General
```
Especial. → [médicos cargados] → Médico → [disponibilidad validada] → Cita Exitosa

Novedades:
✅ Médicos mostrados por especialidad
✅ Validación de horarios (qué días atienden)
✅ Validación de capacidad (cuántos pacientes/día)
✅ Feedback visual en tiempo real
```

### Ejemplo de UX Mejorado
```
Admin selecciona "Medicina Interna"
  → Se cargan: Dr. Juan Pérez, Dra. María López
  
Admin selecciona: Dr. Juan Pérez
Admin selecciona fecha: 25/01/2026 (lunes)
  → Sistema muestra: ✅ "7/15 espacios disponibles"
                      "Horario: 09:00-17:00"

Si hubiera seleccionado viernes:
  → Sistema muestra: ❌ "No atiende viernes"
                      "Próximas fechas: Lunes, Martes..."
```

---

## 📝 SLIDE 4: Arquitectura Técnica

### Backend - Cambios
```
NUEVA tabla: HorarioMedico
  ├─ usuarioId (FK) → Usuario (médico)
  ├─ especialidad
  ├─ diaSemana (0=Lunes, 4=Viernes)
  ├─ horaInicio, horaFin
  └─ capacidadPorDia

MODIFICADA tabla: Cita
  └─ medicoId: pasar de OPCIONAL → REQUERIDO

3 NUEVOS ENDPOINTS REST:
  1. GET /api/medicos/especialidad/:especialidad
     → Retorna médicos + horarios de una especialidad
  
  2. GET /api/medicos/:medicoId/disponibilidad?fecha=...
     → Valida disponibilidad específica
  
  3. POST /api/citas (MODIFICADO)
     → Ahora valida disponibilidad antes de crear
```

### Frontend - Cambios
```
CreateAppointmentForm.tsx:
  ANTES: Especialidad → [Médico: input text libre]
  DESPUÉS: Especialidad → [Médico: select dinámico]
                       → [Indicador disponibilidad]

Nuevos states:
  - medicosDisponibles[]
  - loadingMedicos
  - disponibilidadMedico{}

Nuevos effects:
  - Cargar médicos al cambiar especialidad
  - Validar disponibilidad al cambiar fecha/médico
```

### Validaciones (Backend)
```
Cuando se intenta crear cita:
1. ¿Médico existe? 
2. ¿Médico atiende la especialidad?
3. ¿Médico atiende ese día?
4. ¿Hora en rango del médico?
5. ¿Hay capacidad disponible?

Si TODAS pasan → Cita creada
Si ALGUNA falla → Error claro + sugerencias
```

---

## 📝 SLIDE 5: División de Tareas

### Dev Backend - 4 días
```
Día 1-2: Database & Migrations
  ✓ Crear tabla HorarioMedico
  ✓ Modificar Cita (medicoId requerido)
  ✓ Crear seed con datos de ejemplo

Día 2-4: Servicios & Endpoints
  ✓ Crear servicio de disponibilidad
  ✓ GET /api/medicos/especialidad/:especialidad
  ✓ GET /api/medicos/:medicoId/disponibilidad
  ✓ Modificar POST /api/citas con validaciones
  ✓ Testing manual

Deliverables:
  - 3 endpoints funcionales
  - Validaciones completas
  - Documentación de API
```

### Dev Frontend - 3 días
```
Día 1-2: Lógica & States
  ✓ Agregar estados (medicosDisponibles, etc.)
  ✓ Effects para cargar médicos
  ✓ Effects para validar disponibilidad
  ✓ Helper functions

Día 2-3: UI & Integración
  ✓ Select dinámico de médicos
  ✓ Indicador visual de disponibilidad
  ✓ Validaciones en formulario
  ✓ Integración con Backend
  ✓ Testing E2E

Deliverables:
  - CreateAppointmentForm mejorado
  - UX clara y responsiva
  - Sin errores de consola
```

### Ambos - 2 días
```
Día 5-6: Integración & Testing
  ✓ Testing completo del flujo
  ✓ Edge cases
  ✓ Performance
  ✓ Code review cruzado
  ✓ Documentación final

Deliverables:
  - Feature lista para producción
  - 0 bugs críticos
  - Documentación actualizada
```

---

## 📝 SLIDE 6: Documentación Proporcionada

### Para entender el requerimiento
- 📄 **REQUERIMIENTO_GESTION_DISPONIBILIDAD_MEDICOS.md**
  - Especificación COMPLETA
  - Modelos de datos detallados
  - Endpoints con ejemplos
  - 30 minutos de lectura

### Para codificar
- 💻 **CODIGO_REFERENCIA_DISPONIBILIDAD.md**
  - Snippets listos para copiar
  - Migrations SQL
  - Funciones de servicio
  - 25 minutos de lectura

### Para seguimiento
- ✅ **CHECKLIST_IMPLEMENTACION.md**
  - 11 fases detalladas
  - 100+ checkpoints
  - Timeline estimado
  - Usar como Kanban board

### Para visualizar
- 📊 **FLUJO_VISUAL_DISPONIBILIDAD.md**
  - Diagramas y flujos
  - Árbol de decisión
  - Casos de uso
  - FAQ

### Índice y resumen
- 📚 **INDICE_DOCUMENTACION_DISPONIBILIDAD.md**
  - Guía de lectura por rol
  - Mapa de referencias cruzadas
  - Puntos críticos

---

## 📝 SLIDE 7: Cronograma

```
┌─────────────────────────────────────────┐
│ SEMANA 1: Desarrollo                    │
├─────────────────────────────────────────┤
│ Lunes-Martes:   Backend Infraestructura │
│ Martes-Miércoles: Backend Services      │
│ Lunes-Miércoles: Frontend Lógica        │
│ Miércoles-Jueves: Frontend UI           │
│ Jueves-Viernes:  Integración & Testing │
└─────────────────────────────────────────┘

Total: 9 días hábiles (dentro de 1 semana con overlap)

SEMANA 2: Refinamiento
├─ Lunes: UAT con personal hospital
├─ Martes-Miércoles: Fixes basado en feedback
└─ Jueves: Aprobación final + deployment
```

---

## 📝 SLIDE 8: Criterios de Aceptación

### Backend
- [ ] Tabla HorarioMedico creada con datos
- [ ] 3 endpoints funcionales y documentados
- [ ] Validaciones completas (5 niveles)
- [ ] Manejo de errores claro
- [ ] Testing manual exitoso
- [ ] 0 console.errors en logs

### Frontend
- [ ] Médicos cargados dinámicamente
- [ ] Disponibilidad validada en tiempo real
- [ ] UI responsive (desktop, tablet, mobile)
- [ ] Mensajes de error claros
- [ ] Sin flickering o lentitud
- [ ] Integración E2E funcional

### Conjunto
- [ ] Flujo completo funcional
- [ ] Documentación actualizada
- [ ] Code review aprobado
- [ ] QA testing exitoso
- [ ] 0 bugs críticos

---

## 📝 SLIDE 9: Preguntas Clave (Responder Hoy)

Antes de empezar, aclarar con Product/Hospital:

1. **¿Horarios de médicos ya existen en BD?**
   - Si SÍ: ¿En qué formato? ¿Dónde?
   - Si NO: Crearemos tabla nueva + seed

2. **¿Capacidad típica por médico?**
   - ¿15 pacientes/día? ¿Variable por especialidad?
   - ¿Hay espacios reservados para urgencias?

3. **¿Citas existentes sin médico?**
   - ¿Cuántas hay? ¿Qué hacer con ellas?
   - ¿Migrarlas? ¿Dejarlas como están?

4. **¿Timeline flexible?**
   - ¿9 días es realista?
   - ¿Hay urgencias que aceleren esto?
   - ¿Hay bloqueos de otras features?

---

## 📝 SLIDE 10: Siguientes Pasos

### HOY (después de kickoff)
```
Dev Backend:
  1. Leer REQUERIMIENTO completo (30 min)
  2. Leer CODIGO_REFERENCIA (20 min)
  3. Crear rama: feature/medico-disponibilidad-backend
  4. Empezar Fase 2: Database

Dev Frontend:
  1. Leer REQUERIMIENTO sección Frontend (15 min)
  2. Leer CODIGO_REFERENCIA sección Frontend (20 min)
  3. Crear rama: feature/medico-disponibilidad-frontend
  4. Preparar ambiente local

PM/Tech Lead:
  1. Confirmar preguntas del SLIDE 9
  2. Comunicar respuestas a devs
  3. Bloquear calendar para seguimiento daily
```

### MAÑANA (reunión stand-up)
```
Dev Backend:
  - ¿Migrations creadas?
  - ¿Datos seeded?
  - ¿Bloqueadores?

Dev Frontend:
  - ¿Ambiente preparado?
  - ¿Questions sobre state?
  - ¿Bloqueadores?

Acción: Ajustar plan si hay bloques
```

### SEMANA
```
Daily 15 min: Actualizar CHECKLIST
Wednesday: Code review entre devs
Friday: Testing integration completo
```

---

## 🎯 3 Puntos Clave a Recordar

### 1. **Cambio Breaking**
- `medicoId` será **REQUERIDO** (no opcional)
- Esto afecta citas existentes
- Necesita plan de migración

### 2. **Dos Niveles de Validación**
- **Frontend:** Para UX rápida (feedback inmediato)
- **Backend:** Para seguridad (SIEMPRE validar)

### 3. **No Hay Horarios Hoy**
- Tabla `HorarioMedico` es NUEVA
- Necesitamos seed con datos
- Confirmar horarios con hospital

---

## ❓ PREGUNTAS

*Espacio para Q&A de los devs*

---

## ✅ Checklist Pre-Implementación

- [ ] Ambos devs entienden el requerimiento
- [ ] Ambos devs tienen acceso a documentación
- [ ] Ramas creadas en repositorio
- [ ] Ambiente local listo
- [ ] Dudas resueltas
- [ ] PM confirmó respuestas clave
- [ ] Tech Lead disponible para soporte

---

## 📞 Canales de Comunicación

- **Dudas urgentes:** Slack canal #hospital-development
- **Code review:** Pull requests en GitHub
- **Diseño:** Ver FLUJO_VISUAL_DISPONIBILIDAD.md
- **Bloqueadores:** Reportar a PM inmediatamente

---

## 🚀 ¡Éxito!

Esta es una oportunidad para implementar una feature **crítica para el negocio** y que **mejora significativamente la UX**.

**Vamos a hacerlo bien.** 💪

---

**Presentación:** 22 Enero 2026  
**Versión:** 1.0  
**Next:** Dividir en tareas específicas en Jira/Trello

