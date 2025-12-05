# Guía de Implementación: Clasificación de Pacientes

## 📋 Resumen de Cambios Realizados

### Base de Datos (✅ COMPLETADO)
1. ✅ Eliminada columna `region` del modelo `Paciente`
2. ✅ Agregado campo `tipoPaciente` al modelo `Paciente` (MILITAR | AFILIADO | PNA)
3. ✅ Creado modelo `Afiliado` para almacenar datos de familiares de militares
4. ✅ Migración aplicada exitosamente

---

## 🎯 Flujo de Usuario Propuesto

### 1. Vista de Selección de Tipo de Paciente
**Ubicación**: Antes del formulario de registro

```
┌─────────────────────────────────────────────────┐
│        REGISTRAR NUEVO PACIENTE                  │
│                                                  │
│  Seleccione el tipo de paciente:                │
│                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐│
│  │  MILITAR    │  │  AFILIADO   │  │   PNA    ││
│  │             │  │             │  │          ││
│  │  Personal   │  │  Familiar   │  │ Paciente ││
│  │   Militar   │  │ de Militar  │  │    No    ││
│  │   Activo    │  │             │  │ Afiliado ││
│  └─────────────┘  └─────────────┘  └──────────┘│
└─────────────────────────────────────────────────┘
```

### 2. Formularios Según Tipo

#### A) MILITAR (Formulario Actual)
- Sección 1: Datos de Admisión
- Sección 2: Datos Personales del Paciente
- **Sección 3: Datos de Personal Militar** (obligatorio)
  - Grado
  - Componente
  - Unidad
  - Estado Militar

#### B) AFILIADO (Nuevo)
- Sección 1: Datos de Admisión
- Sección 2: Datos Personales del Paciente
- **Sección 3: Datos de Afiliación** (nuevo)
  - Número de Carnet
  - Parentesco con el Militar (esposo/a, hijo/a, padre/madre, etc.)
  - Nombre del Militar Titular
  - CI del Militar Titular
  - Grado del Militar Titular
  - Componente del Militar Titular
  - Fecha de Afiliación
  - Estado: Vigente/No Vigente

#### C) PNA (Simplificado)
- Sección 1: Datos de Admisión
- Sección 2: Datos Personales del Paciente
- ~~Sección 3: No aparece~~

---

## 🛠️ Implementación Frontend

### Paso 1: Crear Componente de Selección de Tipo

**Archivo**: `src/components/PatientTypeSelector/PatientTypeSelector.tsx`

```tsx
import React from 'react';
import styles from './PatientTypeSelector.module.css';

interface PatientTypeSelectorProps {
  onSelectType: (type: 'MILITAR' | 'AFILIADO' | 'PNA') => void;
}

export const PatientTypeSelector: React.FC<PatientTypeSelectorProps> = ({ onSelectType }) => {
  return (
    <div className={styles.container}>
      <h2>Registrar Nuevo Paciente</h2>
      <p>Seleccione el tipo de paciente:</p>
      
      <div className={styles.buttonGrid}>
        <button 
          className={styles.typeButton}
          onClick={() => onSelectType('MILITAR')}
        >
          <div className={styles.icon}>🪖</div>
          <h3>MILITAR</h3>
          <p>Personal Militar Activo</p>
        </button>

        <button 
          className={styles.typeButton}
          onClick={() => onSelectType('AFILIADO')}
        >
          <div className={styles.icon}>👨‍👩‍👧‍👦</div>
          <h3>AFILIADO</h3>
          <p>Familiar de Militar</p>
        </button>

        <button 
          className={styles.typeButton}
          onClick={() => onSelectType('PNA')}
        >
          <div className={styles.icon}>👤</div>
          <h3>PNA</h3>
          <p>Paciente No Afiliado</p>
        </button>
      </div>
    </div>
  );
};
```

### Paso 2: Crear Sección de Datos de Afiliado

**Archivo**: `src/components/AfiliadoDataSection/AfiliadoDataSection.tsx`

