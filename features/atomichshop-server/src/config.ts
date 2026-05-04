import dotenv from "dotenv";
import { getEnvVar } from "./utils/getEnvVar";
// Ejecutamos la libreria de dotenv
dotenv.config();
// Con esto podemos mandar a llamar al .env y utilizar las variables que esten dentro de este
export const config = {
  db: {
    URI: getEnvVar("DB_URI"),
  },
  server: {
    PORT: process.env.PORT || "4000", // ✅ Puerto del servidor con valor por defecto
  },
  jwt: {
    secret: getEnvVar("JWT_SECRET"), // ✅ Ya tienes jwt, mejor centralizarlo aqui
  },
  email:{
        user: process.env.USER_EMAIL,
        password: process.env.USER_PASSWORD
  }
   
};