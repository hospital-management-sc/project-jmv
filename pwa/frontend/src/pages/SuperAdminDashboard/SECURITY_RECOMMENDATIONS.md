# 🔐 Recomendaciones de Seguridad - SuperAdminDashboard

## Estado Actual ✅
El `SuperAdminDashboard` ya implementa una **capa de seguridad muy sólida** como control de acceso a nivel administrativo. Felicidades por esta implementación.

### Fortalezas Detectadas:
- ✅ **Validación en formularios**: Regex para CI, validación de email, campos requeridos
- ✅ **Gestión de estados**: ACTIVO, INACTIVO, SUSPENDIDO, BAJA
- ✅ **Módulo de baja**: Requiere motivo detallado (min. 10 caracteres)
- ✅ **Headers de autenticación**: Bearer token en todas las peticiones
- ✅ **Filtros avanzados**: Por estado, rol, estado de registro
- ✅ **Controles de acceso UI**: Solo SUPER_ADMIN puede acceder

---

## 🎯 Recomendaciones Adicionales (Categorizado por Prioridad)

### 🔴 CRÍTICA (Implementar Inmediatamente)

#### 1. **Verificación de Rol en el Backend**
```typescript
// En tu controlador backend
if (user.role !== 'SUPER_ADMIN') {
  throw new UnauthorizedError('Acceso denegado: Solo SUPER_ADMIN puede acceder')
}
```
**Por qué**: El frontend puede ser bypasseado. La validación DEBE estar en el backend.

**Ubicación recomendada**: 
- `pwa/backend/src/middleware/roles.ts` o `pwa/backend/src/middleware/auth.ts`
- Aplicar a todas las rutas `/authorized-personnel/*`

**Código sugerido**:
```typescript
export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any
  if (!user || user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: Solo SUPER_ADMIN puede acceder a esta funcionalidad'
    })
  }
  next()
}
```

---

#### 2. **Auditoría de Cambios**
Registrar TODO cambio hecho en la whitelist:
```typescript
interface AuditLog {
  id: number
  superAdminId: number          // Quién hizo el cambio
  accion: 'CREATE' | 'UPDATE' | 'DELETE'
  ciAfectado: string            // Quién fue afectado
  cambiosAnteriores: object     // Datos antes del cambio
  cambiosNuevos: object         // Datos después del cambio
  razonCambio?: string          // Por qué se hizo
  ipOrigen: string              // Desde dónde se hizo
  userAgent: string             // Navegador/cliente
  timestamp: DateTime
}
```

**Beneficios**:
- Trazabilidad completa
- Detección de cambios maliciosos
- Cumplimiento normativo (HIPAA si es applicable)
- Investigación de incidents

---

#### 3. **Rate Limiting para Operaciones Sensibles**
```typescript
// Implementar en backend
app.use('/authorized-personnel', 
  rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutos
    max: 100,                   // 100 requests por ventana
    message: 'Demasiadas peticiones, intenta en 15 minutos',
    skip: (req) => req.method === 'GET' // No limitar lecturas
  })
)

// Rate limit más estricto para operaciones críticas
app.use('/authorized-personnel/:ci/delete',
  rateLimit({
    windowMs: 60 * 60 * 1000,   // 1 hora
    max: 5                       // Solo 5 intentos/hora
  })
)
```

---

#### 4. **Confirmación Adicional para Cambios Críticos**
Implementar token de confirmación (2FA para operaciones críticas):

```typescript
// Paso 1: Usuario solicita cambio crítico
POST /authorized-personnel/:ci/delete?confirm=request
Response: { confirmationToken: "xyz123", expiresIn: 300 } // 5 minutos

// Paso 2: Se envía token por email/SMS
// Paso 3: Usuario confirma con token
POST /authorized-personnel/:ci/delete
Body: { confirmationToken: "xyz123", motivoBaja: "..." }
```

---

### 🟠 ALTA PRIORIDAD (Implementar en el próximo sprint)

#### 5. **Encriptación de Datos Sensibles**
- **CI/Cédula**: ¿Se guarda en plaintext? Considerar encripción
- **Email**: Encriptar almacenamiento si contiene datos sensibles
- **Fechas de vencimiento**: No crítico, pero buena práctica

```typescript
import crypto from 'crypto'

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY // 32 caracteres
const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY)

function encryptCI(ci: string): string {
  let encrypted = cipher.update(ci, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}
```

---

#### 6. **Validación de Email Institucional**
```typescript
// Validar que el email sea del dominio del hospital
const ALLOWED_EMAIL_DOMAINS = ['hospital.com', 'med.hospital.com']

if (formData.email) {
  const domain = formData.email.split('@')[1]
  if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
    errors.email = 'Debe usar un email institucional'
  }
}
```

---

#### 7. **Notificaciones en Tiempo Real**
Alertar al personal cuando su acceso es modificado:
```typescript
// Después de cambios críticos
await enviarNotificacion({
  destinatarioCI: formData.ci,
  tipo: 'ACCESO_MODIFICADO',
  mensaje: `Tu acceso al sistema ha sido ${accion} por ${superAdmin.nombre}`,
  detalles: { accionAnterior, accionNueva, timestamp },
  requiereAccion: true // Mostrar en próximo login
})
```

---

#### 8. **Versionado de la Whitelist**
Mantener historial de cambios completos:
```typescript
interface WhitelistVersion {
  versionId: number
  snapshot: PersonalAutorizado[]  // Estado completo de whitelist
  cambiosDesdeVersion: AuditLog[]
  criadoPor: string
  timestamp: DateTime
}
```

