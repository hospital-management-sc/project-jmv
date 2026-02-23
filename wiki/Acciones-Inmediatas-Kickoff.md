# ⚡ ACCIONES INMEDIATAS: Antes del Kickoff (1 de Noviembre)

**Propósito:** Checklist de lo que debes hacer HOY  
**Tiempo estimado:** 1.5 horas  
**Fecha:** 31 de Octubre, 2025  
**Estado:** CRÍTICO - Antes del kickoff

---

## 📋 RESUMEN: 4 ACCIONES PRINCIPALES

```
ACCIÓN 1: Configurar Rulesets (Protecciones de rama)
└─ Tiempo: ~30 minutos
└─ Archivo: GUIA_PROTEGER_LEADS_ONLY_RULESETS.md

ACCIÓN 2: Cambiar roles de colaboradores
└─ Tiempo: ~20 minutos
└─ Archivo: CAMBIAR_ROL_COLABORADORES_GITHUB.md

ACCIÓN 3: Agregar los 8 integrantes al repo
└─ Tiempo: ~20 minutos
└─ Tutorial: En GitHub Settings > Collaborators

ACCIÓN 4: Crear README de la Organización
└─ Tiempo: ~10 minutos
└─ Archivo: README_ORGANIZACION.md + SETUP_README_ORGANIZACION.md

TOTAL: 80 minutos (~1.3 horas)
```

---

## ✅ ACCIÓN 1: RULESETS (Protecciones de Rama)

### Qué hacer
```
Proteger 3 ramas con Rulesets:
├─ main (2 aprobaciones + tests)
├─ develop (1 aprobación + tests)
└─ leads-only (solo admins)
```

### Dónde ir
```
GitHub > Tu repo > Settings > Rules > Rulesets
├─ Click: "+ New ruleset"
├─ Crear 3 rulesets
└─ Marcar "Enforcement: Active"
```

### Documentación
```
Lee: GUIA_PROTEGER_LEADS_ONLY_RULESETS.md
├─ Paso a paso completo
├─ Con troubleshooting
└─ Incluye 4 pruebas al final
```

### Checklist
```
[ ] main: Ruleset creado
    └─ 2 aprobaciones
    └─ ESLint + Tests + Build
    └─ Block force push: YES

[ ] develop: Ruleset creado
    └─ 1 aprobación
    └─ ESLint + Tests
    └─ Block force push: YES

[ ] leads-only: Ruleset creado
    └─ 1 aprobación
    └─ Bypass list: Tu usuario + Co-líder
    └─ Block force push: YES

[ ] Las 4 pruebas pasaron ✓
```

---

## 👥 ACCIÓN 2: CAMBIAR ROLES

### Qué hacer
```
Cambiar Co-líder a Admin:
├─ Ve a Settings > Access
├─ Encontr Co-líder
├─ Dropdown > Selecciona "Admin"
└─ Confirma
```

### Dónde está la opción
```
NO en: Settings > Collaborators and teams
SÍ en: Settings > Access (nueva ubicación en 2025)
  └─ O: Directamente desde Settings > Collaborators
     └─ Busca usuario > Dropdown de rol
```

### Documentación
```
Lee: CAMBIAR_ROL_COLABORADORES_GITHUB.md
├─ Explica dónde se movió la opción
├─ Muestra 5 niveles de rol
└─ Paso a paso visual
```

### Checklist
```
[ ] Co-líder: Rol = Admin
    └─ Verificado en Settings > Access

[ ] (Opcional) 2 Leads: Rol = Maintain
    └─ Si quieres que tengan casi-admin

[ ] Todos los roles verificados
```

---

## 🔗 ACCIÓN 3: AGREGAR 8 COLABORADORES

### Qué hacer
```
Invitar a los 8 integrantes del equipo:
├─ 2 Backend Leads/Devs
├─ 3 Frontend Devs
├─ 3 más (roles según descripción)
└─ Todos como "Write"
```

### Dónde ir
```
GitHub > Settings > Collaborators and teams > Collaborators
├─ Click: "+ Add people"
├─ Busca por email o username
├─ Selecciona rol: "Write"
├─ Repite 8 veces
```

