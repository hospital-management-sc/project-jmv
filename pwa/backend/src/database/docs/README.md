# 📚 Database Documentation - Hospital Management System

## 📂 Índice de Documentación

Esta carpeta contiene toda la documentación para el equipo de Base de Datos del proyecto Hospital Management System.

---

## 📋 Documentos Principales

### **🚀 Inicio Rápido**
- **[QUICK_START.md](./QUICK_START.md)** - Setup en 5 minutos (recomendado para nuevos)
- **[SETUP_RESUMEN_FINAL.md](./SETUP_RESUMEN_FINAL.md)** - Resumen final del setup completado

### **🗄️ PostgreSQL y Credenciales**
- **[POSTGRESQL_SETUP.md](./POSTGRESQL_SETUP.md)** - Guía completa de PostgreSQL (7 opciones)
- **[CREDENTIALS_GUIDE.md](./CREDENTIALS_GUIDE.md)** - Cómo obtener y configurar credenciales
- **[POSTGRES_FAQ.md](./POSTGRES_FAQ.md)** - Preguntas frecuentes sobre PostgreSQL

### **🔧 Prisma ORM**
- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Setup de Prisma paso a paso (7 pasos)
- **[PRISMA_SETUP_CHECKLIST.md](./PRISMA_SETUP_CHECKLIST.md)** - Checklist de verificación

### **👥 Equipo de Base de Datos**
- **[TEAM_DATABASE.md](./TEAM_DATABASE.md)** - Guía completa para el equipo DB (responsabilidades, workflow, migraciones)

### **📖 Referencia**
- **[SCHEMA_REFERENCE.md](./SCHEMA_REFERENCE.md)** - Referencia del schema Prisma

---

## 🎯 ¿Por Dónde Empezar?

### **Si eres nuevo en el proyecto:**
1. Lee: [QUICK_START.md](./QUICK_START.md) (5 minutos)
2. Lee: [TEAM_DATABASE.md](./TEAM_DATABASE.md) (completo)
3. Ejecuta los comandos del QUICK_START

### **Si tienes preguntas sobre PostgreSQL:**
→ [POSTGRES_FAQ.md](./POSTGRES_FAQ.md)

### **Si necesitas credenciales:**
→ [CREDENTIALS_GUIDE.md](./CREDENTIALS_GUIDE.md)

### **Si necesitas entender el setup:**
→ [SETUP_RESUMEN_FINAL.md](./SETUP_RESUMEN_FINAL.md)

### **Si eres del equipo DB:**
→ [TEAM_DATABASE.md](./TEAM_DATABASE.md) (tu guía principal)

---

## 📊 Estructura del Proyecto

```
backend/
├── src/
│   └── database/
│       ├── docs/                    ← Estás aquí (documentación)
│       │   ├── README.md
│       │   ├── QUICK_START.md
│       │   ├── SETUP_RESUMEN_FINAL.md
│       │   ├── POSTGRESQL_SETUP.md
│       │   ├── CREDENTIALS_GUIDE.md
│       │   ├── POSTGRES_FAQ.md
│       │   ├── DATABASE_SETUP.md
│       │   ├── PRISMA_SETUP_CHECKLIST.md
│       │   ├── TEAM_DATABASE.md
│       │   └── SCHEMA_REFERENCE.md
│       ├── connection.ts           ← Código: gestor de conexión Prisma
│       └── [otros servicios]
├── prisma/
│   ├── schema.prisma               ← Definición de modelos
│   ├── migrations/                 ← Historial de cambios
│   ├── seeds/                      ← Datos iniciales
│   └── sql-reference/              ← SQL original (referencia)
├── package.json
├── .env                            ← Credenciales (NO COMMITEAR)
└── .env.example                    ← Template (SÍ COMMITEAR)
```

---

## 🔄 Workflow del Equipo DB

### **1. Crear/Actualizar Modelo**
```bash
# Edita prisma/schema.prisma
nano prisma/schema.prisma
```

### **2. Crear Migración**
```bash
npm run db:migrate:dev --name <descripcion>
```

### **3. Revisar en Prisma Studio**
```bash
npm run db:studio
```

### **4. Hacer Commit (solo migraciones)**
```bash
git add prisma/migrations/
git commit -m "Add migration: <descripcion>"
```

---

## 📝 Documentación por Rol

| Rol | Documentos Clave |
|-----|------------------|
| **Junior DB** | QUICK_START.md + TEAM_DATABASE.md |
| **Lead DB** | TEAM_DATABASE.md + SCHEMA_REFERENCE.md |
| **DevOps** | POSTGRESQL_SETUP.md + CREDENTIALS_GUIDE.md |
| **Nuevo en equipo** | QUICK_START.md → TEAM_DATABASE.md → SETUP_RESUMEN_FINAL.md |

---

## 🆘 Solución de Problemas

| Problema | Documento |
|----------|-----------|
| ¿Cómo instalo PostgreSQL? | [POSTGRESQL_SETUP.md](./POSTGRESQL_SETUP.md) |
| ¿Cómo obtengo credenciales? | [CREDENTIALS_GUIDE.md](./CREDENTIALS_GUIDE.md) |
| ¿Cómo creo una migración? | [TEAM_DATABASE.md](./TEAM_DATABASE.md) |
| ¿Cómo reseteo la BD? | [DATABASE_SETUP.md](./DATABASE_SETUP.md) |
| ¿Cómo convierto SQL a Prisma? | [DATABASE_SETUP.md](./DATABASE_SETUP.md) |
| Tengo errores con npm | [SETUP_RESUMEN_FINAL.md](./SETUP_RESUMEN_FINAL.md) |

---

## 🛠️ Comandos Rápidos

```bash
# Ver datos
npm run db:studio

# Crear migración
npm run db:migrate:dev --name <nombre>

# Aplicar migraciones
npm run db:migrate:deploy

# Resetear BD (⚠️ borra todo)
npm run db:reset

# Ejecutar seeds
npm run db:seed

# Generar cliente Prisma
npm run db:generate
```

---

## 📚 Recursos Externos

- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Official](https://www.postgresql.org/)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Best Practices](https://www.prisma.io/docs/guides/database/optimizing-queries)

---

## 👥 Contacto del Equipo

- **Lead DB:** [Nombre/Contacto]
- **Backend:** [Nombre/Contacto]
- **DevOps:** [Nombre/Contacto]

---

**Última actualización:** 10 de Noviembre, 2025
**Version:** 1.0
**Estado:** ✅ Activo
