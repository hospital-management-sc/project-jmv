# 🧪 TESTING GUIDE - Hospital Management System

## ✅ ESTADO ACTUAL

### Backend
- ✅ **Puerto:** 3001
- ✅ **BD:** PostgreSQL (Docker)
- ✅ **Status:** Corriendo
- ✅ **Endpoints:** Funcionando

### Frontend  
- ✅ **Puerto:** 5173
- ✅ **Status:** Corriendo
- ✅ **API Base URL:** Auto-detecta localhost o Codespace

### Database
- ✅ **Usuarios seed:** 4 usuarios listos
- ✅ **Conexión:** Activa

---

## 🚀 FLUJO DE TESTING COMPLETO

### OPCIÓN 1: Testing desde Navegador

#### 1️⃣ Abrir aplicación
```
http://localhost:5173/login
```

#### 2️⃣ Abrir Consola (F12 → Console)

#### 3️⃣ Ejecutar test automático
```javascript
window._testAPI.runAllTests()
```

**Resultado esperado:**
```
✅ Health check: {status: "ok", ...}
✅ Login response: {success: true, data: {...}}
✅ Token saved to localStorage
✅ User data: {id: 1, email: "admin@hospital.com", ...}
✅ All tests completed
```

---

### OPCIÓN 2: Testing Manual en Navegador

#### Paso 1: Probar salud del backend
```javascript
window._testAPI.testHealth()
```

#### Paso 2: Hacer login
```javascript
window._testAPI.testLogin()
```

#### Paso 3: Obtener datos del usuario
```javascript
window._testAPI.testGetMe()
```

---

### OPCIÓN 3: Testing Directo en Formulario

#### Test de Login
1. Ve a `http://localhost:5173/login`
2. Ingresa:
   - **Email:** `admin@hospital.com`
   - **Password:** `admin123456`
3. Haz clic en "Iniciar Sesión"
4. **Resultado esperado:**
   - Consola muestra logs sin errores
   - Redirección a `/` (Home)
   - Muestra: "Bienvenido, Administrador Sistema"

#### Test de Register
1. Ve a `http://localhost:5173/register`
2. Ingresa:
   - **Nombre Completo:** `Juan Test`
   - **Email:** `juan.test@example.com`
   - **CI:** `V12345678` (opcional)
   - **Password:** `password123`
   - **Confirmar Password:** `password123`
3. Haz clic en "Registrarse"
4. **Resultado esperado:**
   - Alert: "¡Registro exitoso! Ahora inicia sesión."
   - Redirección a `/login`
   - Puedes hacer login con ese usuario

#### Test de Home/Dashboard
1. Después de login exitoso, deberías ver:
   ```
   Bienvenido, [Nombre del usuario]
   Email: [email del usuario]
   Rol: [rol del usuario]
   
   [Botón "Cerrar Sesión"]
   ```
2. Haz clic en "Cerrar Sesión"
3. **Resultado esperado:**
   - Token se elimina de localStorage
   - Redirección a `/login`

---

## 📊 CREDENCIALES DE TESTING

### Usuarios Pre-cargados:

| Tipo | Email | Password | Rol |
|------|-------|----------|-----|
| Admin | admin@hospital.com | admin123456 | ADMIN |
| Doctor | carlos.garcia@hospital.com | doctor123456 | MEDICO |
| Nurse | maria.lopez@hospital.com | user123456 | ENFERMERO |
| User | juan.perez@hospital.com | user123456 | USUARIO |

---

## 🔍 DEBUGGING

### Ver todos los logs
Abre **DevTools** (F12) → **Console** y verás:
- Requests/Responses del API
- Logs de "Attempting login..."
- Logs de "Token saved..."
- Errores específicos si hay

### Ver localStorage
En la consola:
```javascript
localStorage.getItem('token')  // Ver token
localStorage.getItem('user')   // Ver datos del usuario
```

### Limpiar localStorage
```javascript
localStorage.clear()
```

### Ver variable de configuración
```javascript
// Verificar API Base URL
fetch('http://localhost:3001/api/health').then(r => r.json()).then(console.log)
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Backend corriendo en puerto 3001
- [ ] Frontend corriendo en puerto 5173
- [ ] PostgreSQL conectado
- [ ] Usuarios seed creados
- [ ] Login funciona con `admin@hospital.com`
- [ ] Register crea nuevo usuario en BD
- [ ] Home/Dashboard muestra datos del usuario
- [ ] Logout limpia token
- [ ] Consola sin errores de CORS
- [ ] Consola sin errores de fetch

---

## 🆘 PROBLEMAS COMUNES

### "Failed to fetch"
**Causa:** Problema CORS o backend no responde
**Solución:** 
```bash
# Verificar backend
curl http://localhost:3001/api/health

# Verificar frontend
curl http://localhost:5173
```

### "Invalid token"
**Causa:** Token expirado o inválido
**Solución:** 
```javascript
localStorage.clear()
// Hacer login nuevamente
```

### Formulario no envía
**Causa:** Validación de Zod fallando
**Solución:** Ver logs en consola, revisar que:
- Email sea válido
- Password tenga mínimo 6 caracteres
- Los datos cumplan validación

### Redirección no funciona
**Causa:** Problema de routing
**Solución:** Revisar `router.tsx` y logs de navegación

---

## 📝 PRÓXIMOS PASOS

- [ ] Crear rutas CRUD de Pacientes
- [ ] Crear rutas CRUD de Admisiones  
- [ ] Agregar componentes para listar pacientes
- [ ] Agregar formularios de admisión
- [ ] Testing E2E completo
