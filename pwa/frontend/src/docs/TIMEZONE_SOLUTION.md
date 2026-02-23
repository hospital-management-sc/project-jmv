# Solución de Zona Horaria - Venezuela (GMT-4)

## Problema Identificado

El sistema inicialmente estaba usando la zona horaria UTC en lugar de la zona horaria local de Venezuela (America/Caracas, GMT-4). Esto causaba que las fechas de admisión se guardaran y mostraran incorrectamente con 4 horas de diferencia.

**Ejemplo del problema:**
- Hora real en Venezuela: 4 de diciembre de 2025, 8:17 PM
- Hora mostrada en el sistema: 5 de diciembre de 2025, 12:17 AM (UTC)

## Solución Implementada

### 1. Utilidades de Fecha (`src/utils/dateUtils.ts`)

Se implementaron funciones especializadas que usan `Intl.DateTimeFormat` con la opción `timeZone: 'America/Caracas'` para garantizar que todas las operaciones de fecha/hora respeten la zona horaria local.

#### Función clave: `getTodayVenezuelaISO()`

```typescript
export function getTodayVenezuelaISO(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: VENEZUELA_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  
  const parts = formatter.formatToParts(now);
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  
  return `${year}-${month}-${day}`; // Formato: YYYY-MM-DD
}
```

**¿Por qué `formatToParts()`?**
- Más explícito: Obtiene componentes individuales de la fecha de forma estructurada
- Más confiable: No depende del formato de string que pueda variar por locale
- Más mantenible: El código es claro sobre qué componentes se están extrayendo

#### Función: `getCurrentTimeVenezuela()`

```typescript
export function getCurrentTimeVenezuela(): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: VENEZUELA_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  const parts = formatter.formatToParts(now);
  const hour = parts.find(p => p.type === 'hour')?.value;
  const minute = parts.find(p => p.type === 'minute')?.value;
  
  return `${hour}:${minute}`; // Formato: HH:MM
}
```

### 2. Integración en el Frontend

El componente `AdminDashboard` utiliza estas funciones para inicializar los campos de fecha y hora:

```typescript
// En AdminDashboard.tsx
const admissionDate = getTodayVenezuelaISO(); // "2025-12-04"
const admissionTime = getCurrentTimeVenezuela(); // "20:30"
```

### 3. Base de Datos

- Las fechas se guardan en PostgreSQL como `TIMESTAMPTZ` (timestamp con zona horaria)
- PostgreSQL automáticamente convierte a UTC para almacenamiento
- El backend y frontend convierten de/a Venezuela timezone según sea necesario

## Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│ Frontend (Navegador del Usuario)                                │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ getTodayVenezuelaISO() → "2025-12-04" (GM-4)               │ │
│ │ Envía al backend en JSON                                    │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                          ↓ HTTP POST
┌─────────────────────────────────────────────────────────────────┐
│ Backend (Node.js/Express)                                       │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Recibe: { admisionFecha: "2025-12-04" }                    │ │
│ │ Convierte a Date() → Interpreta como UTC                   │ │
│ │ Envía a Prisma                                              │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                          ↓ Query SQL
┌─────────────────────────────────────────────────────────────────┐
│ PostgreSQL Database                                             │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Guarda como TIMESTAMPTZ en UTC                             │ │
│ │ (Automáticamente convierte con offset GMT-4)               │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                          ↓ Query SELECT
┌─────────────────────────────────────────────────────────────────┐
│ Backend                                                         │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Recibe TIMESTAMPTZ, lo convierte a Date en JS             │ │
│ │ Envía al frontend en ISO string                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                          ↓ HTTP GET
┌─────────────────────────────────────────────────────────────────┐
│ Frontend                                                        │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Recibe ISO string, lo convierte a Date                     │ │
│ │ Usa formatDateVenezuela() para mostrar en GMT-4            │ │
│ │ Muestra al usuario en zona horaria correcta                │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Validación

Para verificar que la zona horaria está configurada correctamente:

```bash
cd pwa/frontend
ts-node test-timezone.ts
```

**Salida esperada:**
```
=== Validación de Timezone Venezuela ===

UTC actual: 2025-12-04T00:17:30.000Z
Formato local del sistema: Thu Dec 04 2025 20:17:30 GMT-0400 (...)

✓ Fecha en Venezuela (ISO): 2025-12-04
✓ Hora en Venezuela (HH:MM): 20:17

✓ Zona horaria configurada: America/Caracas (GMT-4)
✓ Locale configurado: es-VE
```

## Referencia de Funciones Disponibles

| Función | Entrada | Salida | Uso |
|---------|---------|--------|-----|
| `getTodayVenezuelaISO()` | (ninguna) | "2025-12-04" | Input type="date" |
| `getCurrentTimeVenezuela()` | (ninguna) | "20:30" | Input type="time" |
| `formatDateVenezuela()` | Date\|string | "04/12/2025" | Mostrar en tablas |
| `formatDateTimeVenezuela()` | Date\|string | "04/12/2025 8:30 PM" | Mostrar fecha+hora |
| `formatTimeVenezuela()` | Date\|string | "8:30 PM" | Mostrar solo hora |
| `formatDateLongVenezuela()` | Date\|string | "Jueves, 4 de diciembre de 2025" | Mostrar legible |
| `formatDateShortVenezuela()` | Date\|string | "Jue, 4 Dic" | Mostrar comprimido |

## Notas Importantes

1. **Almacenamiento**: Todas las fechas se almacenan en UTC en PostgreSQL usando tipo `TIMESTAMPTZ`
2. **Transmisión**: Las fechas se transmiten entre frontend/backend como strings ISO (2025-12-04)
3. **Visualización**: El frontend siempre formatea usando `timeZone: 'America/Caracas'`
4. **Offset**: Venezuela usa GMT-4 (UTC-4) sin cambio de horario de verano
5. **Locale**: Se usa 'es-VE' (Español de Venezuela) para nombres de días/meses

## Problemas Previos y Por Qué Se Resolvieron

### Problema 1: Usar `toISOString()`
❌ **Incorrecto:**
```javascript
new Date().toISOString() // "2025-12-04T00:30:00Z" (UTC, no Venezuela)
```

✅ **Correcto:**
```javascript
getTodayVenezuelaISO() // "2025-12-04" (Con offset GMT-4 aplicado)
```

### Problema 2: Usar `formatter.format()`
❌ **Menos confiable:**
```javascript
formatter.format(date) // Depende del formato de string que varía por locale
```

✅ **Más confiable:**
```javascript
formatter.formatToParts(date) // Obtiene componentes estructurados
```

## Testing

Para pruebas manuales de la funcionalidad de timezone:

1. Crear un paciente con la fecha de hoy
2. Verificar en la base de datos que se guardó correctamente
3. Verificar en el dashboard que se muestra la fecha correcta
4. Verificar que al editar se pre-llena con la fecha correcta

## Referencias

- [MDN: Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)
- [MDN: TimeZone Support](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#the_timeZone_option)
- [PostgreSQL: Timestamp Types](https://www.postgresql.org/docs/current/datatype-datetime.html)
- [Venezuela Timezone Database](https://en.wikipedia.org/wiki/Time_in_Venezuela)
