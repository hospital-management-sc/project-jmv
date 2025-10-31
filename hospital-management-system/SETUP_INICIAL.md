# ✅ CHECKLIST DE INICIO RÁPIDO

**Para**: Semana 0  
**Tiempo estimado**: 2-3 horas de setup  
**Responsables**: Líderes del proyecto + DevOps

---

## 📋 PASO 1: Preparación Inicial (30 min)

### Líderes del Proyecto
- [ ] Crear cuenta en GitHub (si no tienen)
- [ ] Crear organización en GitHub (ej: `hospital-management-2025`)
- [ ] Crear repo: `hospital-management-system`
- [ ] Invitar a todos los 10 estudiantes al repo
- [ ] Crear equipo en Slack/Discord con canales:
  - [ ] #general
  - [ ] #backend
  - [ ] #frontend
  - [ ] #devops
  - [ ] #random
  - [ ] #hospital-coordination

### Equipo DevOps
- [ ] Verificar Docker y Docker Compose instalados
  ```bash
  docker --version
  docker-compose --version
  ```
- [ ] Verificar Node.js 20+ instalado
  ```bash
  node --version
  npm --version
  ```

---

## 📁 PASO 2: Clonar y Setup Inicial (15 min)

### Todos (en sus máquinas)
```bash
# Clonar repo
git clone <URL-del-repo>
cd hospital-management-system

# Verificar estructura
ls -la
```

**Verificar que exista:**
```
✅ backend/
✅ frontend/
✅ docs/
✅ docker-compose.yml
✅ README.md
✅ CONTRIBUTING.md
✅ GUIA_PROYECTO.md
✅ LIDERAZGO_EQUIPO.md
✅ ASIGNACION_TRABAJO.md
```

---

## 🔧 PASO 3: Setup con Docker (30 min)

### DevOps Person + Backend Lead

```bash
# Posicionarse en raíz del proyecto
cd hospital-management-system

# Crear .env files desde ejemplos
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Levantar servicios
docker-compose up -d

# Verificar que todo esté corriendo
docker-compose ps

# Esperado:
# NAME                COMMAND             STATUS
# hospital-mongodb    mongod              Up (healthy)
# hospital-backend    npm run dev         Up
# hospital-frontend   npm run dev         Up
```

### Verificar Conectividad

```bash
# Frontend (debe cargarse en browser)
curl http://localhost:5173

# Backend (debe responder)
curl http://localhost:5000

# MongoDB (debe conectarse)
docker exec hospital-mongodb mongosh -u admin -p changeMe123!
```

---

## 📦 PASO 4: Verificar Instalación de Dependencias (20 min)

### Backend
```bash
cd backend

# Check que package.json exista
ls -la package.json

# Si npm install aún no corrió (si no usaste Docker):
npm install

# Verificar TypeScript
npm run type-check

# Esperado: Debe compilar sin errores
```

### Frontend
```bash
cd frontend

# Check que package.json exista
ls -la package.json

# Si npm install aún no corrió:
npm install

# Verificar TypeScript
npm run type-check

# Esperado: Debe compilar sin errores
```

---

## 🌐 PASO 5: Acceso a Servicios (10 min)

### Verificar en Browser

| Servicio | URL | Esperado |
|----------|-----|----------|
| Frontend | http://localhost:5173 | Vite welcome o app |
| Backend API | http://localhost:5000 | 404 or JSON response |
| MongoDB Compass | mongodb://admin:changeMe123!@localhost:27017 | Conectado |

### Verificar APIs Básicas

```bash
# Health check backend (la mayoría de apps tienen esto)
curl -X GET http://localhost:5000/health

# Ver que la API está viva
curl -X GET http://localhost:5000/api
```

---

## 📚 PASO 6: Lectura Recomendada (30 min)

**TODOS deben leer en este orden:**

1. ✅ **README.md** (5 min)
   - Overview del proyecto
   - Stack tecnológico
   - Links de documentación

2. ✅ **GUIA_PROYECTO.md** (15 min)
   - Contexto completo
   - Arquitectura
   - Fases del proyecto

3. ✅ **LIDERAZGO_EQUIPO.md** (10 min)
   - Cómo trabajamos en equipo
   - Comunicación
   - Reuniones

4. ✅ **CONTRIBUTING.md** (10 min)
   - Cómo hacer commits
   - Cómo hacer PRs
   - Estándares de código

---

## 👥 PASO 7: Asignación de Roles (30 min)

### Líderes del Proyecto

En reunión con todos:

