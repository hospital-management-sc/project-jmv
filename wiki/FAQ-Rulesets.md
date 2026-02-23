# ❓ FAQ: Migración a Rulesets (GitHub 2024-2025)

**Propósito:** Responder preguntas comunes sobre el cambio de Branch Protection a Rulesets  
**Audiencia:** Leads + Co-líder  
**Última actualización:** 31 de Octubre, 2025

---

## 🎯 PREGUNTAS GENERALES

### P1: ¿Qué es Rulesets?

**R:** Es el nuevo sistema de GitHub para proteger ramas. Reemplaza "Branch Protection Rules".

```
Ventajas de Rulesets:
├─ Mayor control (push + merge + force push)
├─ Bypass list granular
├─ Mejor UI y organización
└─ Futuro de GitHub
```

---

### P2: ¿Por qué GitHub cambió?

**R:** El sistema anterior tenía limitaciones:

```
ANTES (Branch Protection):
├─ Solo protegía merge
├─ UI poco clara
├─ "Include administrators" era confuso
└─ No había forma de controlar push directo

AHORA (Rulesets):
├─ Protege merge + push + fuerza + historia
├─ UI moderna y clara
├─ "Bypass list" es explícito
└─ Control total del flujo
```

---

### P3: ¿Debo cambiar ya a Rulesets?

**R:** SÍ, es recomendado. Pero ¿cuándo?

```
✅ Cambia YA si:
├─ Estás configurando nuevo repo (como tú)
└─ No hay protecciones antiguas activas

⏳ Puedes cambiar después si:
├─ Ya tienes Branch Protection Rules activas
└─ Quieres migrar gradualmente

❌ NO cambies si:
└─ Tu organización prohíbe Rulesets
```

---

### P4: ¿Pueden coexistir Branch Protection + Rulesets?

**R:** SÍ, y a veces es útil.

```
Ejemplo: Rama leads-only

Ruleset:
├─ Bloquea push directo (solo admins pueden)
└─ Bloquea force push

Branch Protection:
├─ Requiere aprobación en PR
└─ Restringe push

Resultado:
└─ Máxima seguridad (ambos activos)
```

---

### P5: ¿GitHub va a eliminar Branch Protection?

**R:** No está confirmado, pero probablemente sí (en 2-3 años).

```
Hoy: Ambos funcionan
Futuro: Solo Rulesets (probablemente)
Razón: GitHub necesita unificar sistemas
```

---

## 🔧 PREGUNTAS TÉCNICAS

### P6: ¿Dónde están EXACTAMENTE los Rulesets?

**R:** Aquí:

```
GitHub.com > Tu Repo > Settings > Rules > Rulesets

Navegación:
1. github.com/cmoinr/hospital-management
2. Click en: Settings (tab superior derecha)
3. Left sidebar: Busca "Rules"
4. Click en: "Rulesets"
5. Click en: "+ New ruleset"
```

---

### P7: ¿Qué es "Ref name" vs "Repository name"?

**R:**

```
ref_name:
├─ Significa: Rama
├─ Valor: leads-only
└─ Uso: Para proteger una rama específica

repository_name:
├─ Significa: Repositorio completo
├─ Valor: hospital-management
└─ Uso: Para proteger todo el repo
```

**Para este proyecto:** Usa `ref_name`

---

### P8: ¿Qué hace "Bypass list"?

**R:** Controla quién puede saltarse las reglas.

```
Caso 1: Sin Bypass list
├─ Todos deben cumplir las reglas
├─ Incluso admins
└─ Máxima rigidez

Caso 2: Con Bypass list (Tu usuario + Co-líder)
├─ Tu usuario puede saltarse las reglas
├─ Co-líder puede saltarse las reglas
├─ Los devs deben cumplir
└─ Permite hotfixes de emergencia

Para leads-only:
└─ Bypass list = Tu usuario + Co-líder
   (Solo ellos pueden hacer push directo)
```

---

### P9: ¿Qué es "Enforcement: Active" vs "Evaluate"?

**R:**

