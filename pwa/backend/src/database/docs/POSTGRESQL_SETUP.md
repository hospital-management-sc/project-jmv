# 🐘 PostgreSQL - Guía de Credenciales y Setup

## ❓ ¿PostgreSQL es Gratis?

**✅ SÍ, PostgreSQL es completamente GRATIS y de código abierto (Open Source)**

- 🆓 **Gratis** para descargar, instalar y usar
- 📝 **Licencia**: PostgreSQL License (muy permisiva)
- 🚀 **Producción**: Puedes usarlo en producción sin pagar
- 🏢 **Empresas**: Usado por Netflix, Spotify, Apple, etc.

---

## 🔑 ¿Dónde Obtener Credenciales PostgreSQL?

Tienes varias opciones según tu caso:

### **OPCIÓN 1: Local (RECOMENDADO para desarrollo)**

Instala PostgreSQL en tu computadora.

#### En **Windows/Mac/Linux**:
```bash
# 1. Descarga desde:
https://www.postgresql.org/download/

# 2. Instala y configura
# Se crea usuario por defecto: postgres
# Contraseña: la que estableces en instalación

# 3. Credenciales por defecto:
DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/hospital_db"
```

#### En **Ubuntu/Debian** (este es Linux):
```bash
# Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Ver estado
sudo systemctl status postgresql

# Conectarse a PostgreSQL
sudo -u postgres psql

# Crear usuario y BD
postgres=# CREATE USER hospital_user WITH PASSWORD 'mi_contraseña_segura';
postgres=# CREATE DATABASE hospital_db OWNER hospital_user;
postgres=# \q

# Credenciales:
DATABASE_URL="postgresql://hospital_user:mi_contraseña_segura@localhost:5432/hospital_db"
```

#### En **Windows**:
```
1. Descarga: https://www.postgresql.org/download/windows/
2. Ejecuta instalador
3. En configuración, establece:
   - Puerto: 5432 (default)
   - Usuario: postgres
   - Contraseña: la que quieras
4. Finaliza instalación
5. Usa: pgAdmin (GUI) incluida para gestionar

DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/hospital_db"
```

---

### **OPCIÓN 2: En un Contenedor Docker (RECOMENDADO para equipos)**

Si ya tienes Docker instalado (lo tienes en este devcontainer):

```bash
# 1. Crea archivo: backend/docker-compose.postgres.yml

# 2. Ejecuta:
docker-compose -f docker-compose.postgres.yml up -d

# 3. Credenciales automáticas:
DATABASE_URL="postgresql://hospital_user:hospital_password@localhost:5432/hospital_db"
```

---

### **OPCIÓN 3: En la Nube (Hosting Gratuito)**

#### **Supabase** (Recomendado - Gratis + Fácil)
```
1. Accede: https://supabase.com/
2. Sign Up gratis
3. Crea nuevo proyecto
4. Obtiene credenciales automáticamente
5. Incluye:
   - Base de datos PostgreSQL (5MB gratis)
   - Dashboard web
   - Backups automáticos
   
DATABASE_URL=<te la proporciona en settings>
```

#### **Railway** (Gratis - $5/mes créditos)
```
1. Accede: https://railway.app/
2. Sign Up gratis
3. Crea BD PostgreSQL
4. Obtiene DATABASE_URL
5. Créditos gratis iniciales
```

#### **Render** (Gratis)
```
1. Accede: https://render.com/
2. Sign Up gratis
3. Crea BD PostgreSQL
4. Obtiene credenciales
5. Servicio gratuito (puede hibernar)
```

---

## 📋 RECOMENDACIÓN POR CASO

### **Para Desarrollo (Fase Actual)**
```
✅ OPCIÓN 1 (Local) o OPCIÓN 2 (Docker)

Razones:
- Más rápido
- Sin internet necesario
- Puedes resetear fácilmente
- Ideal mientras pulís el esquema
```

### **Para Demostración al Hospital**
```
✅ OPCIÓN 2 (Docker en servidor) o OPCIÓN 3 (Supabase)

Razones:
- Accesible remotamente
- Ya en la nube
- Credenciales persistentes
```

### **Para Producción Futura**
```
✅ OPCIÓN 3 (AWS RDS, Azure Database, Supabase, Railway, etc.)

Razones:
- Escalable
- Backups automáticos
- Seguridad profesional
```

---

## 🚀 SETUP RÁPIDO (RECOMENDADO PARA USTEDES)