```tsx
import React from 'react';
import styles from './FormSection.module.css';

interface AfiliadoData {
  nroCarnet: string;
  parentesco: string;
  titularNombre: string;
  titularCi: string;
  titularGrado: string;
  titularComponente: string;
  fechaAfiliacion: string;
  vigente: boolean;
}

interface AfiliadoDataSectionProps {
  data: AfiliadoData;
  onChange: (data: AfiliadoData) => void;
  errors?: {[key: string]: string};
}

const PARENTESCOS = [
  'ESPOSO/A',
  'HIJO/A',
  'PADRE',
  'MADRE',
  'HERMANO/A',
  'OTRO'
];

export const AfiliadoDataSection: React.FC<AfiliadoDataSectionProps> = ({ 
  data, 
  onChange,
  errors = {} 
}) => {
  return (
    <>
      <div className={styles["form-section-header"]}>
        <h3>3. Datos de Afiliación</h3>
      </div>

      <div className={styles["form-grid"]}>
        <div className={styles["form-group"]}>
          <label>Número de Carnet *</label>
          <input
            type="text"
            required
            value={data.nroCarnet}
            onChange={(e) => onChange({...data, nroCarnet: e.target.value})}
            placeholder="Ej: AF-12345678"
          />
          {errors.nroCarnet && <span className={styles["error-message"]}>{errors.nroCarnet}</span>}
        </div>

        <div className={styles["form-group"]}>
          <label>Parentesco *</label>
          <select
            required
            value={data.parentesco}
            onChange={(e) => onChange({...data, parentesco: e.target.value})}
          >
            <option value="">Seleccione...</option>
            {PARENTESCOS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.parentesco && <span className={styles["error-message"]}>{errors.parentesco}</span>}
        </div>

        <div className={styles["form-group"]}>
          <label>Nombre del Militar Titular *</label>
          <input
            type="text"
            required
            value={data.titularNombre}
            onChange={(e) => onChange({...data, titularNombre: e.target.value})}
            placeholder="Nombre completo"
          />
          {errors.titularNombre && <span className={styles["error-message"]}>{errors.titularNombre}</span>}
        </div>

        <div className={styles["form-group"]}>
          <label>CI del Militar Titular *</label>
          <input
            type="text"
            required
            value={data.titularCi}
            onChange={(e) => onChange({...data, titularCi: e.target.value})}
            placeholder="V-12345678"
          />
          {errors.titularCi && <span className={styles["error-message"]}>{errors.titularCi}</span>}
        </div>

        <div className={styles["form-group"]}>
          <label>Grado del Militar Titular *</label>
          <input
            type="text"
            required
            value={data.titularGrado}
            onChange={(e) => onChange({...data, titularGrado: e.target.value})}
            placeholder="Ej: Teniente, Capitán"
          />
          {errors.titularGrado && <span className={styles["error-message"]}>{errors.titularGrado}</span>}
        </div>

        <div className={styles["form-group"]}>
          <label>Componente del Militar Titular *</label>
          <input
            type="text"
            required
            value={data.titularComponente}
            onChange={(e) => onChange({...data, titularComponente: e.target.value})}
            placeholder="Ej: Ejército, Aviación"
          />
          {errors.titularComponente && <span className={styles["error-message"]}>{errors.titularComponente}</span>}
        </div>

        <div className={styles["form-group"]}>
          <label>Fecha de Afiliación *</label>
          <input
            type="date"
            required
            value={data.fechaAfiliacion}
            onChange={(e) => onChange({...data, fechaAfiliacion: e.target.value})}
          />
          {errors.fechaAfiliacion && <span className={styles["error-message"]}>{errors.fechaAfiliacion}</span>}
        </div>

        <div className={styles["form-group"]}>
          <label>Estado de Afiliación</label>
          <select
            value={data.vigente ? 'true' : 'false'}
            onChange={(e) => onChange({...data, vigente: e.target.value === 'true'})}
          >
            <option value="true">Vigente</option>
            <option value="false">No Vigente</option>
          </select>
        </div>
      </div>
    </>
  );
};
```

### Paso 3: Modificar AdminDashboard.tsx

**Cambios necesarios en `RegisterPatientForm`**:

