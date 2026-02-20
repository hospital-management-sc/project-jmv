# 📋 BRIEF EJECUTIVO - Disponibilidad de Médicos en Citas

**Para:** Equipo de Desarrollo (2 Devs)  
**Fecha:** Enero 22, 2026  
**Duración Estimada:** 6-8 días  
**Complejidad:** Media (Backend + Frontend)

---

## 🎯 El Problema

El formulario actual de "Generar Cita" **no valida disponibilidad de médicos**:

```
❌ No muestra médicos por especialidad
❌ No verifica horarios (qué días atienden)
❌ No controla capacidad (cuántos pacientes máximo/día)
→ Riesgo: Citas sin médico o sobrecapacidad
```

---

## ✅ La Solución

Implementar un **sistema de validación de disponibilidad** que:

1. **Backend:** Almacenar horarios médicos y validar disponibilidad
2. **Frontend:** Mostrar médicos disponibles dinámicamente
3. **Validación:** Rechazar citas sin capacidad o fuera de horario

---

## 📊 Cambios de Datos

### Tabla Nueva: `HorarioMedico`
```
usuarioId (FK) | especialidad | diaSemana | horaInicio | horaFin | capacidadPorDia
```

### Tabla Existente: `Cita`
```
medicoId: pasar de OPCIONAL → REQUERIDO
```

---

## 🔌 Endpoints Nuevos/Modificados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/medicos/especialidad/:especialidad` | Lista médicos + horarios |
| GET | `/api/medicos/:medicoId/disponibilidad?fecha=YYYY-MM-DD` | Valida disponibilidad |
| POST | `/api/citas` | **MODIFICADO:** Ahora valida medico disponible |

---

## 🎨 Cambios Frontend

**En `CreateAppointmentForm.tsx`:**

```
Antes:
- Especialidad → [Médico: texto libre opcional]

Después:
- Especialidad → [Médico: select cargado dinámicamente]
                → [Indicador: "✅ 7/15 espacios disponibles"]
                → [Si no hay: "Próximas fechas: Lunes, Martes..."]
```

---

## 📦 Tareas Divididas

### Dev 1: Backend
- [ ] Migration `HorarioMedico`
- [ ] Servicios de validación
- [ ] Endpoints 3 nuevos/modificados
- [ ] Seeds de ejemplo

### Dev 2: Frontend
- [ ] Cargar médicos dinámicamente
- [ ] Validar disponibilidad en tiempo real
- [ ] UI feedback visual
- [ ] Testing de integración

---

## ⏰ Timeline

| Fase | Días | Dev |
|------|------|-----|
| Backend completo | 3-4 | Dev 1 |
| Frontend completo | 2-3 | Dev 2 |
| Testing integrado | 1-2 | Ambos |
| **Total** | **6-9** | - |

---

## 🧪 Validaciones Críticas

El backend **debe verificar:**
- ✅ Médico atiende esa especialidad
- ✅ Médico atiende ese día
- ✅ Hora está en rango horario
- ✅ Hay capacidad disponible
- ✅ No hay cita duplicada

---

## 🐛 Casos Edge

- ¿Citas ya existentes sin médico? → Discutir migración
- ¿Performance con muchos médicos? → Considerar caché
- ¿Urgencias que reservan espacio? → Define en specs

---

## 📖 Documentación Detallada

Ver: `REQUERIMIENTO_GESTION_DISPONIBILIDAD_MEDICOS.md` (documento completo con ejemplos de respuesta, código, etc.)

---

## ✋ Antes de Empezar

Confirmar:
1. ¿Horarios médicos ya existen en papel/sistema?
2. ¿Capacidad típica por médico? (ej: 15 pacientes/día)
3. ¿Cómo manejar citas existentes sin médico?

---

**Versión Rápida Creada:** Enero 22, 2026
