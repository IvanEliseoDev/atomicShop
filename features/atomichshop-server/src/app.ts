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

// E-COMMERCE
import productsEcomerceRoutes from "./routes/product/e-commerce/products";
import providersEcommerceRoutes from "./routes/provider/e-commerce/supplier"
import bannersEcommerceRotes from "./routes/banner/e-commerce/banner"
import cartsEcommerceRoutes from "./routes/carts/carts"
import loginEcommerceRoutes from "./routes/login/e-commerce/login"
import logoutEcommerceRoutes from "./routes/logout/e-commerce/logout"
import registerCustommerEcommerceRoutes from "./routes/customer/e-commerce/registerCustomerController"
import recoveryPasswordEcommerceRoutes from "./routes/recoveryPassword/e-commerce/recoveryPassword"

// API
import { seedRouter } from "./routes/seed";
import cookieParser from "cookie-parser";
import { categoryRouter } from "./routes/categories/categories";

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
    origin: ["http://localhost:5173", "http://localhost:5174"],
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
app.use("/api/v1/seed", seedRouter);

// ADMINISTRACION
app.use("/api/v1/admin/products", productsRoutes);
app.use("/api/v1/admin/provider", providerRoutes);
app.use("/api/v1/admin/customers", customerRouter);
app.use("/api/v1/admin/employees", employeeRouter);
app.use("/api/v1/admin/category", categoryRouter);

// E-COMMERCE
app.use("/api/v1/e-commerce/products", productsEcomerceRoutes);
app.use("/api/v1/e-commerce/banners", bannersEcommerceRotes)
app.use("/api/v1/e-commerce/providers", providersEcommerceRoutes)
app.use("/api/v1/e-commerce/carts", cartsEcommerceRoutes)
app.use("/api/v1/e-commerce/login", loginEcommerceRoutes)
app.use("/api/v1/e-commerce/logout", logoutEcommerceRoutes)
app.use("/api/v1/e-commerce/registerCustommer", registerCustommerEcommerceRoutes)
app.use("/api/v1/e-commerce/recoveryPasswordEcommerce", recoveryPasswordEcommerceRoutes)

export default app;
