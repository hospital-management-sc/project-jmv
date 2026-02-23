# Guía de Contribución

## 🎯 Antes de Empezar

1. **Lee** [GUIA_PROYECTO.md](../GUIA_PROYECTO.md) - Entiende el proyecto
2. **Lee** [LIDERAZGO_EQUIPO.md](../LIDERAZGO_EQUIPO.md) - Entiende cómo trabajamos
3. **Únete** a Slack/Discord del equipo
4. **Comunica** al líder de tu equipo cuando empieces

## 📋 Workflow de Git

### 1. Crear una rama

```bash
# Asegúrate de estar en develop y actualizado
git checkout develop
git pull origin develop

# Crea rama con nombre descriptivo
git checkout -b feature/nombre-descriptivo

# Ejemplo:
git checkout -b feature/patient-crud
git checkout -b bugfix/validation-error
git checkout -b docs/api-documentation
```

### 2. Hacer cambios y commits

```bash
# Haz cambios...

# Verifica cambios
git status

# Agrega cambios
git add .

# Commit con mensaje descriptivo (ver convención abajo)
git commit -m "feat: agregar login con JWT"

# Si necesitas múltiples commits, hazlos pequeños y relacionados
git commit -m "feat: agregar login"
git commit -m "test: agregar tests para login"
```

### 3. Convención de Commits

```
<tipo>(<scope>): <descripción breve>

<descripción detallada opcional>

<footer>
```

**Tipos permitidos:**
- `feat`: Nueva feature
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Cambios de formato (no lógica)
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `chore`: Cambios en build, dependencias

**Ejemplos:**
```
feat: agregar login con JWT
fix: corregir validación de email en formulario
docs: actualizar README
style: formatear código con prettier
test: agregar tests para autenticación
chore: actualizar express a 4.18.2
```

### 4. Push y Pull Request

```bash
# Push a repositorio remoto
git push origin feature/nombre-descriptivo

# En GitHub, crea Pull Request con:
# - Título claro
# - Descripción detallada
# - Referencias a issues (#123)
# - Checklist de lo que hiciste
```

### 5. Template de PR

```markdown
## Descripción
Breve descripción de qué cambios hace este PR.

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change
- [ ] Documentación

## ¿Cómo fue testeado?
Describe los tests que corriste.

## Checklist
- [ ] Mi código sigue los estándares del proyecto
- [ ] He ejecutado linting y está pasando
- [ ] He agregado tests
- [ ] Todos los tests pasan localmente
- [ ] He actualizado la documentación si es necesario
- [ ] No tengo cambios sin commitear

## Screenshots (si aplica)
[Agrega screenshots para cambios UI]

## Issues relacionados
Fixes #123
```

## 🏗️ Estándares de Código

### TypeScript

```typescript
// ✅ BUENO: Tipos explícitos
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ MALO: Tipos implícitos
function getUser(id) {
  // ...
}
```

### Nombres

```typescript
// ✅ BUENO: Nombres descriptivos
const userCount = 42;
const isAuthenticatedUser = true;
const fetchUserById = (id: string) => { };

// ❌ MALO: Nombres poco claros
const uc = 42;
const auth = true;
const fub = (id) => { };
```

### Funciones

```typescript
// ✅ BUENO: Función pequeña y enfocada
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ❌ MALO: Función que hace muchas cosas
function handleUser(data: any) {
  // valida
  // procesa
  // guarda
  // envía email
  // loguea
}
```

### Comentarios

```typescript
// ✅ BUENO: Comentarios para lógica compleja
// Algoritmo de exponential backoff para reintentos
const calculateDelay = (attempt: number): number => {
  return Math.min(1000 * Math.pow(2, attempt), 30000);
};

// ❌ MALO: Comentarios obvios
// Incrementar contador
count++;
```

### Manejo de Errores

