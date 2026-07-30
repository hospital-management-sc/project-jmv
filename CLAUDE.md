# CLAUDE.md — hospital-management-dev

Instrucciones para Claude Code en este proyecto.

## Contexto del proyecto

PWA de gestión clínica y administrativa para el Hospital Militar Tipo I "Dr. José María Vargas" (Venezuela). Sistema en fase de pruebas activas desde julio 2026. Se usará como software real en una institución del Estado.

## Ramas

- `main` — producción. Nunca commitear directamente aquí.
- `dev` — rama de trabajo diario. Todos los cambios van aquí.
- `leads-only`, `ServicioComunitario` — ramas especiales, no tocar sin indicación explícita.

## Flujo de trabajo

1. Todo el trabajo va en `dev`.
2. Para commitear cambios del día: usar `/pre` (bump patch automático).
3. Para hacer un release formal a producción: usar `/release` (PR dev→main + tag + GitHub Release).

## Versionado

- Versión sincronizada en `pwa/frontend/package.json` y `pwa/backend/package.json`.
- Versión inicial: `v0.0.0`. Fase de pruebas en hospital: `v0.x.x`. Producción real: `v1.0.0`.
- Commits en formato convencional: `feat:`, `fix:`, `refactor:`, `chore:`, `style:`, `docs:`.

## Estructura

```
pwa/frontend/     React 19 + TypeScript + Vite (PWA)
pwa/backend/      Express.js + TypeScript + Prisma + PostgreSQL
pwa/docker-compose.yml
.github/workflows-archive/deploy-backend.digitalocean.yml   CI/CD antiguo a DigitalOcean (archivado)
.claude/skills/pre/SKILL.md
.claude/skills/release/SKILL.md
```

## Deploy

- **Backend**: desplegado en [Render](https://dashboard.render.com) (plan Free), servicio `hospital-jmv-backend`, Dockerfile de `pwa/backend/`. Deploy automático al hacer push/merge en `main` (auto-deploy de Render conectado al repo). URL: `https://hospital-jmv-backend.onrender.com`.
  - El plan Free "duerme" tras ~15 min de inactividad (cold start de 30-60s en la siguiente petición). Considerar upgrade si esto afecta la operación real del hospital.
  - Variables de entorno configuradas directamente en el dashboard de Render (no en `.env` del repo): `NODE_ENV`, `DATABASE_URL` (Supabase), `JWT_SECRET`, `JWT_EXPIRY`, `SESSION_SECRET`, `CORS_ORIGIN`, `FRONTEND_URL`.
- **Frontend**: Vercel, proyecto `project-jmv`. Variable `VITE_API_URL` debe apuntar a la URL del backend en Render (`https://hospital-jmv-backend.onrender.com/api`). Cambios en env vars requieren Redeploy manual para tomar efecto.
- **Base de datos**: Supabase (Postgres administrado), independiente del hosting del backend — no requiere migración si se cambia de proveedor de backend.

### Historial: droplet de DigitalOcean (destruido 2026-07-30)

El backend corrió antes en un droplet propio de DigitalOcean (`hospital-jmv`, 159.89.191.201, dominio DuckDNS `hospital-jmv.duckdns.org`), desplegado vía Docker + GitHub Actions por SSH. Se destruyó por costos, migrando el backend a Render sin pérdida de datos (la DB ya vivía en Supabase).

El workflow de aquel deploy quedó archivado en [.github/workflows-archive/deploy-backend.digitalocean.yml](.github/workflows-archive/deploy-backend.digitalocean.yml) con instrucciones para reactivarlo si en el futuro se vuelve a necesitar un VPS propio (más control, sin cold starts, pero con costo mensual fijo).

## Consideraciones de seguridad

- El sistema maneja datos clínicos reales. Nunca exponer datos de pacientes en logs, commits o comentarios.
- No commitear archivos `.env` ni credenciales. Usar `.env.example` como referencia.
- Autenticación vía JWT + WebAuthn (passkeys). No modificar el flujo de auth sin revisión cuidadosa.

## Base de datos

- ORM: Prisma con PostgreSQL.
- Migraciones en `pwa/backend/prisma/migrations/`.
- Siempre generar migración con `npm run db:migrate:dev` al cambiar el schema, nunca usar `db push` en producción.

## Idioma

Responder siempre en español. Mensajes de commit en español está bien, el tipo y scope en inglés (convención).
