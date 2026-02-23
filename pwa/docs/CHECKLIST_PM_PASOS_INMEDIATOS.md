# 👨‍💼 CHECKLIST PM - Pasos Inmediatos

**Para:** Product Manager / Project Lead  
**Objetivo:** Acciones inmediatas para delegación exitosa  
**Tiempo:** 2-3 horas de trabajo  

---

## ✅ AHORA (Próximas 2 horas)

### Lectura Rápida
- [ ] Lee **ONE_PAGER_DISPONIBILIDAD.md** (5 min)
- [ ] Lee **BRIEF_DISPONIBILIDAD_MEDICOS.md** (10 min)
- [ ] Hojea **FLUJO_VISUAL_DISPONIBILIDAD.md** (10 min)

**Tiempo:** 25 minutos

### Validación Interna
- [ ] Revisa con Tech Lead si timeline de 9 días es realista
- [ ] Confirma recursos disponibles (2 devs full-time)
- [ ] Valida que los devs asignados tengan experiencia con:
  - Backend: Prisma, TypeScript, Node.js, PostgreSQL
  - Frontend: React, useState, useEffect, fetch API

**Tiempo:** 30 minutos

### Obtén Aprobaciones
- [ ] CTO/Tech Lead: Aprueba arquitectura
- [ ] Hospital/Stakeholder: Aprueba cambios de flujo
- [ ] DevOps: Confirma ambiente para testing

**Tiempo:** 1 hora (puede ser simultáneo)

---

## 📋 HOY (Antes de kickoff)

### Resuelve Preguntas Clave
Contacta al hospital/doctors para responder:

- [ ] **¿Horarios médicos ya existen en BD?**
  - Si SÍ: ¿Dónde? ¿Qué formato?
  - Si NO: Confirmar que crearemos tabla nueva
  
- [ ] **¿Capacidad típica por médico?**
  - Ej: 15 pacientes/día de máximo
  - ¿Varía por especialidad?
  - ¿Hay reservas para urgencias?
  
- [ ] **¿Qué hacer con citas existentes sin médico?**
  - ¿Hay muchas? (Q SQL: SELECT COUNT(*) WHERE medicoId IS NULL)
  - Plan de migración?
  
- [ ] **Disponibilidad y Urgencias**
  - ¿Cómo manejan casos de urgencia?
  - ¿Pueden saltarse la cola?
  - ¿Afecta la disponibilidad?

**Nota:** Guardar respuestas en documento compartido

---

## 🎯 MAÑANA (Kickoff + Arranque)

### Prepare Kickoff (30 min)
- [ ] Imprime o abre **KICKOFF_PRESENTACION_DEVS.md**
- [ ] Revisa los 10 "slides"
- [ ] Prepara respuestas a preguntas clave
- [ ] Ajusta timeline si es necesario
- [ ] Prepara Jira/Trello con tareas iniciales

### Ejecuta Kickoff (30 min)
- [ ] Presenta contexto (2 min)
- [ ] Explica problema y solución (5 min)
- [ ] Muestra arquitectura (5 min)
- [ ] Divide tareas (5 min)
- [ ] Responde Q&A (10 min)
- [ ] Próximos pasos (3 min)

**Agenda:** Reserva 1 hora (30 min prep + 30 min presentación)

### Devs Comienzan Lectura (Paralelo)
- [ ] Comparte todos los documentos (Drive/GitHub)
- [ ] Devs leen documentación (~2 horas cada uno)
- [ ] Crean ramas en Git
- [ ] Reportan dudas en Slack/email

---

## 📅 SEMANA 1 (Implementación)

### Daily Standups (15 min)
Inicia mañana por la mañana, preguntas:
- [ ] ¿Qué hiciste ayer?
- [ ] ¿Qué harás hoy?
- [ ] ¿Hay bloqueadores?

**Acción:** Actualizar CHECKLIST_IMPLEMENTACION.md cada día

### Seguimiento por Fase
- [ ] **Día 1-2:** Dev Backend debe estar en Fase 2 (Database)
  - Validar: Migrations creadas
  - Validar: Tabla HorarioMedico en BD
  - Validar: Seeds ejecutados

- [ ] **Día 2-3:** Dev Backend debe estar en Fase 3 (Servicios)
  - Validar: Funciones de disponibilidad creadas
  - Validar: Testing manual completado

- [ ] **Día 1-3:** Dev Frontend debe estar en Fase 5 (Lógica)
  - Validar: Estados agregados
  - Validar: Effects funcionando

- [ ] **Día 4-5:** Ambos en Fase 6-7 (Integración)
  - Validar: E2E funcionando

### Bloqueos
- [ ] Si hay bloqueo: Escalar a Tech Lead
- [ ] Si falta info del hospital: Contactar inmediatamente

---

## 📊 FIN DE SEMANA (Checkpoint)

### Validación de Progreso
- [ ] Revisar CHECKLIST_IMPLEMENTACION.md
- [ ] ¿Se completaron Fases 1-5?
- [ ] ¿Hay riesgos para completar en plazo?

### Prep para Semana 2
- [ ] Coordinar UAT con hospital (si aplica)
- [ ] Preparar ambiente de testing
- [ ] Revisar bugs encontrados

---

## 📋 TAREAS DELEGADAS A DEVS

### Dev Backend
**Asignar en Jira/Trello con links a:**
1. REQUERIMIENTO sección "Backend"
2. CODIGO_REFERENCIA sección "Backend"
3. CHECKLIST Fases 1-4

**Epic/Historia:**
```
Como Personal Administrativo,
Necesito que el sistema valide disponibilidad de médicos,
Para no sobrecargar a los doctores y agendar citas con confianza
```