```typescript
// ✅ BUENO: Errores específicos
class ValidationError extends Error {
  constructor(field: string) {
    super(`Validation failed for field: ${field}`);
    this.name = 'ValidationError';
  }
}

// ❌ MALO: Errores genéricos
if (!email) throw new Error('invalid');
```

## 🧪 Testing

### Backend (Jest)

```bash
cd backend
npm test
npm run test:coverage
```

**Estándar:**
- Mínimo 70% cobertura en lógica crítica
- Tests para controllers, services, validadores

```typescript
// Ejemplo: test/auth.test.ts
describe('AuthService', () => {
  describe('login', () => {
    it('should return token for valid credentials', async () => {
      const result = await authService.login('test@test.com', 'password123');
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw error for invalid credentials', async () => {
      await expect(
        authService.login('test@test.com', 'wrongpassword'),
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
```

### Frontend (Vitest)

```bash
cd frontend
npm test
npm run test:coverage
```

**Estándar:**
- Tests para componentes críticos
- Tests para hooks custom

```typescript
// Ejemplo: test/LoginForm.test.tsx
import { render, screen } from '@testing-library/react';
import LoginForm from '../src/components/LoginForm';

describe('LoginForm', () => {
  it('should render login form', () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

  it('should call onSubmit when form is submitted', async () => {
    const handleSubmit = vi.fn();
    render(<LoginForm onSubmit={handleSubmit} />);
    // ... interacciones
    expect(handleSubmit).toHaveBeenCalled();
  });
});
```

## 🔍 Checklist Antes de Push

```bash
# 1. Verificar cambios
git status
git diff

# 2. Linting y formato
npm run lint:fix
npm run format

# 3. Tests
npm test

# 4. Build
npm run build

# 5. Type checking (TypeScript)
npm run type-check

# 6. Si todo pasa:
git push origin feature/nombre
```

## 📝 Comentando PRs

### Reviewer

```
Cuando revises código de compañeros:

✅ CONSTRUCTIVO:
"Aquí podrías usar const en lugar de let para mayor claridad"

❌ NO CONSTRUCTIVO:
"Esto está mal"

✅ ESPECÍFICO:
"Este loop podría ser más eficiente con Array.map()"

❌ VAGO:
"Revisa esto"
```

### Respondiendo Reviews

```
✅ PROFESIONAL:
"Buen punto, cambié para usar const. Ver commit abc123."

❌ DEFENSIVO:
"No, así funciona mejor"
```

## 🚨 Reglas Importantes

### En main (Producción)
- ❌ NO se pushea directamente
- ❌ Requiere PR con review
- ✅ Solo merge después de tests pasar
- ✅ Solo merge después de 1 aprobación

### En develop (Integración)
- ❌ NO se pushea directamente
- ❌ Requiere PR (aunque sea más rápido)
- ✅ Merge después de tests pasar

### En feature branches
- ✅ Se puede pushear aunque tests fallen
- ✅ Commits pueden ser "wip" (work in progress)
- ✅ Squash antes de merge a develop

## 🤝 Colaboración

### Pair Programming
```
Si dos personas trabajan en lo mismo:
1. Decidir quién toma el teclado primero
2. Rotar cada 15-30 minutos
3. Crear UN commit con ambos como authors:
   git commit --author "Persona 1 <p1@email> and Persona 2 <p2@email>"
```

### Code Review
```
Revisar PRs de compañeros es parte del trabajo:
1. Mira el PR en GitHub
2. Descarga la rama si necesitas
3. Lee el código
4. Haz comentarios
5. Aprueba o pide cambios
```

## 📚 Recursos Útiles

- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Best Practices](https://react.dev/learn)

## ❓ Dudas?

1. Revisa esta guía nuevamente
2. Pregunta en Slack
3. Abre una discussion en GitHub
4. Habla con tu sub-lead de equipo

---

**Versión**: 1.0  
**Última actualización**: Octubre 31, 2025
