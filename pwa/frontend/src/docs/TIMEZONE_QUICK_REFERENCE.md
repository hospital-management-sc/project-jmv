# Guía Rápida - Trabajar con Timezone en Venezuela

**Para desarrolladores que necesitan trabajar con fechas/horas en el sistema.**

## 🚀 Quick Start

### Importar funciones
```typescript
import { 
  getTodayVenezuelaISO,
  getCurrentTimeVenezuela,
  formatDateVenezuela,
  formatDateTimeVenezuela,
  VENEZUELA_TIMEZONE,
  VENEZUELA_LOCALE
} from '@/utils/dateUtils'
```

### Casos Más Comunes

#### 1️⃣ Pre-llenar campo de fecha con hoy
```tsx
const [date, setDate] = useState(getTodayVenezuelaISO())

// En el JSX
<input type="date" value={date} onChange={e => setDate(e.target.value)} />
```

#### 2️⃣ Pre-llenar campo de hora con ahora
```tsx
const [time, setTime] = useState(getCurrentTimeVenezuela())

// En el JSX
<input type="time" value={time} onChange={e => setTime(e.target.value)} />
```

#### 3️⃣ Mostrar fecha en tabla/lista
```tsx
const paciente = { fechaAdmision: "2025-12-04T20:30:00Z" }

<td>{formatDateVenezuela(paciente.fechaAdmision)}</td>
// → "04/12/2025"
```

#### 4️⃣ Mostrar fecha + hora
```tsx
<td>{formatDateTimeVenezuela(paciente.fechaAdmision)}</td>
// → "04/12/2025 8:30 PM"
```

#### 5️⃣ Mostrar fecha de forma legible
```tsx
<span>{formatDateLongVenezuela(paciente.fechaAdmision)}</span>
// → "jueves, 4 de diciembre de 2025"
```

## 📚 Referencia de Funciones

### `getTodayVenezuelaISO()`
- **Entrada:** (ninguna)
- **Salida:** `"2025-12-04"` (YYYY-MM-DD)
- **Uso:** Input type="date"
- **Zona Horaria:** Venezuela (GMT-4)

```typescript
const today = getTodayVenezuelaISO()
// → "2025-12-04"
```

### `getCurrentTimeVenezuela()`
- **Entrada:** (ninguna)
- **Salida:** `"20:30"` (HH:MM en 24h)
- **Uso:** Input type="time"
- **Zona Horaria:** Venezuela (GMT-4)

```typescript
const now = getCurrentTimeVenezuela()
// → "20:30"
```

### `formatDateVenezuela(date)`
- **Entrada:** `Date | string | number`
- **Salida:** `"04/12/2025"` (DD/MM/YYYY)
- **Uso:** Mostrar en tablas/listas
- **Zona Horaria:** Venezuela (GMT-4)

```typescript
formatDateVenezuela("2025-12-04T20:30:00Z")
// → "04/12/2025"

formatDateVenezuela(new Date())
// → "04/12/2025"

formatDateVenezuela(1701715800000)
// → "04/12/2025"
```

### `formatDateTimeVenezuela(date)`
- **Entrada:** `Date | string | number`
- **Salida:** `"04/12/2025 8:30 PM"` (DD/MM/YYYY h:MM AM/PM)
- **Uso:** Mostrar fecha + hora
- **Zona Horaria:** Venezuela (GMT-4)

```typescript
formatDateTimeVenezuela("2025-12-04T20:30:00Z")
// → "04/12/2025 8:30 PM"
```

### `formatTimeVenezuela(date)`
- **Entrada:** `Date | string | number`
- **Salida:** `"8:30 PM"` (h:MM AM/PM)
- **Uso:** Mostrar solo hora
- **Zona Horaria:** Venezuela (GMT-4)

```typescript
formatTimeVenezuela("2025-12-04T20:30:00Z")
// → "8:30 PM"
```

### `formatDateLongVenezuela(date)`
- **Entrada:** `Date | string | number`
- **Salida:** `"jueves, 4 de diciembre de 2025"` (Completo en español)
- **Uso:** Mostrar de forma legible
- **Zona Horaria:** Venezuela (GMT-4)

```typescript
formatDateLongVenezuela("2025-12-04T20:30:00Z")
// → "jueves, 4 de diciembre de 2025"
```

### `formatDateShortVenezuela(date)`
- **Entrada:** `Date | string | number`
- **Salida:** `"Jue, 4 Dic"` (Comprimido)
- **Uso:** Mostrar en espacios pequeños
- **Zona Horaria:** Venezuela (GMT-4)

```typescript
formatDateShortVenezuela("2025-12-04T20:30:00Z")
// → "Jue, 4 Dic"
```

