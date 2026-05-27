
// En este archivo lo que haremos es configurar los enpoints y las rutas con las cuales el frontEnd se podra comunicar con estos
import express from "express";
// Importamos cors para que nuestro fronEnd pueda utilizar nuestro enpoints
import cors from "cors";

// A qui importamos las rutas de los enpoints que querramos utilizar
import productsRoutes from "./routes/products";
import providerRoutes from "./routes/providers"
import { customerRouter } from "./routes/customer";
import { seedRouter } from "./routes/seed";
import { employeeRouter } from "./routes/employee";
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
app.use("/api/seed", seedRouter)
app.use("/api/products", productsRoutes);
app.use("/api/providers", providerRoutes)
app.use("/api/customers", customerRouter)
app.use("/api/employees", employeeRouter)
export default app;
