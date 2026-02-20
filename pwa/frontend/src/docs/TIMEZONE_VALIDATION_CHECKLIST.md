# Checklist de Validación - Solución de Timezone

## ✅ Pre-Requisitos
- [ ] Base de datos PostgreSQL ejecutándose
- [ ] Backend (API Express) ejecutándose en puerto 3001
- [ ] Frontend (Vite) ejecutándose en puerto 5173
- [ ] Navegador con acceso a http://localhost:5173

## ✅ Validación Técnica

### 1. Verificar Funciones de Utilidad
```bash
# En la carpeta frontend
cd pwa/frontend

# Ejecutar script de validación de timezone
ts-node test-timezone.ts
```

**Resultado esperado:**
```
=== Validación de Timezone Venezuela ===

UTC actual: 2025-12-04T00:30:00.000Z
Formato local del sistema: Thu Dec 04 2025 20:30:00 GMT-0400

✓ Fecha en Venezuela (ISO): 2025-12-04
✓ Hora en Venezuela (HH:MM): 20:30

✓ Zona horaria configurada: America/Caracas (GMT-4)
✓ Locale configurado: es-VE
```

### 2. Verificar Imports en AdminDashboard
- [ ] Las funciones `getTodayVenezuelaISO` y `getCurrentTimeVenezuela` están importadas desde `dateUtils.ts`
- [ ] No hay errores de compilación TypeScript

### 3. Verificar Errores en Consola del Navegador
- [ ] Abrir DevTools (F12)
- [ ] Ir a la pestaña "Console"
- [ ] No debe haber errores rojos relacionados con fecha/hora
- [ ] Las funciones deben estar disponibles globalmente si accedes a `window`

## ✅ Validación Funcional

### 4. Prueba de Registro de Paciente
1. Navegar a `/admin` (Dashboard de Administración)
2. Hacer clic en "Registrar Nuevo Paciente"
3. **Verificar que los campos de fecha/hora están pre-llenados:**
   - Campo "Fecha de Admisión" debe mostrar la fecha actual en Venezuela (YYYY-MM-DD)
   - Campo "Hora de Admisión" debe mostrar la hora actual en Venezuela (HH:MM)
4. Completar el formulario de registro
5. **Verificar que se guarda correctamente:**
   - Los datos deben persistir correctamente en la base de datos
   - La fecha y hora deben corresponder a la zona horaria de Venezuela

### 5. Prueba de Visualización en Dashboard
1. Después de registrar un paciente
2. Ver el dashboard estadístico
3. **Verificar que:**
   - Las fechas se muestran en formato correcto (DD/MM/YYYY)
   - Las horas se muestran en formato 12h (con AM/PM)
   - La zona horaria es claramente Venezuela (GMT-4)

### 6. Prueba de Edición de Paciente
1. Hacer clic en editar un paciente existente
2. **Verificar que:**
   - Los campos de fecha/hora están pre-llenados con los valores guardados
   - La fecha mostrada es la correcta en zona horaria de Venezuela
   - Al cambiar los valores, se guardan correctamente

## ✅ Validación de Base de Datos

### 7. Verificar Timestamp en PostgreSQL
```sql
-- En pgAdmin o cualquier cliente PostgreSQL
SELECT 
  id,
  ci,
  nombre,
  fechaAdmision,
  horaAdmision,
  EXTRACT(TIMEZONE_HOUR FROM fechaAdmision) as offset_timezone
FROM pacientes
ORDER BY fechaAdmision DESC
LIMIT 5;
```

**Resultado esperado:**
```
| id | ci       | nombre     | fechaAdmision           | horaAdmision | offset_timezone |
|----|----------|------------|-------------------------|--------------|-----------------|
| 1  | 12345678 | Juan Pérez | 2025-12-04 20:30:00-04  | 20:30        | -4              |
```

- El timestamp debe tener offset `-04` (GMT-4)
- NO debe ser `+00` (UTC) ni otro offset

## ✅ Pruebas de Casos Edge

### 8. Cambio de Medianoche
- [ ] Registrar un paciente a las 23:59 (11:59 PM)
- [ ] Verificar que la fecha no salta al día siguiente
- [ ] La fecha debe coincidir con la zona horaria local