**Subtareas:**
- [ ] Crear tabla HorarioMedico
- [ ] Crear servicio de disponibilidad
- [ ] Implementar GET /medicos/especialidad
- [ ] Implementar GET /medicos/:id/disponibilidad
- [ ] Modificar POST /citas con validaciones
- [ ] Crear seed data
- [ ] Testing manual

### Dev Frontend
**Asignar en Jira/Trello con links a:**
1. REQUERIMIENTO sección "Frontend"
2. CODIGO_REFERENCIA sección "Frontend"
3. CHECKLIST Fases 1, 5-8

**Epic/Historia:** [Misma que Backend]

**Subtareas:**
- [ ] Agregar estados a CreateAppointmentForm
- [ ] Crear effect para cargar médicos
- [ ] Crear effect para validar disponibilidad
- [ ] Crear helper functions
- [ ] Reemplazar input médico por select
- [ ] Agregar indicador de disponibilidad
- [ ] Testing integración
- [ ] Validar responsive

---

## 🔔 ALERTAS - Cosas que Podrían Salir Mal

### ⚠️ Breaking Change
**Problema:** medicoId será REQUERIDO
**Acción:** 
- [ ] Verificar cuántas citas existen sin médico
- [ ] Decidir plan de migración ANTES de implementar
- [ ] Comunicar a hospital si afecta datos históricos

### ⚠️ Falta de Horarios
**Problema:** No hay datos de horarios médicos
**Acción:**
- [ ] Contactar hospital AHORA para obtener horarios
- [ ] Si no tenemos: Usar datos de ejemplo para desarrollo
- [ ] Plan: Hospital proporciona datos antes de producción

### ⚠️ Cambios de Requerimiento
**Problema:** Hospital pide cambios a mitad de semana
**Acción:**
- [ ] Recibir cambios POr escrito
- [ ] Evaluar impacto en timeline
- [ ] Replantear si es necesario
- [ ] Comunicar nuevo timeline

### ⚠️ Performance
**Problema:** API de disponibilidad lenta con muchos médicos
**Acción:**
- [ ] Testing con datos reales
- [ ] Considerar caché si < 200ms
- [ ] Si lento: Agregar índices en BD
- [ ] Última opción: Optimizar lógica

---

## 💬 COMUNICACIÓN

### Slack/Teams
- [ ] Crea canal: #hospital-citas-disponibilidad
- [ ] Invita: Devs, Tech Lead, PM
- [ ] Usa para: Dudas rápidas, blockers

### Documentación
- [ ] Centraliza docs en: Drive/GitHub
- [ ] Compartidos con: Ambos devs + Tech Lead
- [ ] Lectura obligatoria: Devs deben confirmar

### Reuniones
- [ ] Daily standup: 15 min (9:30am?)
- [ ] Code review: 30 min (viernes?)
- [ ] UAT: 1 hora (siguiente semana si aplica)

---

## ✅ VALIDACIÓN PRE-PRODUCCIÓN

### Antes de ir a Producción
- [ ] 100% de features implementadas
- [ ] 0 bugs críticos
- [ ] QA testing completado
- [ ] Code review aprobado
- [ ] Hospital valida flujo (UAT)
- [ ] Performance validado
- [ ] Documentación actualizada

### Rollout Plan
- [ ] Testing inicial: Equipo interno
- [ ] Testing extendido: Algunos admins del hospital
- [ ] Producción: Todos los admins
- [ ] Monitoreo: Primeras 24-48 horas

---

## 📞 CONTACTOS A TENER LISTOS

```
DEV BACKEND: ____________________________
DEV FRONTEND: ____________________________
TECH LEAD: ____________________________
PM/PRODUCT: ____________________________
HOSPITAL CONTACT: ____________________________
CTO/DIRECTOR: ____________________________
```

---

## 📚 REFERENCIA RÁPIDA

| Documento | Cuándo | Tiempo |
|-----------|--------|--------|
| ONE_PAGER | Overview rápido | 5 min |
| BRIEF | Presentar a execs | 10 min |
| REQUERIMIENTO | Aclarar specs | 30 min |
| CODIGO_REFERENCIA | Devs coding | 25 min |
| FLUJO_VISUAL | Explicar flujo | 20 min |
| CHECKLIST | Tracking diario | 5 min |
| KICKOFF | Presentación | 30 min |
| INDICE | Navegar docs | 5 min |

---

## 🚀 ESTADOS DE PROGRESO

```
Semana 1:
├─ Lunes: Kickoff + Devs leen (0% código)
├─ Martes: Backend DB creado (10% código)
├─ Miércoles: Backend Servicios (30% código)
├─ Jueves: Frontend Lógica (50% código)
├─ Viernes: Integración + Testing (80% código)
└─ Sábado: Fixes y Refinement (95% código)

Semana 2:
├─ Lunes: UAT (95% código)
├─ Martes-Miércoles: Fixes (98% código)
└─ Jueves: 100% + Deployment
```

---

## ✨ FINAL CHECKLIST

Antes de iniciar:
- [ ] Documentación completada y revisada
- [ ] Devs asignados y confirmados
- [ ] Tech Lead disponible
- [ ] Preguntas clave respondidas
- [ ] Timeline acordado
- [ ] Jira/Trello preparado
- [ ] Canal de comunicación creado
- [ ] Kickoff agendado
- [ ] Ambiente de desarrollo listo
- [ ] BD con datos de ejemplo

---

**Creado:** 22 Enero 2026  
**Versión:** 1.0  
**Status:** ✅ LISTO PARA EJECUTAR

