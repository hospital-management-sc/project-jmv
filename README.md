# Sistema de Gestión Clínica y Administrativa

Aplicación Web Progresiva (PWA) para el Hospital Militar Tipo I "Dr. José María Vargas".

Desarrollado como proyecto de Servicio Comunitario — Universidad Nacional Experimental Rómulo Gallegos (UNERG).

---

## Estado del proyecto

| Rama | Propósito | Estado |
|------|-----------|--------|
| `main` | Producción | Estable |
| `dev` | Desarrollo activo | En progreso |

Versión actual: ver `pwa/frontend/package.json`

---

## Funcionalidades

- Registro de encuentros médicos por especialidad
- Historias clínicas electrónicas dinámicas
- Gestión de citas y horarios de médicos
- Interconsultas entre especialidades
- Módulo de emergencias
- Panel administrativo (Admin y Super Admin)
- Autenticación biométrica (WebAuthn / passkeys)
- Control de acceso por roles (Doctor, Admin, Super Admin)

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Backend | Express.js + TypeScript + Prisma ORM |
| Base de datos | PostgreSQL |
| Infraestructura | Docker + Docker Compose |
| Deploy backend | DigitalOcean (GitHub Actions) |
| Autenticación | JWT + WebAuthn (passkeys) |

---

## Estructura del repositorio

```
pwa/
  frontend/     React PWA
  backend/      API REST Express + Prisma
  docker-compose.yml
wiki/           Documentación interna
.github/
  workflows/    CI/CD (deploy-backend.yml)
.claude/
  skills/       Skills de Claude Code (/pre, /release)
```

---

## Flujo de trabajo

Todo el desarrollo se hace en la rama `dev`. Nunca se commitea directamente a `main`.

```
dev  →  (PR + review)  →  main  →  deploy automático a DigitalOcean
```

**Skills de Claude Code disponibles:**
- `/pre` — commitea cambios en `dev` con bump de versión patch
- `/release` — lleva `dev` a `main`, crea tag y GitHub Release

---

## Setup local

### Prerrequisitos

- Node.js 20+
- Docker y Docker Compose
- PostgreSQL (o usar el contenedor de Docker)

### Instalación

```bash
git clone https://github.com/hospital-management-sc/project-jmv.git
cd project-jmv

# Backend
cd pwa/backend
cp .env.example .env
# Completar variables en .env
npm install
npm run db:migrate:dev
npm run dev

# Frontend (otra terminal)
cd pwa/frontend
npm install
npm run dev
```

Con Docker:

```bash
cd pwa
docker-compose up
```

---

## Equipo

| Rol | Integrante |
|-----|-----------|
| Lead / Coordinador técnico | Carlos Nieves |
| Tutor académico | Prof. Karina Hernández |
| Co-coordinadores | Leidy Hernández, Gustavo Colina, Germán Cordero, Jonathan Lemos |

---

## Licencia

Proyecto académico de Servicio Comunitario — UNERG. Uso restringido a la institución.
