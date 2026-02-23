# 💻 Guía de Implementación - Código de Referencia

**Documento de Apoyo:** Ejemplos prácticos y snippets de código  
**Para:** 2 Desarrolladores Backend + Frontend

---

## 📋 Tabla de Contenidos

1. [Backend - Migrations](#backend---migrations)
2. [Backend - Servicios](#backend---servicios)
3. [Backend - Endpoints](#backend---endpoints)
4. [Backend - Validaciones](#backend---validaciones)
5. [Frontend - Estados y Effects](#frontend---estados-y-effects)
6. [Frontend - Funciones Helper](#frontend---funciones-helper)

---

## Backend - Migrations

### Migration: Crear tabla `HorarioMedico`

**Archivo:** `prisma/migrations/[timestamp]_create_horario_medico.sql`

```sql
-- CreateTable HorarioMedico
CREATE TABLE "HorarioMedico" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "especialidad" VARCHAR(100) NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "horaInicio" VARCHAR(8) NOT NULL,
    "horaFin" VARCHAR(8) NOT NULL,
    "capacidadPorDia" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "HorarioMedico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HorarioMedico_usuarioId_idx" ON "HorarioMedico"("usuarioId");
CREATE INDEX "HorarioMedico_especialidad_idx" ON "HorarioMedico"("especialidad");
CREATE INDEX "HorarioMedico_diaSemana_idx" ON "HorarioMedico"("diaSemana");
CREATE UNIQUE INDEX "HorarioMedico_usuarioId_especialidad_diaSemana_key" ON "HorarioMedico"("usuarioId", "especialidad", "diaSemana");

-- AddForeignKey
ALTER TABLE "HorarioMedico" ADD CONSTRAINT "HorarioMedico_usuarioId_fkey" 
FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

### Migration: Modificar tabla `Cita`

Si `medicoId` es actualmente nullable, hacerlo requerido:

```sql
-- AlterTable Cita - medicoId requerido
ALTER TABLE "Cita" 
ALTER COLUMN "medicoId" SET NOT NULL;

-- AddForeignKey (si no existe)
ALTER TABLE "Cita" 
ADD CONSTRAINT "Cita_medicoId_fkey" 
FOREIGN KEY ("medicoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

---

## Backend - Servicios

### Servicio: `services/disponibilidad.ts` (NUEVO)

```typescript
import { PrismaClient } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

const prisma = new PrismaClient()

/**
 * Obtiene médicos por especialidad con sus horarios
 */
export const obtenerMedicosPorEspecialidad = async (especialidad: string) => {
  try {
    const horarios = await prisma.horarioMedico.findMany({
      where: {
        especialidad: especialidad,
        activo: true,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    })

    // Agrupar por médico
    const medicosMap = new Map()
    horarios.forEach((horario) => {
      const medico = horario.usuario
      if (!medicosMap.has(medico.id)) {
        medicosMap.set(medico.id, {
          id: medico.id,
          nombre: medico.nombre,
          email: medico.email,
          especialidad: especialidad,
          horarios: [],
        })
      }
      medicosMap.get(medico.id).horarios.push({
        id: horario.id,
        diaSemana: horario.diaSemana,
        horaInicio: horario.horaInicio,
        horaFin: horario.horaFin,
        capacidadPorDia: horario.capacidadPorDia,
        activo: horario.activo,
      })
    })

    return Array.from(medicosMap.values())
  } catch (error) {
    console.error('Error al obtener médicos:', error)
    throw new Error('Error al obtener médicos disponibles')
  }
}

/**
 * Obtiene disponibilidad de un médico en una fecha específica
 */
export const obtenerDisponibilidadMedico = async (
  medicoId: number,
  fecha: Date,
  especialidad: string
) => {
  try {
    // Día de la semana (0 = Lunes)
    const diaSemana = (fecha.getDay() + 6) % 7

    // Obtener horario del médico para ese día y especialidad
    const horario = await prisma.horarioMedico.findFirst({
      where: {
        usuarioId: medicoId,
        especialidad: especialidad,
        diaSemana: diaSemana,
        activo: true,
      },
    })

    // Si no atiende ese día
    if (!horario) {
      return {
        medicoId,
        fecha: fecha.toISOString().split('T')[0],
        diaSemana,
        atiendeSeDia: false,
        horaInicio: null,
        horaFin: null,
        capacidadTotal: null,
        citasYaProgramadas: 0,
        espaciosDisponibles: 0,
        diasDisponibles: await obtenerProximosDiasDisponibles(medicoId, especialidad),
      }
    }

    // Contar citas ya programadas para ese día
    const citasCount = await prisma.cita.count({
      where: {
        medicoId: medicoId,
        fechaCita: {
          gte: new Date(fecha.toISOString().split('T')[0]),
          lt: new Date(fecha.toISOString().split('T')[0] + 'T23:59:59Z'),
        },
        estado: 'PROGRAMADA',
      },
    })

    const espaciosDisponibles = horario.capacidadPorDia - citasCount

    return {
      medicoId,
      fecha: fecha.toISOString().split('T')[0],
      diaSemana,
      atiendeSeDia: true,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      capacidadTotal: horario.capacidadPorDia,
      citasYaProgramadas: citasCount,
      espaciosDisponibles: Math.max(0, espaciosDisponibles),
      diasDisponibles: await obtenerProximosDiasDisponibles(medicoId, especialidad),
    }
  } catch (error) {
    console.error('Error al obtener disponibilidad:', error)
    throw new Error('Error al obtener disponibilidad')
  }
}

/**
 * Obtiene los próximos días disponibles para un médico
 */
export const obtenerProximosDiasDisponibles = async (
  medicoId: number,
  especialidad: string,
  dias: number = 7
) => {
  try {
    const proximosDias = []
    const fechaActual = new Date()

    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

    for (let i = 0; i < dias; i++) {
      const fecha = new Date(fechaActual)
      fecha.setDate(fecha.getDate() + i)

      const diaSemana = (fecha.getDay() + 6) % 7

      // No contar fin de semana (5 = sábado, 6 = domingo en formato ISO)
      if (diaSemana >= 5) continue

      const horario = await prisma.horarioMedico.findFirst({
        where: {
          usuarioId: medicoId,
          especialidad: especialidad,
          diaSemana: diaSemana,
          activo: true,
        },
      })

      if (horario) {
        const citasCount = await prisma.cita.count({
          where: {
            medicoId: medicoId,
            fechaCita: {
              gte: new Date(fecha.toISOString().split('T')[0]),
              lt: new Date(fecha.toISOString().split('T')[0] + 'T23:59:59Z'),
            },
            estado: 'PROGRAMADA',
          },
        })

        const espacios = horario.capacidadPorDia - citasCount

        proximosDias.push({
          dia: diasSemana[diaSemana],
          fecha: fecha.toISOString().split('T')[0],
          disponible: espacios > 0,
          espacios: Math.max(0, espacios),
        })

        if (proximosDias.length >= dias) break
      }
    }

    return proximosDias
  } catch (error) {
    console.error('Error al obtener próximos días:', error)
    return []
  }
}

/**
 * Valida si se puede programar una cita para un médico
 */
export const validarDisponibilidadParaCita = async (
  medicoId: number,
  especialidad: string,
  fechaCita: Date,
  horaCita?: string
): Promise<{ valido: boolean; error?: string; detalles?: any }> => {
  try {
    // 1. Verificar que el médico existe
    const medico = await prisma.usuario.findUnique({
      where: { id: medicoId },
    })

    if (!medico) {
      return { valido: false, error: 'El médico no existe' }
    }

    // 2. Verificar que el médico atiende esa especialidad y ese día
    const diaSemana = (fechaCita.getDay() + 6) % 7

    const horario = await prisma.horarioMedico.findFirst({
      where: {
        usuarioId: medicoId,
        especialidad: especialidad,
        diaSemana: diaSemana,
        activo: true,
      },
    })

    if (!horario) {
      const proximosDias = await obtenerProximosDiasDisponibles(medicoId, especialidad)
      return {
        valido: false,
        error: `El médico no atiende la especialidad "${especialidad}" los ${['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'][diaSemana]}`,
        detalles: { proximosDias },
      }
    }

    // 3. Validar hora si se proporciona
    if (horaCita) {
      if (horaCita < horario.horaInicio || horaCita > horario.horaFin) {
        return {
          valido: false,
          error: `La hora ${horaCita} está fuera del horario de atención (${horario.horaInicio} - ${horario.horaFin})`,
        }
      }
    }

    // 4. Verificar capacidad
    const citasCount = await prisma.cita.count({
      where: {
        medicoId: medicoId,
        fechaCita: {
          gte: new Date(fechaCita.toISOString().split('T')[0]),
          lt: new Date(fechaCita.toISOString().split('T')[0] + 'T23:59:59Z'),
        },
        estado: 'PROGRAMADA',
      },
    })

    if (citasCount >= horario.capacidadPorDia) {
      const proximosDias = await obtenerProximosDiasDisponibles(medicoId, especialidad)
      return {
        valido: false,
        error: `El médico ha alcanzado su capacidad máxima (${horario.capacidadPorDia} pacientes) para ${fechaCita.toISOString().split('T')[0]}`,
        detalles: { proximosDias },
      }
    }

    return { valido: true }
  } catch (error) {
    console.error('Error al validar disponibilidad:', error)
    return { valido: false, error: 'Error al validar disponibilidad' }
  }
}
```

---

## Backend - Endpoints

### Controlador: `controllers/citas.ts` (MODIFICACIONES)

```typescript
import { validarDisponibilidadParaCita, obtenerMedicosPorEspecialidad, obtenerDisponibilidadMedico } from '../services/disponibilidad'

/**
 * GET /api/medicos/especialidad/:especialidad
 * Obtener médicos por especialidad
 */
export const obtenerMedicosPorEspecialidad = async (req: Request, res: Response): Promise<void> => {
  try {
    const { especialidad } = req.params

    if (!especialidad) {
      res.status(400).json({
        success: false,
        message: 'Especialidad requerida',
      })
      return
    }

    const medicos = await obtenerMedicosPorEspecialidad(decodeURIComponent(especialidad))

    if (medicos.length === 0) {
      res.status(404).json({
        success: false,
        message: `No hay médicos disponibles para la especialidad: ${especialidad}`,
      })
      return
    }

    res.json({
      success: true,
      data: medicos,
    })
  } catch (error: any) {
    console.error('Error:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

/**
 * GET /api/medicos/:medicoId/disponibilidad?fecha=YYYY-MM-DD&especialidad=...
 * Obtener disponibilidad de un médico
 */
export const obtenerDisponibilidad = async (req: Request, res: Response): Promise<void> => {
  try {
    const { medicoId } = req.params
    const { fecha, especialidad } = req.query

    if (!fecha || !especialidad) {
      res.status(400).json({
        success: false,
        message: 'Parámetros requeridos: fecha, especialidad',
      })
      return
    }

    // Validar formato de fecha
    const fechaParsed = new Date(fecha as string)
    if (isNaN(fechaParsed.getTime())) {
      res.status(400).json({
        success: false,
        message: 'Formato de fecha inválido (usar YYYY-MM-DD)',
      })
      return
    }

    const disponibilidad = await obtenerDisponibilidadMedico(
      Number(medicoId),
      fechaParsed,
      decodeURIComponent(especialidad as string)
    )

    res.json({
      success: true,
      data: disponibilidad,
    })
  } catch (error: any) {
    console.error('Error:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

/**
 * POST /api/citas
 * MODIFICADO: Ahora valida disponibilidad del médico
 */
export const crearCita = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pacienteId, medicoId, fechaCita, horaCita, especialidad, motivo, notas } = req.body

    // Validar campos requeridos
    if (!pacienteId || !medicoId || !fechaCita || !especialidad) {
      res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: pacienteId, medicoId, fechaCita, especialidad',
      })
      return
    }

    // Validar que el paciente exista
    const pacienteExiste = await prisma.paciente.findUnique({
      where: { id: Number(pacienteId) },
    })

    if (!pacienteExiste) {
      res.status(404).json({
        success: false,
        message: 'El paciente no existe',
      })
      return
    }

    // **NUEVO:** Validar disponibilidad del médico
    const fechaParsed = new Date(fechaCita)
    const validacion = await validarDisponibilidadParaCita(
      Number(medicoId),
      especialidad,
      fechaParsed,
      horaCita
    )

    if (!validacion.valido) {
      res.status(409).json({
        success: false,
        message: validacion.error,
        detalles: validacion.detalles,
      })
      return
    }

    // Crear la cita
    const cita = await prisma.cita.create({
      data: {
        pacienteId: Number(pacienteId),
        medicoId: Number(medicoId), // Ahora es requerido
        fechaCita: fechaParsed,
        horaCita: horaCita || null,
        especialidad,
        motivo: motivo || null,
        notas: notas || null,
        estado: 'PROGRAMADA',
      },
      include: {
        paciente: {
          select: { id: true, nroHistoria: true, apellidosNombres: true, ci: true },
        },
        medico: {
          select: { id: true, nombre: true, email: true },
        },
      },
    })

    res.status(201).json({
      success: true,
      message: 'Cita programada exitosamente',
      data: cita,
    })
  } catch (error: any) {
    console.error('Error:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}
```

### Rutas: `routes/citas.ts` (AGREGAR)

```typescript
// Agregar estas rutas al Router existente

// Obtener médicos por especialidad
router.get('/medicos/especialidad/:especialidad', obtenerMedicosPorEspecialidad)

// Obtener disponibilidad de un médico
router.get('/medicos/:medicoId/disponibilidad', obtenerDisponibilidad)
```

---

## Backend - Validaciones

### Archivo: `src/utils/validadores.ts` (NUEVO/AGREGAR)

```typescript
/**
 * Valida formato de hora HH:MM
 */
export const esHoraValida = (hora: string): boolean => {
  const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
  return regex.test(hora)
}

/**
 * Valida formato de fecha YYYY-MM-DD
 */
export const esFechaValida = (fecha: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(fecha)) return false

  const d = new Date(fecha)
  return d instanceof Date && !isNaN(d.getTime())
}

/**
 * Valida que la fecha no sea pasada
 */
export const esProxima = (fecha: Date): boolean => {
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  return fecha >= hoy
}

/**
 * Compara dos horas en formato HH:MM
 */
export const compararHoras = (hora1: string, hora2: string): number => {
  // Retorna: -1 si hora1 < hora2, 0 si son iguales, 1 si hora1 > hora2
  return hora1.localeCompare(hora2)
}
```

---

## Frontend - Estados y Effects

### Componente: `CreateAppointmentForm.tsx` (EXTRACTOS)

```typescript
// AGREGAR ESTADOS
const [medicosDisponibles, setMedicosDisponibles] = useState<any[]>([])
const [loadingMedicos, setLoadingMedicos] = useState(false)
const [disponibilidadMedico, setDisponibilidadMedico] = useState<any>(null)

// ACTUALIZAR appointmentData
const [appointmentData, setAppointmentData] = useState({
  fecha: '',
  hora: '',
  especialidad: '',
  medico: '', // Cambiar de string a "" (ID del médico)
  motivo: '',
})

// EFFECT: Cargar médicos al cambiar especialidad
useEffect(() => {
  if (appointmentData.especialidad) {
    cargarMedicosEspecialidad(appointmentData.especialidad)
  } else {
    setMedicosDisponibles([])
    setDisponibilidadMedico(null)
  }
}, [appointmentData.especialidad])

const cargarMedicosEspecialidad = async (especialidad: string) => {
  setLoadingMedicos(true)
  setMedicosDisponibles([])
  try {
    const response = await fetch(
      `${API_BASE_URL}/medicos/especialidad/${encodeURIComponent(especialidad)}`
    )
    const result = await response.json()

    if (result.success) {
      setMedicosDisponibles(result.data || [])
    } else {
      setSearchError(result.message || 'No se pudieron cargar los médicos')
    }
  } catch (err: any) {
    console.error('Error al cargar médicos:', err)
    setSearchError('Error al cargar médicos disponibles')
  } finally {
    setLoadingMedicos(false)
  }
}

// EFFECT: Validar disponibilidad al cambiar fecha o médico
useEffect(() => {
  if (appointmentData.medico && appointmentData.fecha && appointmentData.especialidad) {
    validarDisponibilidadMedico()
  }
}, [appointmentData.fecha, appointmentData.medico, appointmentData.especialidad])

const validarDisponibilidadMedico = async () => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/medicos/${appointmentData.medico}/disponibilidad?` +
      `fecha=${appointmentData.fecha}&` +
      `especialidad=${encodeURIComponent(appointmentData.especialidad)}`
    )
    const result = await response.json()

    if (result.success) {
      setDisponibilidadMedico(result.data)

      // Validar y mostrar errores
      const newErrors = { ...errors }
      if (!result.data.atiendeSeDia) {
        newErrors.fecha = `El médico no atiende ${obtenerDiaSemana(result.data.diaSemana)}`
      } else if (result.data.espaciosDisponibles <= 0) {
        newErrors.fecha = 'El médico no tiene espacios disponibles ese día'
      } else {
        delete newErrors.fecha
      }
      setErrors(newErrors)
    } else {
      setDisponibilidadMedico(null)
    }
  } catch (err: any) {
    console.error('Error:', err)
    setDisponibilidadMedico(null)
  }
}
```

---

## Frontend - Funciones Helper

### Archivo: `src/utils/medicoUtils.ts` (NUEVO)

```typescript
/**
 * Obtiene el nombre del día de la semana (0=Lunes, 4=Viernes)
 */
export const obtenerDiaSemana = (diaSemana: number): string => {
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
  return dias[diaSemana] || 'Desconocido'
}

/**
 * Formatea la información de disponibilidad para mostrar al usuario
 */
export const formatearDisponibilidad = (disponibilidad: any): string => {
  if (!disponibilidad) return ''

  if (!disponibilidad.atiendeSeDia) {
    return `No atiende los ${obtenerDiaSemana(disponibilidad.diaSemana)}`
  }

  if (disponibilidad.espaciosDisponibles <= 0) {
    return `Sin espacios disponibles (${disponibilidad.citasYaProgramadas}/${disponibilidad.capacidadTotal})`
  }

  return `${disponibilidad.espaciosDisponibles} espacios disponibles (${disponibilidad.citasYaProgramadas}/${disponibilidad.capacidadTotal})`
}

/**
 * Calcula el color de fondo según disponibilidad
 */
export const colorDisponibilidad = (disponibilidad: any): string => {
  if (!disponibilidad) return 'var(--bg-tertiary)'
  if (!disponibilidad.atiendeSeDia || disponibilidad.espaciosDisponibles <= 0) {
    return 'rgba(239, 68, 68, 0.1)' // Rojo
  }
  return 'rgba(16, 185, 129, 0.1)' // Verde
}

/**
 * Obtiene sugerencias de fechas alternativas
 */
export const obtenerSugerenciasAlternativas = (disponibilidad: any): string[] => {
  if (!disponibilidad?.diasDisponibles) return []

  return disponibilidad.diasDisponibles
    .filter((d: any) => d.disponible && d.espacios > 0)
    .slice(0, 3)
    .map((d: any) => `${d.dia} ${d.fecha}`)
}
```

---

## 🗂️ Estructura de Carpetas

```
backend/
├── src/
│   ├── controllers/
│   │   └── citas.ts (MODIFICAR)
│   ├── services/
│   │   └── disponibilidad.ts (NUEVO)
│   ├── routes/
│   │   └── citas.ts (MODIFICAR)
│   └── utils/
│       └── validadores.ts (NUEVO)
└── prisma/
    ├── schema.prisma (MODIFICAR)
    └── migrations/
        └── [timestamp]_create_horario_medico/ (NUEVO)

frontend/
└── src/
    ├── pages/
    │   └── AdminDashboard/
    │       └── components/
    │           └── CreateAppointmentForm.tsx (MODIFICAR)
    └── utils/
        └── medicoUtils.ts (NUEVO)
```

---

## 🧪 Testing - Casos de Prueba

### Backend - Manual Testing con cURL

```bash
# 1. Obtener médicos por especialidad
curl http://localhost:3000/api/medicos/especialidad/Medicina%20Interna

# 2. Obtener disponibilidad
curl "http://localhost:3000/api/medicos/5/disponibilidad?fecha=2026-01-25&especialidad=Medicina%20Interna"

# 3. Crear cita (EXITOSA)
curl -X POST http://localhost:3000/api/citas \
  -H "Content-Type: application/json" \
  -d '{
    "pacienteId": 1,
    "medicoId": 5,
    "fechaCita": "2026-01-25",
    "horaCita": "10:30",
    "especialidad": "Medicina Interna",
    "motivo": "Consulta de rutina"
  }'

# 4. Crear cita (FALLA - médico sin espacios)
curl -X POST http://localhost:3000/api/citas \
  -H "Content-Type: application/json" \
  -d '{
    "pacienteId": 2,
    "medicoId": 5,
    "fechaCita": "2026-01-25",
    "horaCita": "11:00",
    "especialidad": "Medicina Interna"
  }'
```

---

## 📚 Recursos Adicionales

- Documento Principal: `REQUERIMIENTO_GESTION_DISPONIBILIDAD_MEDICOS.md`
- Brief: `BRIEF_DISPONIBILIDAD_MEDICOS.md`
- Schema Prisma: `prisma/schema.prisma`
- Componente: `CreateAppointmentForm.tsx`

---

**Versión:** 1.0 | **Fecha:** Enero 22, 2026
