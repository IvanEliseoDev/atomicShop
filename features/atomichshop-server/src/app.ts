// ruta: ../src/app.ts

// En este archivo lo que haremos es configurar los enpoints y las rutas con las cuales el frontEnd se podra comunicar con estos
import express from "express";
// Importamos cors para que nuestro fronEnd pueda utilizar nuestro enpoints
import cors from "cors";

// A qui importamos las rutas de los enpoints que querramos utilizar
import productsRoutes from "./routes/products";
import providerRoutes from "./routes/providers"

// Esto es para utilizarlos despues en controllers y middlewares.
// // Importamos bcrypt para encriptar contraseñas
// import bcrypt from "bcryptjs";
// // Importamos para generar tokens y todo lo de autenticacion 😈😈😈
// import jwt from "jsonwebtoken";

/**
 * CONFIGURACION DE ARRANQUE
 */
// Una constante que va a ejecutar la libreria de express
const app = express();

/**
 * CONFIGURACION DE CORS PARA LOS ENPOINTS
 */
app.use(cors()); // Con esto hacemos que todos los enpoints que vengan del archivo app.js tengan cors incluido 😁

// Con esto permitimos solicitudes JSON a nuestros enpoints
app.use(express.json());

/**
 * CONFIGURACION DE ENPOINTS
 */
app.use("/api/products", productsRoutes);
app.use("/api/providers", providerRoutes)

// ESTO SE USUARAN DESPUES EN controllers y middlewares.
// /**
//  * CONFIGURACION PARA ENCRIPTAR CONTRASEÑAS
//  */
// const passwordEncriptada = await bcrypt.hash(password, 10); // Con esta constante lo que haremos en encriptarla y creo que con el 10 la cantidad de caracteres que tendra la contraseña encriptada
// const esValida = await bcrypt.compare(password, passwordEncriptada); // Con esto podemos validar en el login si la contraseña que ingreso el usuario es valida o no

// /**
//  * CONFIGURACION PARA TOKENS
//  */
// const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET); // Con esto hacemos que se genere el token y lo amarramos al id del usuario
// jwt.verify(token, process.env.JWT_SECRET); // Y con esto hacemos que las rutas de nuestra API esten aseguradas.

// Exportamos para que el archivo index pueda utilizarlo
export default app;
