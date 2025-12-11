# Scripts de Utilidad para Contraseñas

## 📋 Listar Usuarios de Prueba

Para ver todos los usuarios de prueba y sus credenciales:

```bash
cd pwa/backend
npx tsx show-test-users.ts
```

Mostrará:
- Email, CI y contraseña del SUPER_ADMIN
- Lista de personal autorizado (whitelist)

---

## 🔐 Verificar Contraseña con Hash bcrypt

Para verificar qué contraseña corresponde a un hash:

```bash
cd pwa/backend
npx tsx check-password.ts
```

El script:
1. Te pedirá el hash bcrypt (copiado de la DB)
2. Probará contraseñas conocidas del sistema
3. Si no encuentra coincidencia, te permitirá probar manualmente

**Ejemplo de uso:**
```
🔐 Verificador de Contraseñas bcrypt
=====================================

Ingresa el hash bcrypt: $2a$10$abcd1234...

🔍 Probando contraseñas conocidas del sistema...

   ❌ "SuperAdmin2024!" - No coincide
   ❌ "Admin123" - No coincide
   ✅ ¡CONTRASEÑA ENCONTRADA!
   Contraseña: Medico123
```

---

## 📝 Contraseñas por Defecto del Sistema

### SUPER_ADMIN (único usuario pre-creado)
- **Email:** superadmin@hospital.com
- **CI:** V00000001
- **Contraseña:** `SuperAdmin2024!`
- **Rol:** SUPER_ADMIN

### Personal Autorizado (deben registrarse)
Los siguientes usuarios están en la whitelist pero deben crear su cuenta:
- V12345678 - Dr. Carlos García (MEDICO)
- V87654321 - Lic. María López (ENFERMERO)
- V11223344 - Juan Pérez (ADMIN)
- V55667788 - Dra. Ana Martínez (COORDINADOR)
- V99887766 - Roberto Hernández (ADMIN)

**Nota:** Estos usuarios eligen su contraseña al registrarse por primera vez.

---

## 🔧 Resetear Contraseña Manualmente

Si necesitas resetear una contraseña en la base de datos:

```typescript
// Generar nuevo hash
import bcrypt from 'bcryptjs';
const newHash = await bcrypt.hash('NuevaContraseña123', 10);
console.log(newHash);

// Actualizar en DB
UPDATE "Usuario" 
SET password = '$2a$10$nuevo_hash_aqui...' 
WHERE email = 'usuario@hospital.com';
```

---

## ⚠️ Importante

- **bcrypt NO se puede descifrar** - es un hash unidireccional
- Los scripts solo pueden **verificar** si una contraseña coincide
- Para recuperar acceso: resetea la contraseña o usa el SUPER_ADMIN
