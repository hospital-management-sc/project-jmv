# Fix: Pacientes de Emergencia Aparecen Como Hospitalizados

## 🐛 Problema Reportado

Los pacientes registrados a través del flujo "🚨 Nuevo Paciente en Emergencia" aparecían en el listado de "🏥 Pacientes Hospitalizados Actualmente" **incluso cuando NO se marcaba el check** `¿Requiere hospitalización?` en la sección "3. IMPRESIÓN DIAGNÓSTICA" del formato de emergencia.

## 🔍 Análisis del Problema

Se identificaron **DOS bugs críticos**:

### Bug #1: Endpoint Faltante ❌

El frontend intentaba guardar el formato de emergencia mediante:
```typescript
POST http://localhost:3001/api/formato-emergencia
```

**Pero esta ruta NO existía en el backend**, causando que:
- El formato de emergencia **NUNCA se guardara** en la base de datos
- El campo `requiereHospitalizacion` siempre quedara en `null`/`undefined`
- No había forma de diferenciar si un paciente de emergencia necesitaba hospitalización

### Bug #2: Filtro Incorrecto en Lista de Hospitalizados ⚠️

En [admisiones.ts](../src/controllers/admisiones.ts), línea ~548:

```typescript
// Filtrar admisiones: excluir emergencias que NO requieran hospitalización
const admisionesFiltradas = admisiones.filter((admision) => {
  if (admision.tipo === 'EMERGENCIA') {
    return admision.formatoEmergencia?.requiereHospitalizacion === true;
  }
  return true;
});
```

**Problema**: Cuando `formatoEmergencia` es `null` (porque nunca se guardó), la expresión:
```typescript
admision.formatoEmergencia?.requiereHospitalizacion === true
```

Devuelve `false`, pero **la admisión EMERGENCIA ya está en la lista inicial** porque se filtra solo por:
```typescript
tipo: {
  in: ['EMERGENCIA', 'HOSPITALIZACION', 'UCI', 'CIRUGIA'],
}
```

Entonces **TODAS** las admisiones de tipo `EMERGENCIA` con estado `ACTIVA` se incluían, sin importar si requerían hospitalización.

Además, había un bug en el response:
```typescript
return res.status(200).json({
  total: admisiones.length,  // ❌ Total SIN filtrar
  admisiones: admisionesSerializadas, // ✅ Ya filtrado
});
```

## ✅ Solución Implementada

### 1. Creado Controlador de Formato de Emergencia

**Archivo**: [`src/controllers/formatoEmergencia.ts`](../src/controllers/formatoEmergencia.ts)

Funciones implementadas:
- `crearOActualizarFormatoEmergencia()` - POST /api/formato-emergencia
  - Valida que la admisión sea de tipo EMERGENCIA
  - Crea o actualiza el formato según si ya existe
  - Guarda el campo crítico `requiereHospitalizacion`
  
- `obtenerFormatoEmergencia()` - GET /api/formato-emergencia/:admisionId
  - Recupera el formato con datos del paciente y admisión

### 2. Creada Ruta de Formato de Emergencia

**Archivo**: [`src/routes/formatoEmergencia.ts`](../src/routes/formatoEmergencia.ts)

Define las rutas:
```typescript
POST   /api/formato-emergencia           // Crear/Actualizar formato
GET    /api/formato-emergencia/:admisionId  // Obtener formato
```

### 3. Registrada Ruta en el Servidor

**Archivo**: [`src/index.ts`](../src/index.ts)

Se agregó:
```typescript
import formatoEmergenciaRoutes from './routes/formatoEmergencia';

app.use('/api/formato-emergencia', formatoEmergenciaRoutes);
```

### 4. Corregido Bug del Total en Lista de Hospitalizados

**Archivo**: [`src/controllers/admisiones.ts`](../src/controllers/admisiones.ts), línea ~579

**ANTES**:
```typescript
return res.status(200).json({
  total: admisiones.length,  // ❌ Total incorrecto
  admisiones: admisionesSerializadas,
});
```

**AHORA**:
```typescript
return res.status(200).json({
  total: admisionesFiltradas.length,  // ✅ Total correcto (post-filtro)
  admisiones: admisionesSerializadas,
});
```

## 🔄 Flujo Corregido

### Antes (❌ Incorrecto)
1. Usuario completa formato de emergencia
2. Frontend intenta POST a `/api/formato-emergencia` → **404 Not Found**
3. Formato nunca se guarda en BD
4. `requiereHospitalizacion` queda en `null`
5. Filtro en lista de hospitalizados **NO funciona**
6. Paciente aparece como hospitalizado (aunque no lo requiera)

### Ahora (✅ Correcto)
1. Usuario completa formato de emergencia
2. Frontend hace POST a `/api/formato-emergencia` → **200 OK**
3. Formato se guarda correctamente en BD
4. `requiereHospitalizacion` se guarda con el valor del checkbox
5. Filtro en lista de hospitalizados **funciona correctamente**:
   - Si `requiereHospitalizacion = true` → Aparece en lista
   - Si `requiereHospitalizacion = false` → NO aparece en lista
6. Lista de hospitalizados refleja la realidad clínica

## 📊 Comportamiento Esperado

### Lista "🏥 Pacientes Hospitalizados Actualmente"

Debe mostrar SOLO:
- ✅ Admisiones tipo `HOSPITALIZACION`, `UCI`, `CIRUGIA` (siempre hospitalizados)
- ✅ Admisiones tipo `EMERGENCIA` **CON** `requiereHospitalizacion = true`
- ❌ Admisiones tipo `EMERGENCIA` **SIN** `requiereHospitalizacion = true`
- ❌ Admisiones tipo `CONSULTA_EXTERNA` (nunca hospitalizados)

## 🧪 Testing

Para validar la corrección:

1. Reiniciar el servidor backend
2. Crear nuevo paciente de emergencia
3. Completar formato de emergencia
4. **Sin marcar** "¿Requiere hospitalización?"
5. Guardar formato
6. Verificar que el paciente **NO aparece** en lista de hospitalizados
7. Editar formato y **marcar** "¿Requiere hospitalización?"
8. Guardar
9. Verificar que el paciente **SÍ aparece** en lista de hospitalizados

## 📝 Notas Técnicas

- El formato de emergencia usa **upsert logic** (create or update)
- Relación `FormatoEmergencia` ↔ `Admision` es **1:1** (admisionId es unique)
- El campo `requiereHospitalizacion` es **Boolean con default false**
- La validación asegura que solo admisiones de tipo `EMERGENCIA` tengan formato de emergencia

## 🎯 Impacto

- ✅ Corrige lógica de negocio crítica (hospitalización vs. emergencia ambulatoria)
- ✅ Evita confusión en el personal médico y administrativo
- ✅ Mejora precisión de reportes y estadísticas
- ✅ Permite distinguir emergencias que requieren cama vs. las que no

---

**Fecha de corrección**: 14 de diciembre de 2025
**Reportado por**: Usuario (testing de flujo completo)
**Corregido por**: GitHub Copilot
