# Hospital Management System - Frontend

Un moderno y eficiente frontend para el Sistema de Gestión Hospitalaria, construido con **React 18 + TypeScript + Vite + React Router + React Hook Form + Zod + CSS Modules + PWA**.

## 🚀 Stack Tecnológico

- **React 18** - Librería de interfaz de usuario
- **TypeScript** - Tipado estático seguro
- **Vite** - Build tool ultra rápido
- **React Router** - Enrutamiento de la aplicación
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas de datos
- **CSS Modules** - Estilos encapsulados y modulares
- **CSS Variables** - Sistema de diseño flexible
- **PWA** - Capacidades de aplicación web progresiva

## 📦 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env` desde `.env.example`:
```bash
cp .env.example .env
```

3. Configurar la URL de la API en `.env`:
```env
VITE_API_URL=http://localhost:3001/api
```

## 🏃 Desarrollo

Iniciar el servidor de desarrollo:
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
├── pages/           # Páginas de la aplicación
├── layouts/         # Layouts principales
├── services/        # Servicios de API
├── hooks/           # Custom hooks
├── types/           # Tipos TypeScript compartidos
├── utils/           # Funciones utilitarias
├── styles/          # Estilos globales y variables CSS
└── main.tsx         # Punto de entrada
```

## 🎨 Sistema de Diseño

### Variables CSS
Todas las variables de diseño se encuentran en `src/styles/globals.css`:

```css
/* Colores */
--color-primary: #2563eb
--color-secondary: #64748b
--color-success: #22c55e
--color-warning: #f59e0b
--color-error: #ef4444

/* Espaciado */
--spacing-xs: 0.25rem
--spacing-sm: 0.5rem
--spacing-md: 1rem
--spacing-lg: 1.5rem
--spacing-xl: 2rem

/* Tipografía */
--font-size-sm: 0.875rem
--font-size-base: 1rem
--font-size-lg: 1.125rem
--font-size-xl: 1.25rem
```

## 📝 Crear Formularios

### Ejemplo básico con React Hook Form + Zod:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('password')} type="password" placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Login</button>
    </form>
  )
}
```

## 🔗 Llamadas a API

Usar el servicio de API con TypeScript:

```tsx
import { apiService } from '@services/api'
import { useAsync } from '@hooks/useAsync'

interface Patient {
  id: string
  name: string
  email: string
}

export default function PatientsList() {
  const { data: patients, loading, error, execute } = useAsync<Patient[]>(() =>
    apiService.get<Patient[]>('/patients')
  )

  if (loading) return <p>Cargando...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <ul>
      {patients?.map(patient => (
        <li key={patient.id}>{patient.name}</li>
      ))}
    </ul>
  )
}
```

## 🌐 PWA

La aplicación incluye configuración PWA completa:

- **manifest.json** - Metadatos de la aplicación
- **Service Worker** - Caching y funcionamiento offline
- **Theme Color** - Color de tema personalizado

Para instalar como aplicación:
1. Abrir en navegador compatible
2. Hacer clic en "Instalar" o "Agregar a pantalla de inicio"

## 📱 CSS Modules

Usar CSS Modules para estilos encapsulados:

```tsx
// MyComponent.tsx
import styles from './MyComponent.module.css'

export default function MyComponent() {
  return <div className={styles.container}>Contenido</div>
}
```

```css
/* MyComponent.module.css */
.container {
  padding: var(--spacing-lg);
  background-color: var(--bg-primary);
  border-radius: var(--border-radius);
}
```

## 🏗️ Build

Generar build de producción:
```bash
npm run build
```

Preview del build:
```bash
npm run preview
```

## 🔍 Linting

Ejecutar linter:
```bash
npm run lint
```

## 🌍 Manejo de Zona Horaria

### Configuración para Venezuela (GMT-4)

El sistema está configurado para usar la zona horaria de Venezuela (America/Caracas, GMT-4) en todas las operaciones de fecha y hora.

**Funciones de utilidad en `src/utils/dateUtils.ts`:**

```typescript
// Obtiene la fecha actual en Venezuela en formato ISO (YYYY-MM-DD)
getTodayVenezuelaISO(): string
// Ejemplo: "2025-12-04"

// Obtiene la hora actual en Venezuela (HH:MM)
getCurrentTimeVenezuela(): string
// Ejemplo: "20:30"

// Convierte un Date a formato legible en Venezuela
formatDateVenezuela(date: Date): string
// Ejemplo: "jueves, 4 de diciembre de 2025"

// Convierte un Date a formato completo (fecha + hora) en Venezuela
formatFullDateVenezuela(date: Date): string
// Ejemplo: "jueves, 4 de diciembre de 2025, 8:17 p.m."
```

**Implementación con Intl.DateTimeFormat:**
Las funciones utilizan `Intl.DateTimeFormat` con la opción `timeZone: 'America/Caracas'` para asegurar que todas las operaciones de fecha/hora respeten la zona horaria local, independientemente de la zona horaria del servidor o navegador del usuario.

**Validar timezone:**
```bash
# En la carpeta frontend
ts-node test-timezone.ts
```

## 📚 Recursos

- [React Documentation](https://react.dev)
- [Vite Guide](https://vite.dev)
- [React Router](https://reactrouter.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

## 📄 Licencia

Commercial - Hospital Management System
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
