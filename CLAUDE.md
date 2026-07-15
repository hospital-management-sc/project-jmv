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
.github/workflows/deploy-backend.yml   CI/CD a DigitalOcean
.claude/skills/pre/SKILL.md
.claude/skills/release/SKILL.md
```

## Deploy

- Backend: GitHub Actions despliega automáticamente a DigitalOcean al hacer push/merge en `main`.
- Frontend: despliegue manual (pendiente configurar CI para frontend).

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