### Paso a paso
```
1. Ve a: https://github.com/cmoinr/hospital-management/settings/access

2. En "Manage access", click "+ Add people"

3. En el formulario:
   ├─ Busca: Email del integrante
   ├─ Selecciona: Nombre de la lista
   ├─ Rol: Selecciona "Write" (para todos los devs)
   └─ Click: "+ Select"

4. REPITE para cada persona

5. Ellos recibirán un email con invitación
   └─ Deben aceptar la invitación

6. Verificar en Settings > Collaborators
   └─ Todos deberían aparecer con "Write"
```

### Lista de 8 integrantes
```
[ ] Dev 1 - Backend Lead
    └─ Email: [añadir]
    └─ Rol: Write → OK

[ ] Dev 2 - Frontend Lead
    └─ Email: [añadir]
    └─ Rol: Write → OK

[ ] Dev 3 - Backend
    └─ Email: [añadir]
    └─ Rol: Write → OK

[ ] Dev 4 - Backend
    └─ Email: [añadir]
    └─ Rol: Write → OK

[ ] Dev 5 - Backend
    └─ Email: [añadir]
    └─ Rol: Write → OK

[ ] Dev 6 - Frontend
    └─ Email: [añadir]
    └─ Rol: Write → OK

[ ] Dev 7 - Frontend
    └─ Email: [añadir]
    └─ Rol: Write → OK

[ ] Dev 8 - Frontend
    └─ Email: [añadir]
    └─ Rol: Write → OK
```

### Verificación
```
[ ] Todos los 8 aparecen en Settings > Collaborators
[ ] Todos tienen rol "Write"
[ ] Todos han aceptado la invitación (o recibieron email)
```

---

## 🎯 ORDEN DE EJECUCIÓN RECOMENDADO

### Orden 1 (Mi recomendación)

```
PRIMERO: Cambiar Co-líder a Admin
└─ Razón: Es rápido (2 min)
└─ Beneficio: Co-líder puede ayudar con resto

SEGUNDO: Agregar 8 colaboradores
└─ Razón: Deben recibir invitación pronto
└─ Beneficio: Todos leen la documentación mientras espera

TERCERO: Configurar Rulesets
└─ Razón: Ya tienen acceso, pueden ver cambios
└─ Beneficio: Máximo contexto para entender
```

### Orden 2 (Alternativa: Si Co-líder ayuda)

```
PRIMERO: Cambiar Co-líder a Admin (con Tú)

SEGUNDO: Tú configuras Rulesets
         Co-líder agrega colaboradores (en paralelo)

TERCERO: Verificar todo funciona
```

---

## ⏱️ CRONOGRAMA

```
31 DE OCTUBRE (HOY):

14:00 - 14:10: Cambiar Co-líder a Admin
               └─ Con: CAMBIAR_ROL_COLABORADORES_GITHUB.md

14:10 - 14:30: Agregar 8 colaboradores
               └─ Enviar invitaciones

14:30 - 15:00: Configurar Rulesets
               └─ Con: GUIA_PROTEGER_LEADS_ONLY_RULESETS.md
               └─ Hacer 4 pruebas

15:00 - 15:10: Crear README de Organización
               └─ Con: SETUP_README_ORGANIZACION.md

15:10 - 15:15: Verificar todo
               └─ Co-líder Admin? ✓
               └─ 8 colaboradores invitados? ✓
               └─ 3 Rulesets activos? ✓
               └─ README de org visible? ✓

TOTAL: 75 minutos
```

---

## 📚 DOCUMENTACIÓN DISPONIBLE

```
Para ACCIÓN 1 (Rulesets):
└─ GUIA_PROTEGER_LEADS_ONLY_RULESETS.md
   ├─ OPCIÓN 1: Solo Ruleset (recomendado)
   ├─ OPCIÓN 2: Ruleset + Branch Rule (si es necesario)
   ├─ 4 Pruebas de verificación
   └─ Troubleshooting

Para ACCIÓN 2 (Cambiar roles):
└─ CAMBIAR_ROL_COLABORADORES_GITHUB.md
   ├─ Dónde está la opción (se movió)
   ├─ 5 niveles de rol
   ├─ Paso a paso para cada uno
   └─ Qué hacer si no funciona

Para ACCIÓN 3 (Agregar colaboradores):
└─ Este documento (arriba)
   ├─ Paso a paso
   ├─ Lista de 8 integrantes
   └─ Verificación

Para ACCIÓN 4 (README de Organización):
└─ README_ORGANIZACION.md (el contenido)
└─ SETUP_README_ORGANIZACION.md (cómo instalarlo)

Referencia General:
└─ BRANCH_PROTECTION_SETUP.md
   └─ Documentación técnica completa
```

