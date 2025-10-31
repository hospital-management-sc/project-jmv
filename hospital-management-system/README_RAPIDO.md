# ☕ VERSIÓN TL;DR - LEE EN 5 MIN

**Para:** Gente ocupada que necesita la versión corta  
**Tiempo:** 5 minutos máximo

---

## 🎯 La Idea en Una Frase

Estás liderando un equipo de 10 estudiantes para construir una PWA que ayude a un hospital real a gestionar pacientes, citas e informes durante 12 semanas.

---

## 👥 El Equipo

```
TÚ (Líder) + CO-LÍDER
│
├── BACKEND (5 ppl): API + BD + Seguridad
├── FRONTEND (4 ppl): React + Vite + Páginas
└── DEVOPS/QA (1 ppl): Docker + Testing
```

Cada sub-equipo tiene un **Lead** que reporta a ti.

---

## 🏗️ La Arquitectura (30 segundos)

```
Cliente (React en navegador)
        ↓ HTTP
    Backend (Express + Node.js)
        ↓ Mongoose
    MongoDB (Base de datos)
```

**Stack:**
- Backend: TypeScript + Express + MongoDB
- Frontend: React + Vite + TypeScript
- Datos: Clínicos → SEGURIDAD CRÍTICA
- Deploy: Docker

---

## 📅 Las 12 Semanas

```
Semana 0  → Setup + Kickoff
Semana 1-2 → Requisitos + Hospital
Semana 3-6 → Código + Integración
Semana 7-8 → Testing + Feedback
Semana 9-12 → Piloto + Entrega
```

**Punto crítico:** Semana 3. Si no funciona, todo se retrasa.

---

## 📞 Comunicación Diaria

- **Slack**: Mensajes rápidos
- **Daily Standup**: 10 AM, 15 min (todos)
- **Leads Sync**: 3x semana, 30 min (tú + 3 leads)
- **Weekly Planning**: Viernes, 1 hora

**Regla de oro:** Si lo dices, documéntalo. Si es importante, Slack. Si es estratégico, GitHub.

---

## 🚨 Lo Más Importante

### 1. Claridad
```
❌ "Creen que saben qué hacer"
✅ "Sé exactamente qué hace cada uno"
```

### 2. Documentación
```
❌ "Pregunte a quien lo hizo"
✅ "Está escrito en GitHub"
```

### 3. Seguridad
```
❌ "Lo agregamos después"
✅ "Seguridad desde día 1"
```

---

## 📊 Lo Que Ya Hicimos

✅ Documentación completa (5 guías, 1850+ líneas)  
✅ Estructura de proyecto lista  
✅ Docker Compose funcional  
✅ Todas las dependencias  
✅ Estándares de código  
✅ Distribución de roles  

**Resultado:** No hay "qué hacer mañana" - todo está planeado.

---

## 🎬 Acciones Hoy

1. **Leer** PARA_LIDERES.md (10 min)
2. **Hablar** con co-líder (15 min)
3. **Crear** repo + Slack
4. **Invitar** a 10 estudiantes
5. **Preparar** slides para kickoff

---

## 📋 Mañana: Kickoff (2-3 horas)

Explica:
- Proyecto y por qué importa
- Stack tecnológico
- Roles específicos de cada uno
- Cómo nos comunicamos
- Próximos pasos

Distribuye:
- Link al repo
- SETUP_INICIAL.md
- Canal Slack

---

## 🎓 Tu Rol Como Líder

```
❌ No escribo el código
✅ Aseguro que otros lo escriban bien

❌ No resuelvo todos los problemas
✅ Enseño a otros a resolverlos

❌ No sé todo
✅ Sé a quién preguntarle cada cosa

✅ Comunico claramente
✅ Remuervo bloques
✅ Motivo al equipo
✅ Tomo decisiones difíciles cuando sea necesario
```

---

## 🏥 Hospital (Lo Más Importante)

Los datos que mantienes son VIDAS.

**Seguridad:**
- ✅ Autenticación robusta (JWT)
- ✅ Autorización por roles (médico ≠ admin)
- ✅ Encriptación de datos sensibles
- ✅ Log de quién accedió a qué
- ✅ Sin exponer errores técnicos

**Hospital es tu cliente:**
- Semana 1-2: Entrevista y requisitos
- Semana 7-8: Testing con usuarios reales
- Semana 9-12: Soporte durante piloto

**TÚ:** Punto de contacto principal.

---

## 🔥 Si Algo Sale Mal

| Problema | Solución | Tiempo |
|----------|----------|--------|
| Alguien no entiende | 1-on-1, clarifica rol | 24h |
| Dos personas en conflicto | Reúnete, media, decide | 24h |
| Backend/Frontend desincronizados | Daily standup, API spec clara | Ongoing |
| Seguridad issue | DROP TODO, fix, debrief | Same day |
| Hospital cambia requisitos | Documentar, evaluar, replan | 48h |

---

## 📈 Cómo Saber Si Estamos Bien

### Semana 1-2
✅ ¿Equipo entiende proyecto?  
✅ ¿Hospital está comprometido?

### Semana 3-6
✅ ¿Código está limpio?  
✅ ¿Frontend conecta con Backend?

### Semana 7-8
✅ ¿Hospital está satisfecho?

### Semana 9-12
✅ ¿Sistema funciona en hospital?

---

## 💡 3 Cosas Que Evitar

### 1. Micromanageo
```
❌ "Quiero revisar cada línea"
✅ "Define qué, confía en cómo"
```

### 2. Supuestos
```
❌ "Asumo que entienden"
✅ "Verifico que entiendan"
```

### 3. Documentación al final
```
❌ "Documentamos cuando termina"
✅ "Documentamos mientras hacemos"
```

---

## 🎯 Éxito Se Ve Así

**Diciembre 2025:**

```
✅ 10 personas colaboraron exitosamente
✅ Hospital tiene sistema funcionando
✅ Usuarios (médicos) usando la app
✅ Equipo aprendió habilidades profesionales
✅ Código limpio, testeado, documentado
✅ Todos contarán esto en entrevista de trabajo
```

---

## 📚 Documentos Creados

| Documento | Lee Si... |
|-----------|-----------|
| GUIA_PROYECTO.md | Quieres entender el proyecto completo |
| LIDERAZGO_EQUIPO.md | Tienes duda cómo gestionar 10 personas |
| ASIGNACION_TRABAJO.md | Necesitas asignar roles específicos |
| SETUP_INICIAL.md | Envías al equipo después del kickoff |
| PARA_LIDERES.md | Necesitas resumen en 10 min |
| README.md | Empiezas a trabajar |
| CONTRIBUTING.md | Alguien pregunta cómo hacer PR |

---

## 🎬 AHORA

1. Leer PARA_LIDERES.md (10 min)
2. Hablar con co-líder (15 min)
3. Crear repo GitHub
4. Crear Slack
5. Invitar equipo
6. Preparar kickoff

**Tiempo total:** 1-2 horas

**Resultado:** Proyecto listo para comenzar

---

## 🚀 Mentalidad

```
"Tengo un equipo de 10.
Tengo un proyecto importante.
Tengo un plan de 12 semanas.
Tengo documentación completa.

No hay excusas.
Vamos a hacerlo."
```

---

**Próximo paso:** Leer PARA_LIDERES.md (toma 10 min)

**¿Preguntas?** Revisa LIDERAZGO_EQUIPO.md

**¿Dudas técnicas?** Revisa GUIA_PROYECTO.md

---

**Versión**: 1.0  
**Tiempo de lectura**: 5 minutos  
**Estado**: ✅ Listo para empezar

🚀 **¡Vamos!**
