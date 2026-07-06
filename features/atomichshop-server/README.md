# AtomicShop — API / Backend

REST API del ecosistema AtomicShop. Provee todos los endpoints para el panel de administración y la tienda pública, incluyendo autenticación basada en cookies, gestión de productos con Cloudinary, envío de correos, pasarela de pagos Wompi y base de datos MongoDB.

---

# Technologies — Tech Stack

- Node.js + Express 5
- TypeScript
- MongoDB + Mongoose
- bcrypt / bcryptjs — cifrado de contraseñas
- JSON Web Tokens — autenticación sin estado
- Nodemailer — envío de correos transaccionales
- Cloudinary + Multer — almacenamiento de imágenes
- express-rate-limit — protección contra abuso de endpoints

---

# Project Setup

## Requirements

- Node.js 18+
- npm
- MongoDB Atlas (o instancia local)
- Cuenta Cloudinary
- Cuenta Gmail con App Password habilitada

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

## Start (production)

```bash
npm start
```

---

# Environment Variables

Create a `.env` file in the root of the server project:

```env
# Base de datos
DB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# JWT
JWT_SECRET=tu_secreto_jwt_muy_seguro

# Correo (Gmail)
USER_EMAIL=correo@gmail.com
USER_PASSWORD=app_password_de_gmail

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# CORS — orígenes permitidos en producción (separados por coma)
ALLOWED_ORIGINS=https://atomicshop-admin.vercel.app,https://atomicshop.vercel.app

# Wompi (pasarela de pagos)
WOMPI_GRANT_TYPE=client_credentials
WOMPI_AUDIENCE=wompi_api
WOMPI_CLIENT_ID=tu_client_id
WOMPI_CLIENT_SECRET=tu_client_secret
```

---

# Deployment — Render

1. Push the project to GitHub.
2. Create a new **Web Service** in [Render](https://render.com).
3. Set the **Root Directory** to `features/atomichshop-server`.
4. Set the **Build Command** to `npm run build`.
5. Set the **Start Command** to `npm start`.
6. Add all environment variables from the `.env` section above.
7. Copy the service URL and use it as `VITE_API_URL` in both Vercel frontends.

---

# Route Structure

## Administration (`/api/admin/*`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/admin/first-admin` | No | Register first administrator |
| POST | `/admin/employees/login` | No | Employee login |
| GET | `/admin/employees/logOut` | No | Employee logout |
| GET | `/admin/employees/check-status` | Cookie | Verify session status |
| POST | `/admin/employees/verifyCode` | No | Verify temporary password code |
| GET/POST | `/admin/employees` | Cookie | List / create employees |
| GET/PUT/DELETE | `/admin/employees/:id` | Cookie | Read / update / delete employee |
| PATCH | `/admin/employees/:id/toggle-status` | Cookie | Enable or disable employee account |
| GET/POST | `/admin/products` | Cookie | List / create products |
| GET/PUT/DELETE | `/admin/products/:id` | Cookie | Read / update / delete product |
| PATCH | `/admin/products/:id/toggle` | Cookie | Toggle product active state |
| GET/POST/PUT/DELETE | `/admin/customers` | Cookie | Customer management |
| GET/POST | `/admin/category` | Cookie | Category management |
| GET/POST | `/admin/brands` | Cookie | Brand management |
| GET | `/admin/invoices` | Cookie | Invoice listing |
| POST | `/admin/recovery/requestCode` | No | Request recovery code |
| POST | `/admin/recovery/verifyCode` | No | Verify recovery code |
| POST | `/admin/recovery/newPassword` | No | Set new password |

## E-Commerce (`/api/e-commerce/*`)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/e-commerce/login` | No | Customer login |
| GET | `/e-commerce/logout` | No | Customer logout |
| POST | `/e-commerce/register` | No | Customer registration |
| POST | `/e-commerce/register/verifyCode` | No | Email verification |
| GET | `/e-commerce/products/shop` | No | Product listing with filters |
| GET | `/e-commerce/products/:id` | No | Product detail |
| GET | `/e-commerce/categories` | No | Category list |
| GET | `/e-commerce/brands` | No | Brand list |
| GET | `/e-commerce/banners` | No | Banner carousel |
| GET | `/e-commerce/providers` | No | Provider list |
| GET/POST/DELETE | `/e-commerce/carts` | Cookie | Cart management |
| GET/PUT | `/e-commerce/profile/:id` | Cookie | Profile read / update |
| GET/POST/DELETE | `/e-commerce/wishlist` | Cookie | Wishlist management |
| GET/POST | `/e-commerce/invoices` | Cookie | Invoice management |
| POST | `/e-commerce/recoveryPassword/requestCode` | No | Request recovery code |
| POST | `/e-commerce/recoveryPassword/verifyCode` | No | Verify recovery code |
| POST | `/e-commerce/recoveryPassword/newPassword` | No | Set new password |

---

# Security

- **Cookie-based auth**: `HttpOnly` cookies with JWT prevent XSS token theft.
- **Rate limiting**: 100 requests / 15 min globally; 20 requests / 15 min on auth and register endpoints.
- **CORS**: Configurable via `ALLOWED_ORIGINS` environment variable — only listed origins are allowed.
- **Employee route protection**: All admin CRUD routes require a valid `authCookieEmployee` JWT cookie.
- **Email uniqueness**: Registration validates email against both customer and employee collections to prevent cross-system conflicts.

---

# Dependencies

| Dependency | Purpose |
|------------|---------|
| **bcrypt / bcryptjs** | Password hashing |
| **cloudinary** | Cloud image storage |
| **cookie-parser** | Parse HTTP cookies |
| **cors** | Cross-Origin Resource Sharing |
| **crypto** | Cryptographic utilities |
| **dotenv** | Environment variable loader |
| **express** | Web framework |
| **express-rate-limit** | Request rate limiting |
| **express-validator** | Request validation middleware |
| **jsonwebtoken** | JWT creation and verification |
| **mongoose** | MongoDB ODM |
| **multer** | Multipart file upload handling |
| **multer-storage-cloudinary** | Cloudinary storage adapter for Multer |
| **nodemailer** | Transactional email sending |
| **pdfkit** | PDF invoice generation |
| **zod** | Schema validation |

### Development Dependencies

| Dependency | Purpose |
|------------|---------|
| **@types/bcrypt** | TypeScript definitions for bcrypt |
| **@types/bcryptjs** | TypeScript definitions for bcryptjs |
| **@types/cookie-parser** | TypeScript definitions for cookie-parser |
| **@types/cors** | TypeScript definitions for cors |
| **@types/express** | TypeScript definitions for Express |
| **@types/jsonwebtoken** | TypeScript definitions for jsonwebtoken |
| **@types/multer** | TypeScript definitions for Multer |
| **@types/node** | TypeScript definitions for Node.js |
| **@types/nodemailer** | TypeScript definitions for Nodemailer |
| **tsx** | TypeScript execution for development |
| **typescript** | TypeScript compiler |
