# 📝 Logger Guide - Sistema de Logging Centralizado

## 🎯 Propósito

Este documento explica cómo funciona el sistema de logging del proyecto y cómo usarlo correctamente en tu código.

---

## ¿QUÉ ES LOGGING?

**Logging = Registrar mensajes de lo que hace tu aplicación**

### Ejemplo sin logging:
```
Tu app corre silenciosamente
↓
Si algo falla, no sabes qué pasó ❌
Difícil debuggear
```

### Ejemplo con logging:
```
[2025-11-10 14:30:45] INFO: Usuario conectado
[2025-11-10 14:30:46] INFO: Query ejecutada
[2025-11-10 14:30:47] ERROR: Conexión perdida ← ¡Ves exactamente qué falló! ✅
```

---

## 📦 ¿QUÉ ES WINSTON?

**Winston = Librería profesional que facilita el logging**

### Sin Winston (hacerlo manual - ❌ MAL):
```typescript
console.log("2025-11-10 14:30:45 | INFO | Usuario conectado");
console.log("2025-11-10 14:30:46 | INFO | Query ejecutada");
console.log("2025-11-10 14:30:47 | ERROR | Conexión perdida");
// Repetir esto 1000 veces en tu código 😭
```

### Con Winston (✅ CORRECTO):
```typescript
import logger from './utils/logger';

logger.info("Usuario conectado");
logger.info("Query ejecutada");
logger.error("Conexión perdida");
// Winston automáticamente agrega:
// - Timestamp (fecha/hora)
// - Colores en consola
// - Guarda en archivo
// - Formato profesional
```

---

## 📁 ¿QUÉ HACE `logger.ts`?

### Función Principal:
**Configura Winston UNA SOLA VEZ** para que todo el proyecto lo use igual.

### Lo que configura:

| Componente | Qué hace |
|-----------|----------|
| **Niveles** | Define severidad: error, warn, info, http, debug |
| **Colores** | Pinta los mensajes en la terminal (rojo para error, verde para info, etc) |
| **Formato** | Define cómo se ven los mensajes: `TIMESTAMP NIVEL: MENSAJE` |
| **Transports** | Dónde guardar: consola (terminal) + archivos |

---

## 🔍 Estructura de `logger.ts`

### 1️⃣ Niveles de Log (Lines 10-16)
```typescript
const levels = {
  error: 0,      // 🔴 Problema grave (base de datos caída)
  warn: 1,       // 🟡 Advertencia (algo raro pero no crítico)
  info: 2,       // 🔵 Información general (usuario conectó)
  http: 3,       // 🟣 Requests HTTP (alguien visitó /api/users)
  debug: 4,      // ⚪ Detalles técnicos (valor de variable x = 5)
};
```

**¿Para qué sirve cada uno?**

| Nivel | Cuándo usar | Ejemplo |
|-------|------------|---------|
| **error** | Errores críticos | Base de datos caída, conexión perdida |
| **warn** | Advertencias | Conexión lenta, timeout próximo |
| **info** | Información importante | Usuario login, proceso completado |
| **http** | Requests HTTP | GET /api/users, POST /api/patients |
| **debug** | Detalles técnicos | Valores de variables, pasos internos |

---

### 2️⃣ Colores en Consola (Lines 18-25)
```typescript
const colors = {
  error: 'red',      // ❌ Rojo para errores
  warn: 'yellow',    // ⚠️  Amarillo para advertencias
  info: 'green',     // ✅ Verde para info
  http: 'magenta',   // 🌐 Magenta para requests
  debug: 'white',    // 🐛 Blanco para debug
};
```

**Resultado en tu terminal:**
```
2025-11-10 14:30:45 ERROR: Base de datos caída        ← ROJO
2025-11-10 14:30:46 WARN: Conexión lenta              ← AMARILLO
2025-11-10 14:30:47 INFO: Usuario conectado           ← VERDE
2025-11-10 14:30:48 HTTP: GET /api/users              ← MAGENTA
2025-11-10 14:30:49 DEBUG: Valor de x = 5             ← BLANCO
```

---

### 3️⃣ Formato de Mensajes (Lines 27-35)
```typescript
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // ↑ Agrega la fecha/hora: 2025-11-10 14:30:45:123
  // ↑ Formato: AÑO-MES-DÍA HORA:MINUTO:SEGUNDO:MILISEGUNDOS

  winston.format.colorize({ all: true }),
  // ↑ Pinta los mensajes con colores (basado en el nivel)

  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
  // ↑ Formato final: "2025-11-10 14:30:45 INFO: Usuario conectado"
);
```

---

