# AtomicShop — E-Commerce Público

Tienda en línea pública de AtomicShop. Permite a los clientes explorar productos, gestionar su carrito, realizar compras, administrar su perfil y recuperar su contraseña.

---

# Technologies — Tech Stack

## Frontend

- React 19
- Vite + SWC
- TypeScript
- Tailwind CSS v4
- Shadcn UI + Radix UI

## State & Data

- React Context (autenticación y carrito de compras)
- React Hook Form + Zod — formularios y validación

## Additional Tools

- Framer Motion (animaciones)
- Lucide React (iconografía)
- Sonner (notificaciones tipo toast)
- Wompi (pasarela de pagos)

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

This project uses the native `fetch` API with a hardcoded base URL configurable through a service file.
Update `src/services/ecommerceService.ts` or create a `.env` file:

```env
VITE_API_URL=http://localhost:4000/api/e-commerce
```

In production, replace with the deployed API URL on Render.

---

# Deployment — Vercel

1. Push the project to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the **Root Directory** to `features/atomichShop-e-commerce`.
4. Set the build command to `npm run build` and the output directory to `dist`.
5. Add the environment variable `VITE_API_URL` pointing to the production API.

---

# Features

| Module | Description |
|--------|-------------|
| **Auth** | Login, logout, cookie-based session with AuthContext |
| **Register** | Customer registration with email verification code |
| **Password Recovery** | 3-step flow: email → verification code → new password |
| **Product Catalog** | Listing with filters by price, brand, and category |
| **Product Detail** | Individual view with similar products section |
| **Cart** | Add, remove, and manage items before checkout |
| **Checkout** | Delivery details, payment (card/cash/credit/debit), Wompi integration |
| **Wishlist** | Save favorite products per user |
| **Profile** | Edit name, phone (auto-formatted), DUI, address, and profile picture |
| **Purchase History** | View past invoices |

---

# Dependencies

| Dependency | Purpose |
|------------|---------|
| **@fontsource-variable/geist** | Geist variable font for the UI |
| **@hookform/resolvers** | Connects React Hook Form with Zod |
| **@tailwindcss/vite** | Integrates Tailwind CSS with Vite |
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
| **tailwind-merge** | Merges Tailwind class names safely |
| **tailwindcss** | Utility-first CSS framework |
| **zod** | TypeScript-first schema validation |

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