### 9. Cambio de Mes
- [ ] Registrar un paciente el último día del mes (ej: 31/12 o 28/02)
- [ ] Verificar que no hay problemas de overflow
- [ ] La fecha debe ser correcta

### 10. Diferentes Navegadores
- [ ] Probar en Chrome
- [ ] Probar en Firefox
- [ ] Probar en Safari (si está disponible)
- [ ] Verificar que la zona horaria es consistente en todos

## ✅ Validación Visual

### 11. Verificar Campos Pre-llenados
Pantalla: Formulario de Registro de Paciente

```
┌────────────────────────────────────────┐
│ Fecha de Admisión: [2025-12-04]       │ ← Hoy en Venezuela (GMT-4)
├────────────────────────────────────────┤
│ Hora de Admisión:  [20:30]             │ ← Hora actual en Venezuela
└────────────────────────────────────────┘
```

- [ ] La fecha muestra el día actual en Venezuela
- [ ] La hora muestra la hora actual en Venezuela
- [ ] El formato es consistente

### 12. Verificar Dashboard Stats
Pantalla: Dashboard de Administración

```
┌─────────────────────────────────────┐
│ Total de Pacientes: 5               │
│ (Militares: 2, Afiliados: 2, PNA: 1)│
├─────────────────────────────────────┤
│ Citas Programadas Hoy: 0            │
├─────────────────────────────────────┤
│ Registros de Auditoría: 42          │
└─────────────────────────────────────┘
```

- [ ] Los números se actualizan correctamente
- [ ] No hay errores en la consola

## ✅ Documentación

### 13. Revisar Documentación
- [ ] Leer `TIMEZONE_SOLUTION.md` para entender la solución
- [ ] Entender por qué se usa `formatToParts()` en lugar de `format()`
- [ ] Revisar el flujo de datos de fecha/hora en el sistema

## 📋 Resumen de Resultados

| Prueba | Estado | Notas |
|--------|--------|-------|
| 1. Funciones Utilidad | ✓/✗ | |
| 2. Imports | ✓/✗ | |
| 3. Console Errors | ✓/✗ | |
| 4. Registro Paciente | ✓/✗ | |
| 5. Visualización Dashboard | ✓/✗ | |
| 6. Edición Paciente | ✓/✗ | |
| 7. Base de Datos | ✓/✗ | |
| 8. Medianoche | ✓/✗ | |
| 9. Cambio Mes | ✓/✗ | |
| 10. Navegadores | ✓/✗ | |
| 11. Pre-llenado | ✓/✗ | |
| 12. Stats Dashboard | ✓/✗ | |
| 13. Documentación | ✓/✗ | |

## 🔧 Troubleshooting

### Problema: La fecha no está pre-llenada
- [ ] Verificar que `getTodayVenezuelaISO()` está siendo importada
- [ ] Verificar que se está llamando en el inicializador del formulario
- [ ] Revisar console del navegador para errores

### Problema: La fecha mostrada es incorrecta
- [ ] Verificar que la zona horaria del servidor es correcta
- [ ] Verificar que la zona horaria del navegador es correcta
- [ ] Ejecutar `test-timezone.ts` para validar funciones

### Problema: La hora no es 24h
- [ ] Verificar que `hour12: false` está configurado en la función
- [ ] Limpiar cache del navegador (Ctrl+Shift+Delete)
- [ ] Hacer refresh de la página (F5)

### Problema: Errores en TypeScript
- [ ] Ejecutar `npm run lint` para ver todos los errores
- [ ] Verificar que los imports están correctos
- [ ] Asegurarse que las funciones están exportadas desde `dateUtils.ts`

## 🚀 Siguiente Paso

Una vez que todas las pruebas pasen:
1. Crear un commit con los cambios
2. Notificar al equipo que la solución de timezone está lista
3. Solicitar feedback del usuario sobre el comportamiento de fechas

---

**Documento Actualizado:** 2025-12-04
**Versión:** 1.0
**Estado:** Listo para Validación
