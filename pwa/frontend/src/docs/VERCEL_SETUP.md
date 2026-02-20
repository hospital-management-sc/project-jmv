# Configuración de Variables de Entorno para Producción (Vercel)

## ⚠️ Problema Actual

El frontend en producción (Vercel) está intentando conectarse a `http://localhost:3001` porque no tiene configuradas las variables de entorno correctas.

## ✅ Solución Implementada

### 1. **Código Actualizado**
- ✅ `useDashboardStats.ts` ahora usa `API_BASE_URL` desde `constants.ts`
- ✅ `constants.ts` detecta automáticamente el entorno (Codespace, Vercel, o local)
- ✅ Creado `.env.production` con la URL correcta del backend

### 2. **Configurar Variables de Entorno en Vercel**

Ve a tu proyecto en Vercel y configura las siguientes variables de entorno:

#### Pasos:
1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto `project-jmv`
3. Ve a **Settings** → **Environment Variables**
4. Agrega las siguientes variables:

```
VITE_API_URL=https://project-jmv.onrender.com/api
VITE_APP_NAME=Hospital Management System
VITE_APP_VERSION=1.0.0
```

#### Importante:
- Marca que apliquen para **Production**, **Preview**, y **Development**
- Guarda los cambios

### 3. **Re-desplegar en Vercel**

Después de configurar las variables:

```bash
# Opción 1: Trigger deploy desde Vercel UI
# Ve a Deployments → Re-deploy

# Opción 2: Push a GitHub (si está conectado)
git add .
git commit -m "fix: Configure production API URL for Vercel"
git push origin dev
```

### 4. **Verificar Backend en Render**

Asegúrate de que tu backend en Render esté funcionando:

**URL del backend:** https://project-jmv.onrender.com/api

Prueba estos endpoints:
- ✅ Health check: https://project-jmv.onrender.com/api/health
- ✅ Stats: https://project-jmv.onrender.com/api/dashboard/stats

### 5. **Verificar CORS en Backend**

Tu backend debe permitir requests desde Vercel. Verifica que en tu backend tengas:

```typescript
// backend/src/index.ts
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://project-jmv.vercel.app',
    // Agregar otros dominios de Vercel si es necesario
  ],
  credentials: true
}))
```

## 🔍 Cómo Funciona Ahora

```typescript
// constants.ts detecta automáticamente el entorno:

// 1. Si existe VITE_API_URL → la usa
// 2. Si hostname incluye 'vercel.app' → usa Render
// 3. Si hostname incluye 'app.github.dev' → usa Codespace
// 4. Por defecto → localhost:3001
```

## 📝 Archivos Modificados

1. `frontend/src/hooks/useDashboardStats.ts` - Ahora usa API_BASE_URL
2. `frontend/.env.production` - Variables para producción (nuevo)
3. `VERCEL_SETUP.md` - Esta guía (nuevo)

## 🧪 Testing

Después de desplegar, verifica:

```bash
# 1. Abre la consola del navegador en https://project-jmv.vercel.app
# 2. Busca los logs "[CONSTANTS]" para ver qué URL está usando
# 3. Verifica que las requests vayan a Render, no a localhost
```

## ❓ Troubleshooting

### Error: "ERR_FAILED" o "CORS policy"
- ✅ Verifica que las variables de entorno estén configuradas en Vercel
- ✅ Re-despliega el proyecto en Vercel
- ✅ Verifica que el backend en Render esté activo

### Error: "Backend no responde"
- ✅ Verifica que Render esté corriendo: https://project-jmv.onrender.com/api/health
- ✅ Los planes gratuitos de Render se duermen después de 15min de inactividad

### Variables no se actualizan
- ✅ Re-despliega después de cambiar variables de entorno
- ✅ Limpia caché del navegador (Ctrl+Shift+R)
