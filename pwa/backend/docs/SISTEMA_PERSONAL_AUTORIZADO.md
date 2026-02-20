# 🔐 Sistema de Personal Autorizado (Whitelist)

## Descripción General

El Sistema de Personal Autorizado es un mecanismo de seguridad **crítico** que controla quién puede registrarse en la PWA del Hospital. Este sistema implementa un enfoque de "lista blanca" (whitelist) donde **solo el personal previamente autorizado por las autoridades del hospital puede crear una cuenta**.

## ¿Por qué este sistema?

### Problema que resuelve
- Los sistemas hospitalarios manejan **datos extremadamente sensibles** (información médica, datos personales)
- Un sistema abierto de registro permitiría que cualquier persona acceda a información confidencial
- Se requiere **cumplimiento normativo** (HIPAA, Ley de Protección de Datos, etc.)

### Beneficios
| Beneficio | Descripción |
|-----------|-------------|
| 🔒 Control Total | Solo personal verificado puede acceder |
| 📋 Auditoría Completa | Registro de quién autorizó a quién y cuándo |
| 🛡️ Defensa en Profundidad | Múltiples capas de validación |
| ✅ Cumplimiento Normativo | Alineado con regulaciones de datos médicos |
| 🚫 Prevención de Acceso | Bloquea registros no autorizados desde el inicio |

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                    FLUJO DE REGISTRO SEGURO                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐                                                   │
│  │   RRHH /     │ Agrega personal a                                 │
│  │  Autoridad   │ la whitelist ──────┐                              │
│  └──────────────┘                    │                              │
│                                      ▼                              │
│                        ┌─────────────────────────┐                  │
│                        │   PersonalAutorizado    │                  │
│                        │      (Whitelist)        │                  │
│                        │ ─────────────────────── │                  │
│                        │ • CI (único)            │                  │
│                        │ • Nombre completo       │                  │
│                        │ • Rol autorizado        │                  │
│                        │ • Estado (ACTIVO/BAJA)  │                  │
│                        │ • Vigencia temporal     │                  │
│                        └───────────┬─────────────┘                  │
│                                    │                                │
│  ┌──────────────┐                  │                                │
│  │  Empleado    │ Intenta          │                                │
│  │  del Hospital│ registrarse ─────┼─────────┐                      │
│  └──────────────┘                  │         │                      │
│                                    ▼         ▼                      │
│                        ┌─────────────────────────┐                  │
│                        │   VALIDACIONES          │                  │
│                        │ ─────────────────────── │                  │
│                        │ ✓ ¿CI existe en lista?  │                  │
│                        │ ✓ ¿Estado = ACTIVO?     │                  │
│                        │ ✓ ¿No ha vencido?       │                  │
│                        │ ✓ ¿Nombre coincide?     │                  │
│                        │ ✓ ¿Rol coincide?        │                  │
│                        │ ✓ ¿No registrado aún?   │                  │
│                        └───────────┬─────────────┘                  │
│                                    │                                │
│                     ┌──────────────┴──────────────┐                 │
│                     │                             │                 │
│                     ▼                             ▼                 │
│         ┌─────────────────┐           ┌─────────────────┐           │
│         │   ❌ RECHAZADO   │           │   ✅ APROBADO   │           │
│         │ Mensaje de error│           │ Cuenta creada   │           │
│         │ sin detalles    │           │ + Token JWT     │           │
│         └─────────────────┘           └─────────────────┘           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Modelo de Datos

### Tabla: `PersonalAutorizado`

```prisma
model PersonalAutorizado {
  id                BigInt   @id @default(autoincrement())
  ci                String   @unique   // Cédula de identidad (identificador principal)
  nombreCompleto    String              // Nombre oficial
  email             String?             // Email institucional (opcional)
  rolAutorizado     String              // MEDICO | ADMIN | COORDINADOR | ENFERMERO | SUPER_ADMIN
  departamento      String?             // Departamento asignado
  cargo             String?             // Cargo específico
  
  // Control de vigencia
  estado            String   @default("ACTIVO")  // ACTIVO | INACTIVO | SUSPENDIDO | BAJA
  fechaIngreso      DateTime            // Fecha de ingreso al hospital
  fechaVencimiento  DateTime?           // Hasta cuándo está autorizado (null = indefinido)
  
  // Auditoría
  motivoBaja        String?             // Razón de inactivación
  autorizadoPor     String?             // Quién lo agregó a la lista
  
  // Control de registro
  registrado        Boolean  @default(false)  // Si ya creó cuenta en el sistema
  fechaRegistro     DateTime?                 // Cuándo se registró
  usuarioId         BigInt?  @unique          // Referencia al usuario creado
}
```

---