---

## ✨ BONUS: Crear la Wiki (después del kickoff)

```
No es urgente hoy, pero está documentado:

Ubicación: GitHub > Tu repo > Wiki (tab)
Crear: Home (índice)
Incluir:
├─ Rulesets-Config (link a sección)
├─ Setup-Inicial
├─ Git-Workflow
├─ Team-Access
└─ FAQ

Ventaja:
└─ Documentación centralizada
└─ Accesible desde GitHub UI
└─ Fácil de editar sin commits
```

---

## 🚨 COSAS CRÍTICAS

```
❌ NO OLVIDES:

1. Cambiar Co-líder a Admin ANTES de las 3 ramas
   └─ Necesita permisos para validar

2. Hacer las 4 pruebas de Rulesets
   └─ Verificar que blocquean/permiten correctamente

3. Enviar invitaciones a los 8 devs HOY
   └─ Necesitan tiempo para aceptar

4. Documentar cualquier cambio
   └─ Si algo diferente a lo esperado, nota en FAQ
```

---

## ✅ FINAL CHECKLIST

```
ANTES DE DORMIR HOY:

[ ] Co-líder es Admin
[ ] 8 colaboradores invitados (pendiente aceptación)
[ ] 3 Rulesets creados y activos
[ ] Las 4 pruebas de Rulesets pasaron
[ ] README de organización creado y visible
[ ] Documentación actualizada en INDICE.md
[ ] Listo para kickoff mañana 1 de Noviembre

Si TODO está checked:
└─ ✅ LISTO PARA PRODUCCIÓN
```

---

## 🎨 ACCIÓN 4: CREAR README DE LA ORGANIZACIÓN

### Qué hacer
```
Crear un README elegante para tu organización en GitHub
└─ Integrantes verán contexto del proyecto al entrar
└─ Profesional, breve, con toda la info necesaria
```

### Dónde va
```
GitHub > Tu Organización (hospital-management-org)
  └─ Aparecerá en la página principal de la organización
```

### Paso a paso
```
1. Ve a: https://github.com/hospital-management-org/settings
2. O crea nuevo repo: .github
3. Agrega archivo: profile/README.md
4. Copia contenido de: README_ORGANIZACION.md
5. Commit
6. Verifica en: https://github.com/hospital-management-org
```

### Documentación
```
Lee: SETUP_README_ORGANIZACION.md
├─ Paso a paso visual
├─ Verificación
└─ Resultado esperado

O directamente: README_ORGANIZACION.md
└─ El contenido ya está listo para copiar
```

### Checklist
```
[ ] Repo .github creado
[ ] Carpeta profile/ existe
[ ] Archivo README.md creado
[ ] Contenido copiado desde README_ORGANIZACION.md
[ ] Commit realizado
[ ] Visible en la página de la organización ✓
```

---

```
Problema: No encuentro la opción de Admin
Solución: Ve a CAMBIAR_ROL_COLABORADORES_GITHUB.md > "Troubleshooting"

Problema: Los Rulesets no bloquean cuando deberían
Solución: Ve a GUIA_PROTEGER_LEADS_ONLY_RULESETS.md > "Si algo no funciona"

Problema: La invitación a colaboradores no se envía
Solución: Verifica:
  └─ Email correcto
  └─ Tienes rol Admin
  └─ No son bots o cuentas inactivas

Pregunta general: ¿Qué es Rulesets?
Solución: Lee FAQ_RULESETS.md
```

---

**Documento:** Acciones Inmediatas Pre-Kickoff  
**Versión:** 1.0  
**Fecha:** 31 de Octubre, 2025  
**Urgencia:** 🔴 CRÍTICO  
**Próximo paso:** Empieza con ACCIÓN 1
