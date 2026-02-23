# 👥 CÓMO CAMBIAR ROLES DE COLABORADORES EN GITHUB (2025)

**Propósito:** Mostrar dónde está la opción de Admin que se movió  
**Fecha:** 31 de Octubre, 2025  
**Nota:** GitHub también actualizó esto (como con Rulesets)

---

## 🔴 PROBLEMA: No encuentro la opción para cambiar a Admin

**Síntoma:**
```
Voy a: Settings > Collaborators and teams
Veo: Lista de colaboradores
Pero: No hay botón para cambiar rol a "Admin"
```

---

## 🟢 SOLUCIÓN: La opción se movió

### UBICACIÓN ANTIGUA (no funciona)
```
Settings > Collaborators and teams
  └─ [Había un dropdown para cambiar rol]
     └─ Cambiar a: Admin, Write, Read
     └─ ❌ YA NO ESTÁ AQUÍ
```

### UBICACIÓN NUEVA (2025)
```
GitHub tiene 2 caminos para cambiar roles:

CAMINO 1: Acceso del Repositorio (Para un solo repo)
  └─ Settings > Collaborators and teams > Collaborators
     └─ AQUÍ hay un dropdown (pero limitado)

CAMINO 2: Acceso de la Organización (Mejor, si tienes org)
  └─ Settings > Member privileges
     └─ O en tu Organización: Settings > Members and teams
        └─ AQUÍ sí ves Admin, Write, Read

CAMINO 3: Directamente desde el repo
  └─ Settings > Access
     └─ Click en el usuario
     └─ Selector de rol (Admin, Maintain, Write, Triage, Read)
```

---

## 📍 DÓNDE ESTÁ EXACTAMENTE (PASO A PASO)

### OPCIÓN 1: Por Repositorio (Si eres Admin del repo)

```
1. Ve a: https://github.com/cmoinr/hospital-management
2. Click en: Settings (pestaña arriba a la derecha)
3. En LEFT SIDEBAR, busca: "Access"
4. Click en: "Collaborators" (o Collaborators and teams)
5. Verás la lista de colaboradores
6. Click en el nombre del colaborador que quieres cambiar
7. En el popup, busca el DROPDOWN de rol
8. Selecciona: "Admin"
9. Click: "Save" o "Confirm"
```

### OPCIÓN 2: Por panel "Access" (Más claro)

```
1. Ve a: https://github.com/cmoinr/hospital-management
2. Click en: Settings
3. En LEFT SIDEBAR > "Access" (nueva sección)
   (Si no ves "Access", busca "Collaborators and teams")
4. Verás: "Manage collaborators"
5. Encuentra el usuario
6. Al lado derecho, hay un dropdown (probablemente dice "Write")
7. Click en el dropdown
8. Selecciona: "Admin"
9. Confirma
```

---

## 🎯 LOS 5 NIVELES DE ROL EN GITHUB (2025)

```
Desde más restringido hasta más permiso:

1. Read (Lectura)
   └─ Solo puede ver el código
   └─ NO puede hacer cambios

2. Triage
   └─ Puede ver + crear issues
   └─ NO puede hacer push

3. Write (Escritura)
   └─ Puede hacer push a ramas
   └─ Puede crear PRs
   └─ NO puede cambiar settings
   └─ ✅ PARA DEVS

4. Maintain (Mantenimiento)
   └─ Puede hacer todo excepto:
     └─ NO puede cambiar acceso
     └─ NO puede eliminar repo
     └─ Para líderes técnicos

5. Admin (Administrador)
   └─ Acceso total
   └─ Puede cambiar settings
   └─ Puede agregar/eliminar colaboradores
   └─ Puede eliminar el repo
   └─ ✅ SOLO PARA LÍDERES
```

---

## 📋 PARA TU EQUIPO (10 ROLES)

```
TÚ + CO-LÍDER (2):
└─ Rol: Admin
   └─ Acceso completo

Backend Leads + Frontend Leads (2):
└─ Rol: Maintain
   └─ Casi todo excepto eliminar repo

Devs de Backend + Frontend (6):
└─ Rol: Write
   └─ Push, PRs, normal development
```

---

