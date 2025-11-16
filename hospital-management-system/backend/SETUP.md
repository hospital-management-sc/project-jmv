# Backend Setup & Deployment Guide

## 📋 Configuración Local

### Prerrequisitos
- Node.js v18+
- PostgreSQL 14+
- npm o yarn

### Instalación

1. **Copiar archivo .env**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Configurar variables de entorno** (editar `.env`):
   ```env
   DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/hospital_db
   JWT_SECRET=tu-clave-super-secreta-cambiar-en-produccion
   PORT=3001
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Instalar dependencias**
   ```bash
   npm install
   ```

4. **Ejecutar migraciones de BD**
   ```bash
   npm run db:migrate:dev
   ```

5. **Seedear datos de prueba** (opcional)
   ```bash
   npm run db:seed
   ```
   
   **Credenciales de prueba:**
   - Admin: `admin@hospital.com` / `admin123456`
   - Doctor: `carlos.garcia@hospital.com` / `doctor123456`
   - Nurse: `maria.lopez@hospital.com` / `user123456`
   - User: `juan.perez@hospital.com` / `user123456`

### Desarrollo

```bash
# Iniciar servidor en modo desarrollo (con hot-reload)
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build

# Prisma Studio (UI visual de la BD)
npm run db:studio
```

---

## 🚀 Despliegue en Render

### Pasos de Configuración

1. **Crear cuenta en Render.com**
   - Ir a [render.com](https://render.com)
   - Registrarse con GitHub

2. **Conectar repositorio**
   - New → Web Service
   - Conectar repositorio del proyecto
   - Seleccionar rama `dev` o `main`

3. **Configurar servicio**
   - **Name:** `hospital-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run db:migrate:deploy && npm run build`
   - **Start Command:** `npm start`

4. **Configurar variables de entorno** (en Render):
   ```env
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=tu-clave-super-secreta-produccion
   DATABASE_URL=postgresql://usuario:contraseña@host:5432/hospital_db
   CORS_ORIGIN=https://tu-dominio-vercel.vercel.app
   LOG_LEVEL=info
   ```

5. **Crear y conectar base de datos PostgreSQL**
   - En Render, crear nuevo "PostgreSQL" service
   - Copiar `DATABASE_URL` del servicio de BD
   - Usar esa URL en el backend

6. **Deploy**
   - Render detectará cambios automáticamente en la rama
   - Verá logs de compilación y de la aplicación

### URLs Importantes

- **Backend URL (Render):** `https://hospital-backend.onrender.com`
- **Health Check:** `https://hospital-backend.onrender.com/api/health`
- **Logs en Render:** Dashboard → Servicio → Logs

---

## 🔗 Integración Frontend

### Actualizar `frontend/src/utils/constants.ts`:

```typescript
export const API_BASE_URL = 
  process.env.NODE_ENV === 'production'
    ? 'https://hospital-backend.onrender.com/api'
    : 'http://localhost:3001/api'
```

---

## 📊 Endpoints Disponibles

### Autenticación

- `POST /api/auth/register` - Registrar usuario
  ```json
  {
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "ci": "V12345678",
    "role": "USUARIO"
  }
  ```

- `POST /api/auth/login` - Iniciar sesión
  ```json
  {
    "email": "juan@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Obtener usuario actual (requiere token)
  ```
  Headers: Authorization: Bearer {token}
  ```

---

## 🛠️ Troubleshooting

### Error: `Could not connect to database`
- Verificar `DATABASE_URL` esté correctamente configurado
- Confirmar que PostgreSQL está corriendo localmente
- En producción (Render), verificar que el servicio de BD esté activo

### Error: `CORS error`
- Verificar que `CORS_ORIGIN` en `.env` coincida con el frontend URL
- En producción, usar el dominio de Vercel

### Error: `Invalid token`
- Verificar que el `JWT_SECRET` es el mismo entre desarrollo y producción
- Tokens expiran según `JWT_EXPIRY` (default: 24h)

---

## 📚 Estructura del Código

```
backend/
├── src/
│   ├── config/          # Configuración centralizada
│   ├── controllers/      # Lógica de HTTP (auth.ts)
│   ├── middleware/       # Middlewares (auth.ts, error handling)
│   ├── routes/           # Definición de rutas (auth.ts)
│   ├── services/         # Lógica de negocio (auth.ts)
│   ├── types/            # Interfaces y tipos (auth.ts, responses.ts)
│   ├── database/         # Conexión a BD (connection.ts)
│   ├── utils/            # Utilidades (logger.ts)
│   └── index.ts          # Punto de entrada principal
├── prisma/
│   ├── schema.prisma     # Definición de modelos de BD
│   ├── migrations/       # Historial de cambios de BD
│   └── seeds/            # Datos iniciales (seed.ts)
└── dist/                 # Código compilado (generado con `npm run build`)
```

---

## 🔐 Seguridad

### Implementado:
- ✅ JWT para autenticación
- ✅ Bcrypt para hashing de contraseñas
- ✅ CORS configurado
- ✅ Helmet para headers de seguridad
- ✅ Rate limiting
- ✅ Validación con Zod
- ✅ TypeScript strict mode

### Próximos pasos:
- [ ] Refresh tokens
- [ ] 2FA (autenticación de dos factores)
- [ ] Auditoría de acciones

---

## 📝 Scripts disponibles

```bash
npm run dev                # Desarrollo con hot-reload
npm run build             # Compilar a JavaScript
npm start                 # Iniciar servidor compilado
npm run type-check        # Verificar tipos TypeScript
npm run lint              # Linting con ESLint
npm run lint:fix          # Autofix linting issues
npm run format            # Formatear código con Prettier
npm run test              # Ejecutar tests (si existen)
npm run test:watch       # Tests en modo watch
npm run db:generate      # Regenerar Prisma Client
npm run db:migrate:dev   # Crear migraciones (desarrollo)
npm run db:migrate:deploy # Aplicar migraciones (producción)
npm run db:reset         # Resetear BD completamente
npm run db:seed          # Ejecutar seed.ts
npm run db:studio        # Abrir Prisma Studio
npm run db:push          # Push schema a BD sin migraciones
```