```tsx
// 1. Agregar estado para tipo de paciente
const [selectedPatientType, setSelectedPatientType] = useState<'MILITAR' | 'AFILIADO' | 'PNA' | null>(null);

// 2. Agregar estado para datos de afiliado
const [afiliadoData, setAfiliadoData] = useState({
  nroCarnet: '',
  parentesco: '',
  titularNombre: '',
  titularCi: '',
  titularGrado: '',
  titularComponente: '',
  fechaAfiliacion: '',
  vigente: true,
});

// 3. Modificar el return para mostrar selector o formulario
return (
  <section className={styles["form-section"]}>
    {!selectedPatientType ? (
      // Mostrar selector de tipo
      <PatientTypeSelector onSelectType={setSelectedPatientType} />
    ) : (
      // Mostrar formulario según tipo
      <form onSubmit={handleSubmit} className={styles["patient-form"]}>
        {/* Botón para volver */}
        <button 
          type="button"
          onClick={() => setSelectedPatientType(null)}
          className={styles["back-button"]}
        >
          ← Cambiar tipo de paciente
        </button>

        {/* Sección 1: Datos de Admisión (siempre) */}
        {/* ... código existente ... */}

        {/* Sección 2: Datos Personales (siempre) */}
        {/* ... código existente ... */}

        {/* Sección 3: Según tipo de paciente */}
        {selectedPatientType === 'MILITAR' && (
          <MilitarDataSection 
            data={formData}
            onChange={setFormData}
            errors={errors}
          />
        )}

        {selectedPatientType === 'AFILIADO' && (
          <AfiliadoDataSection 
            data={afiliadoData}
            onChange={setAfiliadoData}
            errors={errors}
          />
        )}

        {/* PNA: No muestra sección 3 */}

        {/* Botones de acción */}
        <div className={styles["form-actions"]}>
          {/* ... botones existentes ... */}
        </div>
      </form>
    )}
  </section>
);
```

### Paso 4: Actualizar handleSubmit

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // Validaciones existentes...
  // ...

  // Validaciones específicas por tipo
  if (selectedPatientType === 'MILITAR') {
    if (!formData.grado) newErrors.grado = 'Requerido para personal militar'
    if (!formData.componente) newErrors.componente = 'Requerido para personal militar'
    if (!formData.estadoMilitar) newErrors.estadoMilitar = 'Requerido para personal militar'
  }

  if (selectedPatientType === 'AFILIADO') {
    if (!afiliadoData.nroCarnet) newErrors.nroCarnet = 'Requerido'
    if (!afiliadoData.parentesco) newErrors.parentesco = 'Requerido'
    if (!afiliadoData.titularNombre) newErrors.titularNombre = 'Requerido'
    if (!afiliadoData.titularCi) newErrors.titularCi = 'Requerido'
    if (!afiliadoData.titularGrado) newErrors.titularGrado = 'Requerido'
    if (!afiliadoData.titularComponente) newErrors.titularComponente = 'Requerido'
    if (!afiliadoData.fechaAfiliacion) newErrors.fechaAfiliacion = 'Requerido'
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors)
    return
  }

  // Preparar datos para enviar
  const datosRegistro = {
    // ... datos existentes ...
    tipoPaciente: selectedPatientType, // NUEVO CAMPO
    
    // Datos militares (solo si es MILITAR)
    ...(selectedPatientType === 'MILITAR' && {
      grado: formData.grado,
      estadoMilitar: formData.estadoMilitar,
      componente: formData.componente,
      unidad: formData.unidad,
    }),
    
    // Datos de afiliado (solo si es AFILIADO)
    ...(selectedPatientType === 'AFILIADO' && {
      afiliadoData: {
        nroCarnet: afiliadoData.nroCarnet,
        parentesco: afiliadoData.parentesco,
        titularNombre: afiliadoData.titularNombre,
        titularCi: afiliadoData.titularCi,
        titularGrado: afiliadoData.titularGrado,
        titularComponente: afiliadoData.titularComponente,
        fechaAfiliacion: afiliadoData.fechaAfiliacion,
        vigente: afiliadoData.vigente,
      }
    }),
  }

  // Enviar al backend...
}
```

---

## 🔧 Cambios Necesarios en el Backend

### Actualizar `crearPaciente` Controller

**Archivo**: `pwa/backend/src/controllers/pacientes.ts`

```typescript
export const crearPaciente = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      // ... campos existentes ...
      tipoPaciente, // NUEVO
      afiliadoData, // NUEVO (solo si es AFILIADO)
      // ... resto de campos ...
    } = req.body;

    // Validar tipoPaciente
    if (!tipoPaciente || !['MILITAR', 'AFILIADO', 'PNA'].includes(tipoPaciente)) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Tipo de paciente inválido. Debe ser: MILITAR, AFILIADO o PNA',
      });
      return;
    }

    // Validaciones específicas
    if (tipoPaciente === 'MILITAR' && (!grado || !componente)) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Grado y Componente son requeridos para personal militar',
      });
      return;
    }

    if (tipoPaciente === 'AFILIADO' && !afiliadoData) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Datos de afiliación son requeridos para pacientes afiliados',
      });
      return;
    }

    const resultado = await prisma.$transaction(async (tx) => {
      // Crear paciente
      const paciente = await tx.paciente.create({
        data: {
          // ... campos existentes ...
          tipoPaciente, // NUEVO
        },
      });

      // Crear admisión (código existente)
      const admision = await tx.admision.create({...});

      // Crear datos militares si es MILITAR
      if (tipoPaciente === 'MILITAR' && (grado || estadoMilitar || componente || unidad)) {
        await tx.personalMilitar.create({
          data: {
            pacienteId: paciente.id,
            grado: grado || null,
            estadoMilitar: estadoMilitar || null,
            componente: componente || null,
            unidad: unidad || null,
          },
        });
      }

      // Crear datos de afiliado si es AFILIADO
      if (tipoPaciente === 'AFILIADO' && afiliadoData) {
        await tx.afiliado.create({
          data: {
            pacienteId: paciente.id,
            nroCarnet: afiliadoData.nroCarnet || null,
            parentesco: afiliadoData.parentesco || null,
            titularNombre: afiliadoData.titularNombre || null,
            titularCi: afiliadoData.titularCi || null,
            titularGrado: afiliadoData.titularGrado || null,
            titularComponente: afiliadoData.titularComponente || null,
            fechaAfiliacion: afiliadoData.fechaAfiliacion ? new Date(afiliadoData.fechaAfiliacion) : null,
            vigente: afiliadoData.vigente !== undefined ? afiliadoData.vigente : true,
          },
        });
      }

      return { paciente, admision };
    });

    // ... resto del código ...
  } catch (error) {
    // ... manejo de errores ...
  }
};
```

---

## 📊 Consultas SQL Útiles

```sql
-- Ver distribución de pacientes por tipo
SELECT tipoPaciente, COUNT(*) as total
FROM "Paciente"
GROUP BY tipoPaciente;

