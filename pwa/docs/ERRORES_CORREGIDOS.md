# 🔧 Errores Corregidos - Formato de Hospitalización

**Fecha:** 14 de Diciembre 2025
**Problemas Resueltos:** 2 errores críticos

---

## 📋 Resumen de Errores

### ❌ Error 1: 500 Internal Server Error al guardar Signos Vitales

**Síntoma:** 
```
Error al agregar signos vitales: Error: API Error: 500 Internal Server Error
    at request (api.ts:70:13)
    at async Module.addSignosVitales (formatoHospitalizacion.service.ts:322:12)
    at async handleSubmit (Seccion2_SignosVitales.tsx:60:9)
```

**Causa Raíz:**
- El esquema Prisma define `fecha` y `hora` como tipos `DateTime`
- El frontend enviaba estos campos como **strings** (`"YYYY-MM-DD"` y `"HH:MM"`)
- Prisma no podía parsear los strings directamente, causando validación fallida

**Solución Implementada:**

✅ **Backend** - [formatoHospitalizacion.ts](src/controllers/formatoHospitalizacion.ts)
- Modificar `addSignosVitales()` para convertir strings a DateTime antes de guardar:
  ```typescript
  if (typeof data.fecha === 'string') {
    processedData.fecha = new Date(data.fecha); // "YYYY-MM-DD" → Date
  }
  if (typeof data.hora === 'string') {
    const [hours, minutes] = data.hora.split(':');
    const timeDate = new Date();
    timeDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    processedData.hora = timeDate; // "HH:MM" → DateTime
  }
  ```
- También convertir campos numéricos: `taSistolica`, `taDiastolica`, `tam`, `fc`, `fr`, `temperatura`, `spo2`
- Actualizar `updateSignosVitales()` con la misma lógica de conversión
- Agregar `details` al error 500 para debugging más fácil

✅ **Orden de Rutas** - [formatoHospitalizacion.ts](src/routes/formatoHospitalizacion.ts)
- Reordenar rutas para evitar conflictos: **específicas antes de genéricas**
  - **ANTES (❌ INCORRECTA):**
    ```typescript
    router.post('/:id/signos-vitales', ...);  // Acepta /:id/signos-vitales
    router.put('/signos-vitales/:id', ...);   // NUNCA se alcanza (/:id atrapa primero)
    ```
  - **DESPUÉS (✅ CORRECTA):**
    ```typescript
    router.put('/signos-vitales/:id', ...);   // Específica, se evalúa primero
    router.delete('/signos-vitales/:id', ...);
    router.post('/:id/signos-vitales', ...);  // Genérica, se evalúa después
    ```

**Archivos Modificados:**
- ✅ `backend/src/controllers/formatoHospitalizacion.ts` - Conversión de tipos
- ✅ `backend/src/routes/formatoHospitalizacion.ts` - Reordenamiento de rutas

---

### ❌ Error 2: 429 Too Many Requests al cargar Pacientes Hospitalizados

**Síntoma:**
```
Error: Too Many Requests
    at request (api.ts:70:13)
    at async Object.listarAdmisionesActivas (admisiones.service.ts:121:12)
    at async cargarPacientes (HospitalizedPatients.tsx:34:24)
```

**Causa Raíz:**
- Backend tiene rate limiter configurado: **100 requests por 15 minutos**
- El componente `HospitalizedPatients` llamaba a `cargarPacientes()` cada vez que cambiaba el filtro `servicioFiltro`
- Sin debounce, múltiples cambios rápidos disparaban muchas solicitudes repetidas

**Solución Implementada:**

✅ **Frontend Debounce** - [HospitalizedPatients.tsx](src/pages/DoctorDashboard/components/HospitalizedPatients.tsx)
- Agregar debounce de **500ms** al useEffect del filtro:
  ```typescript
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    
    debounceTimerRef.current = setTimeout(() => {
      cargarPacientes(); // Solo se ejecuta 500ms después del último cambio
    }, 500);
    
    return () => clearTimeout(debounceTimerRef.current);
  }, [servicioFiltro]);
  ```
- Convertir `cargarPacientes` a `useCallback` para memoización
- Mejorar mensajes de error: mostrar "⏳ Demasiadas solicitudes. Por favor, intente nuevamente en unos momentos." para errores 429

**Archivos Modificados:**
- ✅ `frontend/src/pages/DoctorDashboard/components/HospitalizedPatients.tsx` - Debounce

---

## 🔌 Validación de Tipo - Otros Errores Corregidos

Durante la compilación del frontend, se detectaron y corrigieron errores de tipo:

✅ **RegistrarAdmision.tsx**
- Remover `useEffect` no utilizado que causaba warning

✅ **PatientHistoryView.tsx**
- Actualizar interfaz `Paciente` para incluir relaciones: `admisiones`, `encuentros`, `citas`, `personalMilitar`, `afiliado`

✅ **PatientHistory.tsx**
- Convertir `patient.id` (string) a `Number(patient.id)` para llamadas a servicio

✅ **pacientes.service.ts**
- Expandir interfaz `Paciente` con propiedades de relaciones opcionales

✅ **HospitalizedPatients.tsx**
- Cambiar `NodeJS.Timeout` a `ReturnType<typeof setTimeout>` (compatible con navegadores)

---

## 📦 Compilación Final

```bash
# Backend
✅ npm run build  (TypeScript compilation successful)

# Frontend  
✅ npm run build  (Vite build successful)
   - 219 modules transformed
   - dist/index.html: 1.24 kB
   - dist/assets: CSS 135.97 kB, JS 672.48 kB
   - Build time: 6.37s
```

---

## ✅ Pruebas Recomendadas

### Test 1: Guardar Signos Vitales ✓
1. Navegar a `DoctorDashboard` → `Pacientes Hospitalizados`
2. Hacer click en un paciente
3. Ir a `Formato de Hospitalización` → Sección 2: Signos Vitales
4. Llenar formulario con datos (TA, FC, FR, Temperatura, SPO2)
5. Hacer click en "Guardar"
6. **Esperado:** Registro se guarda sin error 500

### Test 2: Cargar Pacientes sin Error 429 ✓
1. Navegar a `DoctorDashboard`
2. Cambiar rapidamente entre filtros de servicio (Medicina, Cirugía, etc.)
3. **Esperado:** No aparece error "Too Many Requests", los pacientes cargan correctamente

### Test 3: Mostrar Signos Vitales Guardados ✓
1. Después de guardar signos vitales, recarga la página
2. Navega nuevamente al paciente y formato
3. **Esperado:** Los datos se muestran en la tabla de signos vitales registrados

---

## 🔍 Configuración del Rate Limiter

Para desarrollo, si necesitas desactivar o aumentar el límite:

**Archivo:** `backend/src/index.ts`
```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,                  // 100 requests por ventana (aumentar a 500 si es necesario)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter); // Aplica a todas las rutas /api/
```

Para desactivar completamente en desarrollo:
```typescript
// Comentar o remover la línea:
// app.use('/api/', limiter);
```

---

## 📌 Próximos Pasos

- [ ] Ejecutar test suite completo
- [ ] Probar con datos reales de hospitalización
- [ ] Validar que el timeline muestra correctamente los signos vitales guardados
- [ ] Considerar implementar refresh tokens para evitar expiración de sesión en futuro

---

**Estado:** ✅ COMPLETADO
**Compilación:** ✅ SIN ERRORES
**Ready para Testing:** ✅ SÍ
