# 📁 Utils - Utilidades Compartidas

## 📖 Propósito

Esta carpeta contiene utilidades reutilizables en toda la aplicación backend.

---

## 📚 Archivos en esta Carpeta

### `logger.ts`
**Sistema centralizado de logging con Winston**

- 📄 Tipo: Módulo de configuración
- 🎯 Usa en: Todos los archivos que necesiten registrar eventos
- 📦 Dependencia: `winston`

#### Uso rápido:
```typescript
import logger from '../utils/logger';

logger.info("Mensaje");
logger.error("Error");
logger.debug("Detalles técnicos");
```

#### ¿Dudas?
→ Lee: `LOGGER_GUIDE.md`

---

### `LOGGER_GUIDE.md`
**Guía completa para entender y usar el logging**

- 📄 Tipo: Documentación
- 👥 Audiencia: Todo el equipo
- ⏱️ Lectura: 10-15 minutos

#### Contenido:
- ¿Qué es logging?
- ¿Qué es Winston?
- Estructura de logger.ts (línea por línea)
- Cómo usar en tu código
- Ejemplos prácticos
- Configuración
- Buenas prácticas
- Preguntas frecuentes

#### Cuándo leer:
- ✅ Nuevo en el equipo
- ✅ Dudas sobre logging
- ✅ Quieres entender cómo funciona

---

## 🚀 CÓMO EMPEZAR

### Opción 1: Lo quiero ya
```typescript
// 1. Importa
import logger from './utils/logger';

// 2. Usa
logger.info("Hola mundo");
```

### Opción 2: Quiero entender todo
```
Lee: backend/src/utils/LOGGER_GUIDE.md
↓
Aprenderás qué es Winston, logging, y cómo usarlo
↓
Entiende la configuración completa
```

---

## 📋 Estructura de Carpetas

```
backend/src/utils/
├── README.md              ← Estás aquí
├── logger.ts              ← Código (importa en tu código)
└── LOGGER_GUIDE.md        ← Guía (lee si tienes dudas)
```

---

## 🔗 Enlaces Rápidos

| Si necesitas... | Ve a... |
|-----------------|---------|
| **Usar logging en mi código** | Importa `logger.ts` |
| **Entender cómo funciona** | Lee `LOGGER_GUIDE.md` |
| **Ejemplos prácticos** | Busca "EJEMPLOS PRÁCTICOS" en LOGGER_GUIDE.md |
| **Configurar LOG_LEVEL** | Busca "CONFIGURACIÓN" en LOGGER_GUIDE.md |
| **Buenas prácticas** | Busca "BUENAS PRÁCTICAS" en LOGGER_GUIDE.md |
| **Tengo una pregunta** | Busca en "PREGUNTAS FRECUENTES" en LOGGER_GUIDE.md |

---

## 📞 ¿Dudas?

1. Revisa `LOGGER_GUIDE.md` - Probablemente ya está respondida
2. Si no, pregunta en el README del equipo

---

**Última actualización:** 2025-11-10
**Versión:** 1.0
