# 🔐 CONFIGURACIÓN DE PROTECCIONES DE RAMA (RULESETS)

**Ubicación:** Archivo local para referencia  
**Propósito:** Instrucciones paso a paso para configurar protecciones en GitHub  
**Audiencia:** Co-líder (quien configura GitHub)  
**Última actualización:** 31 de Octubre, 2025  
**⚠️ NOTA IMPORTANTE:** GitHub migró a **Rulesets**. El sistema anterior (Branch Protection Rules) sigue disponible pero Rulesets es el nuevo estándar.

---

## ⚡ RESPUESTA RÁPIDA A TU PREGUNTA

### ¿Qué pasó con las opciones que vi antes?

✅ **GitHub rediseñó el panel de Branch Protection**

**Lo que observaste:**
- Solo ves `✅ Require a pull request before merging`
- Las otras opciones desaparecieron del formulario
- Aparece un nuevo panel de **Rulesets**

**Explicación:**
GitHub está migrando del sistema antiguo (Branch Protection Rules) al nuevo (Rulesets). El panel que ves ahora es el nuevo:

```
ANTES:  Settings > Branches > Add rule
  └─ Mostraba todas las opciones en un formulario

AHORA:  Settings > Rules > Create ruleset
  └─ Muestra un formulario diferente y más moderno
```

### ¿Debo usar Rulesets o Branch Protection?

| Pregunta | Respuesta |
|----------|----------|
| ¿Es obligatorio? | NO. Branch Protection sigue funcionando. |
| ¿Cuál es mejor? | Rulesets es el nuevo estándar recomendado. |
| ¿Debo migrar ya? | SÍ, antes del kickoff del proyecto. |
| ¿Pueden coexistir? | SÍ, especialmente para `leads-only`. |

### ¿Cómo configuro leads-only con Rulesets?

```
PASO 1: Ve a Settings > Rules > Create ruleset
PASO 2: Nombre: "Proteger leads-only (Solo Admins)"
PASO 3: Target: refs/heads/leads-only
PASO 4: Habilita:
  ✅ Require a pull request before merging (1 aprobación)
  ✅ Block force pushes
  ✅ Restrict deletions
  ✅ Restrict who can push (Bypass list)
     └─ Solo: Tu usuario + Co-líder

RESULTADO: Solo admins pueden mergear a leads-only
```

**Si NO ves "Restrict who can push":**
→ Usa Branch Protection ADICIONAL (ver Tarea 3 - ALTERNATIVA 1)

---

## 🆕 CAMBIOS EN GITHUB (2024-2025)

GitHub ha transicionado a un nuevo sistema llamado **Rulesets** que reemplaza las Branch Protection Rules anteriores:

| Aspecto | Branch Protection (Antiguo) | Rulesets (Nuevo) |
|--------|------------------------|----------|
| **Ubicación** | Settings > Branches | Settings > Rules > Rulesets |
| **Scope** | Solo ramas específicas | Ramas, tags, o patrones |
| **Flexibilidad** | Limitada | Mayor control |
| **Status** | Deprecado (seguirá funcionando) | ✅ Recomendado |
| **Enforcement** | Solo merge | Merge + Push + Force push |

**Recomendación:** Usa **Rulesets** para nuevas configuraciones.

---

## �️ CÓMO ACCEDER A RULESETS

### Ubicación en GitHub UI

```
GitHub.com > Tu Repositorio
  ↓
Settings (pestaña)
  ↓
LEFT SIDEBAR > Rules (sección nueva)
  ├─ Rulesets (aquí van los Rulesets nuevos)
  └─ (Si también ves "Branches" es el sistema antiguo)
```

### Paso a Paso para Crear un Ruleset

```
1. Ve a: https://github.com/[owner]/hospital-management/settings/rules/rulesets

2. Click: "+ New ruleset" (botón verde)

3. Selecciona: "New branch ruleset" 
   (Si ves opciones, también existe "Tag ruleset")

4. Aparece el formulario con las secciones:
   ├─ Ruleset name (nombre)
   ├─ Enforcement (Active/Evaluate)
   ├─ Target repositories
   ├─ Conditions
   ├─ Rules (lista de reglas)
   └─ Bypass actors (quién puede saltarse)

5. Completa según cada tarea (main, develop, leads-only)
```

