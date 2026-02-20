# Sistema de Créditos IT Lalaguna

Sistema de gestión de créditos académicos desarrollado con React, TypeScript y Vite. Este proyecto permite la administración de alumnos, docentes, periodos, actividades, configuraciones y créditos en el Instituto Tecnológico de La Laguna.

## 📋 Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Scripts Disponibles](#scripts-disponibles)
- [Estructura del Proyecto](#estructura-del-proyecto)


## 🛠️ Tecnologías

- **React 19.1.1** - Librería de interfaz de usuario
- **TypeScript 5.9.3** - Superset tipado de JavaScript
- **Vite 7.1.7** - Build tool y dev server
- **Material-UI 7.3.4** - Framework de componentes UI
- **React Router DOM 7.9.4** - Enrutamiento
- **Axios 1.13.2** - Cliente HTTP
- **MUI X Data Grid 8.17.0** - Tablas de datos avanzadas

## 📦 Requisitos Previos

- **Node.js** (versión 18 o superior recomendada)
- **npm** o **yarn** (gestor de paquetes)
- Acceso a la API backend (configurada mediante variables de ambiente)

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd creditos_itlalaguna
```

2. Instalar las dependencias:
```bash
npm install
```

## ⚙️ Configuración

### Variables de Ambiente

El proyecto requiere configurar las siguientes variables de ambiente. Crear un archivo `.env` en la raíz del proyecto:

```env
# URL base de la API backend
VITE_API_URL=http://localhost:3000/api
```

**Variables disponibles:**

- `VITE_API_URL`: URL completa de la API backend (requerida)

> **Nota:** Las variables en Vite deben comenzar con el prefijo `VITE_` para ser accesibles en el código.

### Ejemplo de archivo .env

```env
# Desarrollo
VITE_API_URL=http://localhost:3000/api

# Producción
# VITE_API_URL=https://api.produccion.com/api
```

## 🏃 Ejecución

### Modo Desarrollo

Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible en:
- **URL:** http://localhost:5173
- **Puerto:** 5173 (por defecto en Vite)

El servidor incluye:
- ⚡ Hot Module Replacement (HMR)
- 🔄 Recarga automática al guardar cambios
- 📝 Mensajes de error detallados en el navegador

### Modo Producción

1. Construir la aplicación:
```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

2. Previsualizar la build de producción:
```bash
npm run preview
```

La previsualización estará disponible en http://localhost:4173

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo en el puerto 5173 |
| `npm run build` | Compila TypeScript y construye la aplicación para producción |
| `npm run lint` | Ejecuta ESLint para verificar la calidad del código |
| `npm run preview` | Previsualiza la build de producción localmente |

## 📁 Estructura del Proyecto

```
creditos_itlalaguna/
├── src/
│   ├── assets/              # Recursos estáticos (imágenes, fonts, etc.)
│   ├── components/          # Componentes reutilizables
│   │   ├── appWrapper/      # Wrapper principal de la app
│   │   ├── cards/           # Componentes de tarjetas
│   │   ├── dataGrid/        # Grid de datos genérico
│   │   ├── dialogs/         # Diálogos modales
│   │   ├── footer/          # Footer de la aplicación
│   │   ├── header/          # Header de la aplicación
│   │   ├── layoutWrapper/   # Wrapper de layouts
│   │   ├── roleProtectedRoute/ # Protección de rutas por rol
│   │   └── views/           # Vistas reutilizables (Cards, Tables)
│   ├── hooks/               # Custom hooks de React
│   ├── layouts/             # Layouts principales
│   ├── pages/               # Páginas de la aplicación
│   │   ├── actividades/     # Gestión de actividades
│   │   ├── alumnos/         # Gestión de alumnos
│   │   ├── configuraciones/ # Configuraciones del sistema
│   │   ├── creditos/        # Gestión de créditos
│   │   ├── docentes/        # Gestión de docentes
│   │   ├── home/            # Página principal
│   │   ├── login/           # Página de inicio de sesión
│   │   ├── periodos/        # Gestión de periodos
│   │   └── usuarios/        # Gestión de usuarios
│   ├── router/              # Configuración de rutas
│   ├── services/            # Servicios de API
│   │   ├── api.ts           # Cliente Axios configurado
│   │   ├── authService.ts   # Servicio de autenticación
│   │   └── *Service.ts      # Servicios por módulo
│   ├── types/               # Definiciones de TypeScript
│   ├── App.tsx              # Componente raíz
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── .env                     # Variables de ambiente (crear)
├── index.html               # HTML principal
├── package.json             # Dependencias y scripts
├── tsconfig.json            # Configuración de TypeScript
├── vite.config.ts           # Configuración de Vite
└── README.md                # Este archivo
```

## 🔒 Autenticación

El sistema utiliza autenticación JWT (JSON Web Tokens). Las características incluyen:

- Tokens almacenados en localStorage
- Interceptores de Axios para incluir el token en cada petición
- Redirección automática al login cuando el token expira (código 401)
- Protección de rutas por roles de usuario

## 🌐 Módulos Principales

- **Actividades**: Registro y gestión de actividades extracurriculares
- **Alumnos**: Base de datos de estudiantes
- **Configuraciones**: Parámetros del sistema
- **Créditos**: Asignación y seguimiento de créditos
- **Docentes**: Información de profesores
- **Periodos**: Gestión de ciclos académicos
- **Usuarios**: Administración de cuentas y permisos

## 🐛 Troubleshooting

### El servidor no inicia
- Verificar que el puerto 5173 no esté en uso
- Eliminar `node_modules` y `package-lock.json`, luego reinstalar con `npm install`

### Errores de conexión a la API
- Verificar que `VITE_API_URL` esté correctamente configurada en `.env`
- Confirmar que el servidor backend esté ejecutándose
- Revisar la consola del navegador para detalles del error

### Errores de TypeScript
- Ejecutar `npm run lint` para identificar problemas
- Verificar que todas las dependencias estén instaladas correctamente

## 📝 Notas Adicionales

- El puerto por defecto de Vite es **5173** pero puede cambiar automáticamente si está ocupado
- Para cambiar el puerto manualmente, modificar `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000 // Puerto personalizado
  }
})
```