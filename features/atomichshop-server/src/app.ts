// En este archivo lo que haremos es configurar los enpoints y las rutas con las cuales el frontEnd se podra comunicar con estos
import express from "express";
// Importamos cors para que nuestro fronEnd pueda utilizar nuestro enpoints
import cors from "cors";

// A qui importamos las rutas de los enpoints que querramos utilizar

// ADMINISTRACION
import productsRoutes from "./routes/product/products";
import providerRoutes from "./routes/provider/provider";
import { customerRouter } from "./routes/customer/customer";
import { employeeRouter } from "./routes/employee";
import { adminRouter } from "./routes/admin";

// E-COMMERCE
import productsEcomerceRoutes from "./routes/product/e-commerce/products";
import providersEcommerceRoutes from "./routes/provider/e-commerce/supplier"
import bannersEcommerceRotes from "./routes/banner/e-commerce/banner"
import cartsEcommerceRoutes from "./routes/carts/carts"
import loginEcommerceRoutes from "./routes/login/e-commerce/login"
import logoutEcommerceRoutes from "./routes/logout/e-commerce/logout"
import registerCustommerEcommerceRoutes from "./routes/customer/e-commerce/registerCustomerController"
import recoveryPasswordEcommerceRoutes from "./routes/recoveryPassword/e-commerce/recoveryPassword"
import categoriesEcommerceRoutes from "./routes/categories/e-commerce/categories"
import brandsEcommerceRoutes from "./routes/brands/e-commerce/brands"
import contactRoutes from "./routes/contactRoutes";
import wishlistRoutes from "./routes/favorite/wishlistRoutes";
import invoiceEcommerceRoutes from "./routes/invoice/e-commerce/invoice";
import adminInvoiceRoutes from "./routes/invoice/admin/invoice";
import profileRoutes from "./routes/profileRoutes/profileRoutes";
import wompiRoutes from "./routes/wompi";

// API
import { seedRouter } from "./routes/seed";
import cookieParser from "cookie-parser";
import { categoryRouter } from "./routes/categories/categories";
import { brandsRouter } from "./routes/brands/brands";
import adminRecoveryRoutes from "./routes/recoveryPassword/recoveryPassword";

/**
 * CONFIGURACION DE ARRANQUE
 */
// Una constante que va a ejecutar la libreria de express

const app = express();
/**
 * CONFIGURACION DE CORS PARA LOS ENPOINTS
 */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    //Permitir el envío de cookies y credenciales
    credentials: true,
  }),
);
// Con esto permitimos solicitudes JSON a nuestros enpoints
app.use(express.json());
app.use(cookieParser());

/**
 * CONFIGURACION DE ENPOINTS
 */

// API
app.use("/api/seed", seedRouter);

// ADMINISTRACION
app.use("/api/admin/products", productsRoutes);
app.use("/api/admin/provider", providerRoutes);
app.use("/api/admin/customers", customerRouter);
app.use("/api/admin/employees", employeeRouter);
app.use("/api/admin/category", categoryRouter);
app.use("/api/admin/brands", brandsRouter);
app.use("/api/admin/recovery", adminRecoveryRoutes);
app.use("/api/admin", adminRouter)

// E-COMMERCE
app.use("/api/e-commerce/products", productsEcomerceRoutes);
app.use("/api/e-commerce/banners", bannersEcommerceRotes)
app.use("/api/e-commerce/providers", providersEcommerceRoutes)
app.use("/api/e-commerce/carts", cartsEcommerceRoutes)
app.use("/api/e-commerce/login", loginEcommerceRoutes)
app.use("/api/e-commerce/logout", logoutEcommerceRoutes)
app.use("/api/e-commerce/register", registerCustommerEcommerceRoutes)
app.use("/api/e-commerce/recoveryPassword", recoveryPasswordEcommerceRoutes)
app.use("/api/e-commerce/categories", categoriesEcommerceRoutes)
app.use("/api/e-commerce/brands", brandsEcommerceRoutes)
app.use("/api/e-commerce/profile", profileRoutes);
app.use("/api/e-commerce/wishlist", wishlistRoutes);
app.use("/api/e-commerce/invoices", invoiceEcommerceRoutes);
app.use("/api/admin/invoices", adminInvoiceRoutes);
app.use("/api/e-commerce/wompi", wompiRoutes);
app.use("/api/e-commerce/contact", contactRoutes)

export default app;
