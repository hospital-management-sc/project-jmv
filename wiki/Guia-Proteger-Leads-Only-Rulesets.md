# 🛡️ GUÍA PASO A PASO: Proteger `leads-only` con Rulesets

**Propósito:** Proteger rama `leads-only` para que SOLO admins puedan mergear  
**Duración:** ~5 minutos  
**Requisitos:** Ser Admin del repositorio  
**Fecha:** 31 de Octubre, 2025

---

## 📍 OPCIÓN 1: SOLO RULESETS (Recomendado si funciona)

### Paso 1: Acceder a Rulesets

```
1. Ve a: https://github.com/cmoinr/hospital-management
2. Click en: Settings (tab superior)
3. En el sidebar izquierdo, busca: "Rules"
4. Click en: "Rulesets"
```

**Visual:**
```
GitHub UI
  ↓
Settings (tab)
  ↓
LEFT SIDEBAR
  ├─ Repository (section)
  ├─ Code and automation (section)
  │  ├─ Actions
  │  ├─ Webhooks
  │  └─ Rules ← AQUÍ
  │     ├─ Rulesets
  │     └─ Branch protection rules (antiguo)
```

### Paso 2: Crear Nuevo Ruleset

```
1. Click en: "+ New ruleset" (botón verde grande)
2. Selecciona: "New branch ruleset"
   (Si ves un dropdown, elige esta opción)
```

### Paso 3: Completar Formulario - Sección 1: Básica

```
CAMPO: Ruleset name
VALOR: Proteger leads-only (Solo Admins)

CAMPO: Enforcement
VALOR: Active
(cambio: "Active" para que esté activo desde ya)
```

**Screenshot conceptual:**
```
┌─────────────────────────────────┐
│ New branch ruleset              │
├─────────────────────────────────┤
│ Ruleset name *                  │
│ [Proteger leads-only...]        │
│                                 │
│ Enforcement status              │
│ ● Active                        │
│ ○ Evaluate                      │
│                                 │
│ Target repositories *           │
│ [Mostrador actual en negrita]   │
└─────────────────────────────────┘
```

### Paso 4: Completar Formulario - Sección 2: Condiciones (Scope)

**Busca la sección "Conditions" o "Include"**

```
CAMPO: Include
OPCIÓN: ref_name
VALOR: leads-only

(Si ves un dropdown que dice "Repository name", 
 cambia a "ref_name" - eso significa rama)
```

**Resultado esperado:**
```
Include
├─ ref_name: leads-only
└─ RESULT: Este ruleset se aplica SOLO a leads-only
```

### Paso 5: Completar Formulario - Sección 3: Rules

**Busca la sección "Rules" (lista de checkboxes)**

Marca EXACTAMENTE estos checkboxes:

```
✅ Require a pull request before merging
   ├─ Required approvals: 1
   ├─ Dismiss stale pull request approvals: NO
   ├─ Require review from code owners: NO
   └─ Require approval of reviews: NO

✅ Block force pushes

✅ Restrict deletions

✅ Require linear history (OPCIONAL)
   └─ Marca si quieres commits lineales
```

**NO marques:**
```
❌ Require status checks (no es para docs)
❌ Require code scanning results
❌ Require signed commits
```

### Paso 6: Completar Formulario - Sección 4: Bypass (IMPORTANTE)

**Busca la sección "Bypass list" o "Bypass actors"**

```
AÑADE:
├─ Tu usuario (Admin)
└─ Co-líder (Admin)

ESTO SIGNIFICA:
Solo estos 2 usuarios pueden hacer push directo a leads-only
Sin pasar por PR (emergencias)
```

**Cómo agregarlo:**
```
1. Click en: "Add bypass"
2. Selecciona: "Users" (dropdown)
3. Busca: Tu usuario (ej: cmoinr)
4. Marca el checkbox
5. Click en: "+ Add" o "Select"
6. REPITE para Co-líder
```

**Resultado esperado:**
```
Bypass list
├─ cmoinr (User) ✓
├─ co-lider-usuario (User) ✓
└─ Admin (Role) [si existe esta opción]
```

### Paso 7: Guardar Ruleset

```
Click en: "Create ruleset" (botón verde)
```

**Espera a que aparezca en la lista.**

---

## ✅ VERIFICACIÓN: ¿Funcionó?

### Test 1: Verifica que el Ruleset existe

```
1. Ve a: Settings > Rules > Rulesets
2. Deberías ver en la lista:
   "Proteger leads-only (Solo Admins)" ✅ Active
```

### Test 2: Intenta hacer push con un dev (no-admin)

