# 🚀 Quick Start - Prisma Setup (5 minutos)

## 📌 TL;DR (Para los que tienen prisa)

```bash
# 1. Copia tu archivo .sql
# backend/prisma/sql-reference/hospital_schema.sql

# 2. Instala dependencias
cd backend && npm install

# 3. Configura .env
cp .env.example .env
# Edita DATABASE_URL con tus credenciales PostgreSQL

# 4. Traduce SQL → Prisma
# Edita: backend/prisma/schema.prisma (basa en tu SQL)

# 5. Crea migración
npm run db:migrate:dev --name init

# 6. Verifica
npm run db:studio
```

---

## 📂 Donde Colocar Tu Archivo SQL

```
✅ CORRECTO: backend/prisma/sql-reference/hospital_schema.sql
❌ INCORRECTO: backend/src/database/hospital_schema.sql
❌ INCORRECTO: backend/schema.sql
```

---

## 🔑 Conceptos Clave

| Concepto | Ubicación | Propósito |
|----------|-----------|----------|
| **SQL Original** | `prisma/sql-reference/` | Referencia (no se ejecuta) |
| **Prisma Schema** | `prisma/schema.prisma` | Define modelos (CRÍTICO) |
| **Migraciones** | `prisma/migrations/` | Historial de cambios BD |
| **Conexión** | `src/database/connection.ts` | Gestiona conexión Prisma |
| **Variables** | `.env` | Credenciales PostgreSQL |

---

## 📝 Traducción SQL → Prisma (Básico)

| SQL | Prisma |
|-----|--------|
| `CREATE TABLE patients (` | `model Patient {` |
| `id SERIAL PRIMARY KEY` | `id Int @id @default(autoincrement())` |
| `name VARCHAR(255)` | `name String` |
| `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | `createdAt DateTime @default(now())` |
| `UNIQUE` | `@unique` |
| `FOREIGN KEY` | `@relation` |

---

## ✅ Checklist

- [ ] SQL colocado en `prisma/sql-reference/`
- [ ] `npm install` completado
- [ ] `.env` configurado con DATABASE_URL
- [ ] `prisma/schema.prisma` traducido del SQL
- [ ] `npm run db:migrate:dev --name init` ejecutado
- [ ] `npm run db:studio` abierto en navegador

---

## 🎯 Próximo Paso

Lee **`TEAM_DATABASE.md`** para guía completa del equipo. 📚
