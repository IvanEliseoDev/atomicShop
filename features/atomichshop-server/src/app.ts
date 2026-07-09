import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Middlewares
import { limiter, authLimiter } from "./middleware/limiter";
import { verifyEmployeeToken } from "./middleware/auth/verifyEmployeeToken";

// ADMINISTRACION
import productsRoutes from "./routes/product/products";
import providerRoutes from "./routes/provider/provider";
import { customerRouter } from "./routes/customer/customer";
import { employeeRouter } from "./routes/employee";
import { adminRouter } from "./routes/admin";

// E-COMMERCE
import productsEcomerceRoutes from "./routes/product/e-commerce/products";
import providersEcommerceRoutes from "./routes/provider/e-commerce/supplier";
import bannersEcommerceRotes from "./routes/banner/e-commerce/banner";
import cartsEcommerceRoutes from "./routes/carts/carts";
import loginEcommerceRoutes from "./routes/login/e-commerce/login";
import logoutEcommerceRoutes from "./routes/logout/e-commerce/logout";
import registerCustommerEcommerceRoutes from "./routes/customer/e-commerce/registerCustomerController";
import recoveryPasswordEcommerceRoutes from "./routes/recoveryPassword/e-commerce/recoveryPassword";
import categoriesEcommerceRoutes from "./routes/categories/e-commerce/categories";
import brandsEcommerceRoutes from "./routes/brands/e-commerce/brands";
import contactRoutes from "./routes/contactRoutes";
import wishlistRoutes from "./routes/favorite/wishlistRoutes";
import invoiceEcommerceRoutes from "./routes/invoice/e-commerce/invoice";
import adminInvoiceRoutes from "./routes/invoice/admin/invoice";
import profileRoutes from "./routes/profileRoutes/profileRoutes";
import wompiRoutes from "./routes/wompi";

// API
import { seedRouter } from "./routes/seed";
import { categoryRouter } from "./routes/categories/categories";
import { brandsRouter } from "./routes/brands/brands";
import adminRecoveryRoutes from "./routes/recoveryPassword/recoveryPassword";

const app = express();

// Render (y cualquier reverse proxy) envía X-Forwarded-For;
// sin esto express-rate-limit lanza ERR_ERL_UNEXPECTED_X_FORWARDED_FOR.
app.set("trust proxy", 1);

/**
 * CORS — orígenes permitidos via variable de entorno
 * En producción: ALLOWED_ORIGINS=https://atomicshop-admin.vercel.app,https://atomicshop.vercel.app
 */
const allowedOrigins: string[] = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "https://atomic-shop-public.vercel.app", "https://atomic-shop-private.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origen no permitido → ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Rate limiting global
app.use(limiter);

/**
 * RUTAS — SEED
 */
app.use("/api/seed", seedRouter);

/**
 * RUTAS — ADMINISTRACIÓN
 * Las rutas de empleados (login, logout, verifyCode) son públicas.
 * El resto de rutas /admin/* requieren cookie de empleado autenticado.
 */
app.use("/api/admin/employees", authLimiter, employeeRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin/recovery", adminRecoveryRoutes);

// Rutas protegidas con token de empleado
app.use("/api/admin/products", verifyEmployeeToken, productsRoutes);
app.use("/api/admin/provider", verifyEmployeeToken, providerRoutes);
app.use("/api/admin/customers", verifyEmployeeToken, customerRouter);
app.use("/api/admin/category", verifyEmployeeToken, categoryRouter);
app.use("/api/admin/brands", verifyEmployeeToken, brandsRouter);
app.use("/api/admin/invoices", verifyEmployeeToken, adminInvoiceRoutes);

/**
 * RUTAS — E-COMMERCE (públicas salvo las que ya verifican internamente)
 */
app.use("/api/e-commerce/login", authLimiter, loginEcommerceRoutes);
app.use("/api/e-commerce/register", authLimiter, registerCustommerEcommerceRoutes);
app.use("/api/e-commerce/recoveryPassword", recoveryPasswordEcommerceRoutes);
app.use("/api/e-commerce/logout", logoutEcommerceRoutes);
app.use("/api/e-commerce/products", productsEcomerceRoutes);
app.use("/api/e-commerce/banners", bannersEcommerceRotes);
app.use("/api/e-commerce/providers", providersEcommerceRoutes);
app.use("/api/e-commerce/carts", cartsEcommerceRoutes);
app.use("/api/e-commerce/categories", categoriesEcommerceRoutes);
app.use("/api/e-commerce/brands", brandsEcommerceRoutes);
app.use("/api/e-commerce/profile", profileRoutes);
app.use("/api/e-commerce/wishlist", wishlistRoutes);
app.use("/api/e-commerce/invoices", invoiceEcommerceRoutes);
app.use("/api/e-commerce/wompi", wompiRoutes);
app.use("/api/e-commerce/contact", contactRoutes);

export default app;
