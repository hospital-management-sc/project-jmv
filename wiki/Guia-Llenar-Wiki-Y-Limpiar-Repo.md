# 📚 GUÍA COMPLETA: MIGRAR DOCUMENTACIÓN A WIKI + LIMPIAR REPO

**Propósito:** Mostrar qué archivos eliminar y cómo llenar la Wiki  
**Fecha:** 31 de Octubre, 2025  
**Tiempo estimado:** 45 minutos

---

## 📊 PASO 1: ANÁLISIS DE ARCHIVOS EN EL REPO

### Archivos ACTUALES en `/hospital-management-system/`:

```
MANTENER (esenciales):
├─ README.md                    # Intro principal (MANTENER)
├─ CONTRIBUTING.md             # Guía para contribuir (MANTENER)
├─ .gitignore                  # Configuración git (MANTENER)
└─ docker-compose.yml          # Infraestructura (MANTENER)

ELIMINAR (van a Wiki):
├─ README_RAPIDO.md            # ❌ (Va a Wiki > Quick Start)
├─ SETUP_INICIAL.md            # ❌ (Va a Wiki > Setup)
├─ PARA_LIDERES.md             # ❌ (Va a Wiki > Para Líderes)
├─ ASIGNACION_TRABAJO.md       # ❌ (Va a Wiki > Roles)
├─ ENTREGABLES.md              # ❌ (Va a Wiki > Entregables)
└─ (carpeta docs/)             # ❌ (Va a Wiki > Docs)
```

**Razón:** Mantener el repo limpio. La documentación en Wiki es más accesible.

---

## 🗑️ PASO 2: ELIMINAR ARCHIVOS INNECESARIOS

### Archivos a eliminar:

```bash
# Navega al repo
cd /workspaces/codespaces-blank/hospital-management-system

# Elimina estos archivos
rm README_RAPIDO.md
rm SETUP_INICIAL.md
rm PARA_LIDERES.md
rm ASIGNACION_TRABAJO.md
rm ENTREGABLES.md

# Elimina carpeta docs/ si no tiene nada importante
rm -rf docs/

# Verifica que quedaron solo los 4 archivos esenciales
ls -la | grep -E "(README|CONTRIBUTING|gitignore|docker-compose)"
```

---

## 📖 PASO 3: CÓMO ACCEDER A LA WIKI

### Ubicación:

```
Tu Repositorio
  ↓
https://github.com/cmoinr/hospital-management
  ↓
En la barra superior: "Wiki" (entre "Code" y "Settings")
  ↓
Click en "Wiki"
```

### Primera vez:

```
1. Ve a: https://github.com/cmoinr/hospital-management/wiki
2. Click: "+ Create the first page"
3. Título: "Home"
4. Clic: "Save page"
```

---

## 🛠️ PASO 4: CREAR LA ESTRUCTURA DE WIKI

### Estructura recomendada:

```
Home (índice principal)
├─ 01-Quick-Start (Inicio rápido)
├─ 02-Setup (Setup inicial)
├─ 03-Roles (Asignación de trabajo)
├─ 04-Rulesets (Protecciones de rama)
├─ 05-Git-Workflow (Flujo de git)
├─ 06-Backend (Documentación backend)
├─ 07-Frontend (Documentación frontend)
├─ 08-FAQ (Preguntas frecuentes)
└─ 09-Recursos (Enlaces útiles)
```

---

## 📝 PASO 5: CREAR PÁGINA "HOME" (Índice)

### Contenido de Home:

```markdown
# 🏥 Hospital Management System

PWA de gestión clínica y administrativa para Hospital Militar Tipo I "Dr. José María Vargas".

## 📚 Documentación

### Para empezar
- [[Quick Start|01-Quick-Start]] - Inicio en 5 minutos
- [[Setup Inicial|02-Setup]] - Requisitos e instalación

### Entender el proyecto
- [[Roles y Responsabilidades|03-Roles]] - Quién hace qué
- [[Flujo de Git|05-Git-Workflow]] - Cómo trabajar con ramas
- [[FAQ|08-FAQ]] - Preguntas frecuentes

### Protecciones y Seguridad
- [[Protecciones de Rama|04-Rulesets]] - Reglas de las ramas
- [[Cómo cambiar roles de colaboradores|Cambiar-Roles]]

### Desarrollo
- [[Backend|06-Backend]] - Documentación del backend
- [[Frontend|07-Frontend]] - Documentación del frontend

### Recursos
- [[Enlaces útiles|09-Recursos]] - Links importantes

---

## 🎯 Objetivos del Proyecto

✅ Digitalizar procesos clínicos y administrativos  
✅ Reducir tiempos de espera  
✅ Sistema escalable y replicable  
✅ Acceso desde PC, tablets y teléfonos  

## 👥 Equipo

Estudiantes de Ingeniería en Sistemas (UNERG) bajo supervisión académica.

---

Última actualización: 31 de Octubre, 2025
```

### Cómo crear esta página:

```
1. Ve a: Wiki > "+ New page"
2. Título: "Home"
3. Sidebar title: (dejar vacío)
4. Pega el contenido arriba
5. Click: "Save page"

Nota: Los [[enlaces]] aparecerán como links una vez
      que crees las otras páginas.
```

---

## 🚀 PASO 6: CREAR PÁGINA "Quick Start"

### Contenido (USA README_RAPIDO.md):

```markdown
# 🚀 Quick Start - Inicio en 5 Minutos

## Requisitos

- Docker y Docker Compose instalados
- Git
- Node.js 18+ (opcional, para desarrollo local)

## Instalación Rápida

### 1. Clonar el repositorio

```bash
git clone https://github.com/cmoinr/hospital-management.git
cd hospital-management
```

### 2. Iniciar con Docker

```bash
docker-compose up -d
```

### 3. Acceder a la aplicación

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000
- **MongoDB:** localhost:27017

### 4. Datos por defecto

Pendiente de documentación en Setup Inicial.

## Siguiente Paso

👉 Lee: [[Setup Inicial|02-Setup]]
```

### Cómo crear:

```
1. Wiki > "+ New page"
2. Título: "01-Quick-Start"
3. Pega el contenido
4. Click: "Save page"
```

---

## 📋 PASO 7: CREAR PÁGINA "Setup Inicial"

### Contenido (USA SETUP_INICIAL.md):

```markdown
# 🔧 Setup Inicial

## Requisitos del Sistema

- **Node.js:** v18 o superior
- **Docker:** v20 o superior
- **Docker Compose:** v2 o superior
- **Git:** v2.30 o superior
- **npm:** v9 o superior (incluido con Node.js)

## Instalación Paso a Paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/cmoinr/hospital-management.git
cd hospital-management
```

### 2. Configurar variables de entorno

#### Backend

```bash
cd backend
cp .env.example .env
# Edita .env con tus valores
```

#### Frontend

```bash
cd frontend
cp .env.example .env
# Edita .env si es necesario
```

### 3. Iniciar con Docker

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

### 4. Verificar que está corriendo

```bash
# Ver logs
docker-compose logs -f

# Ver contenedores
docker-compose ps
```

## Puertos

- **Frontend (Vite):** 5173
- **Backend (Express):** 3000
- **MongoDB:** 27017

## Siguiente Paso

👉 Lee: [[Roles y Responsabilidades|03-Roles]]
```

---

## 👥 PASO 8: CREAR PÁGINA "Roles"

### Contenido (USA ASIGNACION_TRABAJO.md):

```markdown
# 👥 Roles y Responsabilidades

## Estructura del Equipo

### Líderes (2)
- **Roles:** Admin en GitHub
- **Responsabilidades:**
  - Decisiones arquitectónicas
  - Merges a main
  - Gestión del equipo