### 4️⃣ Dónde Guardar los Logs (Lines 37-51)
```typescript
const transports = [
  // "Transport" = lugar donde guardar los logs

  new winston.transports.Console(),
  // ↑ Mostrar en la terminal (mientras desarrollas)
  // Ves los logs en tiempo real

  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  // ↑ Guardar SOLO errores en archivo logs/error.log
  // Útil para revisar problemas después

  new winston.transports.File({
    filename: 'logs/all.log',
  }),
  // ↑ Guardar TODO en archivo logs/all.log
  // Auditoría completa de la aplicación
];
```

**¿Dónde se guardan los archivos?**
```
backend/
├── logs/
│   ├── error.log    ← Solo errores críticos
│   └── all.log      ← Todos los logs
└── src/
```

---

### 5️⃣ Crear la Instancia (Lines 53-59)
```typescript
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'debug',
  // ↑ Nivel mínimo a mostrar
  // ↑ Si .env tiene LOG_LEVEL=info, solo muestra info+ (ignora debug)
  // ↑ Si .env no lo define, usa 'debug' (muestra todo)

  levels,      // ← Usa los niveles que definimos arriba
  format,      // ← Usa el formato que definimos arriba
  transports,  // ← Usa los transportes que definimos arriba
});

export default logger;
// ↑ "Exporta este logger para que otros archivos lo usen"
```

---

## 🚀 CÓMO USAR EN TU CÓDIGO

### 1️⃣ Importar el logger
```typescript
import logger from '../utils/logger';
```

### 2️⃣ Usar en tu código
```typescript
logger.error("Algo rompió");
logger.warn("Cuidado con esto");
logger.info("Todo bien");
logger.debug("Detalles técnicos");
logger.http("GET /api/users");
```

### 3️⃣ Ver los resultados en:
- **Terminal**: Mientras desarrollas ves los logs en tiempo real
- **logs/error.log**: Solo errores (para revisar después)
- **logs/all.log**: Todos los logs (auditoría completa)

---

## 📖 EJEMPLOS PRÁCTICOS

### Ejemplo 1: En la conexión a BD (connection.ts)
```typescript
import logger from '../utils/logger';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const initializeDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
    // ↑ Si todo bien, esto aparece en terminal con color VERDE
  } catch (error) {
    logger.error('❌ Failed to connect to database:', error);
    // ↑ Si hay error, esto aparece en terminal con color ROJO
    // ↑ Se guarda también en logs/error.log
    process.exit(1);
  }
};
```

**Terminal output:**
```
2025-11-10 14:30:45:123 INFO: ✅ Database connected successfully
```

---

### Ejemplo 2: En un servicio (src/services/PatientService.ts)
```typescript
import logger from '../utils/logger';

export class PatientService {
  async createPatient(data: PatientData) {
    try {
      logger.debug('Creating patient with data:', data);
      // ↑ Detalles técnicos (aparece solo si LOG_LEVEL=debug)

      const patient = await db.patient.create({ data });

      logger.info(`Patient created successfully: ${patient.id}`);
      // ↑ Información importante (siempre aparece)

      return patient;
    } catch (error) {
      logger.error(`Failed to create patient: ${error.message}`);
      // ↑ Error crítico (aparece en terminal ROJO y en logs/error.log)
      throw error;
    }
  }
}
```

**Terminal output:**
```
2025-11-10 14:30:45:123 DEBUG: Creating patient with data: { ci: "12345", name: "Juan" }
2025-11-10 14:30:46:456 INFO: Patient created successfully: 42
```

---

### Ejemplo 3: En un controlador (src/controllers/AuthController.ts)
```typescript
import logger from '../utils/logger';

export class AuthController {
  async login(req, res) {
    try {
      logger.http(`Login attempt: ${req.body.email}`);

      const user = await findUser(req.body.email);
      
      if (!user) {
        logger.warn(`Login failed: User not found - ${req.body.email}`);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      logger.info(`User logged in: ${user.email}`);
      res.json({ token: generateToken(user) });

    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      res.status(500).json({ error: 'Server error' });
    }
  }
}
```

**Terminal output:**
```
2025-11-10 14:30:45:123 HTTP: Login attempt: juan@hospital.com
2025-11-10 14:30:46:456 INFO: User logged in: juan@hospital.com
```

---

## ⚙️ CONFIGURACIÓN

### Variable de Entorno: `LOG_LEVEL`

En `.env`:
```bash
# Mostrar todos los logs (debug, http, info, warn, error)
LOG_LEVEL=debug

# O mostrar solo info y superiores (info, warn, error)
LOG_LEVEL=info

# O mostrar solo errores y warnings
LOG_LEVEL=warn

# O mostrar solo errores
LOG_LEVEL=error
```

**¿Qué significa?**

