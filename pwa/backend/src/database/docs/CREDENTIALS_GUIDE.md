# 📱 PostgreSQL - Resumen de Credenciales

## ✅ ¿PostgreSQL es Gratis?

**SÍ. PostgreSQL es 100% gratuito y de código abierto.**

- 🆓 Gratis descargar, instalar y usar
- 📝 Licencia: PostgreSQL (muy permisiva)
- 🚀 Funciona en producción sin costo
- 🏢 Usado por: Netflix, Spotify, Apple, Instagram, etc.

---

## 🔑 ¿Dónde Obtener Credenciales?

Tienes 3 opciones:

### **OPCIÓN 1️⃣: Local en tu PC** (Simple)
```
1. Descargar e instalar: https://www.postgresql.org/download/
2. Usuario: postgres (por defecto)
3. Contraseña: la que estableces en instalación
4. Puerto: 5432 (por defecto)

DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/hospital_db"
```

### **OPCIÓN 2️⃣: Docker Local** (RECOMENDADO para equipo) ⭐
```
1. Levanta: docker-compose -f docker-compose.postgres.yml up -d
2. Usuario: hospital_user (ya configurado)
3. Contraseña: hospital_password (ya configurada)
4. Puerto: 5432

DATABASE_URL="postgresql://hospital_user:hospital_password@localhost:5432/hospital_db"

✅ Ya incluye pgAdmin en http://localhost:5050
```

### **OPCIÓN 3️⃣: En la Nube** (Hosting gratis) 🌐
```
- Supabase: https://supabase.com/        ← Fácil + Gratis
- Railway: https://railway.app/          ← Gratis + $5/mes
- Render: https://render.com/            ← Gratis (puede hibernar)
- AWS RDS: https://aws.amazon.com/rds/   ← Tier gratuito 1 año
- Azure: https://azure.microsoft.com/    ← Tier gratuito 12 meses
```

---

## 🚀 MI RECOMENDACIÓN PARA USTEDES

Basándome en que están en equipo y en devcontainer:

### **USA DOCKER LOCAL**

```bash
# 1. Levanta PostgreSQL + pgAdmin
docker-compose -f docker-compose.postgres.yml up -d

# 2. Verifica que está corriendo
docker-compose -f docker-compose.postgres.yml ps

# 3. En .env escribe:
DATABASE_URL="postgresql://hospital_user:hospital_password@localhost:5432/hospital_db"

# 4. Accede a pgAdmin (GUI visual):
# http://localhost:5050
# Email: admin@hospital.local
# Contraseña: admin123
```

**Ventajas:**
- ✅ Todos en el equipo usan las mismas credenciales
- ✅ No hay que instalar PostgreSQL localmente
- ✅ Fácil de resetear: `docker-compose down -v`
- ✅ Incluye pgAdmin (interfaz visual)
- ✅ Portátil entre máquinas

---

## 🛠️ Pasos Específicos para Ti

### **Paso 1: Verifica que tienes Docker**
```bash
docker --version
docker-compose --version
```

### **Paso 2: Levanta PostgreSQL**
```bash
cd backend
docker-compose -f docker-compose.postgres.yml up -d
```

**Salida esperada:**
```
Creating hospital_postgres_dev ... done
Creating hospital_pgadmin ... done
```

### **Paso 3: Verifica que está corriendo**
```bash
docker-compose -f docker-compose.postgres.yml ps
```

**Salida esperada:**
```
NAME                   STATUS
hospital_postgres_dev  Up 5 seconds
hospital_pgadmin       Up 3 seconds
```

### **Paso 4: Copia .env**
```bash
cp .env.example .env
```

**Ya incluye:**
```env
DATABASE_URL="postgresql://hospital_user:hospital_password@localhost:5432/hospital_db"
```

### **Paso 5: Prueba la conexión**
```bash
npm run db:push
```

---

## 📊 Comparativa de Opciones

| Aspecto | Local | Docker | Supabase |
|--------|-------|--------|----------|
| **Costo** | Gratis | Gratis | Gratis (5MB) |
| **Setup** | 10 min | 2 min | 5 min |
| **Para equipo** | ❌ | ✅ | ✅ |
| **Resetear BD** | Complejo | `docker-compose down -v` | En UI |
| **Acceso visual** | Necesita pgAdmin | Incluido | Incluido |
| **Requiere internet** | ❌ | ❌ | ✅ |

---

## 🎯 Acción Inmediata

Ejecuta esto en terminal:

```bash
cd /workspaces/codespaces-blank/hospital-management-system/backend

# 1. Levanta PostgreSQL
docker-compose -f docker-compose.postgres.yml up -d

# 2. Espera 10 segundos para que inicie
sleep 10

# 3. Verifica
docker-compose -f docker-compose.postgres.yml ps

# 4. Copia .env
cp .env.example .env

# 5. Instala dependencias
npm install

# 6. Prueba conexión
npm run db:push
```

Si todo va bien, verás:
```
✅ Prisma Client generated
```

---

## 🔒 Seguridad: .env

### ✅ **HACER:**
```
✅ Guardar DATABASE_URL en .env (NO COMMITEAR)
✅ Usar .env.example como template (SÍ COMMITEAR)
✅ En producción, usar credenciales fuertes
✅ Revisar .gitignore incluya .env
```

### ❌ **NO HACER:**
```
❌ Commitear .env
❌ Compartir DATABASE_URL por chat
❌ Usar contraseñas simples en producción
❌ Dejar credenciales en el código
```

---

## 📱 Acceso a Datos

Cuando PostgreSQL esté corriendo, accede desde:

### **Opción A: Prisma Studio (Recomendado)**
```bash
npm run db:studio
# Abre: http://localhost:5555
```

### **Opción B: pgAdmin (GUI)** (Incluido en Docker)
```
Abre: http://localhost:5050
Email: admin@hospital.local
Contraseña: admin123
```

### **Opción C: Terminal psql**
```bash
psql "postgresql://hospital_user:hospital_password@localhost:5432/hospital_db"
```

---

## 🔄 Comandos Útiles

```bash
# Ver logs
docker-compose -f docker-compose.postgres.yml logs -f postgres

# Detener PostgreSQL
docker-compose -f docker-compose.postgres.yml down

# Resetear BD (borra todo)
docker-compose -f docker-compose.postgres.yml down -v

# Reiniciar
docker-compose -f docker-compose.postgres.yml restart
```

---

**Elige Docker y ejecuta los 6 pasos. Me avisas cuando sea listo.** ✅
