
// En este archivo lo que haremos es configurar los enpoints y las rutas con las cuales el frontEnd se podra comunicar con estos
import express from "express";
// Importamos cors para que nuestro fronEnd pueda utilizar nuestro enpoints
import cors from "cors";

// A qui importamos las rutas de los enpoints que querramos utilizar
import productsRoutes from "./routes/products";
import providerRoutes from "./routes/providers"

/**
 * CONFIGURACION DE ARRANQUE
 */
// Una constante que va a ejecutar la libreria de express
const app = express();
/**
 * CONFIGURACION DE CORS PARA LOS ENPOINTS
 */
app.use(cors()); // Con esto hacemos que todos los enpoints que vengan del archivo app.js tengan cors incluido

// Con esto permitimos solicitudes JSON a nuestros enpoints
app.use(express.json());

/**
 * CONFIGURACION DE ENPOINTS
 */
app.use("/api/products", productsRoutes);
app.use("/api/providers", providerRoutes)
export default app;
