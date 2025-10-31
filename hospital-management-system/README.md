# Hospital Management System - PWA de Gestión Clínica

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Descripción

PWA (Progressive Web App) para gestión clínica y administrativa del Hospital Militar Tipo I "Dr. José María Vargas". Proyecto de Servicio Comunitario de estudiantes de Ingeniería en Sistemas (UNERG).

## 🎯 Objetivos

- Digitalizar procesos administrativos y clínicos
- Reducir tiempos de espera y mejorar atención
- Sistema escalable y replicable en otros hospitales
- Interfaz accessible desde PC, tablets y teléfonos

## ✨ Características Principales

- ✅ Gestión de pacientes
- ✅ Historial clínico electrónico
- ✅ Agenda de citas
- ✅ Interconsultas multidisciplinarias
- ✅ Generador de informes
- ✅ Panel administrativo
- ✅ Control de acceso por roles

## 🏗️ Stack Tecnológico

### Backend
- **Node.js** + **Express.js** + **TypeScript**
- **MongoDB** + **Mongoose**
- **JWT** para autenticación
- **Zod** para validación

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **React Router** para navegación
- **React Hook Form** + **Zod** para formularios
- **CSS Modules** + **CSS Variables**
- **PWA** capabilities

### DevOps
- **Docker** + **Docker Compose**
- **GitHub Actions** para CI/CD

## 🚀 Inicio Rápido

### Requisitos
- Docker y Docker Compose instalados
- Node.js 20+ (para desarrollo sin Docker)
- Git

### Con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone <repository-url>
cd hospital-management-system

# Levantar servicios
docker-compose up -d

# Verificar servicios
docker-compose ps
```

Acceso:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### Sin Docker (Desarrollo local)

#### Backend
```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tu configuración local

# Ejecutar servidor (requiere MongoDB local en :27017)
npm run dev
```

#### Frontend
```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar servidor Vite
npm run dev
```

## 📁 Estructura del Proyecto

```
hospital-management-system/
├── backend/                    # API REST (Express + TypeScript)
│   ├── src/
│   │   ├── config/            # Configuraciones
│   │   ├── models/            # Esquemas Mongoose
│   │   ├── controllers/       # Controllers
│   │   ├── services/          # Lógica de negocio
│   │   ├── middleware/        # Middlewares
│   │   ├── routes/            # Rutas
│   │   ├── utils/             # Utilidades
│   │   └── index.ts           # Punto de entrada
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/        # Componentes React
│   │   ├── pages/             # Páginas
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # Servicios API
│   │   ├── context/           # Context API
│   │   ├── styles/            # CSS Modules
│   │   └── App.tsx
│   ├── public/                # Assets estáticos
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                       # Documentación
│   ├── ARQUITECTURA.md
│   ├── API.md
│   ├── DATABASE.md
│   ├── SEGURIDAD.md
│   └── SETUP.md
│
└── docker-compose.yml         # Orquestación Docker

Ver GUIA_PROYECTO.md para estructura detallada.
```

## 🛠️ Desarrollo

### Scripts Principales

#### Backend
```bash
cd backend
npm run dev          # Modo desarrollo (watch)
npm run build        # Compilar TypeScript
npm start            # Ejecutar compilado
npm test             # Ejecutar tests
npm run lint         # Linting
npm run lint:fix     # Arreglar lint automáticamente
npm run format       # Formatear código
```

#### Frontend
```bash
cd frontend
npm run dev          # Servidor Vite (desarrollo)
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linting
npm run lint:fix     # Arreglar lint automáticamente
npm run format       # Formatear código
npm test             # Ejecutar tests
```

## 📝 Documentación

- **[GUIA_PROYECTO.md](../GUIA_PROYECTO.md)** - Guía completa del proyecto
- **[LIDERAZGO_EQUIPO.md](../LIDERAZGO_EQUIPO.md)** - Guía de liderazgo para 10 personas
- **[docs/ARQUITECTURA.md](./docs/ARQUITECTURA.md)** - Arquitectura técnica
- **[docs/API.md](./docs/API.md)** - Especificación de API
- **[docs/DATABASE.md](./docs/DATABASE.md)** - Esquema de base de datos
- **[docs/SEGURIDAD.md](./docs/SEGURIDAD.md)** - Consideraciones de seguridad
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Guía de contribución

## 🔐 Seguridad

**⚠️ CRÍTICO: Este proyecto maneja datos clínicos sensibles**

### Características de Seguridad
- ✅ JWT con refresh tokens
- ✅ Contraseñas hasheadas (bcrypt)
- ✅ RBAC (Role-Based Access Control)
- ✅ HTTPS en producción
- ✅ Auditoría de accesos
- ✅ Validación en cliente y servidor
- ✅ Rate limiting

Ver [docs/SEGURIDAD.md](./docs/SEGURIDAD.md) para detalles.

## 📊 Estado del Proyecto

### Fases Planeadas
- **Fase 0 (Semana -1)**: Preparación ✅
- **Fase 1 (Semanas 1-2)**: Recolección de requisitos 🔄
- **Fase 2 (Semanas 3-6)**: Desarrollo del prototipo ⏳
- **Fase 3 (Semanas 7-8)**: Validación y ajustes ⏳
- **Fase 4 (Semanas 9-12)**: Piloto y entrega ⏳

### Roadmap
- [ ] Setup inicial y estructura
- [ ] Autenticación y autorización
- [ ] CRUD de pacientes
- [ ] CRUD de citas
- [ ] CRUD de interconsultas
- [ ] Generador de informes
- [ ] Testing completo
- [ ] Documentación de usuario
- [ ] Piloto en hospital

## 👥 Equipo

### Líderes del Proyecto
- [Tu Nombre]
- [Nombre del Co-líder]

### Profesor Tutor
- Prof. Karina Hernández

### Coordinador Institucional
- [Nombre del coordinador del hospital]

**Equipo total**: 10 estudiantes de Ingeniería en Sistemas (UNERG)

Ver [LIDERAZGO_EQUIPO.md](../LIDERAZGO_EQUIPO.md) para distribución completa.

## 📞 Comunicación

- **Slack/Discord**: Canal principal para comunicación del equipo
- **GitHub Issues**: Para tareas y bugs
- **GitHub Discussions**: Para decisiones técnicas
- **Email**: Comunicación formal con hospital

## 🤝 Contribución

Ver [CONTRIBUTING.md](./CONTRIBUTING.md) para detalles sobre:
- Git workflow
- Estándares de código
- Proceso de Pull Request
- Testing requerido

## 📋 Checklist de Inicio

- [ ] Clonar repositorio
- [ ] Instalar dependencias (`npm install` en backend y frontend)
- [ ] Configurar variables de entorno (`.env` files)
- [ ] Levantar servicios con Docker Compose
- [ ] Verificar acceso a Frontend, Backend y MongoDB
- [ ] Leer GUIA_PROYECTO.md y LIDERAZGO_EQUIPO.md
- [ ] Unirse a canales de comunicación

## 📄 Licencia

MIT License - Ver LICENSE para detalles

## 📞 Contacto

Para preguntas o issues:
1. Revisa [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Abre un GitHub Issue
3. Contacta a los líderes del proyecto

---

**Última actualización**: Octubre 31, 2025  
**Versión**: 0.1.0 (Fase inicial - Setup)