-- Ver pacientes militares con su información militar
SELECT p.*, pm.*
FROM "Paciente" p
LEFT JOIN "PersonalMilitar" pm ON p.id = pm."pacienteId"
WHERE p."tipoPaciente" = 'MILITAR';

-- Ver pacientes afiliados con su información de afiliación
SELECT p.*, a.*
FROM "Paciente" p
LEFT JOIN "Afiliado" a ON p.id = a."pacienteId"
WHERE p."tipoPaciente" = 'AFILIADO';

-- Ver afiliados por militar titular
SELECT 
  a."titularNombre",
  a."titularCi",
  COUNT(*) as "numAfiliados"
FROM "Afiliado" a
GROUP BY a."titularNombre", a."titularCi"
ORDER BY "numAfiliados" DESC;
```

---

## ✅ Checklist de Implementación

### Backend
- [x] Eliminar columna `region` del schema
- [x] Agregar campo `tipoPaciente` al modelo `Paciente`
- [x] Crear modelo `Afiliado`
- [x] Aplicar migración
- [ ] Actualizar controlador `crearPaciente` para manejar `tipoPaciente`
- [ ] Agregar lógica para crear registro de `Afiliado`
- [ ] Actualizar endpoints de consulta para incluir datos de afiliación

### Frontend
- [ ] Crear componente `PatientTypeSelector`
- [ ] Crear componente `AfiliadoDataSection`
- [ ] Modificar `RegisterPatientForm` para mostrar selector
- [ ] Actualizar estado del formulario para incluir tipo y datos de afiliado
- [ ] Actualizar validaciones según tipo de paciente
- [ ] Actualizar `handleSubmit` para enviar datos correctos
- [ ] Agregar estilos CSS para nuevos componentes
- [ ] Probar flujo completo para cada tipo de paciente

### Testing
- [ ] Probar registro de paciente MILITAR
- [ ] Probar registro de paciente AFILIADO
- [ ] Probar registro de paciente PNA
- [ ] Verificar validaciones específicas por tipo
- [ ] Verificar almacenamiento correcto en BD

---

## 🎨 Notas de Diseño

1. **Colores sugeridos para botones de tipo**:
   - MILITAR: Verde militar (#4A5D3F)
   - AFILIADO: Azul (#3B82F6)
   - PNA: Gris (#6B7280)

2. **Iconos**: Puedes usar emojis o una librería como react-icons

3. **Navegación**: Agregar botón "← Cambiar tipo" para permitir que el usuario vuelva a seleccionar

4. **Validación en tiempo real**: Mostrar errores específicos según el tipo seleccionado

---

## 📞 Próximos Pasos con el Teniente

Confirmar con el Teniente:
1. ¿Los campos de afiliado propuestos son correctos?
2. ¿Hay algún formato específico para el número de carnet?
3. ¿Existen más parentescos que deben incluirse?
4. ¿Se necesita validar la vigencia de la afiliación al momento del registro?
5. ¿Los pacientes PNA requieren algún dato adicional especial?