```
Active:
├─ El ruleset ESTÁ funcionando
├─ Bloquea violaciones AHORA
└─ Debes estar seguro antes de activar

Evaluate:
├─ El ruleset está en prueba
├─ Monitorea pero NO bloquea
├─ Útil para probar antes de "Active"
└─ Cambiar a "Active" cuando estés listo
```

**Para ti:** Usa "Active" desde el inicio

---

### P10: ¿Cómo elimino un Ruleset?

**R:**

```
1. Settings > Rules > Rulesets
2. Encuentra el ruleset
3. Click en: "..." (three dots)
4. Click en: "Delete"
5. Confirma
```

**Nota:** No se puede deshacer. Asegúrate primero.

---

## 🎯 PREGUNTAS ESPECÍFICAS: leads-only

### P11: ¿Qué reglas EXACTAS necesita leads-only?

**R:** Mínimo:

```
✅ Require a pull request before merging
   └─ 1 aprobación (de otro admin)

✅ Restrict who can push
   └─ Solo: Tu usuario + Co-líder

✅ Block force pushes
✅ Restrict deletions
```

---

### P12: ¿Por qué leads-only necesita Bypass list?

**R:** Para permitir emergencias.

```
Escenario: Documento urgente que arreglar en leads-only

SIN Bypass list:
1. Tú crearías PR
2. Esperarías a Co-líder para aprobación
3. Co-líder aprueba
4. Tú mergeas
└─ Proceso lento (15-30 min)

CON Bypass list:
1. Tú haces push directo a leads-only
2. Completado (2-3 min)
└─ Emergencias sin delays

Seguridad:
└─ Solo tú + Co-líder tienen bypass
   (Devs no pueden)
```

---

### P13: ¿Qué pasa si un dev intenta hacer push a leads-only?

**R:** Se rechaza:

```
$ git push origin leads-only
remote: error: You are not authorized to push to this branch
remote: error: This repository is set to require all pushes to be made via pull requests
→ Push rechazado ✓ (Funcionó)
```

---

### P14: ¿Qué pasa si un dev crea PR a leads-only?

**R:** La PR se crea, pero no se puede mergear sin aprobación:

```
Dev:     Crea PR a leads-only
Ruleset: ✓ Acepta la PR
Admin:   Aprueba PR
Admin:   Mergea (porque está en Bypass list)
Dev:     Intenta mergear → ✓ Rechazado (no está en Bypass)
```

---

## 🚨 PREGUNTAS DE TROUBLESHOOTING

### P15: Crear el Ruleset pero no aparece en la lista

**R:** Probable delay de GitHub.

```
Soluciones:
1. Espera 30 segundos
2. Recarga la página (F5)
3. Si persiste:
   → Ve a Settings > Rules
   → Verifica que ves "Rulesets" como opción
   → Click en Rulesets de nuevo
```

---

### P16: El Ruleset está "Active" pero Dev aún puede hacer push

**R:** Verifícalo:

```
Checklist:
1. ¿Dev está en Bypass list?
   → Si SÍ: Elimina dev de Bypass
   → Si NO: Continúa

2. ¿Ruleset tiene ref_name: leads-only?
   → Verifica la sección "Conditions"

3. ¿Es la rama correcta?
   → Verifica: git branch -a
   → Dev está haciendo push a: leads-only?

4. ¿Hay múltiples Rulesets?
   → Settings > Rules > Rulesets
   → Elimina duplicados
```

---

### P17: ¿Admin puede autoaprobar su propio PR?

**R:** Depende de tu configuración.

```
Ruleset estándar:
├─ Sí, admin puede autoaprobar

Para máxima seguridad:
├─ Requiere que otro admin apruebe
├─ (Requiere configuración adicional)
└─ Pero es más lento

Para leads-only (Recomendado):
├─ Permite autoaprobación
└─ Razón: Ya hay protección por Bypass list
```

---

### P18: ¿Cómo migro de Branch Protection a Rulesets?

**R:** Paso a paso:

