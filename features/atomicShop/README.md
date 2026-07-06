# AtomicShop — Panel de Administración

Panel privado de administración de la plataforma AtomicShop. Permite a empleados y administradores gestionar el inventario, clientes, empleados, ventas y recuperación de contraseñas del sistema.

---

# Technologies — Tech Stack

## Frontend

- React 19
- Vite + SWC
- TypeScript
- Tailwind CSS v4
- Shadcn UI + Radix UI

## State & Data

- Zustand — estado global de autenticación
- TanStack React Query — estado del servidor y caché
- React Hook Form + Zod — formularios y validación

## Additional Tools

- Axios (cliente HTTP)
- Framer Motion (animaciones)
- Lucide React (iconografía)
- Sonner (notificaciones tipo toast)
- SweetAlert2 (alertas de confirmación e información)

---

# Project Setup

## Requirements

- Node.js 18+
- npm

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

---

# Environment Variables

Create a `.env` file in the root of this project:

```env
VITE_API_URL=http://localhost:4000/api
```

In production, replace the value with the deployed API URL on Render.

---

# Deployment — Vercel

1. Push the project to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the **Root Directory** to `features/atomicShop`.
4. Set the build command to `npm run build` and the output directory to `dist`.
5. Add the environment variable `VITE_API_URL` pointing to the production API.

---

# Features

| Module | Description |
|--------|-------------|
| **Auth** | Login, logout, cookie-based session, restricted account detection |
| **First Use** | First-time onboarding to create the initial administrator |
| **Password Recovery** | 3-step flow: email → verification code → new password |
| **Employees** | CRUD, role assignment, account enable/disable, email notifications |
| **Products** | CRUD with Cloudinary image upload, state toggle (active/inactive) |
| **Clients** | CRUD with state management |
| **Sales** | Invoice listing with payment status filters |
| **Brands & Categories** | Dropdown data for product forms |

---

# Dependencies

| Dependency | Purpose |
|------------|---------|
| **@fontsource-variable/inter** | Inter variable font for the UI |
| **@hookform/resolvers** | Connects React Hook Form with Zod |
| **@tailwindcss/vite** | Integrates Tailwind CSS with Vite |
| **@tanstack/react-query** | Server state management and caching |
| **axios** | HTTP client for API communication |
| **class-variance-authority** | Utility for component variant classes |
| **clsx** | Conditional class name utility |
| **framer-motion** | Animations and UI transitions |
| **lucide-react** | Icon library |
| **radix-ui** | Accessible headless UI primitives |
| **react** | Core UI library |
| **react-dom** | DOM rendering for React |
| **react-hook-form** | Form state management |
| **react-router** | Client-side routing |
| **shadcn** | Component library built on Radix UI |
| **sonner** | Toast notification system |
| **sweetalert2** | Confirmation and alert dialogs |
| **tailwind-merge** | Merges Tailwind class names safely |
| **tailwindcss** | Utility-first CSS framework |
| **zod** | TypeScript-first schema validation |
| **zustand** | Lightweight global state management |

### Development Dependencies

| Dependency | Purpose |
|------------|---------|
| **@eslint/js** | Base ESLint JavaScript configuration |
| **@types/node** | TypeScript definitions for Node.js |
| **@types/react** | TypeScript definitions for React |
| **@types/react-dom** | TypeScript definitions for React DOM |
| **@vitejs/plugin-react-swc** | React support for Vite using SWC |
| **eslint** | Code quality linter |
| **eslint-plugin-react-hooks** | Enforces React Hooks rules |
| **eslint-plugin-react-refresh** | Compatibility with React Fast Refresh |
| **globals** | Global variable definitions for ESLint |
| **typescript** | TypeScript compiler |
| **typescript-eslint** | ESLint rules for TypeScript |
| **vite** | Build tool and development server |
