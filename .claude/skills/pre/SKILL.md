---
name: pre
description: "Flujo de trabajo diario en la rama dev del proyecto hospital-management: commitea los cambios actuales con mensaje convencional, bumea la versión patch en ambos package.json (frontend y backend), y pushea a origin/dev. Usar cuando el usuario dice \"/pre\", \"commitear\", \"guardar cambios\", \"subir a dev\", \"hacer commit\", o similar. PREREQUISITO: debe haber cambios en el working tree o staged."
---

# Skill: /pre

Commitea los cambios actuales en `dev`, bumea la versión **patch** (ej: `0.0.1` → `0.0.2`), y pushea a `origin/dev`. Todo el trabajo del día a día pasa por aquí.

**Rama de trabajo:** `dev`
**Repositorio:** `hospital-management-sc/project-jmv` (GitHub)
**Ruta del proyecto:** `C:\Users\cmoin\Documentos\hospital-management-dev`

---

## Paso 1 — Verificar estado y rama

```bash
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" status
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" branch --show-current
```

- Si la rama actual **no es `dev`**, advierte al usuario y pregunta si desea cambiar a `dev` antes de continuar.
- Si **no hay cambios** (working tree limpio y nada staged), informa que no hay nada que commitear y detente.

---

## Paso 2 — Analizar los cambios

Revisa los archivos modificados para entender qué se cambió:

```bash
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" diff --stat HEAD
```

Identifica:
- ¿Qué parte del sistema se modificó? (`pwa/frontend/`, `pwa/backend/`, `pwa/docker-compose.yml`, etc.)
- ¿Cuál es el tipo de cambio? (`feat`, `fix`, `refactor`, `chore`, `style`, `docs`)
- Formula un mensaje de commit convencional descriptivo (en español está bien, el scope en inglés)

---

## Paso 3 — Leer versión actual y recomendar bump

Lee la versión actual desde `pwa/frontend/package.json`:

```bash
node -e "console.log(require('./pwa/frontend/package.json').version)" 2>/dev/null
```

Analiza el tipo de cambios realizados y **recomienda al usuario** el nivel de bump correspondiente (patch, minor o major):
- **patch** (ej: `0.0.2` → `0.0.3`): Para correcciones de errores (fix), pequeños retoques o refactorizaciones.
- **minor** (ej: `0.0.2` → `0.1.0`): Para nuevas funcionalidades principales (feat) o mejoras de UI/UX importantes.
- **major** (ej: `0.0.2` → `1.0.0`): Para cambios de arquitectura, breaking changes o lanzamientos mayores.

Muestra la sugerencia al usuario y **solicita su confirmación explícita** sobre qué versión utilizar antes de proceder al Paso 4.

---

## Paso 4 — Bumpear versión en ambos package.json tras confirmación del usuario

Una vez confirmada la versión por el usuario, actualiza el campo `"version"` en **ambos** archivos al mismo valor:

- `pwa/frontend/package.json`
- `pwa/backend/package.json`

Usa Node.js para hacerlo de forma segura sin romper el JSON:

```bash
node -e "const fs = require('fs'); ['pwa/frontend/package.json', 'pwa/backend/package.json'].forEach(p => { const j = JSON.parse(fs.readFileSync(p, 'utf8')); j.version = '<nueva versión confirmada>'; fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n'); });"
```

---

## Paso 5 — Stagear todo y commitear

```bash
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" add -A
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" status
```

Revisa que no haya archivos sensibles (`.env`, claves, secretos) antes de commitear. Si los ves, adviértelo al usuario.

Luego commitea con el mensaje convencional que formulaste en el Paso 2, más el bump de versión:

```bash
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" commit -m "<tipo>(<scope>): <descripción>

- bump version a <nueva versión>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Paso 6 — Push a origin/dev

```bash
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" push origin dev
```

Si el push falla porque hay commits remotos que no tienes, haz pull primero:

```bash
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" pull origin dev --rebase
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" push origin dev
```

---

## Resumen final

```
✓ Commit en dev
  Versión: <anterior> → <nueva>
  Commit: <hash corto> — <mensaje>
  Push: origin/dev ✓

Listo para trabajar. Cuando quieras hacer un release usa /release.
```