**Comunicar claramente:**
- [ ] Cada persona sabe su rol (Backend, Frontend, DevOps/QA)
- [ ] Cada persona sabe su sub-equipo y sub-líder
- [ ] Cada persona recibe documento ASIGNACION_TRABAJO.md
- [ ] Preguntas: ¿Alguien no entiende su rol?

**Documento compartir:**
- [ ] ASIGNACION_TRABAJO.md (ver tareas específicas)
- [ ] Link a GUIA_PROYECTO.md
- [ ] Link a LIDERAZGO_EQUIPO.md

---

## 🚀 PASO 8: Primer Standup (30 min)

### Primera Reunión de Equipo

**Agenda:**
1. Bienvenida (5 min)
2. Explicación de proyecto (10 min)
3. Explicación de roles (5 min)
4. Q&A (5 min)
5. Setup verification (5 min)

**Preguntar:**
- ✅ ¿Todos en el Slack/Discord?
- ✅ ¿Todos clonaron el repo?
- ✅ ¿Docker está corriendo?
- ✅ ¿Entienden el documento ASIGNACION_TRABAJO.md?
- ✅ ¿Saben a quién contactar?

---

## 📝 PASO 9: Documentar Setup en Tu Máquina

### Cada Persona Registra

Crea un issue en GitHub:

```
Title: "Setup verificado en [tu nombre]"

Body:
Confirmo que completé setup:
- [ ] Repo clonado
- [ ] Docker corriendo
- [ ] Frontend accesible en localhost:5173
- [ ] Backend accesible en localhost:5000
- [ ] MongoDB accesible
- [ ] Leí README, GUIA_PROYECTO, CONTRIBUTING
- [ ] Entiendo mi rol
- [ ] Entiendo la comunicación en Slack

Sistema operativo: [macOS / Windows / Linux]
Cualquier problema encontrado: [Describe aquí]
```

---

## 🔍 PASO 10: Verificación Final (15 min)

### Checklist de Líderes

```
✅ Repo en GitHub con 10+ colaboradores
✅ Slack/Discord activo con 10+ miembros
✅ docker-compose.yml corriendo exitosamente
✅ Todos reportan setup completado
✅ Todos entienden su rol
✅ Todos en la misma página sobre comunicación
✅ Todos saben próximos pasos
✅ Reunión de kickoff agendada para próxima semana
```

---

## 🎯 Próximos Pasos (Después de Semana 0)

### Para la Próxima Semana (Semana 1-2)

**Líderes:**
- [ ] Agendar entrevista en hospital
- [ ] Preparar preguntas para hospital

**Backend Lead:**
- [ ] Comenzar con primer endpoint (login probablemente)
- [ ] Crear rama `develop`
- [ ] Primer PR de ejemplo

**Frontend Lead:**
- [ ] Crear estructura de componentes
- [ ] Primer PR de ejemplo

**DevOps:**
- [ ] Configurar GitHub Actions básico

**Todo el equipo:**
- [ ] Daily standup: 10 AM (15 min)
- [ ] Asignarse primeras tareas
- [ ] Hacer commits pequeños

---

## 🆘 Troubleshooting Común

### "Docker no funciona"
```bash
# Reiniciar Docker
docker restart

# O reiniciar desde cero
docker-compose down
docker-compose up -d
```

### "MongoDB no conecta"
```bash
# Ver logs de MongoDB
docker logs hospital-mongodb

# Verificar credenciales en .env
cat backend/.env | grep MONGODB
```

### "Frontend no carga"
```bash
# Ver logs de Vite
docker logs hospital-frontend

# Verificar que VITE_API_URL esté correcto
cat frontend/.env
```

### "Puertos ya en uso"
```bash
# Ver qué está usando el puerto (ej: 5000)
lsof -i :5000

# Cambiar puertos en docker-compose.yml
# De: 5000:5000
# A:  5001:5000
```

### "Permisos de Docker en Linux"
```bash
# Si tienes error de permisos:
sudo usermod -aG docker $USER
newgrp docker
docker ps  # Debe funcionar sin sudo
```

---

## 📞 Contactos de Ayuda

Si algo no funciona:
1. **Slack/Discord** → Pregunta en #devops
2. **GitHub** → Crea issue con error
3. **Sub-lead de tu equipo** → Help directo
4. **Líderes del proyecto** → Escalación

---

## ✨ Post-Setup Celebration

**Si TODO funciona:**
```
🎉 ¡Felicidades! Tu setup está listo.
📝 Reporta en GitHub issue que completaste setup.
📅 Prepárate para primera iteración.
💪 Vamos a construir algo increíble.
```

---

**Versión**: 1.0  
**Creado**: Octubre 31, 2025  
**Para completar antes de**: Lunes 31 de octubre 2025

**Tiempo total estimado**: 3-4 horas
