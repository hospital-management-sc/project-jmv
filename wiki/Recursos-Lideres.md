# 🎯 RECURSOS PARA LÍDERES DEL PROYECTO

**Rama:** `main` (Pública, todos ven este archivo)  
**Propósito:** Guiar a líderes sobre dónde encontrar documentación restringida  
**Acceso:** Todos (pero contenido señala a rama leads-only)  

---

## 📍 ¿Eres Líder del Proyecto?

Si eres **Tú** o tu **Co-líder**, tienes acceso a documentación **privada y confidencial** en la rama `leads-only` que NO aparece en esta rama `main`.

### 📋 Documentación Privada (leads-only)

| Documento | Propósito | Quién | Acceso |
|-----------|-----------|-------|--------|
| **LIDERAZGO_DECISION_ESTRATEGICA.md** | Matriz de decisiones críticas del proyecto | Solo Admins | `leads-only` |
| **ACTAS_REUNIONES_LIDERES.md** | Registro de decisiones y reuniones privadas | Solo Admins | `leads-only` |
| **ACCESO_EQUIPOS.md** | Matriz de permisos y control de acceso | Solo Admins | `leads-only` |

---

## 🚀 Cómo Acceder

### Opción 1: Desde tu Terminal Local

```bash
# 1. Traer la rama leads-only
git fetch origin leads-only

# 2. Cambiar a la rama
git checkout leads-only

# 3. Ver archivos disponibles
ls -la *.md
```

### Opción 2: En GitHub Web

```
1. Ve a: https://github.com/[owner]/hospital-management
2. Click en selector de ramas (arriba a la izquierda)
3. Selecciona "leads-only"
4. Los archivos aparecerán en la rama leads-only
```

### Opción 3: Ver Commits en GitHub

```
1. Ve a: https://github.com/[owner]/hospital-management/commits/leads-only
2. Verás todos los commits en la rama protegida
3. Click en cualquier documento para ver contenido
```

---

## 🔒 ¿Por Qué Esta Rama Es Privada?

```
Información en leads-only:
├─ Decisiones estratégicas sensibles
├─ Evaluaciones de equipo
├─ Riesgos críticos identificados
├─ Actas de reuniones privadas
├─ Detalles de negociación con hospital
└─ Presupuesto y costos detallados

Protección:
├─ ✅ Solo Admins pueden hacer push
├─ ✅ Requiere 2 approvals antes de merge
├─ ✅ NO se mergea a main o develop
├─ ✅ Histórico auditado
└─ ✅ Invisible para desarrolladores sin acceso
```

---

## 📞 Soporte

**Si tienes problemas accediendo:**

```
1. Verifica que tienes acceso Admin en GitHub
2. Confirma que tu SSH key está configurada
3. Intenta: git fetch --all
4. Contacta al co-líder: [email]
```

---

**Último update:** 31 de Octubre, 2025  
**Documento en:** `main` (pública)  
**Contenido privado en:** `leads-only` (protegida)
