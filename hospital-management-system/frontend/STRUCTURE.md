# 📱 Estructura del Proyecto Frontend

## 🎯 Descripción General

Sistema de Gestión Hospitalaria - Frontend implementado con **React 18 + TypeScript + Vite + React Router + React Hook Form + Zod + CSS Modules + PWA**.

## 📂 Estructura de Carpetas

```
frontend/
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── index.ts             # Barrel exports
│   │   ├── Button.tsx           # Componente Button con variantes
│   │   ├── Button.module.css
│   │   ├── FormInput.tsx        # Input reutilizable para formularios
│   │   ├── FormInput.module.css
│   │   ├── FormSelect.tsx       # Select reutilizable para formularios
│   │   └── FormSelect.module.css
│   │
│   ├── pages/                   # Vistas de aplicación
│   │   ├── Home.tsx             # Página de inicio
│   │   ├── Home.module.css
│   │   ├── Login.tsx            # Página de login
│   │   ├── Login.module.css
│   │   ├── Register.tsx         # Página de registro
│   │   ├── Register.module.css
│   │   └── Dashboard.tsx        # Dashboard (plantilla)
│   │
│   ├── layouts/                 # Layouts principales
│   │   ├── MainLayout.tsx       # Layout para rutas públicas
│   │   ├── MainLayout.module.css
│   │   ├── AuthLayout.tsx       # Layout para auth (login/register)
│   │   └── AuthLayout.module.css
│   │
│   ├── services/                # Servicios de API
│   │   ├── index.ts             # Barrel exports
│   │   ├── api.ts               # Servicio genérico de API
│   │   └── auth.ts              # Servicio de autenticación
│   │
│   ├── hooks/                   # Custom hooks
│   │   └── useAsync.ts          # Hook para operaciones asincrónicas
│   │
│   ├── types/                   # Tipos TypeScript compartidos
│   │   └── auth.ts              # Tipos de autenticación y usuarios
│   │
│   ├── utils/                   # Funciones utilitarias
│   │   └── constants.ts         # Constantes de la aplicación
│   │
│   ├── styles/                  # Estilos globales
│   │   └── globals.css          # Estilos globales + variables CSS
│   │
│   ├── router.tsx               # Configuración de React Router
│   ├── App.tsx                  # Componente raíz
│   └── main.tsx                 # Punto de entrada
│
├── public/
│   ├── manifest.json            # PWA metadata
│   └── service-worker.js        # Service Worker
│
├── index.html                   # HTML principal
├── vite.config.ts              # Configuración Vite
├── tsconfig.json               # Configuración TypeScript base
├── tsconfig.app.json           # Configuración TypeScript app (con aliases)
├── tsconfig.node.json          # Configuración TypeScript node
├── .env.example                # Variables de entorno (ejemplo)
├── .gitignore                  # Git ignore
└── README.md                   # Documentación
```

## 🚀 Características Implementadas

### 1️⃣ **Autenticación**
- ✅ Página de Login (C.I., Email, Contraseña)
- ✅ Página de Registro (C.I., Nombres, Apellidos, Email, Tipo de Usuario, Contraseña)
- ✅ Validación con React Hook Form + Zod
- ✅ Servicio de autenticación integrado
- ✅ Manejo de tokens en localStorage

### 2️⃣ **Componentes Reutilizables**
- ✅ Button (con variantes: primary, secondary, success, error)
- ✅ FormInput (input con error, hint, validación)
- ✅ FormSelect (select con validación)

### 3️⃣ **Servicios**
- ✅ apiService (métodos: GET, POST, PUT, PATCH, DELETE)
- ✅ authService (login, register, logout, token management)

### 4️⃣ **Routing**
- ✅ React Router v6 con nested routes
- ✅ AuthLayout para rutas de autenticación
- ✅ MainLayout para rutas públicas
- ✅ Rutas: /, /login, /register

### 5️⃣ **Diseño y Estilos**
- ✅ CSS Modules para estilos encapsulados
- ✅ Variables CSS para colores, espaciado, tipografía
- ✅ Sistema de diseño flexible
- ✅ Dark mode listo (basado en prefers-color-scheme)
- ✅ Responsive design

### 6️⃣ **PWA**
- ✅ manifest.json con metadata
- ✅ Service Worker con caching
- ✅ Instalable como app

### 7️⃣ **TypeScript**
- ✅ Path aliases configurados (@/, @components/, @pages/, @services/, etc.)
- ✅ Tipado estricto
- ✅ Tipos compartidos centralizados

### 8️⃣ **Hooks Personalizados**
- ✅ useAsync para operaciones asincrónicas

### 9️⃣ **Constantes y Configuración**
- ✅ constants.ts con rutas, endpoints, storage keys
- ✅ .env.example para variables de entorno

## 🎨 Sistema de Diseño

### Colores
```css
--color-primary: #2563eb (Azul)
--color-secondary: #64748b (Gris)
--color-success: #22c55e (Verde)
--color-warning: #f59e0b (Amarillo)
--color-error: #ef4444 (Rojo)
--color-info: #0ea5e9 (Cyan)
```

### Espaciado
```css
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem
--spacing-2xl: 3rem
```

## 📚 Tipos Principales

### User Roles
- `admin` - Administrador del sistema
- `doctor` - Médico
- `coordinator` - Coordinador de áreas
- `staff` - Personal de soporte

### User Types
- `medical` - Personal médico/coordinadores
- `administrative` - Personal administrativo

## 🔄 Flujo de Autenticación

1. **Registro**: Usuario ingresa datos → Validación Zod → POST /auth/register
2. **Login**: Usuario ingresa C.I., Email, Contraseña → POST /auth/login
3. **Token**: Se guarda en localStorage → Disponible para peticiones autenticadas
4. **Logout**: Limpia localStorage → Redirección a login

## 🧪 Próximos Pasos

- [ ] Implementar rutas protegidas con ProtectedRoute
- [ ] Crear contexto de autenticación global
- [ ] Agregar interceptor de axios/fetch para token en headers
- [ ] Crear vistas para pacientes
- [ ] Crear vistas para citas
- [ ] Crear vistas para médicos
- [ ] Implementar notificaciones (toast/alerts)
- [ ] Agregar tabla de datos reutilizable
- [ ] Agregar modal componente

## 📦 Dependencias Principales

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^6.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "typescript": "~5.9.3",
  "vite": "^7.2.2"
}
```

## 🚀 Comandos

```bash
npm install          # Instalar dependencias
npm run dev          # Iniciar servidor desarrollo (http://localhost:5173)
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Ejecutar linter
```

## 📝 Variables de Entorno (.env)

```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Hospital Management System
VITE_APP_VERSION=1.0.0
```

## 🎯 Arquitectura

### Separación de Responsabilidades
- **Pages**: Componentes de página completa
- **Layouts**: Estructura de la página
- **Components**: Componentes reutilizables
- **Services**: Lógica de comunicación con API
- **Hooks**: Lógica reutilizable de React
- **Types**: Tipos TypeScript compartidos
- **Utils**: Funciones utilitarias y constantes

### Control de Flujo
```
Router → Layout (Auth/Main) → Pages → Components
         ↓
      Services (API)
         ↓
      Backend
```

## 🔐 Seguridad

- Validación en cliente con Zod
- Contraseñas encriptadas (enviadas al backend)
- Token en localStorage (mejorable con httpOnly en cookies)
- Tipado fuerte con TypeScript

---

**Próxima sesión**: Implementación de rutas protegidas, contexto de autenticación global y vistas específicas del hospital.
