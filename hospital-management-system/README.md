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
pwa-hospital-militar/
│
├── 📁 client/                          # Frontend PWA (React.js)
│   ├── 📁 public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   ├── sw.js
│   │   └── icons/
│   │
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── ErrorBoundary.jsx
│   │   │   │   ├── DataTable.jsx        # Tabla reusable con paginación
│   │   │   │   ├── SearchFilter.jsx     # Búsqueda y filtros
│   │   │   │   └── Modal.jsx            # Modal reusable
│   │   │   │
│   │   │   ├── 📁 auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── RoleBasedAccess.jsx  # Control de acceso por roles
│   │   │   │
│   │   │   ├── 📁 admin/                # NUEVO: Componentes de administración
│   │   │   │   ├── 📁 dashboard/
│   │   │   │   │   ├── StatsCards.jsx   # Tarjetas de estadísticas
│   │   │   │   │   ├── Charts.jsx       # Gráficos y reportes
│   │   │   │   │   └── ActivityFeed.jsx # Feed de actividad
│   │   │   │   │
│   │   │   │   ├── 📁 users/
│   │   │   │   │   ├── UserForm.jsx     # Formulario crear/editar usuario
│   │   │   │   │   ├── UserList.jsx     # Lista de usuarios
│   │   │   │   │   ├── UserRoles.jsx    # Gestión de roles
│   │   │   │   │   └── BulkActions.jsx  # Acciones masivas
│   │   │   │   │
│   │   │   │   ├── 📁 system/
│   │   │   │   │   ├── SystemConfig.jsx # Configuración del sistema
│   │   │   │   │   ├── BackupRestore.jsx # Backup y restauración
│   │   │   │   │   ├── AuditLog.jsx     # Logs de auditoría
│   │   │   │   │   └── ApiKeys.jsx      # Gestión de API keys
│   │   │   │   │
│   │   │   │   ├── 📁 reports/
│   │   │   │   │   ├── ReportBuilder.jsx # Constructor de reportes
│   │   │   │   │   ├── Analytics.jsx    # Analytics avanzados
│   │   │   │   │   └── ExportTools.jsx  # Herramientas de exportación
│   │   │   │   │
│   │   │   │   └── AdminSidebar.jsx     # Sidebar específico para admin
│   │   │   │
│   │   │   ├── 📁 pacientes/
│   │   │   │   ├── PatientForm.jsx
│   │   │   │   ├── PatientList.jsx
│   │   │   │   ├── PatientCard.jsx
│   │   │   │   └── PatientSearch.jsx    # Búsqueda avanzada
│   │   │   │
│   │   │   ├── 📁 medical/
│   │   │   │   ├── MedicalHistory.jsx
│   │   │   │   ├── AppointmentScheduler.jsx
│   │   │   │   ├── ReportGenerator.jsx
│   │   │   │   ├── InterconsultaForm.jsx
│   │   │   │   └── MedicalCharts.jsx    # Gráficos médicos
│   │   │   │
│   │   │   └── 📁 dashboard/            # Componentes de dashboard general
│   │   │       ├── QuickActions.jsx     # Acciones rápidas
│   │   │       ├── Notifications.jsx    # Panel de notificaciones
│   │   │       └── UpcomingAppointments.jsx
│   │   │
│   │   ├── 📁 pages/
│   │   │   ├── Dashboard.jsx            # Dashboard principal
│   │   │   │
│   │   │   ├── 📁 admin/                # NUEVO: Páginas de administración
│   │   │   │   ├── AdminDashboard.jsx   # Dashboard administrativo
│   │   │   │   ├── 📁 user-management/
│   │   │   │   │   ├── UsersListPage.jsx
│   │   │   │   │   ├── UserCreatePage.jsx
│   │   │   │   │   └── UserEditPage.jsx
│   │   │   │   │
│   │   │   │   ├── 📁 system-management/
│   │   │   │   │   ├── SystemConfigPage.jsx
│   │   │   │   │   ├── BackupPage.jsx
│   │   │   │   │   ├── AuditLogsPage.jsx
│   │   │   │   │   └── ApiManagementPage.jsx
│   │   │   │   │
│   │   │   │   ├── 📁 reports/
│   │   │   │   │   ├── ReportsPage.jsx
│   │   │   │   │   ├── AnalyticsPage.jsx
│   │   │   │   │   └── CustomReportsPage.jsx
│   │   │   │   │
│   │   │   │   ├── 📁 hospital-config/
│   │   │   │   │   ├── DepartmentsPage.jsx  # Gestión de departamentos
│   │   │   │   │   ├── SpecialtiesPage.jsx  # Especialidades médicas
│   │   │   │   │   └── SchedulesPage.jsx    # Horarios del hospital
│   │   │   │   │
│   │   │   │   └── AdminLayout.jsx      # Layout específico para admin
│   │   │   │
│   │   │   ├── 📁 pacientes/
│   │   │   │   ├── PatientsPage.jsx
│   │   │   │   └── PatientDetail.jsx
│   │   │   │
│   │   │   ├── 📁 medical/
│   │   │   │   ├── MedicalHistoryPage.jsx
│   │   │   │   ├── AppointmentsPage.jsx
│   │   │   │   ├── InterconsultasPage.jsx
│   │   │   │   └── ReportsPage.jsx
│   │   │   │
│   │   │   └── AuthPage.jsx
│   │   │
│   │   ├── 📁 hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── usePatients.js
│   │   │   ├── useAppointments.js
│   │   │   ├── useLocalStorage.js
│   │   │   ├── useAdmin.js              # NUEVO: Hook para funcionalidades admin
│   │   │   ├── useUsers.js              # NUEVO: Gestión de usuarios
│   │   │   ├── useReports.js            # NUEVO: Reportes y analytics
│   │   │   └── useSystem.js             # NUEVO: Configuración del sistema
│   │   │
│   │   ├── 📁 services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── patientService.js
│   │   │   ├── appointmentService.js
│   │   │   ├── storageService.js
│   │   │   ├── adminService.js          # NUEVO: Servicios de administración
│   │   │   ├── userService.js           # NUEVO: Servicios de usuarios
│   │   │   ├── reportService.js         # NUEVO: Servicios de reportes
│   │   │   └── systemService.js         # NUEVO: Servicios del sistema
│   │   │
│   │   ├── 📁 utils/
│   │   │   ├── constants.js
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   ├── offlineManager.js
│   │   │   ├── adminHelpers.js          # NUEVO: Utilidades para admin
│   │   │   ├── exportUtils.js           # NUEVO: Exportación de datos
│   │   │   └── chartUtils.js            # NUEVO: Utilidades para gráficos
│   │   │
│   │   ├── 📁 contexts/
│   │   │   ├── AuthContext.js
│   │   │   ├── AppContext.js
│   │   │   ├── OfflineContext.js
│   │   │   └── AdminContext.js          # NUEVO: Context para admin
│   │   │
│   │   ├── 📁 styles/
│   │   │   ├── index.css
│   │   │   ├── components/
│   │   │   ├── admin/                   # NUEVO: Estilos específicos admin
│   │   │   └── responsive.css
│   │   │
│   │   ├── 📁 assets/
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── fonts/
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── sw-development.js
│
├── 📁 server/                         # Backend (Node.js/Express)
│   ├── 📁 src/
│   │   ├── 📁 controllers/
│   │   │   ├── authController.js
│   │   │   ├── patientController.js
│   │   │   ├── medicalHistoryController.js
│   │   │   ├── appointmentController.js
│   │   │   ├── interconsultaController.js
│   │   │   ├── reportController.js
│   │   │   ├── userController.js
│   │   │   ├── adminController.js       # NUEVO: Controlador de admin
│   │   │   ├── systemController.js      # NUEVO: Controlador del sistema
│   │   │   └── analyticsController.js   # NUEVO: Controlador de analytics
│   │   │
│   │   ├── 📁 routes/
│   │   │   ├── index.js
│   │   │   ├── authRoutes.js
│   │   │   ├── patientRoutes.js
│   │   │   ├── medicalRoutes.js
│   │   │   ├── appointmentRoutes.js
│   │   │   ├── adminRoutes.js           # NUEVO: Rutas de administración
│   │   │   ├── userRoutes.js            # NUEVO: Rutas de usuarios
│   │   │   ├── systemRoutes.js          # NUEVO: Rutas del sistema
│   │   │   └── analyticsRoutes.js       # NUEVO: Rutas de analytics
│   │   │
│   │   ├── 📁 models/
│   │   │   ├── User.js
│   │   │   ├── Patient.js
│   │   │   ├── MedicalHistory.js
│   │   │   ├── Appointment.js
│   │   │   ├── Interconsulta.js
│   │   │   ├── Report.js
│   │   │   ├── Department.js            # NUEVO: Modelo de departamentos
│   │   │   ├── Specialty.js             # NUEVO: Modelo de especialidades
│   │   │   ├── AuditLog.js              # NUEVO: Modelo de logs de auditoría
│   │   │   ├── SystemConfig.js          # NUEVO: Modelo de configuración
│   │   │   └── Backup.js                # NUEVO: Modelo de backups
│   │   │
│   │   ├── 📁 middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── validationMiddleware.js
│   │   │   ├── roleMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   ├── logger.js
│   │   │   ├── adminMiddleware.js       # NUEVO: Middleware para admin
│   │   │   └── auditMiddleware.js       # NUEVO: Middleware de auditoría
│   │   │
│   │   ├── 📁 services/
│   │   │   ├── authService.js
│   │   │   ├── patientService.js
│   │   │   ├── emailService.js
│   │   │   ├── reportService.js
│   │   │   ├── adminService.js          # NUEVO: Servicios de administración
│   │   │   ├── userManagementService.js # NUEVO: Gestión de usuarios
│   │   │   ├── analyticsService.js      # NUEVO: Servicios de analytics
│   │   │   ├── backupService.js         # NUEVO: Servicios de backup
│   │   │   └── systemService.js         # NUEVO: Servicios del sistema
│   │   │
│   │   ├── 📁 utils/
│   │   │   ├── 📁 database/
│   │   │   │   ├── connection.js
│   │   │   │   └── seed.js
│   │   │   │
│   │   │   ├── 📁 security/
│   │   │   │   ├── encryption.js
│   │   │   │   ├── validators.js
│   │   │   │   └── auditLogger.js       # NUEVO: Logger de auditoría
│   │   │   │
│   │   │   ├── 📁 admin/                # NUEVO: Utilidades de admin
│   │   │   │   ├── dataExport.js        # Exportación de datos
│   │   │   │   ├── reportGenerator.js   # Generador de reportes
│   │   │   │   └── systemMonitor.js     # Monitor del sistema
│   │   │   │
│   │   │   ├── helpers.js
│   │   │   └── constants.js
│   │   │
│   │   ├── 📁 config/
│   │   │   ├── database.js
│   │   │   ├── environment.js
│   │   │   ├── security.js
│   │   │   ├── pwa.js
│   │   │   └── admin.js                 # NUEVO: Configuración admin
│   │   │
│   │   ├── 📁 docs/
│   │   │   └── swagger.json
│   │   │
│   │   └── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   ├── .env.example
│   └── dockerfile
│
├── 📁 shared/
│   ├── 📁 types/
│   ├── 📁 constants/
│   │   ├── roles.js                    # Actualizado con roles admin
│   │   ├── permissions.js              # NUEVO: Permisos detallados
│   │   └── system.js                   # NUEVO: Constantes del sistema
│   └── 📁 utils/
│
├── 📁 docs/
│   ├── 📁 technical/
│   │   ├── architecture.md
│   │   ├── api-reference.md
│   │   ├── database-schema.md
│   │   ├── deployment-guide.md
│   │   └── admin-guide.md              # NUEVO: Guía de administración
│   │
│   ├── 📁 user-manuals/
│   │   ├── manual-medicos.md
│   │   ├── manual-administrativos.md
│   │   ├── manual-admin.md             # NUEVO: Manual de administrador
│   │   └── quick-start.md
│   │
│   ├── 📁 requirements/
│   │   ├── functional-requirements.md
│   │   ├── non-functional-requirements.md
│   │   ├── user-stories.md
│   │   └── admin-requirements.md       # NUEVO: Requisitos de admin
│   │
│   └── project-presentation.pdf
│
├── 📁 tests/
│   ├── 📁 client/
│   │   ├── unit/
│   │   │   └── admin/                  # NUEVO: Tests de componentes admin
│   │   ├── integration/
│   │   └── e2e/
│   │       └── admin/                  # NUEVO: Tests E2E de admin
│   │
│   ├── 📁 server/
│   │   ├── unit/
│   │   │   └── admin/                  # NUEVO: Tests de servicios admin
│   │   ├── integration/
│   │   └── api/
│   │       └── admin/                  # NUEVO: Tests de API admin
│   │
│   └── jest.config.js
│
├── 📁 scripts/
│   ├── setup-dev.js
│   ├── seed-database.js
│   ├── backup-data.js
│   ├── create-admin-user.js            # NUEVO: Script crear usuario admin
│   ├── system-maintenance.js           # NUEVO: Mantenimiento del sistema
│   ├── generate-reports.js             # NUEVO: Generar reportes automáticos
│   └── deployment/
│
├── 📁 deployment/
│   ├── 📁 docker/
│   │   ├── docker-compose.yml
│   │   ├── nginx/
│   │   └── mongo/
│   │
│   ├── 📁 production/
│   │   ├── environment.prod.js
│   │   └── build-script.js
│   │
│   └── 📁 staging/
│
├── 📁 database/
│   ├── 📁 migrations/
│   │   ├── 001-initial-schema.js
│   │   ├── 002-add-admin-features.js   # NUEVO: Migración para features admin
│   │   └── 003-audit-logging.js        # NUEVO: Migración para auditoría
│   ├── 📁 seeds/
│   │   ├── admin-users.js              # NUEVO: Semilla de usuarios admin
│   │   ├── departments.js              # NUEVO: Semilla de departamentos
│   │   └── specialties.js              # NUEVO: Semilla de especialidades
│   └── schema-design.mongodb
│
├── 📁 backups/
│   ├── 📁 sample-data/
│   └── 📁 database-dumps/
│
├── .gitignore
├── README.md
├── package.json
├── docker-compose.yml
└── LICENSE

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
