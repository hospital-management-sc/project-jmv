# Guía de Configuración de Iconos PWA - Hospital JMV

## Estado Actual ✅

Se ha actualizado la configuración de la PWA con los siguientes cambios:

### 1. **manifest.json** ✅
- ✅ Nombre: "Hospital JMV"
- ✅ Nombre corto: "HJMV"
- ✅ Descripción en español
- ✅ theme_color: `#7c3aed` (púrpura - color primario de la app)
- ✅ background_color: `#0f172a` (fondo oscuro - modo dark)

### 2. **index.html** ✅
- ✅ Activado manifest.json
- ✅ Activado Service Worker
- ✅ Meta tags para iOS (apple-mobile-web-app-*)
- ✅ Título actualizado: "Hospital JMV"
- ✅ Description meta tag

### 3. **service-worker.js** ✅
- ✅ CACHE_NAME actualizado a: `hospital-jmv-v1`

---

## Próximos Pasos: Preparar los Iconos 🎨

### Tamaños Requeridos
Necesitas crear 2 versiones de tu logo:

| Tamaño | Uso | Ruta |
|--------|-----|------|
| **192x192** | Pantalla de inicio, notificaciones (smartphones) | `public/icon-192x192.png` |
| **512x512** | Splash screen, app drawer (tablets, desktop) | `public/icon-512x512.png` |

### Opciones para Generar los Iconos

#### **Opción 1: Usando ImageMagick (Recomendado)**
```bash
# Instalar ImageMagick si no lo tenemos
# Windows: choco install imagemagick
# macOS: brew install imagemagick

# Si tienes un archivo de logo (logo.png) en la carpeta public:
magick convert public/logo.png -resize 192x192 public/icon-192x192.png
magick convert public/logo.png -resize 512x512 public/icon-512x512.png
```

#### **Opción 2: Usando online tools**
- [https://convertio.co/es/png-jpg/](https://convertio.co/es/)
- [https://www.remove.bg/es](https://www.remove.bg/es) - Para fondo transparente
- [https://www.iloveimg.com/es/redimensionar-imagen](https://www.iloveimg.com/es/redimensionar-imagen)

#### **Opción 3: Usar software de diseño**
- Figma
- Adobe Photoshop
- GIMP (gratuito)

### Recomendaciones para los Iconos 🎯

1. **Formato**: PNG con fondo transparente (mejor para PWA)
2. **Colores**: Usa los colores de tu app:
   - Color primario: `#7c3aed` (púrpura)
   - Color secundario: `#56c0f0` (azul/cyan)
   - Evita fondos blancos

3. **Diseño**: 
   - Asegúrate que se vea bien en tamaños pequeños (192x192)
   - El logo debe ser claramente visible y simple
   - Evita texto pequeño que no se lea en 192x192

4. **Seguridad**: Para la mejor experiencia:
   - Usa márgenes/padding alrededor del logo
   - Mantén un espacio en blanco mínimo

### Estructura Esperada
```
pwa/frontend/public/
├── index.html
├── manifest.json
├── service-worker.js
├── icon-192x192.png    ← Agregar
├── icon-512x512.png    ← Agregar
└── vite.svg            (puede eliminarse)
```

### Validación de PWA 🔍

Una vez agregues los iconos, puedes validar tu PWA así:

1. **En Chrome DevTools**:
   - F12 → Application → Manifest
   - Verifica que aparezcan correctamente los iconos
   - Valida que el Service Worker esté registered

2. **En Chrome** (escribir en barra de direcciones):
   - `chrome://apps` - Verás tu app instalada
   - `chrome://serviceworker-internals/` - Ver estado del SW

3. **Generar APK para Android**:
   - Usar [PWABuilder](https://www.pwabuilder.com/)
   - URL: tu aplicación hospedada
   - Genera automáticamente APK con los iconos

---

## Información Adicional sobre Shortcuts (Opcional) 📌

El manifest.json ya incluye un atajo para "Ver Pacientes". Una vez agregues los iconos, este atajo mostrará el icono de 192x192 en el menú de atajos de tu PWA en Android/iOS.

---

## Archivos Modificados ✏️

✅ `pwa/frontend/public/manifest.json` - Actualizado
✅ `pwa/frontend/index.html` - Actualizado  
✅ `pwa/frontend/public/service-worker.js` - Actualizado

---

## Próxima Ejecución de Pruebas

Una vez agregues los iconos PNG de 192x192 y 512x512:

```bash
cd pwa/frontend
npm run dev
```

Luego abre DevTools → Application → Manifest para validar que todo esté correcto.
