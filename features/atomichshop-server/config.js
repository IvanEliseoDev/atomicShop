// En este archivo lo que hacemos es que nuestra API pueda utilizar las varibales que estan en el .env
import dotenv from "dotenv";

// Ejecutamos la libreria de dotenv
dotenv.config();

// Con esto podemos mandar a llamar al .env y utilizar las variables que esten dentro de este
export const config = {
  db: {
    URI: process.env.DB_URI,
  },
};
