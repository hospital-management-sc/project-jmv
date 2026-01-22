# ✅ Checklist de Implementación - Sistema de Disponibilidad Médicos

**Proyecto:** Hospital Management PWA  
**Requerimiento:** Disponibilidad y Horarios de Médicos  
**Responsables:** 2 Desarrolladores (Backend + Frontend)  
**Fecha Inicio:** Enero 22, 2026  

---

## 📋 FASE 1: PREPARACIÓN (0.5 días)

### Planning y Setup
- [ ] Ambos devs revisan documentación completa
  - `REQUERIMIENTO_GESTION_DISPONIBILIDAD_MEDICOS.md`
  - `BRIEF_DISPONIBILIDAD_MEDICOS.md`
  - `CODIGO_REFERENCIA_DISPONIBILIDAD.md`
- [ ] Dev 1 (Backend) crea rama: `feature/medico-disponibilidad-backend`
- [ ] Dev 2 (Frontend) crea rama: `feature/medico-disponibilidad-frontend`
- [ ] Aclarar preguntas de negocio con stakeholders:
  - [ ] ¿Horarios médicos ya existen en BD?
  - [ ] ¿Capacidad típica por médico?
  - [ ] ¿Qué hacer con citas existentes sin médico?
  - [ ] ¿Tiempo máximo de implementación?

---

## 🗄️ FASE 2: DATABASE (Dev 1 - Backend)

### Migrations
- [ ] Crear migration `CreateHorarioMedico`
  - [ ] Tabla `HorarioMedico` con campos correctos
  - [ ] Índices creados
  - [ ] Foreign keys establecidas
- [ ] Crear migration `ModificarCitaMedicoRequerido`
  - [ ] `Cita.medicoId` cambiar a NOT NULL
  - [ ] Foreign key agregado si no existe
  - [ ] Índice en medicoId

### Schema Prisma
- [ ] Agregar modelo `HorarioMedico` a `schema.prisma`
- [ ] Actualizar relaciones en modelo `Usuario`
- [ ] Actualizar relaciones en modelo `Cita`
- [ ] Ejecutar `prisma format`
- [ ] Ejecutar migrations: `prisma migrate deploy`

### Data Seeding
- [ ] Crear script seed con datos de ejemplo
  - [ ] 2-3 médicos por especialidad (15 especialidades)
  - [ ] Horarios variados (algunos L-V, otros con días específicos)
  - [ ] Capacidades diferentes (12-20 pacientes/día)
- [ ] Ejecutar seed: `npm run seed`
- [ ] Validar datos en DB: `prisma studio`

---

## 🛠️ FASE 3: BACKEND - SERVICIOS (Dev 1 - Backend)

### Crear Servicio de Disponibilidad
- [ ] Crear archivo `src/services/disponibilidad.ts`
  - [ ] `obtenerMedicosPorEspecialidad()`
    - [ ] Retorna lista de médicos con horarios
    - [ ] Filtra activos
  - [ ] `obtenerDisponibilidadMedico()`
    - [ ] Valida día de la semana
    - [ ] Cuenta citas programadas
    - [ ] Calcula espacios disponibles
  - [ ] `obtenerProximosDiasDisponibles()`
    - [ ] Retorna 7 próximos días
    - [ ] Excluye fines de semana
    - [ ] Incluye espacios disponibles
  - [ ] `validarDisponibilidadParaCita()`
    - [ ] Verifica médico existe
    - [ ] Verifica médico atiende especialidad
    - [ ] Verifica médico atiende día
    - [ ] Verifica hora en rango
    - [ ] Verifica capacidad

### Testing del Servicio
- [ ] Probar `obtenerMedicosPorEspecialidad()` manualmente
- [ ] Probar `obtenerDisponibilidadMedico()` con casos:
  - [ ] Día que sí atiende
  - [ ] Día que no atiende
  - [ ] Sin capacidad disponible
  - [ ] Con capacidad disponible
- [ ] Probar `validarDisponibilidadParaCita()` con casos:
  - [ ] Validación exitosa
  - [ ] Médico no existe
  - [ ] No atiende especialidad
  - [ ] No atiende día
  - [ ] Hora fuera de rango
  - [ ] Sin capacidad

---

## 🔌 FASE 4: BACKEND - ENDPOINTS (Dev 1 - Backend)

### Controlador de Citas
- [ ] Agregar función `obtenerMedicosPorEspecialidad()`
  - [ ] GET `/api/medicos/especialidad/:especialidad`
  - [ ] Validar parámetro
  - [ ] Manejo de errores
  - [ ] Respuesta JSON formateada
- [ ] Agregar función `obtenerDisponibilidad()`
  - [ ] GET `/api/medicos/:medicoId/disponibilidad`
  - [ ] Validar parámetros (fecha, especialidad)
  - [ ] Formato de fecha YYYY-MM-DD
  - [ ] Manejo de errores

### Modificar POST `/api/citas`
- [ ] Cambiar validación para requerir `medicoId`
- [ ] Agregar validación con `validarDisponibilidadParaCita()`
- [ ] Retornar error 409 si no disponible
- [ ] Incluir `detalles.proximosDias` en error
- [ ] Testear con datos válidos
- [ ] Testear con datos inválidos