## Roles del Sistema

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| `SUPER_ADMIN` | Administrador del sistema | Gestiona whitelist, usuarios, todo |
| `ADMIN` | Personal administrativo | Admisiones, citas, reportes |
| `COORDINADOR` | Coordinador de área médica | Gestión de su departamento |
| `MEDICO` | Personal médico | Atención clínica, historias |
| `ENFERMERO` | Personal de enfermería | Asistencia, signos vitales |

---

## API Endpoints

### Gestión de Personal Autorizado (Solo SUPER_ADMIN)

#### Listar Personal Autorizado
```http
GET /api/authorized-personnel
Authorization: Bearer <token_super_admin>

Query params:
  - estado: ACTIVO | INACTIVO | SUSPENDIDO | BAJA
  - rol: MEDICO | ADMIN | COORDINADOR | ENFERMERO
  - registrado: true | false
  - departamento: string
```

#### Obtener por CI
```http
GET /api/authorized-personnel/:ci
Authorization: Bearer <token_super_admin>
```

#### Agregar Personal
```http
POST /api/authorized-personnel
Authorization: Bearer <token_super_admin>
Content-Type: application/json

{
  "ci": "V12345678",
  "nombreCompleto": "Dr. Juan Pérez García",
  "email": "juan.perez@hospital.com",
  "rolAutorizado": "MEDICO",
  "departamento": "Medicina Interna",
  "cargo": "Médico Internista",
  "fechaIngreso": "2024-01-15",
  "fechaVencimiento": null  // null = sin vencimiento
}
```

#### Actualizar Personal
```http
PUT /api/authorized-personnel/:ci
Authorization: Bearer <token_super_admin>
Content-Type: application/json

{
  "departamento": "Cirugía General",
  "cargo": "Coordinador",
  "rolAutorizado": "COORDINADOR"
}
```

#### Dar de Baja
```http
DELETE /api/authorized-personnel/:ci
Authorization: Bearer <token_super_admin>
Content-Type: application/json

{
  "motivoBaja": "Renuncia voluntaria del empleado"
}
```

#### Carga Masiva (hasta 100 registros)
```http
POST /api/authorized-personnel/bulk
Authorization: Bearer <token_super_admin>
Content-Type: application/json

{
  "personnel": [
    {
      "ci": "V12345678",
      "nombreCompleto": "Dr. Juan Pérez",
      "rolAutorizado": "MEDICO",
      "fechaIngreso": "2024-01-15"
    },
    // ... más registros
  ]
}
```

#### Estadísticas
```http
GET /api/authorized-personnel/stats
Authorization: Bearer <token_super_admin>

Response:
{
  "success": true,
  "data": {
    "total": 150,
    "activos": 142,
    "registrados": 98,
    "pendientesRegistro": 44,
    "porRol": [
      { "rol": "MEDICO", "cantidad": 80 },
      { "rol": "ADMIN", "cantidad": 25 },
      // ...
    ]
  }
}
```

---

## Flujo de Registro (Usuario)

### 1. Usuario intenta registrarse

```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Dr. Juan Pérez García",
  "ci": "V12345678",
  "email": "juan.perez@gmail.com",
  "password": "MiPassword123!",
  "role": "MEDICO"
}
```

### 2. Sistema valida contra whitelist

El sistema ejecuta estas validaciones **en orden**:

1. ✅ **Existencia**: ¿El CI existe en `PersonalAutorizado`?
2. ✅ **Ya registrado**: ¿Ya tiene cuenta creada?
3. ✅ **Estado**: ¿Está en estado `ACTIVO`?
4. ✅ **Vigencia**: ¿No ha vencido su autorización?
5. ✅ **Nombre**: ¿El nombre coincide (75%+ similitud)?
6. ✅ **Rol**: ¿El rol solicitado es el autorizado?

### 3. Respuestas posibles

#### ✅ Registro exitoso
```json
{
  "success": true,
  "data": {
    "id": 123,
    "nombre": "Dr. Juan Pérez García",
    "email": "juan.perez@gmail.com",
    "role": "MEDICO",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "User registered successfully"
}
```

#### ❌ No está en whitelist
```json
{
  "success": false,
  "error": "UnauthorizedError",
  "message": "No está autorizado para registrarse. Contacte al departamento de Recursos Humanos del hospital."
}
```

#### ❌ Ya está registrado
```json
{
  "success": false,
  "error": "UnauthorizedError",
  "message": "Ya existe una cuenta registrada con esta cédula. Si olvidó su contraseña, utilice la opción de recuperación."
}
```

#### ❌ No está activo
```json
{
  "success": false,
  "error": "UnauthorizedError",
  "message": "Su autorización está en estado \"SUSPENDIDO\". Contacte al departamento de Recursos Humanos."
}
```

#### ❌ Autorización vencida
```json
{
  "success": false,
  "error": "UnauthorizedError",
  "message": "Su autorización ha vencido. Contacte al departamento de Recursos Humanos para renovarla."
}
```

