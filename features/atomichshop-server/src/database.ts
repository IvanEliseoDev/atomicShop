// ruta: ../src/database.ts

// Manejamos las conexiones con nuestra base de datos
import mongoose from "mongoose";
import { config } from "./config";

// Nos conectamos a la bd
// El signo ! le dice a TypeScript "confía en mí, este valor SÍ existe"
mongoose.connect(config.db.URI!);

// Para ver el estado de la conexión
const connection = mongoose.connection; // Corregido: conecction → connection

//Corregido: conecction → connection en los 3 eventos
// Una sola vez - si la conexión está abierta, avisamos que todo bien
connection.once("open", () => {
    console.log("DB is connected 😁")
})

// Cuando se ejecute este evento - si se desconecta
connection.on("disconnected", () => {
    console.log("DB is disconnected 😤")
})

// Si hay un error en la conexión
connection.on("error", (error) => {
    console.log("Error found 💀 " + error)
})