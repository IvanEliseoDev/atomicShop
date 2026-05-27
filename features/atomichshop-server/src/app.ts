
// En este archivo lo que haremos es configurar los enpoints y las rutas con las cuales el frontEnd se podra comunicar con estos
import express from "express";
// Importamos cors para que nuestro fronEnd pueda utilizar nuestro enpoints
import cors from "cors";

// A qui importamos las rutas de los enpoints que querramos utilizar

// ADMINISTRACION
import productsRoutes from "./routes/product/products";
import providerRoutes from "./routes/providers"
import { customerRouter } from "./routes/customer";
import { employeeRouter } from "./routes/employee";

// E-COMMERCE
import productsEcomerceRoutes from "./routes/product/productsEcommerce"

// API
import { seedRouter } from "./routes/seed";
import cookieParser from "cookie-parser";


/**
 * CONFIGURACION DE ARRANQUE
 */
// Una constante que va a ejecutar la libreria de express

const app = express();
/**
 * CONFIGURACION DE CORS PARA LOS ENPOINTS
 */
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    //Permitir el envío de cookies y credenciales
    credentials: true
}))
// Con esto permitimos solicitudes JSON a nuestros enpoints
app.use(express.json());
app.use(cookieParser());

/**
 * CONFIGURACION DE ENPOINTS
 */

// API
app.use("/api/seed", seedRouter)

// ADMINISTRACION
app.use("/api/products", productsRoutes);
app.use("/api/providers", providerRoutes)
app.use("/api/customers", customerRouter)
app.use("/api/employees", employeeRouter)

// E-COMMERCE
app.use("/ecommerce/products", productsEcomerceRoutes)

export default app;
