# 🔧 Cambios Realizados: Problema de Reload Automático en Login

## 📋 Problema Identificado

Cuando el usuario ingresaba credenciales incorrectas o inválidas en la pantalla de login:
1. ✅ El mensaje de error aparecía en la UI correctamente
2. ❌ **La página se recargaba automáticamente (como F5)** sin dejar que el usuario pudiera leer el error
3. ❌ El usuario veía solo la página en blanco de login nuevamente

### 🎯 Causa Raíz

En el archivo `frontend/src/services/api.ts`, el código interceptaba **todos los errores 401** y hacía:

```typescript
if (response.status === 401) {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'  // ← CAUSA EL RELOAD
}
```

**Problema:** El backend estaba devolviendo **status 401 para credenciales inválidas**, cuando debería devolver **400 Bad Request**.

---

## ✅ Soluciones Implementadas

### 1. **Frontend** (`pwa/frontend/src/services/api.ts`)

**Cambio:** Diferenciar entre errores 401 en endpoints de autenticación vs. endpoints protegidos.

```typescript
if (response.status === 401) {
  // Solo limpiar tokens si NO es un endpoint de autenticación
  const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/forgot-password')
  
  if (!isAuthEndpoint) {
    // Solo redirigir para endpoints protegidos (tokens expirados reales)
    console.warn('[API] Token inválido o expirado, limpiando sesión')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }
}
```

**Beneficio:** Los errores del login se manejan correctamente sin redirigir automáticamente.

---

### 2. **Backend** - Crear nueva clase de error (`pwa/backend/src/types/responses.ts`)

**Cambio:** Crear `InvalidCredentialsError` que devuelve **status 400** en lugar de **401**:

```typescript
export class InvalidCredentialsError extends AppError {
  constructor(message = 'Invalid credentials') {
    super(400, message);  // ← Status 400 (Bad Request), no 401
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}
```

**Beneficio:** Diferencia clara entre:
- `400` = Credenciales inválidas (problema del cliente)
- `401` = Token JWT expirado/inválido (en endpoints protegidos)

---

### 3. **Backend** - Actualizar servicio de autenticación (`pwa/backend/src/services/auth.ts`)

**Cambios:**

a) **Import actualizado:**
```typescript
import { ValidationError, UnauthorizedError, InvalidCredentialsError } from '../types/responses';
```

b) **Cuando el usuario no existe:**
```typescript
if (!user) {
  logger.warn(`Login attempt with non-existent email: ${email}`);
  throw new InvalidCredentialsError('Credenciales inválidas. Verifique su correo electrónico y contraseña.');
  // Antes: throw new UnauthorizedError(...)
}
```

c) **Cuando la contraseña es incorrecta:**
```typescript
if (!isPasswordValid) {
  logger.warn(`Failed login attempt for user: ${email}`);
  throw new InvalidCredentialsError('Credenciales inválidas. Verifique su correo electrónico y contraseña.');
  // Antes: throw new UnauthorizedError(...)
}
```

---

## 📊 Comparativa Antes vs Después

### **Antes:**
```
Usuario intenta login fallido
    ↓
Backend lanza UnauthorizedError (401)
    ↓
API service intercepta 401
    ↓
window.location.href = '/login'  ← RELOAD AUTOMÁTICO
    ↓
Página se recarga → error desaparece
```

### **Después:**
```
Usuario intenta login fallido
    ↓
Backend lanza InvalidCredentialsError (400)
    ↓
API service NO intercepta 400
    ↓
Login component muestra el error en la UI
    ↓
Usuario puede leer y actuar sobre el error ✅
```

---

## 🧪 Cómo Probar

1. **Inicia el backend:** `npm run dev` en `pwa/backend/`
2. **Inicia el frontend:** `npm run dev` en `pwa/frontend/`
3. **Ve a la página de login:** http://localhost:5173/login
4. **Ingresa credenciales incorrectas:**
   - Email: `test@test.com`
   - Password: `wrongpassword`
5. **Resultado esperado:**
   - ✅ Se muestra un mensaje de error en la UI
   - ✅ La página NO se recarga automáticamente
   - ✅ El usuario puede leer el error cómodamente
   - ✅ El usuario puede intentar de nuevo sin problemas

---

## 📝 Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `pwa/frontend/src/services/api.ts` | Condicional para no redirigir en endpoints `/auth/*` |
| `pwa/backend/src/types/responses.ts` | Añadida clase `InvalidCredentialsError` |
| `pwa/backend/src/services/auth.ts` | Usar `InvalidCredentialsError` en lugar de `UnauthorizedError` |

---

## 🔐 Notas de Seguridad

- ✅ El sistema de 401 aún funciona correctamente para tokens JWT expirados en endpoints protegidos
- ✅ Las credenciales inválidas ahora devuelven 400 (estándar HTTP correcto)
- ✅ No hay cambios en la lógica de autenticación, solo en los códigos de estado HTTP
- ✅ Los logs siguen registrando todos los intentos de login fallidos

---

## 🚀 Estado

- ✅ **Completado**
- ✅ **Testeado localmente**
- 📝 **Recomendación:** Hacer push a rama `dev` y crear PR para revisión
