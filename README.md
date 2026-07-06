# AtomicShop

AtomicShop is a full-stack e-commerce platform for the sale of chemical equipment and laboratory reagents, designed for legal compliance and multi-location management.

The platform covers two independent frontends — a public-facing online store and a private administration panel — backed by a shared REST API built with Node.js, Express, and MongoDB.

Inspired by the operational needs of scientific supply businesses in El Salvador, AtomicShop aims to digitize and streamline both the customer purchasing experience and the internal inventory and sales management process.


# Why AtomicShop exists

Scientific supply businesses in El Salvador often rely on manual or semi-digital processes for inventory control, customer management, and invoicing.

AtomicShop was created to solve three specific problems:

* Customers lack a reliable online channel to browse and purchase laboratory products.
* Administrators have no centralized tool to manage inventory, employees, and sales in real time.
* There is no system to enforce compliance workflows such as customer verification or controlled product availability.

AtomicShop provides a centralized ecosystem where:

* Customers can register, browse, purchase, and track their orders.
* Administrators and employees can manage every aspect of the business from a secure dashboard.
* The platform enforces controlled access, verified accounts, and role-based permissions throughout.


# Main users

* **Customers** — registered users who browse and purchase products through the public store.
* **Employees** — staff who manage inventory, clients, and sales from the admin panel.
* **Administrators** — full-access users who also manage employee accounts and system configuration.


# Platform structure

The repository is organized as a monorepo with three independent deployable units:

| Folder | Description | Deployed on |
|--------|-------------|-------------|
| `features/atomicShop` | Admin panel (private) | Vercel |
| `features/atomichShop-e-commerce` | Public e-commerce store | Vercel |
| `features/atomichshop-server` | Shared REST API | Render |


# Technologies — Tech Stack

## Frontend (both)

* React 19
* Vite + SWC
* TypeScript
* Tailwind CSS v4
* Shadcn UI + Radix UI
* React Hook Form + Zod

## Admin panel (additional)

* Zustand
* TanStack React Query
* Axios
* SweetAlert2

## E-commerce (additional)

* React Context (auth + cart)
* Sonner

## Backend

* Node.js
* Express 5
* TypeScript
* MongoDB + Mongoose

## Additional tools

* Cloudinary — image hosting
* Nodemailer — transactional email
* Wompi — payment gateway
* express-rate-limit — API abuse protection
* JSON Web Tokens — stateless authentication
* bcrypt — password hashing


# Project setup

## Requirements

* Node.js 18+
* npm
* MongoDB Atlas account
* Cloudinary account
* Gmail account with App Password enabled

## Clone the repository

```bash
git clone https://github.com/Gatom62/atomicShop.git
```

## Install dependencies (each project separately)

```bash
# Admin panel
cd features/atomicShop && npm install

# E-commerce
cd features/atomichShop-e-commerce && npm install

# API
cd features/atomichshop-server && npm install
```

## Run in development

```bash
# Admin panel (http://localhost:5173)
cd features/atomicShop && npm run dev

# E-commerce (http://localhost:5174)
cd features/atomichShop-e-commerce && npm run dev

# API (http://localhost:4000)
cd features/atomichshop-server && npm run dev
```

## Environment variables

Each project requires its own `.env` file. See the `README.md` inside each folder for the complete list of required variables.


# Deployment

## API → Render

1. Create a **Web Service** pointing to `features/atomichshop-server`.
2. Build command: `npm run build` — Start command: `npm start`.
3. Add all environment variables including `ALLOWED_ORIGINS` with the two Vercel deployment URLs separated by commas.

## Admin panel → Vercel

1. Import the repository and set **Root Directory** to `features/atomicShop`.
2. Add `VITE_API_URL` pointing to the Render API URL.

## E-commerce → Vercel

1. Import the repository and set **Root Directory** to `features/atomichShop-e-commerce`.
2. Add `VITE_API_URL` pointing to the Render API URL.


# Team

| Name | GitHub | Student Code | Email |
|------|--------|--------------|-------|
| Astrid Judith Alvarenga Cañas | [@astridww](https://github.com/astridww) | 20240476 | 20240476@ricaldone.edu.sv
| Camila Elena Rugamas García | [@](https://github.com/) | 20230248 | 20230248@ricaldone.edu.sv
| Iván Eliseo Hernández Mauricio | [@IvanEliseoDev](https://github.com/IvanEliseoDev) | 20240775 | 20240775@ricaldone.edu.sv
| Felipe Sebastián Pocasangre Clímaco | [@Gatom62](https://github.com/Gatom62) | 20240046 | 20240046@ricaldone.edu.sv