```
PASO 1: Crea el Ruleset (sin eliminar Branch Protection)
PASO 2: Prueba que el Ruleset funciona (1-2 dias)
PASO 3: Elimina la Branch Protection antigua
PASO 4: Verifica que todo sigue funcionando

Tiempo total: 2-3 días
Riesgo: Bajo (puedes revertir)
```

---

### P19: ¿Qué sucede si elimino un Ruleset?

**R:** Se desactiva inmediatamente:

```
Momento de eliminar:
1. Click en "Delete"
2. Confirmas
3. En ~5 segundos: El ruleset se elimina

Efecto:
├─ Todos pueden hacer push (sin restricciones)
├─ Sin Bypass list (porque no existe)
└─ Sin límites en force push, delete

Cómo revertir:
└─ No hay revertir, debes recrear desde 0
```

---

### P20: ¿El Ruleset funciona retroactivamente?

**R:** NO.

```
Si creaste Ruleset HOY:
└─ Protege DESDE HOY en adelante
└─ Cambios ANTERIORES no se revisan

Ejemplo:
1. Dev hizo push a leads-only hace 1 mes
2. Hoy creas Ruleset
3. El push antiguo sigue, no se elimina
```

---

## 📚 PREGUNTAS DE CONCEPTO

### P21: ¿Qué es "linear history"?

**R:** Es opcional. Significa todos los commits en línea recta.

```
Sin linear history:
├─ Git merge normal
└─ Historial puede ramificarse

Con linear history:
├─ Solo "Squash and merge" o "Rebase"
└─ Historial siempre en línea recta

Para tu proyecto:
└─ NO obligatorio, pero recomendado para develop
```

---

### P22: ¿Qué es "Dismiss stale approvals"?

**R:** Si alguien hace commit nuevo, ¿anulan aprobaciones?

```
Dismiss stale = SI
├─ Nuevo commit = aprobación anterior anulada
├─ Dev debe solicitar re-aprobación
└─ Más seguro

Dismiss stale = NO
├─ Aprobación sigue siendo válida
├─ Aunque haya nuevos commits
└─ Menos seguro

Para leads-only:
└─ Usa: Dismiss stale = NO (estricto)
```

---

### P23: ¿Cuál es la diferencia entre "Require review from code owners"?

**R:** Si tienes archivo `CODEOWNERS`.

```
Sin CODEOWNERS:
├─ Cualquier admin aprueba
└─ Esta opción no importa

Con CODEOWNERS:
├─ Solo code owners pueden aprobar
└─ Ejemplo: Backend lead aprueba backend

Para leads-only:
└─ NO necesitas CODEOWNERS
└─ Usa: Require review from code owners = NO
```

---

## ✅ RESUMEN: CHECKLIST RULESETS

```
Antes de empezar:
├─ [ ] Entiendo qué es Rulesets
├─ [ ] Sé cómo acceder (Settings > Rules > Rulesets)
├─ [ ] Conozco la diferencia: ref_name vs repository_name
└─ [ ] Entiendo Bypass list

Para crear Ruleset:
├─ [ ] Completo: Ruleset name
├─ [ ] Selecciono: Enforcement = Active
├─ [ ] Defino: Conditions (ref_name = rama)
├─ [ ] Marco: Rules necesarias
├─ [ ] Agrego: Bypass list (solo admins)
└─ [ ] Click: "Create ruleset"

Después de crear:
├─ [ ] Verifico que existe en lista
├─ [ ] Pruebo con dev (debe bloquearse)
├─ [ ] Pruebo con admin (debe funcionar)
└─ [ ] Documento en BRANCH_PROTECTION_SETUP.md
```

---

## 📞 ¿PREGUNTAS QUE NO RESPONDEN AQUÍ?

Consulta:
1. `GUIA_PROTEGER_LEADS_ONLY_RULESETS.md` (paso a paso visual)
2. `BRANCH_PROTECTION_SETUP.md` (referencia completa)
3. [GitHub Docs: Rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets)

---

**Documento:** FAQ Migración a Rulesets  
**Versión:** 1.0  
**Última actualización:** 31 de Octubre, 2025  
**Mantenedor:** Leads Team
