---
name: release
description: "Flujo de release del proyecto hospital-management: lleva los commits de dev a main mediante PR + merge, crea tag vX.Y.Z y GitHub Release con notas de cambios. Usar cuando el usuario dice \"/release\", \"hacer release\", \"llevar a main\", \"producción\", \"publicar versión\", o similar. PREREQUISITO: los cambios deben estar commiteados y pusheados en dev (via /pre)."
---

# Skill: /release

Lleva los cambios de `dev` a `main` con un release formal. Crea PR, hace merge, crea tag y GitHub Release.

**Flujo:** `dev` → PR → merge a `main` → tag → release
**Repositorio:** `hospital-management-sc/project-jmv` (GitHub)
**Ruta del proyecto:** `C:\Users\cmoin\Documentos\hospital-management-dev`

Al hacer merge a `main`, el GitHub Action de DigitalOcean despliega el backend automáticamente.

---

## Paso 1 — Verificar estado antes del release

```bash
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" fetch origin
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" status
```

Verifica que:
- La rama actual sea `dev` (o que al menos `origin/dev` esté actualizado)
- No haya cambios sin commitear (si los hay, indica que se debe correr `/pre` primero)

Muestra los commits de `dev` que aún no están en `main`:

```bash
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" log origin/main..origin/dev --oneline
```

Si no hay commits pendientes, informa que no hay nada nuevo para hacer release y detente.

---

## Paso 2 — Determinar tipo de versión

Lee la versión actual de `pwa/frontend/package.json`:

```powershell
(Get-Content "C:\Users\cmoin\Documentos\hospital-management-dev\pwa\frontend\package.json" | ConvertFrom-Json).version
```

Analiza los commits pendientes y recomienda el tipo de bump:
- **patch** (`0.1.3` → `0.1.4`): solo bug fixes o cambios menores
- **minor** (`0.1.3` → `0.2.0`): nueva funcionalidad, sin cambios que rompan compatibilidad
- **major** (`0.1.3` → `1.0.0`): cambios que rompen compatibilidad, o primer release a producción real

Muestra al usuario el resumen de commits y el bump recomendado, y **pide confirmación explícita**:

> "Commits pendientes: X. Versión actual: Y. Recomiendo bump Z → nueva versión W. ¿Confirmas el release? (sí/no)"

Si el usuario no confirma, detente.

---

## Paso 3 — Bumpear versión en ambos package.json

Actualiza el campo `"version"` en **ambos** archivos al mismo valor nuevo:

```powershell
$frontendPath = "C:\Users\cmoin\Documentos\hospital-management-dev\pwa\frontend\package.json"
$backendPath  = "C:\Users\cmoin\Documentos\hospital-management-dev\pwa\backend\package.json"
$newVersion   = "<versión calculada>"

$fe = Get-Content $frontendPath -Raw | ConvertFrom-Json
$be = Get-Content $backendPath  -Raw | ConvertFrom-Json
$fe.version = $newVersion
$be.version = $newVersion
$fe | ConvertTo-Json -Depth 10 | Set-Content $frontendPath -Encoding utf8
$be | ConvertTo-Json -Depth 10 | Set-Content $backendPath  -Encoding utf8
```

Luego commitea el bump en `dev` y pushea:

```bash
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" add pwa/frontend/package.json pwa/backend/package.json
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" commit -m "chore: bump version a <nueva versión>"
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" push origin dev
```

---

## Paso 4 — Crear PR de dev → main

Analiza los commits para construir las release notes. Agrupa por tipo:
- `feat:` → **Nuevas funcionalidades**
- `fix:` → **Correcciones**
- `refactor:` / `chore:` → **Mejoras internas**
- `style:` / `docs:` → **Estilos / Documentación**

```bash
gh pr create \
  --repo hospital-management-sc/project-jmv \
  --base main \
  --head dev \
  --title "release: v<nueva versión>" \
  --body "$(cat <<'PREOF'
## v<nueva versión>

### Nuevas funcionalidades
- <lista de feat: commits>

### Correcciones
- <lista de fix: commits>

### Mejoras internas
- <lista de refactor/chore commits>

## Partes del sistema afectadas

- [ ] Frontend (`pwa/frontend/`)
- [ ] Backend (`pwa/backend/`)
- [ ] Base de datos (migraciones Prisma)
- [ ] Infraestructura (`docker-compose`, GitHub Actions)

## Deploy

- Backend: GitHub Action de DigitalOcean se dispara automáticamente al hacer merge a main
- Frontend: despliegue manual (si aplica)

🏥 Release generado con /release skill
PREOF
)"
```

Muestra la URL del PR creado.

---

## Paso 5 — Merge del PR a main

```bash
gh pr merge --repo hospital-management-sc/project-jmv --squash --delete-branch=false
```

- `--squash`: mantiene el historial de `main` limpio
- `--delete-branch=false`: NO elimina `dev`

Confirma que el merge fue exitoso.

---

## Paso 6 — Sincronizar main → dev (OBLIGATORIO tras cada squash merge)

Después de un squash merge, `main` tiene un commit nuevo que `dev` no reconoce. Si no se sincroniza ahora, el próximo `/release` tendrá conflictos inevitables.

```bash
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" fetch origin
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" checkout dev
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" merge origin/main --no-edit
```

Si hay conflicto en `package.json`, conserva la versión más alta (la de `dev`) y:

```bash
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" add pwa/frontend/package.json pwa/backend/package.json
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" commit -m "chore: merge main en dev tras release v<versión>"
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" push origin dev
```

Si no hay conflicto, igualmente hacer push:

```bash
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" push origin dev
```

Este paso es siempre obligatorio. No omitirlo aunque no haya conflictos.

---

## Paso 7 — Crear tag y GitHub Release

Obtén el SHA del merge en main:

```bash
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" fetch origin main
git -C "C:\Users\cmoin\Documentos\hospital-management-dev" log origin/main --oneline -1
```

Crea el release en GitHub con tag `v<versión>`:

```bash
gh release create "v<versión>" \
  --repo hospital-management-sc/project-jmv \
  --target main \
  --title "v<versión>" \
  --notes "$(cat <<'REOF'
## v<versión> — <fecha en formato DD/MM/YYYY>

### Nuevas funcionalidades
- <resumen de feat: commits, no copiar literal — redactar en términos del sistema>

### Correcciones
- <resumen de fix: commits>

### Mejoras internas
- <resumen de chore/refactor si son relevantes para el historial>

---
🏥 Sistema de Gestión Clínica y Administrativa
REOF
)"
```

- Si ya existe un tag con esa versión, informa al usuario y omite este paso.

---

## Paso 8 — Verificar deploy automático

```bash
gh run list --repo hospital-management-sc/project-jmv --limit 3
```

Muestra los workflows activos. Si hay uno de deploy en curso o completado, informa al usuario.

---

## Resumen final

```
Release completado ✓
  PR: <URL>
  Merge: main ← dev (squash)
  Versión en producción: v<versión>
  Release: github.com/hospital-management-sc/project-jmv/releases/tag/v<versión>
  Deploy: GitHub Action de DigitalOcean disparado ✓
  dev: sincronizada con main ✓
```