### **Opción A: Docker Local (5 minutos)**

1. **Crea archivo `backend/docker-compose.postgres.yml`:**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: hospital_postgres
    environment:
      POSTGRES_DB: hospital_db
      POSTGRES_USER: hospital_user
      POSTGRES_PASSWORD: hospital_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U hospital_user"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

2. **Levanta PostgreSQL:**
```bash
cd backend
docker-compose -f docker-compose.postgres.yml up -d
```

3. **Verifica que está corriendo:**
```bash
docker-compose -f docker-compose.postgres.yml ps
```

4. **Credenciales automáticas:**
```env
DATABASE_URL="postgresql://hospital_user:hospital_password@localhost:5432/hospital_db"
```

5. **Para detener:**
```bash
docker-compose -f docker-compose.postgres.yml down
```

---

### **Opción B: Local en Linux (Este Devcontainer)**

```bash
# 1. Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# 2. Iniciar servicio
sudo systemctl start postgresql

# 3. Crear usuario y BD
sudo -u postgres psql << EOF
CREATE USER hospital_user WITH PASSWORD 'hospital_password';
CREATE DATABASE hospital_db OWNER hospital_user;
ALTER ROLE hospital_user WITH CREATEDB;
\q
EOF

# 4. Credenciales:
DATABASE_URL="postgresql://hospital_user:hospital_password@localhost:5432/hospital_db"

# 5. Verificar conexión:
psql "postgresql://hospital_user:hospital_password@localhost:5432/hospital_db" -c "SELECT version();"
```

---

## 🔐 Seguridad: Credenciales en .env

### ✅ **CORRECTO:**
```env
# .env (NO COMMITEAR)
DATABASE_URL="postgresql://hospital_user:hospital_password@localhost:5432/hospital_db"
JWT_SECRET=tu_secreto_aqui
```

### ❌ **INCORRECTO:**
```env
# NO pongas credenciales en el código
# NO hagas commit de .env
# NO uses contraseñas simples en producción
```

### **Protección:**
```bash
# Asegúrate que .env está en .gitignore
echo ".env" >> .gitignore

# Crea .env.example (SÍ commitear)
# DATABASE_URL=postgresql://user:password@localhost:5432/db_name
# JWT_SECRET=your_secret_here
```

---

## ✅ Paso a Paso: Tu Caso

Basándome en que estás en un **devcontainer (Linux)**, te recomiendo:

### **OPCIÓN RECOMENDADA: Docker Local**

```bash
# 1. Crea docker-compose.postgres.yml
# (Ve arriba: Opción A: Docker Local)

# 2. Levanta PostgreSQL
docker-compose -f docker-compose.postgres.yml up -d

# 3. Actualiza .env
DATABASE_URL="postgresql://hospital_user:hospital_password@localhost:5432/hospital_db"

# 4. Verifica conexión
npm run db:push

# ¡Listo!
```

---

## 🔍 Verificar Conexión

### **Comando para probar:**
```bash
# Desde backend/
psql "postgresql://hospital_user:hospital_password@localhost:5432/hospital_db" -c "SELECT 1;"
```

**Si ves:**
```
 ?column?
----------
        1
(1 row)
```

✅ **Conexión exitosa!**

---

## 📚 Recursos

- [PostgreSQL Official](https://www.postgresql.org/)
- [PostgreSQL Downloads](https://www.postgresql.org/download/)
- [Supabase (Hosting Gratis)](https://supabase.com/)
- [Railway (Hosting Gratis)](https://railway.app/)
- [pgAdmin (GUI Tool)](https://www.pgadmin.org/)

---

## ❓ Preguntas Comunes

**P: ¿Tengo que pagar por PostgreSQL?**
R: No, es completamente gratis. Puedes pagardespués si quieres hosting en la nube.

**P: ¿Cuál es la diferencia entre local y Docker?**
R: Local = instalado en tu PC. Docker = en contenedor (más portátil y limpio).

**P: ¿Debo usar contraseña complicada ahora?**
R: En desarrollo, no. Para producción/demostración, sí.

**P: ¿Dónde guardo la contraseña?**
R: En `.env` (NO commitear). Usa `.env.example` como template.

**P: ¿Puedo cambiar la contraseña después?**
R: Sí, con SQL: `ALTER USER hospital_user WITH PASSWORD 'nueva_contraseña';`

---

**Elige la opción que más te convenga y me avisas cuando tengas PostgreSQL corriendo.** 🚀
