# 📖 TUTORIAL VISUAL: CREAR WIKI EN GITHUB

**Propósito:** Paso a paso con imágenes conceptuales para llenar la Wiki  
**Tiempo:** 30-45 minutos para todas las páginas  
**Fecha:** 31 de Octubre, 2025

---

## 🎬 PASO A PASO CON IMÁGENES CONCEPTUALES

### PASO 1: Acceder a la Wiki

```
GitHub UI:

┌──────────────────────────────────────┐
│ hospital-management                  │
├──────────────────────────────────────┤
│ Code  Issues  Pull requests  Wiki ← AQUÍ │
│                                    │
│                                    │
└──────────────────────────────────────┘
```

**Instrucciones:**
```
1. Ve a: https://github.com/cmoinr/hospital-management
2. En la barra horizontal, busca: "Wiki"
3. Click en "Wiki"
4. Verás: "Create the first page"
5. Click en ese botón
```

---

### PASO 2: Crear Primera Página "Home"

```
Formulario que ves:

┌────────────────────────────────────────┐
│ Wiki                                   │
├────────────────────────────────────────┤
│ [+ New page] [Edit sidebar]            │
├────────────────────────────────────────┤
│                                        │
│ Title:  [Home________________]         │
│                                        │
│ Sidebar title: [optional]              │
│                                        │
│ Content:                               │
│ ┌──────────────────────────────────┐  │
│ │ # 🏥 Hospital Management System  │  │
│ │                                  │  │
│ │ PWA de gestión clínica...        │  │
│ └──────────────────────────────────┘  │
│                                        │
│ [Save page] [Cancel]                  │
└────────────────────────────────────────┘
```

**Acciones:**
```
1. Title: Escribe "Home"
2. Sidebar title: Dejar vacío
3. Content: Copia el contenido de GUIA_LLENAR_WIKI_Y_LIMPIAR_REPO.md
   └─ Busca la sección "Contenido de Home"
4. Click: "Save page"
5. Espera 2 segundos
6. Listo ✓
```

---

### PASO 3: Ver que se creó correctamente

```
Después de crear:

┌──────────────────────────────────────┐
│ Wiki                                 │
├──────────────────────────────────────┤
│ [+ New page] [Edit sidebar]          │
├──────────────────────────────────────┤
│                                      │
│ Home ← AQUÍ APARECE                  │
│ Last updated 1 minute ago            │
│                                      │
│ 🏥 Hospital Management System        │
│ PWA de gestión clínica...            │
│                                      │
└──────────────────────────────────────┘
```

**Si ves esto: ✅ Funciona**

---

### PASO 4: Crear Segunda Página "Quick Start"

```
1. Click en: [+ New page]

Abre nuevo formulario

┌────────────────────────────────────────┐
│ Wiki                                   │
├────────────────────────────────────────┤
│ Title:  [01-Quick-Start_______]        │
│                                        │
│ Sidebar title: [Quick Start]           │
│                                        │
│ Content:                               │
│ ┌──────────────────────────────────┐  │
│ │ # 🚀 Quick Start                 │  │
│ │                                  │  │
│ │ ## Requisitos                    │  │
│ │ - Docker...                      │  │
│ └──────────────────────────────────┘  │
│                                        │
│ [Save page]                            │
└────────────────────────────────────────┘
```

**Acciones:**
```
1. Title: "01-Quick-Start"
2. Sidebar title: "Quick Start"
   (Esto aparece en el índice lateral)
3. Content: Copia de GUIA_LLENAR_WIKI_Y_LIMPIAR_REPO.md
   └─ Sección "PASO 6: CREAR PÁGINA Quick Start"
4. Click: "Save page"
```

---

### PASO 5: Crear Más Páginas (Patrón)

Repite el PASO 4 para cada una:

```
┌─────────────────────────────────────────┐
│ Title          │ Sidebar Title         │
├─────────────────────────────────────────┤
│ 02-Setup       │ Setup Inicial         │
│ 03-Roles       │ Roles y Responsab...  │
│ 04-Rulesets    │ Protecciones de Rama  │
│ 05-Git-Workflow│ Flujo de Git          │
│ 06-Backend     │ Backend               │
│ 07-Frontend    │ Frontend              │
│ 08-FAQ         │ FAQ                   │
│ 09-Recursos    │ Recursos              │
└─────────────────────────────────────────┘
```

**Para cada una:**
```
1. Click [+ New page]
2. Llena Title y Sidebar title (copiar de tabla arriba)
3. Copia Content de GUIA_LLENAR_WIKI_Y_LIMPIAR_REPO.md
4. Click [Save page]
5. Repite
```

---

### PASO 6: Editar "Home" para agregar enlaces

Una vez que crees todas las páginas, necesitas actualizar Home:

```
1. Ve a Wiki > Home
2. Click en: [Edit] (botón arriba a la derecha)

Abre el editor

3. Modifica los [[enlaces]] para que apunten a las páginas reales

CAMBIOS:
Encuentra:  [[Quick Start|01-Quick-Start]]
Asegúrate:  La página "01-Quick-Start" existe
Resultado:  Clickear en "Quick Start" va a esa página

4. Click [Save] cuando termines
```

---

## 🔗 TABLA DE ENLACES PARA HOME

Cuando edites Home, asegúrate que estos enlaces funcionan:

```markdown
# Enlaces que DEBEN funcionar:

[[Quick Start|01-Quick-Start]]      → Página "01-Quick-Start"
[[Setup Inicial|02-Setup]]          → Página "02-Setup"
[[Roles y Responsabilidades|03-Roles]] → Página "03-Roles"
[[Protecciones de Rama|04-Rulesets]] → Página "04-Rulesets"
[[Flujo de Git|05-Git-Workflow]]   → Página "05-Git-Workflow"
[[Backend|06-Backend]]              → Página "06-Backend"
[[Frontend|07-Frontend]]            → Página "07-Frontend"
[[FAQ|08-FAQ]]                      → Página "08-FAQ"
[[Enlaces útiles|09-Recursos]]     → Página "09-Recursos"

Formato de GitHub Wiki:
[[Texto que aparece|Nombre-de-la-pagina]]
                    └─ Usa guiones, no espacios
```

---

## 📸 VISTA FINAL DE LA WIKI

```
Cuando hayas terminado, la Wiki se verá así:

┌──────────────────────────────────────┐
│ Wiki                                 │
├──────────────────────────────────────┤
│ [+ New page] [Edit sidebar]          │
├──────────────────────────────────────┤
│                                      │
│ 📚 Sidebar (Navegación):             │
│                                      │
│ Home                                 │
│ ├─ Quick Start                       │
│ ├─ Setup Inicial                     │
│ ├─ Roles y Responsab...              │
│ ├─ Protecciones de Rama              │
│ ├─ Flujo de Git                      │
│ ├─ Backend                           │
│ ├─ Frontend                          │
│ ├─ FAQ                               │
│ └─ Recursos                          │
│                                      │
│ 📄 Contenido (Home):                 │
│                                      │
│ 🏥 Hospital Management System        │
│                                      │
│ PWA de gestión clínica y...          │
│                                      │
│ 📚 Documentación                     │
│                                      │
│ ### Para empezar                     │
│ • Quick Start - Inicio en 5 min      │
│ • Setup Inicial - Requisitos         │
│ ...                                  │
│                                      │
└──────────────────────────────────────┘
```

---

## ✅ CHECKLIST: CREACIÓN DE WIKI

```
Primero - Crear páginas:
[ ] Home (índice principal)
[ ] 01-Quick-Start
[ ] 02-Setup
[ ] 03-Roles
[ ] 04-Rulesets
[ ] 05-Git-Workflow
[ ] 06-Backend
[ ] 07-Frontend
[ ] 08-FAQ
[ ] 09-Recursos

Después - Actualizar Home:
[ ] Editar Home
[ ] Verificar que [[enlaces]] funcionan
[ ] Guardar Home

Verificación Final:
[ ] Hago click en cada enlace desde Home
[ ] Todos van a la página correcta
[ ] No hay errores de página no encontrada
[ ] La navegación es clara
[ ] El equipo puede usarla

¿LISTO? ✅
```

---

## 🎓 CONSEJOS Y TRUCOS

### 1. Usar Markdown en Wiki

```markdown
# Encabezado 1 (H1)
## Encabezado 2 (H2)
### Encabezado 3 (H3)

**Negrita**
*Cursiva*
~~Tachado~~

- Lista 1
- Lista 2

1. Numerada 1
2. Numerada 2

[Link a web](https://ejemplo.com)
[[Link a otra página Wiki|Nombre-Pagina]]

```markdown
código inline
```

```python
bloque de código
def hello():
    return "Hola"
```

| Tabla | Ejemplo |
|-------|---------|
| Fila1 | Valor1  |
```

### 2. Editores de Markdown

Puedes escribir el contenido en:
- GitHub Wiki directamente
- Editor de texto (VS Code, Notepad++)
- Markdown online editors

### 3. Vista previa

En GitHub Wiki, mientras escribes:
```
┌────────────┬────────────┐
│ Write (✎)  │ Preview (👁)│
└────────────┴────────────┘
  Click en "Preview" para ver cómo se ve
```

### 4. Si cometes error

```
1. Click [Edit] en la página
2. Corrige el contenido
3. Click [Save]
4. Listo
```

No hay "undo" pero puedes editar cualquier momento.

---

## 🚀 FLUJO RECOMENDADO

### Día 1 (HOY - 31 de Octubre):

```
14:00 - 14:15: Crear Home
14:15 - 14:30: Crear 01-Quick-Start
14:30 - 14:45: Crear 02-Setup
14:45 - 15:00: Crear 03-Roles, 04-Rulesets
15:00 - 15:15: Crear 05-Git-Workflow
15:15 - 15:30: Crear 06-Backend, 07-Frontend
15:30 - 15:45: Crear 08-FAQ, 09-Recursos
15:45 - 16:00: Editar Home y verificar enlaces

TOTAL: 2 horas
```

### Día 2 (KICKOFF - 1 de Noviembre):

```
09:00: Muestra la Wiki al equipo
09:15: Equipo lee la Wiki mientras espera
09:30: Inicia desarrollo con Wiki como referencia
```

---

## 📞 AYUDA RÁPIDA

### Si algo no funciona:

```
Problema: Los [[enlaces]] no funcionan
Causa: El nombre de la página es diferente
Solución: Verifica que escribiste bien en la URL
  └─ Usa guiones, no espacios
  └─ Ej: "01-Quick-Start" (con guión)
  └─ No: "01 Quick Start" (con espacio)

Problema: No veo cambios después de editar
Causa: GitHub caché
Solución: F5 (refresca)

Problema: Una página desapareció
Causa: Accidental delete o navegación
Solución: Busca en el historio o recrea
```

---

**Documento:** Tutorial Visual - Crear Wiki  
**Versión:** 1.0  
**Fecha:** 31 de Octubre, 2025  
**Próximo paso:** Empieza a crear las páginas