### Diferencias Clave con el Sistema Antiguo

```
ANTES (Branch Protection Rules):
  Settings > Branches > Add rule
  ├─ Solo protege merge
  ├─ Opciones limitadas
  └─ "Include administrators" era una opción

AHORA (Rulesets):
  Settings > Rules > Create ruleset
  ├─ Protege merge + push + force push
  ├─ Mayor control granular
  ├─ "Bypass actors" controla quién puede saltarse
  └─ Más flexible y moderno
```

---

### Tarea 1: Proteger Rama `main` (Con Rulesets)

**Acceso:** GitHub > Settings > Rules > Create ruleset

```
PASO 1: Información Básica
├─ Ruleset name: "Proteger main"
├─ Enforcement status: ✅ Active
└─ Target repositories: (Este repositorio actual)

PASO 2: Scope (Ámbito de Aplicación)
├─ Include: 
│  └─ ref_name: main
└─ Exclude: (dejar vacío)

PASO 3: Rules (Reglas a Aplicar)
├─ ✅ Require a pull request before merging
│  ├─ Required approvals: 2
│  ├─ Dismiss stale pull request approvals: YES
│  ├─ Require review from code owners: NO
│  └─ Require approval of reviews before dismissing: NO
│
├─ ✅ Require status checks to pass
│  ├─ Require branches to be up to date: YES
│  └─ Required checks:
│     ├─ ESLint
│     ├─ Jest Tests
│     └─ Build
│
├─ ✅ Block force pushes
│  └─ (Automático al usar rulesets)
│
├─ ✅ Restrict deletions
│  └─ (Automático al usar rulesets)
│
├─ ✅ Require linear history
│  └─ NO (opcional, solo si quieres commits lineales)
│
└─ ❌ Bypass list
   └─ No hay bypasses (ni admins pueden saltarse estas reglas)
```

**Resultado:** main está totalmente protegida con 2 aprobaciones + status checks.

---

### Tarea 2: Proteger Rama `develop` (Con Rulesets)

**Acceso:** GitHub > Settings > Rules > Create ruleset

```
PASO 1: Información Básica
├─ Ruleset name: "Proteger develop"
├─ Enforcement status: ✅ Active
└─ Target repositories: (Este repositorio actual)

PASO 2: Scope
├─ Include:
│  └─ ref_name: develop
└─ Exclude: (dejar vacío)

PASO 3: Rules
├─ ✅ Require a pull request before merging
│  ├─ Required approvals: 1
│  ├─ Dismiss stale pull request approvals: YES
│  ├─ Require review from code owners: NO
│  └─ Require approval of reviews before dismissing: NO
│
├─ ✅ Require status checks to pass
│  ├─ Require branches to be up to date: YES
│  └─ Required checks:
│     ├─ ESLint
│     └─ Jest Tests
│
├─ ✅ Block force pushes
│  └─ (Automático)
│
├─ ✅ Restrict deletions
│  └─ (Automático)
│
└─ ✅ Require linear history (OPCIONAL)
   └─ Recomendado para develop
```

**Resultado:** develop requiere 1 aprobación + status checks.

---

### Tarea 3: Proteger Rama `leads-only` ⭐ IMPORTANTE (Con Rulesets)

**Acceso:** GitHub > Settings > Rules > Create ruleset

```
PASO 1: Información Básica
├─ Ruleset name: "Proteger leads-only (Solo Admins)"
├─ Enforcement status: ✅ Active
└─ Target repositories: (Este repositorio actual)

PASO 2: Scope
├─ Include:
│  └─ ref_name: leads-only
└─ Exclude: (dejar vacío)

PASO 3: Rules
├─ ✅ Require a pull request before merging
│  ├─ Required approvals: 1
│  ├─ Dismiss stale pull request approvals: NO (estricto)
│  ├─ Require review from code owners: NO
│  └─ Require approval of reviews before dismissing: NO
│
├─ ❌ Require status checks to pass
│  └─ (No aplica para documentación)
│
├─ ✅ Block force pushes
│  └─ (Automático)
│
├─ ✅ Restrict deletions
│  └─ (Automático)
│
└─ ✅ Restrict who can push
   ├─ Type: Bypass list (IMPORTANTE)
   └─ Allow only:
      ├─ Users: [Tu usuario] + [Co-líder]
      └─ Roles: Admin (solo admins pueden pushear)
```