## 🛠️ PASO A PASO: CAMBIAR A ADMIN

### Para Co-líder (hacerlo Admin)

```
1. Ve a: https://github.com/cmoinr/hospital-management/settings/access

2. En "Manage access", busca: [nombre-co-lider]

3. A la derecha, ves un selector (probablemente dice "Write")

4. Click en el selector

5. Aparece un dropdown:
   ├─ Read
   ├─ Triage
   ├─ Write
   ├─ Maintain
   └─ Admin ← SELECCIONA ESTE

6. Click en: "Admin"

7. Confirma en el popup si te lo pide

8. Listo ✅ Co-líder ahora es Admin
```

### Resultado esperado

```
ANTES:
[Co-líder name]    Write    [v]

DESPUÉS:
[Co-líder name]    Admin    [v]
```

---

## 🎓 DIFERENCIA: Admin vs Maintain

| Acción | Write | Maintain | Admin |
|--------|-------|----------|-------|
| Push a ramas | ✅ | ✅ | ✅ |
| Crear PRs | ✅ | ✅ | ✅ |
| Mergear PRs | ✅ | ✅ | ✅ |
| Cambiar settings | ❌ | ❌ | ✅ |
| Cambiar protecciones | ❌ | ❌ | ✅ |
| Agregar colaboradores | ❌ | ❌ | ✅ |
| Eliminar repo | ❌ | ❌ | ✅ |
| Cambiar visibilidad | ❌ | ❌ | ✅ |

---

## ⚠️ SI NO VES LOS CAMBIOS

### Problema: No veo la opción de Admin

```
CAUSAS POSIBLES:

1. No estás en Settings del repo correcto
   └─ Verifica: URL debe ser hospital-management/settings

2. No eres Admin del repo
   └─ Solución: Solo Admin actual puede hacer esto

3. GitHub UI diferente (versión beta)
   └─ Solución: Limpia cache (Ctrl+Shift+Delete)
   └─ O intenta en navegador incógnito

4. Aún no existe la sección "Access"
   └─ Solución: Ve a "Collaborators and teams"
   └─ Busca el usuario y edita desde ahí
```

### Si aún no funciona

```
RUTA ALTERNATIVA:

1. Ve a: Settings > Collaborators and teams
2. Busca: El nombre del colaborador
3. Deberías ver un pequeño icono "⚙️" o "..."
4. Click en ese icono
5. Selecciona: "Change role to Admin"
```

---

## 🔗 REFERENCIA RÁPIDA

| Lo que quieres | Dónde ir |
|---|---|
| Cambiar colaborador a Admin | Settings > Access > Dropdown de rol |
| Ver todos los colaboradores | Settings > Collaborators and teams |
| Invitar nuevo colaborador | Settings > Collaborators and teams > Add people |
| Cambiar tu propio rol | No puedes (debe hacerlo otro Admin) |
| Remover a alguien | Settings > Collaborators > Botón "Remove" |

---

## 📞 PARA TU PROYECTO

**Tarea hoy:**
```
[ ] Cambiar Co-líder a Admin
    └─ Settings > Access > Select "Admin"

[ ] Invitar 8 devs como "Write"
    └─ Settings > Collaborators and teams > Add people
    └─ Selecciona rol: "Write"

[ ] Revisar roles:
    └─ Tú: Admin ✓
    └─ Co-líder: Admin
    └─ 2 Leads: Maintain (opcional)
    └─ 6 Devs: Write
```

---

## 💡 MEJORA: Usando GitHub Teams

**Opcional pero recomendado:**

```
En lugar de agregar colaboradores uno por uno,
puedes usar "Teams":

GitHub > Organización > Teams
├─ Crear: "Backend" (rol: Write)
├─ Crear: "Frontend" (rol: Write)
├─ Crear: "Leads" (rol: Admin)
└─ Agregar miembros a cada team

VENTAJA:
└─ Cambiar permisos en grupo
└─ Mejor organización
└─ Escalable
```

---

**Documento:** Cómo Cambiar Roles de Colaboradores (2025)  
**Última actualización:** 31 de Octubre, 2025  
**Crítico para:** Agregar colaboradores antes del kickoff
