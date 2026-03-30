// ruta: ../src/config.ts

// En este archivo lo que hacemos es que nuestra API pueda utilizar las varibales que estan en el .env
import dotenv from "dotenv";

// Ejecutamos la libreria de dotenv
dotenv.config();

// Con esta funcion validamos que las variables de entorno existan antes de arrancar la API
// Si no existen, la API no arranca y avisa exactamente cual variable falta
const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Variable de entorno faltante: ${key}`);
  }
  return value;
};

// Con esto podemos mandar a llamar al .env y utilizar las variables que esten dentro de este
export const config = {
  db: {
    URI: getEnvVar("DB_URI"),
  },
  server: {
    PORT: process.env.PORT || "4000", // ✅ Puerto del servidor con valor por defecto
  },
  jwt: {
    SECRET: getEnvVar("JWT_SECRET"), // ✅ Ya tienes jwt, mejor centralizarlo aqui
  },
};