### Backend Leads (1-2)
- **Roles:** Maintain en GitHub
- **Responsabilidades:**
  - Arquitectura backend
  - Revisar PRs
  - Mentoría a backend devs

### Frontend Leads (1-2)
- **Roles:** Maintain en GitHub
- **Responsabilidades:**
  - Arquitectura frontend
  - Revisar PRs
  - Mentoría a frontend devs

### Backend Developers (2-3)
- **Roles:** Write en GitHub
- **Responsabilidades:**
  - Desarrollo de features
  - Seguir estándares de código
  - Crear PRs para revisión

### Frontend Developers (2-3)
- **Roles:** Write en GitHub
- **Responsabilidades:**
  - Desarrollo de UI/UX
  - Seguir estándares de código
  - Crear PRs para revisión

## Permisos por Rol

| Acción | Dev | Lead | Admin |
|--------|-----|------|-------|
| Push a feature/* | ✅ | ✅ | ✅ |
| Push a develop | ❌ | ✅ | ✅ |
| Push a main | ❌ | ❌ | ✅ |
| Crear PR | ✅ | ✅ | ✅ |
| Revisar PR | ✅ | ✅ | ✅ |
| Mergear PR | ❌ | ✅ | ✅ |
| Cambiar settings | ❌ | ❌ | ✅ |

## Siguiente Paso

👉 Lee: [[Flujo de Git|05-Git-Workflow]]
```

---

## 🔐 PASO 9: CREAR PÁGINA "Rulesets"

### Contenido (USA GUIA_PROTEGER_LEADS_ONLY_RULESETS.md):

```markdown
# 🔐 Protecciones de Rama (Rulesets)

## Resumen de Ramas

### main (Producción)
- **Requiere:** 2 aprobaciones
- **Status checks:** ESLint, Tests, Build
- **Quién puede mergear:** Admins
- **Force push:** ❌ Bloqueado

### develop (Desarrollo)
- **Requiere:** 1 aprobación
- **Status checks:** ESLint, Tests
- **Quién puede mergear:** Leads + Admins
- **Force push:** ❌ Bloqueado

### leads-only (Docs internas)
- **Requiere:** 1 aprobación
- **Quién puede mergear:** Solo Admins
- **Quién puede pushear:** Solo Admins
- **Force push:** ❌ Bloqueado

## Flujo de Trabajo

1. Creas `feature/tu-feature` desde `develop`
2. Haces commits y pushes a tu rama
3. Creas PR a `develop`
4. Lead revisa y aprueba
5. Mergeas a `develop`
6. Cuando está listo: Lead crea PR `develop` → `main`
7. Admin aprueba y mergea

## Para más detalles

Ver: [[CAMBIAR_ROL_COLABORADORES_GITHUB.md|Cambiar-Roles]]
```

---

## 💻 PASO 10: CREAR PÁGINA "Git Workflow"

### Contenido:

```markdown
# 🔄 Flujo de Git

## Crear una rama feature

```bash
# Actualiza develop
git checkout develop
git pull origin develop

# Crea tu rama feature
git checkout -b feature/nombre-descriptivo

# Ej:
git checkout -b feature/login-form
git checkout -b feature/patient-dashboard
```

## Trabajar en tu rama

```bash
# Haz cambios
git add .
git commit -m "Descripción clara de cambios"

# Pushea regularmente
git push origin feature/nombre-descriptivo
```

## Crear Pull Request

1. Ve a GitHub > Pull requests
2. Click "New pull request"
3. Compara:
   - **Base:** develop
   - **Compare:** feature/nombre-descriptivo
4. Agrega descripción y detalle
5. Click "Create pull request"

## Después de aprobación

```bash
# Update local develop
git checkout develop
git pull origin develop

# Borra rama local
git branch -d feature/nombre-descriptivo

# Borra rama remota
git push origin --delete feature/nombre-descriptivo
```

## Comandos útiles

```bash
# Ver todas las ramas
git branch -a

# Ver historial
git log --oneline

# Ver cambios sin pushear
git status
```
```

---

## 🎓 PASO 11: LLENAR EL RESTO DE PÁGINAS

### Backend (06-Backend)
```
Usa contenido de: backend/README.md (si existe)
O crea resumen de:
- Stack tecnológico
- Estructura de carpetas
- Endpoints principales
- Cómo correr tests
```

### Frontend (07-Frontend)
```
Usa contenido de: frontend/README.md (si existe)
O crea resumen de:
- Stack tecnológico
- Estructura de carpetas
- Cómo correr en desarrollo
- PWA capabilities
```

### FAQ (08-FAQ)
```
Preguntas comunes:
- ¿Cómo reporto un bug?
- ¿Cómo sugiero una mejora?
- ¿Dónde están los datos?
- ¿Cómo resetear la BD?
- Etc.
```

### Recursos (09-Recursos)
```
- Links a documentación externa
- Links a tareas en GitHub
- Links a diseño en Figma
- Etc.
```

---

## ✅ CHECKLIST: LLENAR LA WIKI

```
Estructura base:
[ ] Home creada (índice)

Guías de inicio:
[ ] 01-Quick-Start (5 min de lectura)
[ ] 02-Setup (instalación completa)

Organización:
[ ] 03-Roles (quién hace qué)
[ ] 04-Rulesets (protecciones de rama)
[ ] 05-Git-Workflow (cómo trabajar)

Documentación técnica:
[ ] 06-Backend (resumen)
[ ] 07-Frontend (resumen)

Soporte:
[ ] 08-FAQ (preguntas frecuentes)
[ ] 09-Recursos (enlaces útiles)

Bonus:
[ ] Cambiar-Roles (cómo cambiar roles en GitHub)
```

---

## 🗑️ LISTA DE ELIMINACIÓN

### Archivos a eliminar del repo:

```bash
cd /workspaces/codespaces-blank/hospital-management-system

# Elimina archivos
rm README_RAPIDO.md
rm SETUP_INICIAL.md
rm PARA_LIDERES.md
rm ASIGNACION_TRABAJO.md
rm ENTREGABLES.md

# Elimina carpeta docs si no es esencial
rm -rf docs/

# Commit y push
git add -A
git commit -m "refactor: mueve documentación a Wiki"
git push origin main
```

---

## 📱 RESULTADO FINAL

### El repo quedará limpio:

```
hospital-management-system/
├─ README.md                   (¿Qué es, inicio rápido)
├─ CONTRIBUTING.md            (Cómo contribuir)
├─ .gitignore                 (Archivos ignorados)
├─ docker-compose.yml         (Infraestructura)
├─ backend/                   (Código backend)
├─ frontend/                  (Código frontend)
└─ .github/                   (CI/CD, workflows)
```

### La documentación estará en Wiki:

```
Wiki > Home (Índice)
├─ Quick Start
├─ Setup Inicial
├─ Roles
├─ Rulesets
├─ Git Workflow
├─ Backend
├─ Frontend
├─ FAQ
└─ Recursos
```

---

## 🎓 VENTAJAS DE USAR WIKI

```
✅ Documentación centralizada
✅ Fácil de editar (sin commits)
✅ Visible en interfaz de GitHub
✅ Historial de cambios
✅ Búsqueda integrada
✅ Estructura clara con índice
✅ Equipo no se pierde en archivos .md
```

---

## 🚀 SIGUIENTE PASO

**HOY:**
```
1. Elimina los 5 archivos .md innecesarios
2. Commit y push
3. Crea Home en Wiki
4. Crea las 5 páginas principales
```

**MAÑANA (Kickoff):**
```
5. Muestra la Wiki al equipo
6. Que abran las páginas y las lean
7. El repo queda limpio para desarrollo
```

---

**Documento:** Guía Completa Wiki + Limpiar Repo  
**Versión:** 1.0  
**Fecha:** 31 de Octubre, 2025  
**Tiempo:** 45 minutos
