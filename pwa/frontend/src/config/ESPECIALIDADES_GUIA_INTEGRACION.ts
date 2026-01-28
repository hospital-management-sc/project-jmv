/**
 * GUÍA DE INTEGRACIÓN - Dashboards Especializados por Especialidad Médica
 * 
 * ============================================================================
 * DESCRIPCIÓN GENERAL
 * ============================================================================
 * 
 * Se ha implementado un sistema completo para dashboards médicos personalizados
 * basados en la especialidad del médico. El sistema permite:
 * 
 * 1. Especialidades CENTRALIZADAS y VALIDADAS
 * 2. Configuración específica por especialidad
 * 3. Formularios personalizados según especialidad
 * 4. Opciones de dashboard dinámicas
 * 5. Integración automática con el contexto de autenticación
 * 
 * ============================================================================
 * ARCHIVOS CREADOS
 * ============================================================================
 * 
 * FRONTEND:
 * ├── src/config/especialidades.config.ts
 * │   └─ Configuración centralizada de las 15 especialidades
 * │
 * ├── src/services/especialidades.service.ts
 * │   └─ Servicio para acceder y validar especialidades
 * │
 * ├── src/hooks/useEspecialidad.ts
 * │   └─ Hook para acceder a datos de especialidad del usuario actual
 * │
 * ├── src/contexts/DashboardEspecializadoContext.tsx
 * │   └─ Contexto para proporcionar config a componentes del dashboard
 * │
 * └── src/types/auth.ts
 *     └─ ACTUALIZADO: JWTPayload incluye especialidad y departamento
 * 
 * BACKEND:
 * ├── src/config/especialidades.config.ts
 * │   └─ Misma configuración (fuente única de verdad)
 * │
 * ├── src/types/auth.ts
 * │   └─ ACTUALIZADO: JWTPayload incluye especialidad y departamento
 * │
 * └── src/services/auth.ts
 *     └─ ACTUALIZADO: generateToken() ahora incluye especialidad
 * 
 * ============================================================================
 * PASOS DE INTEGRACIÓN EN EL DOCTORDASHBOARD
 * ============================================================================
 * 
 * PASO 1: Envolver el DoctorDashboard con el Provider
 * ────────────────────────────────────────────────────
 * 
 * En tu router o App.tsx:
 * 
 * import { DashboardEspecializadoProvider } from '@/contexts/DashboardEspecializadoContext'
 * 
 * <DashboardEspecializadoProvider>
 *   <DoctorDashboard />
 * </DashboardEspecializadoProvider>
 * 
 * 
 * PASO 2: Usar el hook en componentes hijos
 * ─────────────────────────────────────────
 * 
 * En DashboardActions.tsx (o cualquier componente):
 * 
 * import { useDashboardEspecializado } from '@/contexts/DashboardEspecializadoContext'
 * 
 * export function DashboardActions() {
 *   const { especialidad, nombre, opcionesEspeciales } = useDashboardEspecializado()
 *   
 *   return (
 *     <section>
 *       <h2>Dashboard de {nombre}</h2>
 *       {opcionesEspeciales.includes('cirugia-reparadora') && (
 *         <button>Reportar Cirugía</button>
 *       )}
 *     </section>
 *   )
 * }
 * 
 * 
 * PASO 3: Acceder directamente a especialidad del usuario
 * ────────────────────────────────────────────────────────
 * 
 * Si necesitas acceso directo (sin usar el contexto):
 * 
 * import { useEspecialidad } from '@/hooks/useEspecialidad'
 * 
 * const { especialidad, nombre, tieneFormularioPersonalizado } = useEspecialidad()
 * 
 * 
 * PASO 4: Usar el servicio para funciones generales
 * ──────────────────────────────────────────────────
 * 
 * import especialidadesService from '@/services/especialidades.service'
 * 
 * // Obtener todas las especialidades
 * const todas = especialidadesService.obtenerTodas()
 * 
 * // Obtener config de una especialidad
 * const config = especialidadesService.obtenerConfig('Medicina Interna')
 * 
 * // Obtener especialidades de un departamento
 * const pediatria = especialidadesService.obtenerPorDepartamento('Pediatría')
 * 
 * ============================================================================
 * EJEMPLOS PRÁCTICOS
 * ============================================================================
 * 
 * EJEMPLO 1: Mostrar opciones dinámicas según especialidad
 * ────────────────────────────────────────────────────────
 * 
 * function DashboardActions() {
 *   const { opcionesEspeciales } = useDashboardEspecializado()
 * 
 *   const acciones = [
 *     { 
 *       id: 'cirugia-reparadora', 
 *       label: 'Reportar Cirugía', 
 *       mostrar: opcionesEspeciales.includes('cirugia-reparadora') 
 *     },
 *     { 
 *       id: 'control-prenatal', 
 *       label: 'Control Prenatal', 
 *       mostrar: opcionesEspeciales.includes('control-prenatal') 
 *     },
 *   ]
 * 
 *   return (
 *     <div>
 *       {acciones
 *         .filter(a => a.mostrar)
 *         .map(accion => (
 *           <button key={accion.id}>{accion.label}</button>
 *         ))}
 *     </div>
 *   )
 * }
 * 
 * 
 * EJEMPLO 2: Formulario personalizado por especialidad
 * ────────────────────────────────────────────────────
 * 
 * function RegisterEncounter() {
 *   const { camposEspecificos, tieneFormularioPersonalizado } = useEspecialidad()
 * 
 *   return (
 *     <form>
 *       <input type="text" placeholder="Motivo de consulta" />
 *       
 *       {tieneFormularioPersonalizado && (
 *         <>
 *           {camposEspecificos.includes('sistemaOrgano') && (
 *             <input placeholder="Sistema/Órgano afectado" />
 *           )}
 *           {camposEspecificos.includes('edad') && (
 *             <input type="number" placeholder="Edad del paciente" />
 *           )}
 *         </>
 *       )}
 *     </form>
 *   )
 * }
 * 
 * 
 * EJEMPLO 3: Filtrar médicos por especialidad (Admin)
 * ────────────────────────────────────────────────────
 * 
 * import especialidadesService from '@/services/especialidades.service'
 * 
 * function SelectEspecialidad() {
 *   const opciones = especialidadesService.obtenerNombres()
 * 
 *   return (
 *     <select>
 *       {opciones.map(esp => (
 *         <option key={esp} value={esp}>{esp}</option>
 *       ))}
 *     </select>
 *   )
 * }
 * 
 * ============================================================================
 * CONFIGURACIÓN DE ESPECIALIDADES
 * ============================================================================
 * 
 * Las 15 especialidades confirmadas incluyen:
 * 
 * 1. Medicina Interna
 * 2. Medicina Paliativa
 * 3. Cirugía General
 * 4. Pediatría
 * 5. Neumología Pediátrica
 * 6. Traumatología
 * 7. Cirugía de Manos
 * 8. Odontología
 * 9. Otorrinolaringología
 * 10. Dermatología
 * 11. Fisiatría
 * 12. Ginecología
 * 13. Gastroenterología
 * 14. Hematología
 * 15. Psicología
 * 
 * Cada especialidad tiene:
 * - Código único (ej: 'MI' para Medicina Interna)
 * - Departamento asociado
 * - Campos específicos del formulario
 * - Opciones especiales del dashboard
 * - Descripción
 * - Color de identificación
 * 
 * ============================================================================
 * FLUJO DE DATOS
 * ============================================================================
 * 
 * 1. Login
 *    └─ Backend: generateToken() incluye especialidad del Usuario
 *    └─ Frontend: AuthContext.login() almacena JWT con especialidad
 * 
 * 2. Dashboard Load
 *    └─ DoctorDashboard monta dentro de DashboardEspecializadoProvider
 *    └─ Provider lee user.especialidad del AuthContext
 * 
 * 3. Component Access
 *    └─ Componentes hijos usan useDashboardEspecializado() o useEspecialidad()
 *    └─ Reciben configuración dinámicamente
 * 
 * 4. Render Dinámico
 *    └─ Componentes renderizan solo opciones/campos válidos para su especialidad
 * 
 * ============================================================================
 * NOTAS IMPORTANTES
 * ============================================================================
 * 
 * ⚠️  El campo especialidad debe estar poblado en la tabla Usuario al crear
 *    el usuario. Se recomienda:
 *    - Obtenerla de PersonalAutorizado.departamento durante el registro
 *    - Mostrar selector de especialidad en el formulario de registro
 *    - Validar contra la lista centralizada
 * 
 * ⚠️  Sincronización: Las dos listas de especialidades (frontend y backend)
 *    deben estar SIEMPRE sincronizadas. Si cambias una, actualiza ambas.
 * 
 * ✅  Future Enhancement: Se puede agregar configuración a base de datos
 *    en tabla EspecialidadesConfig para mayor flexibilidad sin redeploy.
 * 
 * ============================================================================
 */

export {}