**Beneficios**: Poder revertir a versiones anteriores si es necesario.

---

### 🟡 MEDIA PRIORIDAD (Mejoras de UX/Seguridad)

#### 9. **Confirmación Visual de Cambios Críticos**
```typescript
// Mostrar resumen ANTES de confirmar
const cambio = {
  anterior: { estado: 'ACTIVO', rol: 'MEDICO' },
  nuevo: { estado: 'BAJA', rol: 'MEDICO' },
  razon: 'Jubilación'
}

// Modal mostrando diferencias en rojo/verde
```

---

#### 10. **Expiración de Acceso Automática**
Ya tienes `fechaVencimiento` - implementar:
```typescript
// Cron job diario
const personalVencido = await db.personalAutorizado.findMany({
  where: {
    fechaVencimiento: { lte: today },
    estado: 'ACTIVO'
  }
})

// Cambiar a INACTIVO automáticamente
for (const personal of personalVencido) {
  await cambiarEstado(personal.ci, 'INACTIVO', 'Acceso vencido automáticamente')
  await notificarPersonal(personal.email, 'Tu acceso ha expirado')
}
```

---

#### 11. **Bloqueo de Cuenta tras Intentos Fallidos (Backend)**
```typescript
interface LoginAttempt {
  ci: string
  timestamp: DateTime
  exitoso: boolean
  ipOrigen: string
}

// Bloquear después de 5 intentos fallidos en 15 minutos
const intentosFallidos = await db.loginAttempt.count({
  where: {
    ci,
    exitoso: false,
    timestamp: { gte: new Date(Date.now() - 15 * 60 * 1000) }
  }
})

if (intentosFallidos >= 5) {
  throw new Error('Cuenta bloqueada temporalmente')
}
```

---

#### 12. **Restricción de IP para SUPER_ADMIN**
```typescript
// Almacenar IPs permitidas
interface SuperAdminIPWhitelist {
  superAdminId: number
  ipPermitida: string
  descripcion: string // "Oficina", "VPN", etc.
}

// Validar en cada request
const ipsPermitidas = await db.superAdminIPWhitelist.findMany({
  where: { superAdminId: user.id }
})

if (!ipsPermitidas.some(ip => ip.ipPermitida === clientIP)) {
  throw new UnauthorizedError('IP no autorizada para SUPER_ADMIN')
}
```

---

#### 13. **Logs Detallados con Timestamps**
```typescript
interface DetailedLog {
  timestamp: DateTime
  superAdmin: string
  accion: string
  recurso: string           // Qué se modificó
  detalles: object
  estadoAnterior: object
  estadoNuevo: object
  resultado: 'EXITOSO' | 'FALLIDO'
  razonFallo?: string
  ipCliente: string
  userAgent: string
}
```

---

### 🟢 BAJA PRIORIDAD (Futuras Mejoras)

#### 14. **Integración LDAP/Active Directory**
Para sincronización automática con sistema corporativo:
```typescript
// Importar usuarios desde AD corporativo
async function sincronizarDesdeAD() {
  const usuariosAD = await ldap.search(EMPRESA_AD_BASE_DN)
  for (const usuario of usuariosAD) {
    await crearOActualizarPersonal({
      ci: usuario.idNumber,
      nombreCompleto: usuario.displayName,
      email: usuario.mail,
      departamento: usuario.department,
      cargo: usuario.title
    })
  }
}
```

---

#### 15. **Dashboard de Seguridad para SUPER_ADMIN**
Mostrar:
- 📊 Cambios recientes
- 🚨 Alertas de actividad sospechosa
- 📈 Intentos de acceso fallidos
- ⏰ Accesos próximos a vencer
- 🔍 Búsqueda en logs de auditoría

---

## 📋 Checklist de Implementación

```
CRÍTICA:
[ ] Backend: Validar SUPER_ADMIN en middleware
[ ] Auditoría: Crear tabla AuditLog y grabar cambios
[ ] Rate Limiting: Implementar en rutas sensibles
[ ] Confirmación 2FA: Token por email para operaciones críticas

ALTA:
[ ] Encriptación: CI y email
[ ] Validación: Email institucional
[ ] Notificaciones: Alertar cambios de acceso
[ ] Versionado: Guardar snapshots de whitelist

MEDIA:
[ ] UI: Resumen de cambios antes de confirmar
[ ] Cron: Expiración automática de accesos
[ ] Login: Bloqueo tras intentos fallidos
[ ] Restricción: IP whitelist para SUPER_ADMIN
[ ] Logs: Sistema detallado de auditoría

BAJA:
[ ] LDAP: Sincronización con AD corporativo
[ ] Dashboard: Metrics de seguridad para SUPER_ADMIN
```

---

## 📝 Notas Importantes

1. **El frontend NO es una barrera de seguridad** - Todo debe validarse en backend
2. **Registrar todo** - La auditoría es tu mejor amiga en casos de dispute
3. **Notificar usuarios** - Si su acceso cambia, deben saberlo
4. **Principio del menor privilegio** - Solo SUPER_ADMIN puede hacer cambios críticos
5. **Monitoreo continuo** - Revisar logs de auditoría regularmente

---

## 🔗 Referencias
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Hospital Data Security: HIPAA (si aplica)
- Rate Limiting: express-rate-limit
- Encryption: bcrypt, crypto-js

---

## Próximas Pasos
1. ✅ Actualizar departamentos con 15 especialidades
2. 🔄 Implementar validación SUPER_ADMIN en backend
3. 🔄 Crear tabla de auditoría
4. 🔄 Implementar rate limiting
5. 🔄 Agregar confirmación 2FA
