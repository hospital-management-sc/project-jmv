# Unificación del Registro de Pacientes

## Fecha: 2024-01-XX

## Problema Identificado

El sistema tenía una inconsistencia arquitectural en el registro de pacientes:

- **Admin (`RegisterPatientForm.tsx`)**: Creaba Paciente + Admisión inicial con `nroHistoria` autogenerado
- **Médico (`RegistrarPaciente.tsx`)**: Creaba Paciente SIN `nroHistoria`, luego se creaba una segunda admisión

Esto generaba:
1. **Duplicación de admisiones** para pacientes nuevos en emergencia (admisión inicial + admisión de emergencia)
2. **Inconsistencia de datos**: Unos pacientes tenían `nroHistoria`, otros no
3. **Arquitectura confusa**: No estaba claro cuándo se creaba el `nroHistoria`

## Decisión Arquitectural

**nroHistoria es el identificador PERMANENTE del Paciente**, generado UNA VEZ al momento del primer registro, independientemente de si es registrado por Admin o Médico.

### Flujo Unificado

1. **Paciente**: Se crea con `nroHistoria` autogenerado (formato `XX-XX-XX`)
2. **Admisión**: Se crea al mismo tiempo con el tipo correcto:
   - `HOSPITALIZACION` si lo registra Admin
   - `EMERGENCIA` si lo registra Médico en emergencias
3. **Formatos clínicos**: Se asocian a la admisión correspondiente

## Cambios Implementados

### 1. Backend (`pacientes.ts`)

```typescript
// ANTES: Admisión inicial siempre con tipo null
tipo: null,
servicio: null,

// AHORA: Admisión inicial con tipo especificado
tipo: tipoAdmision || null, // 'EMERGENCIA', 'HOSPITALIZACION', o null
servicio: servicioAdmision || null,
```

**Nuevos parámetros opcionales en `POST /pacientes`:**
- `tipoAdmision` (string): Tipo de la admisión inicial ('EMERGENCIA', 'HOSPITALIZACION', etc.)
- `servicioAdmision` (string): Servicio de la admisión

### 2. Frontend (`RegistrarPaciente.tsx`)

**ANTES:**
- Hacía POST directamente a `/pacientes`
- Creaba Paciente + Admisión inicial con tipo null

**AHORA:**
- Solo valida los datos del formulario
- Retorna datos validados via `onSuccess` callback
- El componente padre es responsable de crear Paciente + Admisión

```typescript
// NO crear el paciente aquí. Solo retornar los datos validados.
onSuccess(datosRegistro);
```

### 3. `RegistrarEmergencia.tsx`

**ANTES:**
```typescript
// Creaba Paciente sin tipo
POST /pacientes → Admisión (tipo: null)
// Luego creaba segunda admisión
POST /admisiones → Admisión (tipo: EMERGENCIA)
// RESULTADO: 2 admisiones
```

**AHORA:**
```typescript
// Crea Paciente con tipo EMERGENCIA
const datosCompletos = {
  ...datosRegistro,
  tipoAdmision: 'EMERGENCIA',
  servicioAdmision: 'EMERGENCIA',
};
POST /pacientes → Admisión (tipo: EMERGENCIA)
// RESULTADO: 1 admisión con tipo correcto
```

### 4. `RegisterPatientForm.tsx`

**ANTES:**
```typescript
POST /pacientes // Admisión con tipo null
```

**AHORA:**
```typescript
datosRegistro.tipoAdmision = 'HOSPITALIZACION';
datosRegistro.servicioAdmision = 'HOSPITALIZACION';
POST /pacientes // Admisión con tipo HOSPITALIZACION
```

### 5. `nroHistoria` Autogenerado

Ambos componentes ahora incluyen:
```typescript
useEffect(() => {
  const cargarSiguienteNroHistoria = async () => {
    const response = await fetch(`${API_BASE_URL}/pacientes/ultimos?limit=1`);
    const data = await response.json();
    const ultimoPaciente = data.data?.[0];
    
    if (ultimoPaciente?.nroHistoria) {
      // Parsear formato XX-XX-XX e incrementar
      const partes = ultimoPaciente.nroHistoria.split('-');
      const ultimoNumero = parseInt(partes[2], 10);
      const siguienteNumero = ultimoNumero + 1;
      const nuevoNroHistoria = `${partes[0]}-${partes[1]}-${siguienteNumero.toString().padStart(2, '0')}`;
      setFormData(prev => ({ ...prev, nroHistoria: nuevoNroHistoria }));
    } else {
      setFormData(prev => ({ ...prev, nroHistoria: '01-01-01' }));
    }
  };
  
  cargarSiguienteNroHistoria();
}, []);
```

## Resultado Final

### Admin registra paciente
1. `RegisterPatientForm.tsx` valida datos + genera `nroHistoria`
2. `POST /pacientes` con `tipoAdmision: 'HOSPITALIZACION'`
3. Backend crea: **Paciente** (con nroHistoria) + **Admisión HOSPITALIZACION** (con habitación)
4. **Total: 1 Paciente, 1 Admisión**

### Médico registra paciente en emergencia
1. Busca paciente por CI → No existe
2. `RegistrarPaciente.tsx` valida datos + genera `nroHistoria`
3. `RegistrarEmergencia.tsx` recibe datos y crea paciente con `tipoAdmision: 'EMERGENCIA'`
4. Backend crea: **Paciente** (con nroHistoria) + **Admisión EMERGENCIA**
5. Redirige a `FormatoEmergencia.tsx` con `admisionId`
6. **Total: 1 Paciente, 1 Admisión**

### Médico registra emergencia para paciente existente
1. Busca paciente por CI → Existe
2. Muestra datos del paciente
3. Crea nueva admisión: `POST /admisiones` con `tipo: 'EMERGENCIA'`
4. Redirige a `FormatoEmergencia.tsx` con `admisionId`
5. **Total: Paciente existente, +1 Admisión EMERGENCIA**

## Beneficios

✅ **Consistencia de datos**: Todos los pacientes tienen `nroHistoria` desde el primer registro  
✅ **Sin duplicación**: Solo se crea UNA admisión por registro  
✅ **Arquitectura clara**: `nroHistoria` es identificador permanente del paciente  
✅ **Reutilización**: `RegistrarPaciente.tsx` es componente puro de validación  
✅ **Flexibilidad**: Backend acepta tipo de admisión como parámetro  

## Próximos Pasos

- [ ] Probar flujo completo de emergencia end-to-end
- [ ] Verificar que `FormatoEmergencia.tsx` recibe `admisionId` correcto
- [ ] Documentar en wiki el flujo unificado
- [ ] Crear tests unitarios para validación de `nroHistoria`
