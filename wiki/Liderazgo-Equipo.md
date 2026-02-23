# 👥 Guía de Liderazgo de Proyecto: Gestión de Equipo de 10 Personas

**Dirigido a:** Líderes del proyecto (Tú + co-líder)  
**Objetivo:** Estrategias prácticas para coordinar un equipo grande en un proyecto complejo

---

## 📑 Tabla de Contenidos

1. [Principios de Liderazgo](#principios-de-liderazgo)
2. [Estructura Organizacional](#estructura-organizacional)
3. [Comunicación Efectiva](#comunicación-efectiva)
4. [Gestión de Tareas](#gestión-de-tareas)
5. [Resolución de Conflictos](#resolución-de-conflictos)
6. [Motivación del Equipo](#motivación-del-equipo)
7. [Gestión de Riesgos](#gestión-de-riesgos)
8. [Reuniones Efectivas](#reuniones-efectivas)
9. [Documentación](#documentación)
10. [Métricas de Éxito](#métricas-de-éxito)

---

## 🎯 Principios de Liderazgo

### 1. **Claridad sobre Velocidad**
En equipos grandes, es mejor ir más lento pero con claridad que rápido y con confusión.

```
❌ "Todos hagan lo que crean mejor"
✅ "Estos son los pasos exactos, aquí está el design doc"
```

### 2. **Documentar TODO**
Lo que está en la cabeza de una persona está perdido para el equipo.

```
Regla: Si lo dices en una reunión, documéntalo.
Si está en un email, ponlo en GitHub/Notion.
Si está en Slack, crea un issue.
```

### 3. **Responsabilidad Clara**
Cada tarea debe tener UN responsable, aunque el trabajo lo haga equipo.

```
❌ "Este módulo lo hacemos entre todos"
✅ "Carlos es responsable del módulo de pacientes, apoyado por María"
```

### 4. **Confianza y Autonomía**
Delega tareas, pero sé disponible. No micromanagees.

```
✅ Define qué quieres (objetivo)
✅ Establece límites (deadline, scope)
✅ Confía en cómo lo hacen
❌ No controles cada paso
```

### 5. **Feedback Constante**
No esperes a las retrospectivas. Feedback es continuo.

```
Semanal: "¿Cómo va?"
Mensual: "¿Qué necesitas de mí?"
Trimestral: "Retrospectiva"
```

---

## 🏢 Estructura Organizacional

### Modelo Recomendado: 3 Sub-equipos

```
PROJECT LEADS (Tú + Co-líder)
│
├── BACKEND LEAD (1 persona)
│   ├── Developer 1
│   ├── Developer 2
│   └── Developer 3
│
├── FRONTEND LEAD (1 persona)
│   ├── Developer 1
│   ├── Developer 2
│   └── Developer 3
│
└── DEVOPS/QA LEAD (1 persona)
    ├── DevOps Engineer
    └── QA Engineer
```

### Responsabilidades por Nivel

#### Project Leads (Tú + Co-líder)
- **Visión**: Asegurar que el proyecto avanza hacia objetivos
- **Coordinación**: Integración entre equipos
- **Hospital**: Comunicación con cliente
- **Escalación**: Resolver bloqueos
- **Decisiones**: Arquitectura, tecnología, procesos

**Tiempo**: ~20-30 horas/semana
**Reuniones**: Líderes (diarios), Hospital (según necesidad), Equipo completo (semanales)

#### Sub-leads (Backend, Frontend, DevOps)
- **Técnica**: Decisiones técnicas en su área
- **Código**: Review de PRs, asegurar calidad
- **Equipo**: Mentoring, resolución de bloques
- **Documentación**: Specs técnicas de su área

**Tiempo**: ~25-30 horas/semana
**Reuniones**: Su equipo (dailies), Leads (3x semana), Integración (semanales)

#### Developers/Engineers
- **Implementación**: Escribir código, tests
- **Comunicación**: Reportar avance, bloques
- **Documentación**: Mantener actualizada
- **Calidad**: Revisar PRs de pares

**Tiempo**: ~35-40 horas/semana
**Reuniones**: Su equipo (dailies), Reunión general (semanales)

---

## 💬 Comunicación Efectiva

### Canales de Comunicación (Por Urgencia)

| Canal | Urgencia | Tiempo Respuesta | Uso |
|-------|----------|------------------|-----|
| **Slack (crítico)** | CRÍTICA | 5 min | Servidor caído, bloques críticos |
| **Slack (general)** | Alta | 15 min | Preguntas, actualizaciones rápidas |
| **GitHub Issues** | Media | 1 hora | Tareas, bugs, feature requests |
| **Email/Documentación** | Baja | 24 horas | Decisiones, documentación, archivos |
| **Reuniones** | Planificadas | - | Decisiones complejas, feedback |

### Reglas de Slack

```
✅ HACE: "Estoy bloqueado en X. Necesito ayuda del backend."
❌ NO HACE: "¿Alguien?"

✅ HACE: Thread para respuestas (no flood del canal)
❌ NO HACE: Spam de mensajes individuales

✅ HACE: Menciona a personas relevantes (@Carlos, @María)
❌ NO HACE: @everyone o @channel sin razón urgente

✅ HACE: Updates en standup escrito (si no puedes estar en meeting)
❌ NO HACE: Desaparecer sin comunicar
```

### Documentación de Decisiones

**Formato ADR (Architecture Decision Record):**

```markdown
# ADR-001: Usar JWT para Autenticación

## Contexto
Necesitamos un sistema de autenticación escalable para 10+ usuarios

## Decisión
Usaremos JWT (JSON Web Tokens) con refresh tokens

## Justificación
- Stateless (escalable)
- Estándar de industria
- Compatible con PWA
- Seguro si se implementa correctamente

## Consecuencias
- Necesitamos rotating keys
- Token revocation es más complejo
- Auditoría de sesiones es importante

## Alternativas Consideradas
- Sessions tradicionales (menos escalable)
- OAuth2 (overkill para proyecto interno)
```

**Ubicación**: `/docs/ADR/`

### Comunicación con Hospital

#### Reuniones Periódicas
- **Semanal (15 min)**: Avance informal
- **Bi-semanal (1 hora)**: Status formal
- **Mensual (2 horas)**: Sesión de validación/feedback

#### Reportes
```
Estructura de Reporte Semanal:

📊 Semana del X al Y

✅ Completado esta semana:
- Autenticación funcional
- CRUD de pacientes
- Dashboard básico

🔄 En progreso:
- Integración frontend-backend (en curso)
- Estilos CSS (50% completado)

🚧 Bloques:
- Datos de prueba: necesitamos más info del hospital
- SSL: necesitamos servidor

📅 Próxima semana:
- Testing con usuarios
- Ajustes de UX
```

---

## 📋 Gestión de Tareas

### Principios

1. **Una tarea = Una persona responsable**
2. **Tareas: máximo 1 semana de trabajo**
3. **Dependencies claras**
4. **Estimaciones realistas**

### Flujo de Tareas

```
CREAR ISSUE
    ↓
DISCUTIR EN STANDUP
    ↓
ASIGNAR RESPONSABLE + DEADLINE
    ↓
MOVER A "EN PROGRESO"
    ↓
CREAR RAMA + PULL REQUEST
    ↓
REVIEW (CÓDIGO + TESTING)
    ↓
MERGE
    ↓
VERIFICACIÓN EN STAGING
    ↓
MOVER A "DONE"
```

### Template de Issue

```markdown
## Descripción
Breve explicación de qué necesita hacerse

## Aceptancia
- [ ] Criterio 1
- [ ] Criterio 2
- [ ] Tests implementados
- [ ] Documentado

## Tareas técnicas
- [ ] Paso 1
- [ ] Paso 2

## Estimación
3 días (story points: 3)

## Bloques Potenciales
- Necesita dato X del hospital
- Depende de issue #123

## Asignado a
@carlos
```

### Estimación de Tareas (Planning Poker)

**Escala de Story Points: Fibonacci (1, 2, 3, 5, 8)**

- **1 punto**: 1 hora (rutinario)
- **2 puntos**: 4 horas (conocido)
- **3 puntos**: 8 horas (con algunos unknowns)
- **5 puntos**: 2-3 días (complejo, necesita testing)
- **8 puntos**: 3+ días (muy complejo, divide en tareas menores)

**Nunca estimes > 8 puntos. Divide la tarea.**

### Burndown (Seguimiento)

```
Cada viernes:
Total de puntos: 50
- Completado: 35 (70%)
- En progreso: 8 (16%)
- No empezado: 7 (14%)

Tendencia: Vamos bien. Si continuamos, terminaremos viernes.
```

---

## 😤 Resolución de Conflictos

### Tipos Comunes en Proyectos Grupo

#### 1. Desacuerdo Técnico (Backend vs Frontend)
```
Escenario: "Las validaciones deben estar en backend"
vs "Las validaciones deben estar en frontend"

Solución:
✅ Ambas (defensa en profundidad)
✅ Documentar en ADR
✅ Backend lead y Frontend lead deciden
```

#### 2. Falta de Comunicación
```
Escenario: Developer 1 hace trabajo que Developer 2 ya estaba haciendo

Solución:
✅ Revisar Daily Standup process
✅ GitHub Issues actualizadas antes de comenzar
✅ Slack notification cuando asignas tarea
```

#### 3. Diferencia de Velocidad
```
Escenario: Algunos termina rápido, otros se quedan atrás

Solución:
✅ Code review más exhausto (más aprendizaje)
✅ Pair programming
✅ Tareas más complejas a más rápidos
✅ Mentoring de más lentos
```

#### 4. Uno se va (emergencia, abandono)
```
Escenario: Un developer no puede continuar

Solución:
✅ Documentación completa (no está en su cabeza)
✅ Task handover claro
✅ Redistribuir tareas
✅ Reunión 1-on-1 para entender razón
```

### Framework de Resolución

```
1. ESCUCHAR: Entiende todas las perspectivas (15 min)
2. ANALIZAR: ¿Cuál es el core del problema? (10 min)
3. GENERAR: ¿Cuáles son posibles soluciones? (10 min)
4. DECIDIR: Como líder, toma decisión clara (5 min)
5. DOCUMENTAR: Explica la decisión al equipo (5 min)
6. SEGUIR: Asegura que se cumple (diario)
```

---

## 💪 Motivación del Equipo

### Factores de Motivación en Proyectos Grupo

#### 1. Claridad de Propósito
```
❌ "Hacemos una app para un hospital"
✅ "Haremos una app que va a reducir los tiempos de espera
   en el hospital militar y potencialmente salvar vidas.
   Cada uno de ustedes es responsable de que funcione bien."
```

#### 2. Reconocimiento
```
SEMANAL:
- Mensajes en Slack: "Felicidades a Carlos por terminar validación"
- Standup destaca logros

MENSUAL:
- Email al profesor/equipo: "Este mes, María lideró testing y encontró 15 bugs"

ANUAL (Cuando termine):
- Certificados de participación
- Testimonios sobre su contribución
- GitHub stargazers reconocimiento
```

#### 3. Empoderamiento
```
NO: "Necesito que hagas exactamente esto"
SÍ: "Necesitamos autenticación robusta. Aquí están los reqs.
     Confío en ti para diseñar la solución. ¿Qué necesitas?"
```

#### 4. Desarrollo Profesional
```
- Enseña a otros (Pair programming)
- Code reviews donde aprendan
- Libros/cursos recomendados
- Experiencia en GitHub (portfolio)
```

#### 5. Ambiente Positivo
```
✅ Manejo profesional de conflictos
✅ No gritar/intimidar
✅ Humor (¡sin ofender!)
✅ Empatía: "Viernes cansador, terminemos para disfrutar el fin de semana"
✅ Flexibilidad: "¿Necesitas 2 horas hoy por X razón? Ok, sin problema"
```

### Banderas Rojas de Desmotivación

| Señal | Qué significa | Acción |
|-------|---------------|--------|
| Menor participación en Slack | Quizás se siente excluido | 1-on-1 privado |
| Retrasos continuos | Quizás está abrumado | Simplifica tareas |
| Comentarios negativos | Frustración | Retrospectiva 1-on-1 |
| Ausencias a reuniones | Podría haber problema | Chequea cómo está |
| Código de baja calidad | Desinterés o presión | Reduce carga, revisa |

### Actividades de Team Building

- **Llamada de kick-off**: Conocerse, entusiasmo
- **Memes de código**: Comparte memes técnicos en Slack
- **Pair programming sessions**: Conocer a otros
- **Virtual lunch**: Come juntos (online)
- **Demo day**: Muestra lo logrado (incluso parcial)
- **Celebración**: Cuando termines hito importante

---

## ⚠️ Gestión de Riesgos

### Riesgos Comunes en Proyectos Grupo

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|--------|-----------|
| Someone abandons project | Media | Alto | Documentación, multi-person review |
| Technical debt acumula | Alta | Alto | Code reviews, refactoring schedule |
| Scope creep | Alta | Medio | Clear requirements, change log |
| Fallos en comunicación | Alta | Medio | Daily standups, Slack discipline |
| Someone is unproductive | Media | Bajo-Medio | Clear expectations, feedback |
| Hospital cambia requisitos | Media | Alto | Regular validation, documented changes |
| Diferentes niveles de skill | Alta | Bajo | Pair programming, mentoring |
| Time zone/availability issues | Baja | Bajo | Asincrónico, documentación |

### Plan de Contingencia: ¿Qué si alguien se va?

```
PREVENCIÓN:
1. Documentación completa (no en cabeza)
2. Multi-person code ownership
3. Knowledge sharing sessions
4. Documentación de onboarding

SI ALGUIEN SE VA:
1. Reunión inmediata para entender por qué
2. Hacer handover documentado
3. Reasignar tareas de 1-on-1
4. Actualizar sprint plan
5. Posible 1.5x temporal en carga del equipo
6. Post-mortem: ¿Cómo prevenimos esto?
```

### Risk Register

```markdown
# Risk Register - Hospital Management System

## R001: Database Schema Change Late
- **Probabilidad**: Media
- **Impacto**: Alto
- **Mitigación**: Validación temprana con hospital, migrations planeadas
- **Owner**: Carlos (Backend Lead)

## R002: Frontend-Backend desincronización
- **Probabilidad**: Alta
- **Impacto**: Medio
- **Mitigación**: Regular integration tests, shared API spec (Swagger)
- **Owner**: Líderes

... más riesgos ...
```

---

## 📞 Reuniones Efectivas

### Tipos de Reuniones

#### 1. DAILY STANDUP (15 minutos)
**Frecuencia**: Diariamente (10 AM recomendado)  
**Formato**: Cada persona en 2-3 minutos

```
- Ayer hice: X
- Hoy haré: Y
- Me bloquea: Z
```

**Reglas:**
- ✅ Puntos concretos
- ✅ En el horario
- ✅ Si no puedes ir, actualizas en Slack/GitHub
- ❌ NO es para resolver problemas (para después)
- ❌ NO es un status report formal

#### 2. BACKLOG REFINEMENT (45 min, mitad de semana)
**Participantes**: Leads + desarrolladores (no todos)  
**Objetivo**: Preparar tareas para próxima semana

```
- Revisar próximas tareas
- Aclarar requerimientos
- Estimar con planning poker
- Identificar bloques
```

#### 3. SPRINT PLANNING (1 hora, viernes 9 AM)
**Participantes**: Todo el equipo  
**Objetivo**: Acordar work para próxima semana

```
- Revisar completado
- Discutir próximas prioridades
- Asignar responsables
- Deadline clara
```

#### 4. SPRINT REVIEW / DEMO (1 hora, viernes 11 AM)
**Participantes**: Todo el equipo + hospital (si es posible)  
**Objetivo**: Mostrar lo completado

```
Cada sub-equipo demuestra:
- Backend: Nuevos endpoints (Postman)
- Frontend: Nuevas páginas (vivo)
- DevOps: Infraestructura/CI-CD
```

#### 5. RETROSPECTIVE (1 hora, viernes 12 PM)
**Participantes**: Todo el equipo  
**Objetivo**: ¿Qué mejorar?

```
Formato: Went Well → Didn't Go Well → Try Next
- ¿Qué funcionó bien?
- ¿Qué no funcionó?
- ¿Qué mejoramos próxima semana?

Formato alternativo: Sailboat

┌─ Viento (lo que nos impulsa)
├─ Barco (lo que está bien)
├─ Ancla (lo que nos frena)
└─ Islas (futuro objetivo)
```

#### 6. 1-ON-1 LEADS WITH TEAM
**Frecuencia**: Mensual (30 min por persona)  
**Objetivo**: Feedback individual, desarrollo

```
Agenda:
- ¿Cómo te sientes en el proyecto?
- ¿Qué estás aprendiendo?
- ¿Hay algo que necesites?
- Feedback constructivo
- Reconocimiento
```

#### 7. LEADS SYNC (1-2 horas, 3x semana)
**Participantes**: Project Leads + Sub-leads  
**Objetivo**: Decisiones, coordinación, problemas

```
- Estado de cada equipo
- Bloques de integración
- Decisiones técnicas
- Coordinación con hospital
- Escalaciones
```

#### 8. HOSPITAL COORDINATION (1-2 horas, bi-weekly)
**Participantes**: Project Leads + Hospital Coordinator  
**Objetivo**: Feedback, requisitos, logística

```
- Validación de requerimientos
- Feedback de mockups
- Cambios de scope
- Disponibilidad para testing
- Logística (acceso, horarios)
```

### Plantilla de Agenda

```markdown
# DAILY STANDUP - Lunes 31 Oct, 10 AM

## Asistencia esperada
- [ ] Backend Team (3 personas)
- [ ] Frontend Team (3 personas)
- [ ] DevOps
- [ ] Project Leads

## Puntos
1. Ronda rápida: ayer/hoy/bloques (12 min)
2. Bloques críticos (3 min)
   - Base de datos no conecta (Backend Lead → DevOps)
3. Recordatorio: Sprint ends viernes (0 min)

## Post-meeting
- Quien identificó bloque → Slack con detalles
```

---

## 📚 Documentación

### Tipos de Documentación

#### 1. Technical Documentation
**¿Qué?** Cómo funciona técnicamente  
**Donde?** `/docs/` en GitHub  
**Quién?** Sub-leads de cada área  
**Cuando?** A medida que se desarrolla

```
- ARQUITECTURA.md
- API.md (con Swagger link)
- DATABASE.md (esquemas)
- SEGURIDAD.md
- SETUP.md (cómo correr localmente)
```

#### 2. User Documentation
**¿Qué?** Cómo usar la aplicación  
**Donde?** PDF separado  
**Quién?** QA + Líderes  
**Cuando?** Antes de piloto

```
- Manual de Usuario (PDF)
- Video tutoriales
- FAQ
- Troubleshooting
```

#### 3. Project Documentation
**¿Qué?** Gestión del proyecto  
**Donde?** GitHub Wiki  
**Quién?** Líderes  
**Cuando?** Semana 0

```
- Guía de Contribución
- Estándares de Código
- Procesos (cómo hacer PR, etc)
- Roles y Responsabilidades
```

#### 4. Decision Log
**¿Qué?** Por qué decidimos X  
**Donde?** `/docs/ADR/`  
**Quién?** Person que propone decisión  
**Cuando?** Inmediatamente después de decidir

### Documentación Mínima Requerida

| Documento | Deadline | Owner |
|-----------|----------|-------|
| GUIA_PROYECTO.md | Semana 0 | Líderes |
| CONTRIBUTING.md | Semana 0 | Líderes |
| API.md (Swagger) | Semana 3 | Backend Lead |
| DATABASE.md | Semana 2 | Backend BD person |
| SETUP.md | Semana 1 | DevOps |
| MANUAL_USUARIO.md | Semana 11 | QA |
| ADRs (conforme se decide) | Ongoing | Proponents |

---

## 📊 Métricas de Éxito

### Métricas del Proyecto

#### 1. Velocidad (Tareas completadas por semana)

```
Semana 1: 25 puntos
Semana 2: 28 puntos
Semana 3: 32 puntos (ramp-up normal)
Semana 4-8: ~35 puntos/semana (steady state)
Semana 9-12: ~30 puntos/semana (QA/testing)

Meta: Completar 70%+ del trabajo planeado cada semana
```

#### 2. Calidad de Código

```
- Coverage de tests: 70%+ (meta)
- Vulnerabilidades: 0 (críticas)
- Bugs por PR: < 1 después de testing
- Lint warnings: 0 en main
```

#### 3. Entrega a Tiempo

```
- Sprints completados a tiempo: 90%+
- Critical bugs encontrados late: 0
- Cambios de scope: Documentados
```

#### 4. Satisfacción del Equipo

**Encuesta cada 2 semanas:**
```
¿Entiendes los objetivos? 1-5
¿Tienes herramientas que necesitas? 1-5
¿Estás aprendiendo? 1-5
¿Me siento parte del equipo? 1-5
¿Hay comunicación clara? 1-5

Meta: Promedio > 4/5
```

#### 5. Satisfacción del Hospital

```
Reuniones bi-semanales:
- Requisitos entendidos: 90%+
- Feedback incorporado: Dentro de 1 semana
- Issues encontrados temprano: >70%
```

### Dashboard de Proyecto

```
┌─ GENERAL ─────────────────┐
│ Progress: ████████░░ 80%  │
│ On Track: ✅               │
│ Velocity: 35 pts/semana   │
└───────────────────────────┘

┌─ POR EQUIPO ──────────────┐
│ Backend:  ███████░░░ 70%  │
│ Frontend: █████░░░░░ 50%  │
│ DevOps:   ██████████100%  │
└───────────────────────────┘

┌─ RIESGOS ─────────────────┐
│ 🟢 2 Low                  │
│ 🟡 1 Medium               │
│ 🔴 0 Critical             │
└───────────────────────────┘

┌─ PRÓXIMO HITO ────────────┐
│ Validación con hospital   │
│ 14/11/2025                │
│ Responsable: Líderes      │
└───────────────────────────┘
```

---

## 🎓 Situaciones Específicas

### Situación 1: "Las 10 personas no saben qué hacer"

```
Causas posibles:
- Falta de claridad en tareas
- Tareas muy grandes
- Bloqueos no resueltos
- Comunicación rota

Solución:
1. Emergency meeting 30 min
2. Priorizar 10-15 tareas pequeñas
3. Asignar 1-on-1
4. Daily check-in esa semana
5. Retrospectiva: ¿Cómo prevenimos?
```

### Situación 2: "Una persona se abrumó"

```
Señales:
- Bajo desempeño
- Comentarios negativos
- Ausencias

Acción:
1. 1-on-1 privado, empático
2. Escucha qué es el problema
3. Reduce carga inmediatamente
4. Asigna mentor/buddy
5. Check-in semanal por 2 semanas
6. Reconoce esfuerzo (incluso parcial)
```

### Situación 3: "Dos personas tienen conflicto"

```
Ejemplo: Frontend wants validations in frontend only.
         Backend wants validations in backend.

Proceso:
1. Escucha a ambos por separado (15 min c/u)
2. Junta en video, tú media (15 min)
3. Solución: "Ambos lugares, aquí el design"
4. Documenta en ADR-XXX
5. Cierra issue en GitHub
6. Follow-up en 1 semana
```

### Situación 4: "Hospital cancela reunión / cambia requisitos"

```
❌ Pánico, cambio de planes inmediato
✅ Proceso:
1. Entiende la razón
2. Documente el cambio
3. Evalúa impacto
4. Replan sprint si es necesario
5. Comunica al equipo

Cambios GRANDES:
- Emergency leads meeting
- Escalación si afecta deadline

Cambios pequeños:
- GitHub issue con "changed-scope"
- Comentario en próxima retrosp
```

---

## ✅ Checklist Inicial (Líderes)

### Antes de Semana 0
- [ ] Define roles con co-líder
- [ ] Prepara presentación de kickoff
- [ ] Crea GitHub organization/repo
- [ ] Setup GitHub Projects (Kanban)
- [ ] Crea Slack/Discord
- [ ] Prepara documento CONTRIBUTING.md

### Semana 0 - Lunes
- [ ] Primer commit al repo
- [ ] Notifica equipo
- [ ] Enviado link a GitHub
- [ ] Enviado link a Slack

### Semana 0 - Miércoles
- [ ] Reunión de Kickoff (2-3 horas)
- [ ] Explica proyecto, stack, roles
- [ ] Q&A
- [ ] Todos entienden su rol

### Semana 0 - Jueves
- [ ] Primer daily standup (prueba)
- [ ] Todos se presentan
- [ ] Feedback del proceso

### Semana 0 - Viernes
- [ ] Sprint planning (tareas semana 1)
- [ ] Retrospective: "¿Qué aprendimos?"
- [ ] Ambiente setup verificado en todos

---

## 🚀 Ultimas Palabras

### Para Líderes (Tú)

```
1. Tu trabajo NO es escribir código
   → Es que otros escriban código exitosamente

2. Tu trabajo NO es saber todo
   → Es saber quién sabe qué y conectarlos

3. Tu trabajo NO es resolver problemas
   → Es que el equipo resuelva problemas

4. Tu trabajo NO es ser amigo
   → Pero tampoco ser enemigo

5. Tu trabajo SÍ es:
   ✅ Dar claridad
   ✅ Remover bloques
   ✅ Celebrar éxitos
   ✅ Aprender de fracasos
   ✅ Motivar
   ✅ Proteger al equipo de presión externa
   ✅ Tomar decisiones difíciles cuando sea necesario
```

### Para el Equipo (Comunica)

```
"Este proyecto es grande. 10 personas. Pero somos EQUIPO.

Esto significa:
- Nos comunicamos claro
- Nos ayudamos mutuamente
- Celebramos juntos
- Fallamos como equipo, no como individuos
- Nadie se queda atrás

Confío en ustedes. Vamos a hacer algo increíble."
```

---

**Versión**: 1.0  
**Autor**: Equipo de Liderazgo  
**Última actualización**: Octubre 31, 2025