## 🔧 Patrones Comunes

### Patrón 1: Mostrar "Hace X tiempo"
```typescript
function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const target = new Date(date)
  const diff = now.getTime() - target.getTime()
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (seconds < 60) return 'Hace unos segundos'
  if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
  if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`
  return `Hace ${days} día${days > 1 ? 's' : ''}`
}
```

### Patrón 2: Validar que fecha no es en el futuro
```typescript
function isFutureDate(dateString: string): boolean {
  const date = new Date(dateString)
  return date > new Date()
}

// Uso
if (isFutureDate("2025-12-05")) {
  // Error: la fecha no puede ser en el futuro
}
```

### Patrón 3: Obtener inicio y fin del día
```typescript
function getStartOfDay(date: Date = new Date()): Date {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: VENEZUELA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  
  const iso = getTodayVenezuelaISO()
  return new Date(`${iso}T00:00:00`)
}

function getEndOfDay(date: Date = new Date()): Date {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: VENEZUELA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  
  const iso = getTodayVenezuelaISO()
  return new Date(`${iso}T23:59:59`)
}
```

## ⚠️ Errores Comunes

### ❌ INCORRECTO: Usar `toISOString()`
```typescript
// ❌ Retorna UTC, no Venezuela
const date = new Date().toISOString() // "2025-12-04T00:30:00Z"
```

### ✅ CORRECTO: Usar funciones de utilidad
```typescript
// ✅ Retorna con offset Venezuela
const date = getTodayVenezuelaISO() // "2025-12-04"
```

---

### ❌ INCORRECTO: Asumir que `new Date(string)` usa zona horaria local
```typescript
// ❌ JavaScript asume UTC para strings ISO
const date = new Date("2025-12-04") // Interpreta como UTC
```

### ✅ CORRECTO: Usar funciones formateadas
```typescript
// ✅ Usa la zona horaria correcta
const formatted = formatDateVenezuela("2025-12-04") // "04/12/2025"
```

---

### ❌ INCORRECTO: Confiar en formato de string
```typescript
// ❌ El formato puede variar por locale
const parts = formatter.format(date) // Depende del locale
```

### ✅ CORRECTO: Usar `formatToParts()`
```typescript
// ✅ Componentes estructurados
const parts = formatter.formatToParts(date) 
// → [{type: 'year', value: '2025'}, ...]
```

## 🧪 Testing

### Validar que una fecha está en rango
```typescript
function isDateInRange(date: Date, from: Date, to: Date): boolean {
  return date >= from && date <= to
}

// Test
const today = new Date(getTodayVenezuelaISO())
const yesterday = new Date(today)
yesterday.setDate(yesterday.getDate() - 1)
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

console.assert(
  isDateInRange(today, yesterday, tomorrow),
  'Hoy debe estar entre ayer y mañana'
)
```

### Verificar zona horaria
```typescript
function verifyVenezuelaTimezone() {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: VENEZUELA_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  
  console.log('Venezuela time:', formatter.format(now))
  console.log('UTC time:', now.toISOString())
}
```

## 📖 Documentación Completa

Para información más detallada, ver:
- `TIMEZONE_SOLUTION.md` - Solución técnica completa
- `TIMEZONE_VALIDATION_CHECKLIST.md` - Checklist de validación
- `pwa/frontend/src/utils/dateUtils.ts` - Código fuente
- `pwa/frontend/README.md` - Sección de Zona Horaria

## 💡 Tips

1. **Siempre usa funciones de utilidad** - No hagas manipulación manual de fechas
2. **Almacena en UTC** - La base de datos usa TIMESTAMPTZ en UTC
3. **Formatea al mostrar** - Usa funciones de formato para presentación al usuario
4. **Valida en JavaScript** - No confíes en formato de string de navegador
5. **Prueba en diferentes zonas** - Si trabajas con múltiples zonas horarias

## 🆘 Troubleshooting

| Problema | Solución |
|----------|----------|
| Fecha off by 1 día | Verifica que estés usando la función correcta (getTodayVenezuelaISO vs formatDateVenezuela) |
| Hora en 12h pero necesitas 24h | Usa `getCurrentTimeVenezuela()` que retorna 24h |
| Cambios no persisten | Asegúrate de enviar string ISO al backend (ej: "2025-12-04") |
| Consola muestra "undefined" | Verifica que importaste la función de `dateUtils.ts` |
| Diferentes horas en navegadores | Verifica timezone del SO, Javascript siempre usa la correcta |

---

**Version:** 1.0  
**Última Actualización:** 4 de Diciembre de 2025  
**Zona Horaria:** America/Caracas (GMT-4)