**¿Dónde está la opción "Restrict who can push"?**

Si NO ves esta opción en Rulesets, hay dos alternativas:

**ALTERNATIVA 1: Usa Branch Protection + Rulesets (Recomendado)**
```
1. Crea el Ruleset anterior (sin Restrict who can push)
2. Luego agrega Branch Protection Rule ADICIONAL:
   GitHub > Settings > Branches > Add rule
   ├─ Pattern: leads-only
   └─ ✅ Restrict who can push to matching branches
      └─ Solo: Tu usuario + Co-líder
```

**ALTERNATIVA 2: Solo Rulesets (Si tu cuenta permite bypass rules)**
```
En el Ruleset de leads-only, busca:
├─ Bypass list (o "Who can bypass ruleset")
│  └─ Add: [Tu usuario] + [Co-líder]
└─ Esto permite que solo admins puedan hacer push directo
```

**Resultado:** leads-only está protegida:
- ✅ Requiere PR (1 aprobación)
- ✅ Solo admins pueden pushear/mergear
- ✅ No se puede borrar
- ✅ No se puede force push
```

---

## 👥 Configuración de Acceso a Equipo

**Acceso:** GitHub > Settings > Collaborators and teams

### Paso 1: Crear Roles

```
Roles sugeridos en GitHub:
├─ Admin (2): Tú + Co-líder
│  └─ Full access, puede hacer push a cualquier rama
│
├─ Write (8): Todos los devs
│  └─ Puede hacer push a develop y feature/*, PRs
│
└─ Read (0): Stakeholders (si aplica)
   └─ Solo lectura, puede ver código
```

### Paso 2: Invitar Colaboradores

**Para cada desarrollador:**

```
1. Ve a: GitHub > Settings > Collaborators
2. Click "Add people"
3. Busca por email o username
4. Selecciona rol: "Write"
5. Envía invitación
6. Desarrollador acepta en su email
```

**Usuarios a invitar:**

| Nombre | Email | Rol | Team |
|--------|-------|-----|------|
| Co-líder | [email] | Admin | Leads |
| Dev 1 - Backend Lead | [email] | Write | Backend |
| Dev 2 - Frontend Lead | [email] | Write | Frontend |
| Dev 3 - Backend | [email] | Write | Backend |
| Dev 4 - Backend | [email] | Write | Backend |
| Dev 5 - Backend | [email] | Write | Backend |
| Dev 6 - Frontend | [email] | Write | Frontend |
| Dev 7 - Frontend | [email] | Write | Frontend |
| Dev 8 - Frontend | [email] | Write | Frontend |

### Paso 3: Crear Teams (Opcional pero recomendado)

```
Equipo: Backend
├─ Permisos: Write
├─ Miembros: Dev 1-5
└─ Propósito: Coordinar backend

Equipo: Frontend
├─ Permisos: Write
├─ Miembros: Dev 6-8
└─ Propósito: Coordinar frontend

Equipo: Leads (privado)
├─ Permisos: Admin
├─ Miembros: Tú + Co-líder
└─ Propósito: Decisiones estratégicas
```

---

## 🔍 Verificación Post-Configuración

**Checklist para confirmar que todo está correcto:**


---

## 🔍 VERIFICACIÓN POST-CONFIGURACIÓN (CON RULESETS)

### Para cada Ruleset creado, verifica:

#### Ruleset: "Proteger main"

```
GitHub > Settings > Rules > Rulesets

Verifica en el ruleset "Proteger main":
✅ Enforcement: Active
✅ Target: refs/heads/main
✅ Require a pull request: YES
✅ Required approvals: 2
✅ Require status checks: YES
   ├─ Require up to date: YES
   └─ Checks: ESLint, Jest Tests, Build
✅ Block force pushes: YES
✅ Restrict deletions: YES
```

#### Ruleset: "Proteger develop"

```
GitHub > Settings > Rules > Rulesets

Verifica en el ruleset "Proteger develop":
✅ Enforcement: Active
✅ Target: refs/heads/develop
✅ Require a pull request: YES
✅ Required approvals: 1
✅ Require status checks: YES
   ├─ Require up to date: YES
   └─ Checks: ESLint, Jest Tests
✅ Block force pushes: YES
✅ Restrict deletions: YES
```

#### Ruleset: "Proteger leads-only (Solo Admins)"

```
GitHub > Settings > Rules > Rulesets

Verifica en el ruleset "Proteger leads-only":
✅ Enforcement: Active
✅ Target: refs/heads/leads-only
✅ Require a pull request: YES
✅ Required approvals: 1
✅ Dismiss stale approvals: NO
✅ Block force pushes: YES
✅ Restrict deletions: YES
✅ Restrict pushes (Bypass list):
   └─ Solo: Tu usuario + Co-líder (Roles: Admin)

OJO: Si no ves "Bypass list" o "Restrict pushes":
 → Solución: Usa Branch Protection Rule ADICIONAL
   para esta rama (ver Tarea 3 - ALTERNATIVA 1)
```

---

## 📝 Pasos Recomendados por Orden

### Semana 1 (Antes del kickoff)

```
Día 1:
├─ [ ] Crear reglas para main
├─ [ ] Crear reglas para develop
└─ [ ] Crear reglas para leads-only

Día 2-3:
├─ [ ] Crear teams en GitHub
└─ [ ] Revisar que todo está configurado

Día 4:
├─ [ ] Invitar usuarios (Tú + Co-líder envían invitaciones)
└─ [ ] Confirmar que todos aceptaron

Día 5:
├─ [ ] Test: Dev hace PR a develop (verify flujo)
├─ [ ] Test: Approver aprueba PR
├─ [ ] Test: Auto-merge funciona
└─ [ ] Documentar cualquier issue
```

---


## 🚨 TROUBLESHOOTING

### Problema: No veo las opciones que mencionas en Rulesets

```
Síntoma: El formulario de Ruleset solo muestra "Require a pull request"
Causa: Es normal. GitHub reorganizó el formulario.

✅ Lo que VAS a ver en Rulesets:
├─ Require a pull request before merging
├─ Require status checks to pass
├─ Require branches to be up to date
├─ Require linear history
├─ Block force pushes
├─ Restrict deletions
├─ Require code scanning results to pass
└─ Restrict who can push (Bypass list)

❌ Lo que NO vas a ver (porque es obsoleto):
├─ Include administrators
├─ Allow auto-merge (está en otro lugar)
└─ Dismiss stale approvals (debajo de PR requirements)
```

### Problema: No puedo ver "Restrict who can push"

```
Causa: Depende de tu tipo de cuenta
Soluciones:

OPCIÓN 1: Busca "Bypass list" o "Bypass actors"
 → Cuando editas el Ruleset, ve al final
 → Busca sección "Bypass actors" o similar
 → Agrega los admins ahí

OPCIÓN 2: Usa Branch Protection ADICIONAL
 → Settings > Branches > Add rule
 → Pattern: leads-only
 → ✅ Restrict who can push to matching branches
 → Solo: Tu usuario + Co-líder

OPCIÓN 3: Combina Rulesets + Branch Protection
 → Crea Ruleset para "Require PR"
 → Crea Branch Rule para "Restrict push"
 → Ambos trabajan juntos
```

### Problema: Dev no puede hacer push a develop

```
Causas con Rulesets:
1. Dev tiene rol "Read" en lugar de "Write"
   → Solución: GitHub > Settings > Collaborators > Cambiar a Write

2. Dev no tiene SSH key configurada
   → Solución: `ssh-keygen -t ed25519` y agregar a GitHub

3. Status checks del Ruleset están fallando
   → Solución: Dev debe ejecutar ESLint/Tests localmente
   → Luego hacer commit y push de nuevo

4. Ruleset bloquea push directo a develop
   → Esto es INTENCIONAL (dev debe hacer PR)
   → Solución: Dev crea feature branch
   → Luego hace PR a develop
```

### Problema: Admin no puede mergear a leads-only

```
Causas:
1. Ruleset requiere 1 aprobación
   → Otro admin debe aprobar primero
   → INTENCIONAL para audit trail

2. Admin está en "bypass list" pero aún así bloqueado
   → Bypass list es solo para push directo
   → Para merge, sigue requiriendo la aprobación

3. No hay forma de que admin autoapruebe
   → Solución: Admin 1 hace PR + Admin 2 aprueba + Admin 1 mergea
```

### Problema: "leads-only" requiere Branch Rule + Ruleset?

```
La respuesta corta: Posiblemente SÍ
Porque: GitHub aún está en transición

Solución recomendada:
1. Crea Ruleset principal (Require PR, Block force push)
2. Crea Branch Rule adicional (Restrict who can push)
3. Ambos se aplican juntos
4. Así garantizas control total

Verificar si necesitas ambos:
 → Intenta hacer push a leads-only con un dev
 → Si te deja: Agrega Branch Rule
 → Si te bloquea: Solo Ruleset es suficiente
```

### Problema: No puedo ver rama leads-only en GitHub

```
Posibles causas:
1. Rama no fue pushed todavía
   → Solución: `git push origin leads-only`

2. No tienes permiso de ver
   → Solución: Verifica que eres Admin en el repo

3. Branch se eliminó accidentalmente
   → Solución: `git checkout -b leads-only origin/leads-only`
   → Luego: `git push origin leads-only`

4. Rama existe pero no aparece en "Branches"
   → Solución: GitHub a veces tarda en actualizar la UI
   → Intenta hacer refresh (F5)
   → O accede directamente: github.com/[owner]/repo/tree/leads-only
```

---

## 📞 REFERENCIA RÁPIDA DE URLs

### URLs Nuevas (Rulesets - Recomendado)

```
Crear/Editar Rulesets:
https://github.com/[owner]/hospital-management/settings/rules/rulesets
(Este es el nuevo estándar)

Ver todos los Rulesets activos:
https://github.com/[owner]/hospital-management/settings/rules

Ver configuración de Rules:
https://github.com/[owner]/hospital-management/settings/rules/rulesets
```

### URLs Antiguas (Branch Protection - Todavía disponible)

```
Configurar protecciones de rama (método antiguo):
https://github.com/[owner]/hospital-management/settings/branches
(Solo si necesitas usar Branch Protection Rules como alternativa)
```

### URLs Compartidas (Siguen funcionando)

```
Ver colaboradores:
https://github.com/[owner]/hospital-management/settings/access

Ver teams:
https://github.com/[owner]/hospital-management/settings/teams

Ver actividad de seguridad (Audit log):
https://github.com/[owner]/hospital-management/security/audit

Ver status checks de CI/CD:
https://github.com/[owner]/hospital-management/actions

Ver ramas del repositorio:
https://github.com/[owner]/hospital-management/branches
```

---

## ✅ Confirmación de Completación

Una vez que hayas completado todos los pasos, marca:

```
Configuración de Protecciones de Rama
├─ [ ] Rama main protegida (2 reviews)
├─ [ ] Rama develop protegida (1 review)
├─ [ ] Rama leads-only protegida (admin only)
├─ [ ] Status checks configurados (main y develop)
└─ [ ] Teams creados (Backend, Frontend, Leads)

Acceso de Usuarios
├─ [ ] Co-líder = Admin
├─ [ ] Backend devs (5) = Write
├─ [ ] Frontend devs (3) = Write
└─ [ ] Todos aceptaron invitación

Testing
├─ [ ] Test: Dev puede crear branch feature/*
├─ [ ] Test: Dev puede hacer PR a develop
├─ [ ] Test: PR require 1 approval
├─ [ ] Test: Admin puede mergear a main solo con 2 approvals
└─ [ ] Test: Lead-only is not mergeable por devs

Documentación
├─ [ ] RECURSOS_LIDERES.md en main ✅
├─ [ ] LIDERAZGO_DECISION_ESTRATEGICA.md en leads-only ✅
├─ [ ] ACTAS_REUNIONES_LIDERES.md en leads-only ✅
├─ [ ] ACCESO_EQUIPOS.md en leads-only ✅
└─ [ ] Este archivo (como referencia) guardado localmente
```

---

**Documento:** Configuración de Protecciones de Rama  
**Última revisión:** 31 de Octubre, 2025  
**Responsable:** Co-líder (configuración en GitHub)  
**Soporte:** Tú (líder principal) si hay dudas