#### ❌ Nombre no coincide
```json
{
  "success": false,
  "error": "UnauthorizedError",
  "message": "El nombre proporcionado no coincide con nuestros registros. Verifique que sea exactamente como aparece en su documento de identidad."
}
```

#### ❌ Rol no autorizado
```json
{
  "success": false,
  "error": "UnauthorizedError",
  "message": "No está autorizado para registrarse como \"ADMIN\". Su rol autorizado es \"MEDICO\"."
}
```

---

## Seguridad Adicional

### Logging de Seguridad

Todos los intentos de registro (exitosos y fallidos) se registran en `logs/security.log`:

```
2024-11-28 10:15:23 security: [WHITELIST] Intento de registro RECHAZADO - CI no autorizado: V99999999
2024-11-28 10:16:45 security: [WHITELIST] Personal autorizado verificado exitosamente: V12345678
2024-11-28 10:16:46 info: [AUTH] Nuevo usuario registrado exitosamente: juan.perez@gmail.com (CI: V12345678)
```

### Auditoría en Base de Datos

Cada operación se registra en `AuditLog`:

```json
{
  "tabla": "Usuario",
  "registroId": 123,
  "accion": "REGISTER",
  "detalle": {
    "ci": "V12345678",
    "email": "juan.perez@gmail.com",
    "role": "MEDICO",
    "whitelistVerified": true,
    "personalAutorizadoId": 45
  }
}
```

### Comparación de Nombres (Tolerancia)

El sistema permite pequeñas diferencias en nombres:
- Ignora mayúsculas/minúsculas
- Ignora acentos (José = Jose)
- Permite diferente orden de palabras
- Requiere al menos 75% de coincidencia de palabras

```
DB:    "Dr. Carlos Eduardo García Méndez"
Input: "Carlos Garcia Mendez"
Resultado: ✅ VÁLIDO (100% de palabras coinciden)

DB:    "María Elena López Rodríguez"
Input: "Juan Pérez García"
Resultado: ❌ INVÁLIDO (0% de coincidencia)
```

---

## Guía de Implementación

### Paso 1: Ejecutar migración
```bash
cd pwa/backend
npx prisma migrate dev
```

### Paso 2: Ejecutar seed (crea SUPER_ADMIN inicial)
```bash
npx ts-node prisma/seeds/seed.ts
```

### Paso 3: Iniciar sesión como SUPER_ADMIN
```
Email: superadmin@hospital.com
Password: SuperAdmin2024!
```

### Paso 4: Agregar personal autorizado
Usar la API o crear una interfaz de administración para agregar empleados a la whitelist.

### Paso 5: Empleados pueden registrarse
Los empleados en la whitelist pueden crear sus cuentas vía `/register`.

---

## Consideraciones de Producción

### 1. Cambiar credenciales del SUPER_ADMIN
Inmediatamente después del primer login, cambiar la contraseña.

### 2. Carga inicial de empleados
Se recomienda usar el endpoint `/bulk` para cargar la nómina inicial desde RRHH.

### 3. Integración con sistemas de RRHH
Considerar integración automática con sistemas de nómina para mantener la whitelist actualizada.

### 4. Backup de la whitelist
Incluir `PersonalAutorizado` en los backups regulares.

### 5. Monitoreo de intentos fallidos
Configurar alertas para múltiples intentos de registro fallidos (posible ataque).

---

## FAQ

### ¿Qué pasa si alguien renuncia?
El SUPER_ADMIN debe dar de baja al empleado en la whitelist. Su cuenta existente seguirá funcionando hasta que también se desactive en la tabla `Usuario`.

### ¿Puede un empleado cambiar su rol?
No por sí mismo. El SUPER_ADMIN debe actualizar el `rolAutorizado` en la whitelist y también el `role` en la tabla `Usuario`.

### ¿Qué pasa si hay un error en el nombre?
El sistema tiene tolerancia del 75%. Si aún así falla, el SUPER_ADMIN puede corregir el nombre en la whitelist.

### ¿Se puede eliminar un registro de la whitelist?
No. Solo se puede dar de BAJA con un motivo. Esto mantiene el historial para auditoría.

### ¿Qué pasa con empleados temporales?
Usar el campo `fechaVencimiento` para definir hasta cuándo están autorizados. El sistema rechazará registros después de esa fecha.

---

## Archivos Relacionados

```
backend/
├── prisma/
│   └── schema.prisma              # Modelo PersonalAutorizado
├── src/
│   ├── services/
│   │   ├── authorizedPersonnel.ts # Lógica de whitelist
│   │   └── auth.ts                # Integración en registro
│   ├── controllers/
│   │   └── authorizedPersonnel.ts # Controladores API
│   ├── routes/
│   │   └── authorizedPersonnel.ts # Rutas API
│   └── utils/
│       └── logger.ts              # Logging de seguridad
└── docs/
    └── SISTEMA_PERSONAL_AUTORIZADO.md  # Esta documentación
```