### Rutas
- [ ] Agregar rutas en `routes/citas.ts`
  - [ ] GET `/api/medicos/especialidad/:especialidad`
  - [ ] GET `/api/medicos/:medicoId/disponibilidad`
- [ ] Verificar orden de rutas (específica antes de genérica)

### Testing Backend
- [ ] Probar todos endpoints con Postman/cURL
- [ ] Validar respuestas (status, estructura JSON)
- [ ] Validar mensajes de error claros
- [ ] Probar con especialidades que no existen
- [ ] Probar con médicos que no existen
- [ ] Probar con fechas pasadas
- [ ] Probar con fechas sin disponibilidad

---

## 🎨 FASE 5: FRONTEND - LÓGICA (Dev 2 - Frontend)

### Actualizar Estados
- [ ] `CreateAppointmentForm.tsx` - Agregar estados
  - [ ] `medicosDisponibles` (array)
  - [ ] `loadingMedicos` (boolean)
  - [ ] `disponibilidadMedico` (object)

### Actualizar appointmentData
- [ ] Cambiar campo `medico` de string a ""
- [ ] Esto debe almacenar el ID del médico

### Effects
- [ ] Crear useEffect para cargar médicos al cambiar especialidad
  - [ ] Llamar `cargarMedicosEspecialidad()`
  - [ ] Manejar loading state
  - [ ] Manejar errores
  - [ ] Limpiar si no hay especialidad
- [ ] Crear useEffect para validar disponibilidad
  - [ ] Se dispara al cambiar fecha, médico o especialidad
  - [ ] Llamar API de disponibilidad
  - [ ] Actualizar `disponibilidadMedico`
  - [ ] Mostrar errores si aplica

### Funciones Helper
- [ ] Crear `src/utils/medicoUtils.ts`
  - [ ] `obtenerDiaSemana()` - convierte 0-4 a Lunes-Viernes
  - [ ] `formatearDisponibilidad()` - texto legible
  - [ ] `colorDisponibilidad()` - color según disponibilidad
  - [ ] `obtenerSugerenciasAlternativas()` - próximos días

### Testing Frontend (Dev Tools)
- [ ] Abrir Console y verificar no hay errores JS
- [ ] Usar Network tab para validar requests
- [ ] Mock API responses si backend no está listo

---

## 🎨 FASE 6: FRONTEND - UI (Dev 2 - Frontend)

### Campo Médico
- [ ] Reemplazar input text por select
- [ ] Mostrar "Selecciona especialidad primero" si no hay especialidad
- [ ] Mostrar "Cargando..." si `loadingMedicos`
- [ ] Mostrar mensaje "No hay médicos" si lista vacía
- [ ] Llenar select con médicos disponibles
- [ ] Deshabilitar select si no hay especialidad

### Indicador de Disponibilidad
- [ ] Mostrar card debajo del médico con:
  - [ ] ✅/❌ atiende ese día
  - [ ] Horario: HH:MM - HH:MM
  - [ ] Espacios: X/Y
  - [ ] Lista de próximos días si no disponible
- [ ] Color rojo si no disponible
- [ ] Color verde si disponible
- [ ] Actualizar dinámicamente al cambiar fecha/médico

### Validación en Formulario
- [ ] Campo médico: agregar validación requerido
- [ ] Mostrar error si intenta enviar sin médico
- [ ] Validar que espacios > 0 antes de enviar
- [ ] Mostrar sugerencias en error

### Limpieza de Formulario
- [ ] Al buscar otro paciente: limpiar médicos
- [ ] Al cambiar especialidad: limpiar médico y disponibilidad
- [ ] Al resetear form: limpiar todo

---

## 🔗 FASE 7: INTEGRACIÓN (Ambos Devs)

### Dev 1: Verificar Backend
- [ ] Todos los endpoints implementados
- [ ] Validaciones correctas
- [ ] Mensajes de error claros
- [ ] Respuestas formateadas
- [ ] Sin console.log() en producción
- [ ] Errores manejados

### Dev 2: Verificar Frontend
- [ ] Todos los states y effects correctos
- [ ] UI actualiza dinámicamente
- [ ] Errores mostrados al usuario
- [ ] Sin console.error() en producción
- [ ] Responsive en mobile

### Integración End-to-End
- [ ] Dev 1 levanta backend local
- [ ] Dev 2 apunta frontend a localhost
- [ ] Flujo completo:
  1. [ ] Buscar paciente
  2. [ ] Seleccionar especialidad → cargan médicos
  3. [ ] Seleccionar médico
  4. [ ] Seleccionar fecha → muestra disponibilidad
  5. [ ] Seleccionar hora
  6. [ ] Enviar → se crea cita

### Edge Cases
- [ ] [ ] Especialidad sin médicos
- [ ] [ ] Médico sin horarios activos
- [ ] [ ] Fecha sin disponibilidad
- [ ] [ ] Médico con capacidad 0
- [ ] [ ] Hora fuera de rango
- [ ] [ ] Cambiar selecciones rapidamente (race condition?)
- [ ] [ ] Desconexión de red (error handling)