```
1. Abre terminal
2. git checkout leads-only
3. echo "test" > test.txt
4. git add test.txt
5. git commit -m "test"
6. git push origin leads-only
```

**Resultado esperado:**
```
Error: You are not authorized to push...
Error: This repository is set to require...
(Esto significa que funcionó ✅)
```

### Test 3: Admin intenta merge via PR

```
1. Dev hace PR a leads-only (esto SÍ debería funcionar)
2. Admin aprueba PR
3. Admin hace merge
(Esto debería funcionar ✅)
```

---

## 🚨 SI ALGO NO FUNCIONA

### Problema: No veo "Bypass list" en el formulario

**Solución: Usa COMBINACIÓN de Ruleset + Branch Protection**

```
PASO 1: Completa el Ruleset anterior sin Bypass
PASO 2: Luego agrega Branch Protection Rule:
   Settings > Branches > Add rule
   Pattern: leads-only
   ✅ Require a pull request before merging
   ✅ Restrict who can push to matching branches
      └─ Solo: Tu usuario + Co-líder
```

### Problema: El Ruleset dice "Active" pero parece no funcionar

**Posibles causas:**
```
1. RAM/Cache de GitHub
   → Solución: Espera 5 minutos
   → O abre terminal nueva y reinicia

2. Ruleset aplica solo a nuevos pushes
   → Solución: Espera ~1 minuto después de crear

3. Rama no existe
   → Solución: Primero: git push origin leads-only
   → Luego: Crea el Ruleset
```

### Problema: Dev puede hacer push cuando no debería

```
Verificar:
1. ¿Tu usuario está en "Bypass list"?
   → El usuario de dev debería estar BLOQUEADO

2. ¿Hay múltiples Rulesets conflictivos?
   → Ve a Settings > Rules > Rulesets
   → Verifica que solo hay uno para leads-only

3. ¿El Ruleset tiene "Enforcement: Active"?
   → Si dice "Evaluate", no está activo
   → Cambia a "Active"

Solución:
→ Elimina el Ruleset y vuelve a crear
→ Asegúrate de NO agregar dev en "Bypass list"
```

---

## 📋 CHECKLIST FINAL

```
ANTES DE INICIAR PROYECTO, confirma:

Ruleset "Proteger leads-only (Solo Admins)"
├─ [ ] Existe en Settings > Rules > Rulesets
├─ [ ] Estado: "Active"
├─ [ ] Target: refs/heads/leads-only
├─ [ ] Require a pull request: YES (1 aprobación)
├─ [ ] Block force pushes: YES
├─ [ ] Restrict deletions: YES
└─ [ ] Bypass list: Tu usuario + Co-líder (SOLO)

Pruebas
├─ [ ] Dev intenta push → Bloqueado ✓
├─ [ ] Dev hace PR → Funciona ✓
├─ [ ] Admin aprueba → Funciona ✓
├─ [ ] Admin mergea → Funciona ✓
└─ [ ] Admin hace push directo → Funciona ✓

Combinación (Si necesitaste Branch Protection):
├─ [ ] Ruleset creado + activo
├─ [ ] Branch Protection Rule creado + activo
└─ [ ] Ambos trabajan juntos SIN conflictos
```

---

## 🎓 EXPLICACIÓN TÉCNICA (Opcional)

### ¿Por qué "Bypass list" en lugar de "Include administrators"?

```
ANTES (Branch Protection):
└─ "Include administrators"
   └─ Significa: "Even admins must follow rules"

AHORA (Rulesets):
├─ Todos deben seguir todas las reglas
└─ EXCEPTO los en "Bypass list"
   └─ Admins en Bypass pueden saltarse TODO
```

### ¿Cómo interactúan Ruleset + Branch Protection?

```
Si creastambos:
1. Ruleset bloquea push directo
   → Dev no puede hacer git push
   
2. Branch Protection bloquea merge
   → Dev no puede mergear sin aprobación

3. Resultado final:
   ├─ Dev debe hacer PR (Branch Protection)
   ├─ PR requiere aprobación (Ruleset)
   ├─ Solo admins en Bypass pueden saltarse
   └─ Máximo nivel de seguridad
```

### ¿Qué es "Enforce"?

```
Active: El ruleset está funcionando ahora
Evaluate: El ruleset NO está activo, solo monitoreando
```

---

## 📞 SOPORTE

Si necesitas ayuda:
1. Verifica que estés en Settings > Rules > Rulesets
2. Consulta troubleshooting arriba
3. Si persiste: Pregunta en el canal de Leads

**Documento:** Guía Proteger leads-only con Rulesets  
**Versión:** 1.0  
**Última actualización:** 31 de Octubre, 2025