| LOG_LEVEL | Ve estos logs | NO ve |
|-----------|--------------|-------|
| `debug` | debug, http, info, warn, error | (ninguno) |
| `info` | info, warn, error | debug, http |
| `warn` | warn, error | debug, http, info |
| `error` | error | debug, http, info, warn |

---

## 🎯 BUENAS PRÁCTICAS

### ✅ HAZLO

```typescript
// 1. Importar en todos tus archivos
import logger from '../utils/logger';

// 2. Usar el nivel correcto
logger.error('Base de datos no responde');  // ✅ Error crítico
logger.info('Usuario login exitoso');       // ✅ Info importante
logger.debug('Query ejecutada:', query);    // ✅ Detalles técnicos

// 3. Ser descriptivo
logger.error(`Failed to create patient: ${error.message}`);
// ↑ Claro qué pasó

// 4. Incluir contexto
logger.info(`Patient created: ID=${id}, Name=${name}`);
// ↑ Fácil debuggear
```

### ❌ NO HAGAS

```typescript
// ❌ Usar console.log
console.log("Usuario conectado");

// ❌ Usar el nivel incorrecto
logger.info('Base de datos caída');  // ❌ Esto es ERROR, no INFO
logger.error('Usuario conectado');   // ❌ Esto es INFO, no ERROR

// ❌ Mensajes vacos
logger.info('ok');                   // ❌ No se entiende qué pasó

// ❌ Información sensible
logger.info(`Password: ${password}`);  // ❌ ¡NUNCA registres contraseñas!
logger.info(`Token: ${authToken}`);    // ❌ ¡NUNCA registres tokens!
```

---

## 📂 ARCHIVOS GENERADOS

Cuando usas el logger, Winston automáticamente crea:

```
backend/
├── logs/
│   ├── error.log      ← Todos los errores (ERROR, WARN)
│   └── all.log        ← Todos los logs (ERROR, WARN, INFO, HTTP, DEBUG)
├── src/
│   ├── utils/
│   │   ├── logger.ts  ← Este archivo (configuración)
│   │   └── LOGGER_GUIDE.md ← Esta guía
│   └── ...
```

### Contenido de `logs/all.log`:
```
2025-11-10 14:30:45:123 DEBUG: Creating patient with data: { ci: "12345" }
2025-11-10 14:30:46:456 INFO: Patient created successfully: 42
2025-11-10 14:30:47:789 HTTP: POST /api/patients
2025-11-10 14:30:48:101 WARN: Connection timeout approaching
2025-11-10 14:30:49:234 ERROR: Database connection lost
```

### Contenido de `logs/error.log`:
```
2025-11-10 14:30:48:101 WARN: Connection timeout approaching
2025-11-10 14:30:49:234 ERROR: Database connection lost
```

---

## ❓ PREGUNTAS FRECUENTES

### P: ¿Por qué no usar `console.log()`?

A: Puedes usarlo, pero Winston es mejor porque:
- ✅ Agrega timestamp automáticamente
- ✅ Agrupa por severidad (error, info, etc)
- ✅ Guarda en archivos automáticamente
- ✅ Colorea para leer más fácil
- ✅ Es profesional
- ✅ Usado por empresas grandes

### P: ¿Es obligatorio usarlo?

A: No es obligatorio, pero es **best practice** (buena práctica profesional). Todo backend serio tiene logging.

### P: ¿Puedo agregar más niveles?

A: Sí, pero no es recomendable. Los 5 niveles (error, warn, info, http, debug) son estándar en la industria.

### P: ¿Los archivos de log crecen infinitamente?

A: Sí, actualmente sí. En producción, usarías rotación de logs, pero no es necesario para desarrollo.

### P: ¿Por qué timestamp en milisegundos?

A: Para debugging. Si dos eventos ocurren casi simultáneamente, verás la diferencia exacta.

### P: ¿Puedo usar logger en archivos React (frontend)?

A: No, este logger es solo para backend (Node.js). React tiene su propio sistema de logging.

---

## 📚 REFERENCIAS

- **Winston Official Docs**: https://github.com/winstonjs/winston
- **Logger Levels Standard**: https://tools.ietf.org/html/rfc5424#section-6.2.1
- **Logging Best Practices**: https://12factor.net/logs

---

## 🎓 RESUMEN RÁPIDO

| Concepto | Explicación |
|----------|-------------|
| **Logging** | Registrar mensajes de lo que hace tu app |
| **Winston** | Librería profesional para logging |
| **logger.ts** | Archivo que configura Winston (lo haces UNA sola vez) |
| **Niveles** | error, warn, info, http, debug (diferentes severidades) |
| **Transports** | Dónde guardar: consola (terminal) + archivos |
| **Uso** | `import logger from '../utils/logger'` luego `logger.info("msg")` |

---

**¿Dudas?** Pregunta en el README del equipo o revisa los ejemplos en los servicios. 🚀