---

## 📱 FASE 8: TESTING COMPLETO (Ambos Devs)

### Testing Manual
- [ ] Crear 5 citas exitosamente
- [ ] Intentar crear cita en día sin horario → error claro
- [ ] Intentar crear cita sin capacidad → sugerencias alternativas
- [ ] Cambiar especialidad varias veces → se actualiza médicos
- [ ] Abrir en 2 browsers → verificar datos consistentes

### Testing Responsivo
- [ ] Desktop (1920px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)
- [ ] Verificar:
  - [ ] Select médico visible
  - [ ] Card disponibilidad legible
  - [ ] Errores visibles

### Testing de Errores
- [ ] API no disponible → muestra error amable
- [ ] Respuesta inválida → manejo correcto
- [ ] Timeout de request → no se cuelga UI
- [ ] Validación frontend antes de enviar

### Performance
- [ ] Cargar médicos < 1 segundo
- [ ] Validar disponibilidad < 1 segundo
- [ ] Crear cita < 2 segundos
- [ ] No hay flickering en UI

---

## 📖 FASE 9: DOCUMENTACIÓN (Dev 1)

### README de Feature
- [ ] Crear `docs/FEATURE_DISPONIBILIDAD_MEDICOS.md`
- [ ] Incluir:
  - [ ] Qué es
  - [ ] Cómo funciona
  - [ ] APIs disponibles
  - [ ] Ejemplos de uso
  - [ ] Troubleshooting

### Actualizar Documentación Existente
- [ ] Actualizar `IMPLEMENTATION_SUMMARY.md`
- [ ] Agregar a lista de features completadas
- [ ] Incluir screenshots si aplica

### Código Limpio
- [ ] Sin TODO/FIXME/HACK comments
- [ ] Sin código comentado
- [ ] Sin console.log/console.error
- [ ] Nombres de variables claros
- [ ] Funciones documentadas (JSDoc)

---

## 🧹 FASE 10: CODE REVIEW (Ambos Devs)

### Review Dev 1 → Dev 2
- [ ] Código backend legible
- [ ] Validaciones completas
- [ ] Manejo de errores
- [ ] Sin queries N+1
- [ ] Índices en BD
- [ ] Documentación

### Review Dev 2 → Dev 1
- [ ] Código frontend limpio
- [ ] States bien organizados
- [ ] Effects sin dependencies issues
- [ ] UI accesible
- [ ] Sin memory leaks
- [ ] Documentación

### Feedback y Fixes
- [ ] Incorporar sugerencias
- [ ] Re-review cambios
- [ ] Aprobar cuando esté listo

---

## 🚀 FASE 11: TESTING FINAL (Ambos Devs)

### Merged a main (después de PR aprobado)
- [ ] Backend merged
- [ ] Frontend merged
- [ ] Sin conflictos
- [ ] Tests pasan (si hay)

### Testing en Staging
- [ ] Deployar a ambiente similar a producción
- [ ] Verificar:
  - [ ] Datos correctos en BD
  - [ ] Availabilidad responde
  - [ ] Citas se crean exitosamente
  - [ ] No hay errores en console

### Checklist Final
- [ ] Todos los tests pasan
- [ ] Documentación actualizada
- [ ] No hay breaking changes
- [ ] Funcionalidad completamente implementada
- [ ] QA ha validado
- [ ] Listo para deployment

---

## 📊 REGISTRO DE TIEMPO

| Fase | Estimado | Actual | Responsable |
|------|----------|--------|-------------|
| 1. Preparación | 0.5d | | Ambos |
| 2. Database | 1d | | Dev 1 |
| 3. Servicios | 1d | | Dev 1 |
| 4. Endpoints | 1d | | Dev 1 |
| 5. Frontend Logic | 1.5d | | Dev 2 |
| 6. Frontend UI | 1d | | Dev 2 |
| 7. Integración | 1d | | Ambos |
| 8. Testing | 1d | | Ambos |
| 9. Documentación | 0.5d | | Dev 1 |
| 10. Code Review | 1d | | Ambos |
| 11. Testing Final | 0.5d | | Ambos |
| **TOTAL** | **9 días** | | |

---

## 🎯 Métricas de Éxito

- [ ] ✅ 0 bugs críticos en testing final
- [ ] ✅ Tiempo de respuesta < 500ms en todas las operaciones
- [ ] ✅ 100% de casos de uso funcionales
- [ ] ✅ UX clara sin confusión
- [ ] ✅ Documentación completa
- [ ] ✅ Code review aprobado por ambos devs

---

## 📝 NOTAS

```
[Agregar notas durante implementación]

Fecha: _______________
Nota: _________________________________________________________________

Fecha: _______________
Nota: _________________________________________________________________
```

---

**Última actualización:** Enero 22, 2026  
**Estado:** Listo para comenzar  
**Aprobado por:** [Nombre PM/Tech Lead]
